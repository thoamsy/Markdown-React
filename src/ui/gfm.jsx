import React, { PureComponent } from 'react';
import Editor from './editor';
import Preview from './preview';
import Nav from './nav';
import FileExplore from './sidebar';
import { v4 } from 'uuid';
import {
  not,
  curry,
  pick,
  when,
  both,
  trim,
  startsWith,
  objOf,
  pipe,
  equals,
  slice,
  update,
  findIndex,
  propEq,
  prepend,
  reject
} from 'ramda';

class GFM extends PureComponent {
  state = {
    markedHTML: '',
    title: 'untitled',
    content: '',
    id: v4(),
    showSidebar: false
  };

  async componentDidMount() {
    // 动态导入 Web Worker 来渲染 markdown
    let worker = await import('worker-loader!../worker.js');
    this.worker = new worker();
    this.worker.onmessage = ({ data }) => {
      if (typeof data === 'string') {
        this.setState({ markedHTML: data });
      }
      if (typeof data === 'object') {
        // 加载的时候获取最新的文章和所有文章的元数据
        const { lastArticle, metas: articleInformations } = data;
        if (lastArticle) {
          this.sendToWorker(lastArticle.content);
          this.setState({
            ...lastArticle,
             articleInformations
          });
        } else {
          const { content } = data;
          this.sendToWorker(content);
          this.setState({ ...data });
        }
      }
    };
    this.worker.postMessage({ useFor: 'inital' });
    this.bindSyncScroll();
  }

  componentWillUnmount() {
    this.worker.terminate();
    // 似乎不太好清除滚动监听事件。 不过本来就只有一个界面，没必要咯
  }

  bindSyncScroll() {
    const left = this.codeMirror.getScrollerElement();
    const right = document.querySelector('.preview');
    let timer;
    function sync({ target }) {
      // 将另外一个滚动的事件清除，以防止无限循环。
      const other = [left, right].find(div => div !== target);
      other.removeEventListener('scroll', sync);
      // 防止出现抖动问题
      if (typeof timer !== undefined) clearTimeout(timer);

      timer = setTimeout(() => other.addEventListener('scroll', sync), 200);
      const { scrollTop, scrollHeight, offsetHeight } = target;
      const precentage = scrollTop / (scrollHeight - offsetHeight);
      other.scrollTop = precentage * (other.scrollHeight - other.offsetHeight);
    }
    left.addEventListener('scroll', sync);
    right.addEventListener('scroll', sync);
  }

  sendToWorker = input => {
    this.worker && this.worker.postMessage({ markdown: input, useFor: 'render' });
  };

  switchArticle = (articleId) => {
    this.worker.postMessage({ id: articleId, useFor: 'get' });
  }

  getInstance = (instance) => {
    this.codeMirror = instance;
  };

  saveArticle = (content, id) => {
    const data = {
      content,
      title: this.state.title,
      updatedDate: Date.now(),
      id: this.state.id
    };
    // 存进 indexedDB
    this.worker.postMessage({ article: data, useFor: 'update' });
    // 获得文章信息的拷贝。
    const { articleInformations } = this.state;
    const getMeta = pick(['title', 'updatedDate', 'id'], data);
    const updateArticleMetas = pipe(
      reject(propEq('id', data.id)),
      prepend(getMeta),
      objOf('articleInformations'),
      this.updateState
    );
    updateArticleMetas(articleInformations);
  };

  updateState = curry((newState) => {
    this.setState(newState);
  });

  getFirstLine = (content = '# untitled') => {
    const isHeaderAndNotEqualBefore = both(
        startsWith('# '),
        pipe(equals('# ' + this.state.title), not)
    );
    // 函数式编程的方式
    when(
      isHeaderAndNotEqualBefore,
      pipe(slice(2, Infinity), objOf('title'), this.updateState)
    )(trim(content));
  };

  createNewDocument = () => {
    // 重置这些数据
    this.setState({
      title: '',
      content: '',
      markedHTML: '',
      id: v4()
    });
  }

  toggleSidebar = () => {
    this.setState(prev => ({
      showSidebar: !prev.showSidebar
    }));
  }

  render() {
    const {
      articleInformations,
      title,
      id,
      markedHTML,
      content,
      showSidebar
    } = this.state;
    return (
      <div className="container-fluid">
        <Nav title={title}
          createNewDocument={this.createNewDocument}
          toggleSidebar={this.toggleSidebar} />
        <div className={`backdrop ${showSidebar ? 'in' : 'out'}`}
          onClick={this.toggleSidebar} ></div>
        <FileExplore
          {...{ theId: id, theTitle: title, articleInformations, showSidebar }}
          switchArticle={this.switchArticle}
        />
        <article className="my-gfm">
          <Editor
            sendToWorker={this.sendToWorker}
            getInstance={this.getInstance}
            getFirstLine={this.getFirstLine}
            save={this.saveArticle}
            content={content}
          />
          <Preview output={markedHTML} />
        </article>
      </div>
    );
  }
}

export default GFM;
