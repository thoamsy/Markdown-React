import React, { Component } from 'react';
import Editor from './editor';
import Preview from './preview';

class GFM extends Component {
  state = { 
    markedHTML: ''
   }
  componentDidMount() {
    // 动态导入 Web Worker 来渲染 markdown
    import('worker-loader!../worker.js').then(worker => {
      this.renderMarkdown = new worker();
      this.renderMarkdown.onmessage = ({ data }) => {
        this.setState({ markedHTML: data });
      }
    })
  }

  handleEditor = (input) => {
    this.renderMarkdown.postMessage(input);
  }

  render() {
    return (
      <div className="my-gfm">
        <Editor sendToWorker={this.handleEditor}/>
        <Preview output={this.state.markedHTML}/>
      </div>
    );
  }
}

export default GFM;