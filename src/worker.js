import Markdown from 'markdown-it';
import mark from 'markdown-it-mark';
import footnote from 'markdown-it-footnote';
import checkbox from 'markdown-it-checkbox';
import hljs from 'highlight.js';

const md = Markdown({
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(lang, str).value;
    }
    return '';
  }
})
  .use(mark)
  .use(footnote)
  .use(checkbox);

self.onmessage = ({ data }) => {
  postMessage(md.render(data));
};
