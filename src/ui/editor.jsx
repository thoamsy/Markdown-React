import React, { PureComponent } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/display/placeholder';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/theme/twilight.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/vim';
import 'bulma/css/bulma.css';

class MarkdownEditor extends PureComponent {
  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
      mode: {
        name: 'gfm',
        highlightFormatting: true
      },
      showCursorWhenSelecting: true,
      keyMap: navigator.userAgent.includes('Chrome') ? 'vim' : 'default',
      autofocus: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      allowDropFileTypes: ['text/markdown'],
      matchBrackets: true,
      theme: 'twilight',
      extraKeys: { Enter: 'newlineAndIndentContinueMarkdownList' }
    });
    // 让父元素获取 editor 示例
    this.props.getInstance(this.editor);
    this.editor.on('change', this.change);
    this.editor.on('blur', this.autoSave);
    // 30s 自动保存
    this.timer = setInterval(this.autoSave, 30000);
    document.querySelector('.CodeMirror').classList.add('column');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.content !== this.props.content) {
      console.log('Change the render');
      this.editor.setValue(nextProps.content);
    }
  }

  componentWillUnmount() {
    this.editor.off('change', this.change);
    clearInterval(this.timer);
  }

  change = (editor, changeObj) => {
    const doc = editor.getDoc();
    this.props.sendToWorker(doc.getValue());

    // 同时检测是否修改了第一行。
    let start = 0;
    let firstLine = doc.getLine(start);

    while (!(firstLine = doc.getLine(start)) && start < doc.lineCount()) {
      start++;
    }
    this.props.getFirstLine(firstLine);
  };

  autoSave = () => {
    this.props.save(this.editor.getValue());
  };

  render() {
    return <textarea placeholder="write your mind." />;
  }
}
export default MarkdownEditor;
