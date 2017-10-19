import React, { Component } from 'react';
import Editor from './editor';
import Preview from './preview';
import Nav from './nav';
import {
  __,
  not,
  curry,
  pick,
  when,
  both,
  trim,
  startsWith,
  assoc,
  pipe,
  equals
} from 'ramda';

class GFM extends Component {
  state = {
    markedHTML: '',
    title: 'untitled',
    date: '',
    content: ''
  };

  async componentDidMount() {
    // 动态导入 Web Worker 来渲染 markdown
    let worker = await import('worker-loader!../worker.js');
    this.renderMarkdown = new worker();
    this.renderMarkdown.onmessage = ({ data }) => {
      if (typeof data === 'string') {
        this.setState({ markedHTML: data });
      }
      if (typeof data === 'object') {
        this.codeMirror.setValue(data.content);
        this.sendToWorker(data.content);
        this.setState({
          ...data
        });
      }
    };
    this.renderMarkdown.postMessage('get last article');
    this.bindSyncScroll();
  }

  componentWillUnmount() {
    this.renderMarkdown.terminate();
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
    this.renderMarkdown && this.renderMarkdown.postMessage(input);
  };

  getInstance = instance => {
    this.codeMirror = instance;
  };

  saveArticle = article => {
    const data = {
      content: article,
      title: this.state.title,
      updatedDate: Date.now()
    };
    this.renderMarkdown.postMessage(data);
  };

  getFirstLine = (content = '# untitled') => {
    const updateState = curry((names, newState) => {
      this.setState(pick(names, newState));
    });

    const isHeaderAndNotEqualBefore = both(
        startsWith('# '),
        pipe(equals('# ' + this.state.title), not)
    );
    // 函数式编程的方式
    when(
      isHeaderAndNotEqualBefore,
      pipe(assoc('title', __, {}), updateState(['title']))
    )(trim(content));
  };

  render() {
    return (
      <div className="container-fluid">
        <Nav title={this.state.title} />
        <div className="my-gfm">
          <Editor
            sendToWorker={this.sendToWorker}
            getInstance={this.getInstance}
            getFirstLine={this.getFirstLine}
            save={this.saveArticle}
            content={this.state.content}
          />
          <Preview output={this.state.markedHTML} />
        </div>
      </div>
    );
  }
}

export default GFM;
