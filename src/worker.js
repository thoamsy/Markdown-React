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
const dbPromise = idb.open('markdown-db', 3, updated => {
  switch (updated.oldVersion) {
  case 1: {
    updated.createObjectStore(storeName, { keyPath: 'title' });
    const store = updated.transaction.objectStore(storeName);
    store.createIndex('updatedDate', 'updatedDate', { unique: true });
  }
  case 2: {
      updated.deleteObjectStore(storeName);
      updated.createObjectStore(storeName, { keyPath: 'id' });
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

    // TODO: need to be refactor;
    postMessage({
      lastArticle: articles[0],
      allTitles: pluck('title', articles),
      allDates: pluck('updatedDate', articles),
      allIds: pluck('id', articles)
    });
    return;
  }
  if (typeof data === 'string') {
    // 用来渲染
    postMessage(md.render(data));
  } else if (typeof data === 'object') {
    // 用来和数据交互
    const store = await getStore();
    // 如果有 content 属性，就是更新。
    if ('content' in data) {
      store.put(data)//.then(() => articles[data.title] = data);
    } else {
      postMessage(await store.get(data.id));
    }
  }
};
