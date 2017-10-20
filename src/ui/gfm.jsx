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
  slice
} from 'ramda';

class GFM extends PureComponent {
  state = {
    markedHTML: '',
    title: 'untitled',
    content: '',
    id: ''
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
    this.worker.postMessage({ article: data, useFor: 'update' });
  };

  updateState = curry((names, newState) => {
    this.setState(pick(names, newState));
  });

  getFirstLine = (content = '# untitled') => {
    const isHeaderAndNotEqualBefore = both(
        startsWith('# '),
        pipe(equals('# ' + this.state.title), not)
    );
    // 函数式编程的方式
    when(
      isHeaderAndNotEqualBefore,
      pipe(slice(2, Infinity), objOf('title'), this.updateState(['title']))
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

  render() {
    const {
      articleInformations,
      title,
      id,
      markedHTML,
      content
    } = this.state;
    return (
      <div className="container-fluid">
        <Nav title={title} createNewDocument={this.createNewDocument} />
        {/* 文件浏览器保存的是所有文章的标题，id，上次修改是时间。以及当前文章的一些信息 */}
        <FileExplore
          {...{ theId: id, theTitle: title, articleInformations }}
          switchArticle={this.switchArticle}
        />
        <div className="my-gfm">
          <Editor
            sendToWorker={this.sendToWorker}
            getInstance={this.getInstance}
            getFirstLine={this.getFirstLine}
            save={this.saveArticle}
            content={content}
          />
          <Preview output={markedHTML} />
        </div>
      </div>
    );
  }
}

export default GFM;
