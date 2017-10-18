let timer;
let right = '.preview', left = '.CodeMirror';
export default function syncScroll() {
  if (this.classList && this.classList.contains(right)) {
    [left, right] = [right, left];
  }
  if (typeof timer !== undefined) {
    clearTimeout(timer);
  }
  const otherView = document.querySelector(right);
  otherView.removeEventListener('scroll', syncScroll);

  if (this.editor) {
    const { top, height } = this.editor.getScrollInfo();
    const precentage = top / height;
    const y = precentage * otherView.scrollHeight;
    otherView.scrollTop = y;
  } else {
    const { scrollHeight: height, scrollTop: top } = this;
    const precentage = top / height;
    const y = precentage * window.codeMirror.getDoc().height;
    window.codeMirror.scrollTo(null, y);
  }
  setTimeout(() => otherView.addEventListener('scroll', syncScroll, 200));
}
