import React, { Component } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/theme/base16-light.css';
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
      theme: 'base16-light',
      extraKeys: { 'Enter': 'newlineAndIndentContinueMarkdownList' },
      addModeClass: true,
      value: 'You are so **good**'
    });
    // TODO: 一个临时的解决方案
    window.codeMirror = this.editor;
    this.editor.on('change', this.change);
    this.editor.on('scroll', this.handleScroll);
    this.editor.setValue('You are so **good**');
  }

  componentWillUnmount() {
    this.editor.off('change', this.change);
    this.editor.off('scroll', this.handleScroll);
  }

  change = editor => {
    this.props.sendToWorker(editor.doc.getValue());
  }

  handleScroll = editor => {
      const {
        offsetHeight,
        scrollHeight,
        scrollTop
      } = this.editor.getScrollerElement();
      const precentage = scrollTop / (scrollHeight - offsetHeight);
      const preview = document.querySelector('.preview');
      const x = precentage * (preview.scrollHeight - preview.offsetHeight);
      preview.scrollTop = x;
  }

  render() {
    return (
      <textarea placeholder="write your mind."/>
    );
  }
}
export default MarkdownEditor;
