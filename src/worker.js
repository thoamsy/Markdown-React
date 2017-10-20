import Markdown from 'markdown-it';
import mark from 'markdown-it-mark';
import footnote from 'markdown-it-footnote';
import checkbox from 'markdown-it-checkbox';
import hljs from 'highlight.js';
import idb from 'idb';
import { sort, prop, descend, pluck } from 'ramda';

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

const storeName = 'articles';
const dbPromise = idb.open('markdown-db', 2, updated => {
  switch (updated.oldVersion) {
  case 1: {
    updated.createObjectStore(storeName, { keyPath: 'title' });
    const store = updated.transaction.objectStore(storeName);
    store.createIndex('updatedDate', 'updatedDate', { unique: true });
  }
  }
});

const getStore = () =>
  dbPromise.then(db => db.transaction(storeName, 'readwrite').objectStore(storeName));

async function retrieveAllArticles() {
  const store = await getStore();
  let articles;
  try {
    articles = store.getAll();
    console.log('Success');
  } catch (err) {
    console.error(err);
  }
  return articles;
}

let articles;
self.onmessage = async ({ data }) => {
  if (data === 'get last article') {
    const sortByDate = sort(descend(prop('updatedDate')));
    articles = sortByDate(await retrieveAllArticles());
    postMessage({
      lastArticle: articles[0],
      allTitles: pluck('title', articles),
      allDates:  pluck('updatedDate', articles)
    });
    return;
  }
  if (typeof data === 'string') {
    // 用来渲染
    postMessage(md.render(data));
  } else if (typeof data === 'object') {
    // 用来存储
    const store = await getStore();
    store.put(data);
  }
};
