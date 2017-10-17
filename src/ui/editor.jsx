import React, { Component } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/display/placeholder';
import './editor.css';

class MarkdownEditor extends Component {
  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
      mode: {
        name: 'gfm',
        highlightFormatting: true,
      },
      showCursorWhenSelecting: true,
      autofocus: true,
      autoCloseBrackets: true,
      theme: 'dracula',
      extraKeys: { 'Enter': 'newlineAndIndentContinueMarkdownList' },
      addModeClass: true
    });
  }

  render() {
    return (
      <textarea placeholder="write your mind."/>
    );
  }
}
export default MarkdownEditor;
