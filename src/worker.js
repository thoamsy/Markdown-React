import marked from 'marked';
import highlight from 'highlight.js';
self.onmessage = ({ data }) => {
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    breaks: true,
    // sanitize: true,
    smartLists: true,
    smartypants: true,
    highlight: (code) => (
      highlight.highlightAuto(code).value
    )
  });
  postMessage(marked(data));
};
