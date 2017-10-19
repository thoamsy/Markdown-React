import React, { Component } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/theme/twilight.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/display/placeholder';
import 'codemirror/keymap/vim';
import './editor.css';


class MarkdownEditor extends Component {
  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
      mode: {
        name: 'gfm',
        highlightFormatting: true,
      },
      showCursorWhenSelecting: true,
      keyMap: 'vim',
      autofocus: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      theme: 'twlight',
      extraKeys: { 'Enter': 'newlineAndIndentContinueMarkdownList' },
      addModeClass: true,
      value: 'You are so **good**'
    });
    // 让父元素获取 editor 示例
    this.props.getInstance(this.editor);
    this.editor.on('change', this.change);
    this.editor.setValue('You are so **good**');
  }

  componentWillUnmount() {
    this.editor.off('change', this.change);
  }

  change = editor => {
    this.props.sendToWorker(editor.doc.getValue());
  }

  render() {
    return (
      <textarea placeholder="write your mind."/>
    );
  }
}
export default MarkdownEditor;
