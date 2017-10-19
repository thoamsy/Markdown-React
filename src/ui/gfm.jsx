import React, { Component } from 'react';
import Editor from './editor';
import Preview from './preview';
import Nav from './nav';

class GFM extends Component {
  state = {
    markedHTML: '',
    title: 'untitled'
  };

  async componentDidMount() {
    // 动态导入 Web Worker 来渲染 markdown
    let worker = await import('worker-loader!../worker.js');
    this.renderMarkdown = new worker();
    this.renderMarkdown.onmessage = ({ data }) => {
      this.setState({ markedHTML: data });
    };
    this.handleEditor(this.codeMirror.getValue());
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
      const other = [left, right].find(div => div !== target);
      other.removeEventListener('scroll', sync);
      if (typeof timer !== undefined) clearTimeout(timer);

      timer = setTimeout(() => other.addEventListener('scroll', sync), 200);
      const { scrollTop, scrollHeight, offsetHeight } = target;
      const precentage = scrollTop / (scrollHeight - offsetHeight);
      other.scrollTop = precentage * (other.scrollHeight - other.offsetHeight);
    }
    left.addEventListener('scroll', sync);
    right.addEventListener('scroll', sync);
  }

  handleEditor = input => {
    this.renderMarkdown && this.renderMarkdown.postMessage(input);
  };

  getInstance = instance => {
    this.codeMirror = instance;
  };

  getFirstLine = (content = '# untitled') => {
    // 将第一行作为标题
    content = content.trim();
    if (content.startsWith('# ')) {
      content = content.slice(2);
      if (content !== this.state.title) {
        this.setState({
          title: content
        });
      }
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <Nav title={this.state.title}/>
        <div className="my-gfm">
        <Editor
            sendToWorker={this.handleEditor}
            getInstance={this.getInstance}
            getFirstLine={this.getFirstLine}
        />
        <Preview output={this.state.markedHTML} />
        </div>
      </div>
    );
  }
}

export default GFM;
