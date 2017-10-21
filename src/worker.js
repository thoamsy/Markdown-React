import Markdown from 'markdown-it';
import mark from 'markdown-it-mark';
import footnote from 'markdown-it-footnote';
import checkbox from 'markdown-it-checkbox';
import hljs from 'highlight.js';
import idb from 'idb';
import { sort, prop, descend, pluck, project } from 'ramda';

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
const dbPromise = idb.open('markdown-db', 4, updated => {
  switch (updated.oldVersion) {
    case 1: {
      updated.createObjectStore(storeName, { keyPath: 'title' });
      const store = updated.transaction.objectStore(storeName);
      store.createIndex('updatedDate', 'updatedDate', { unique: true });
    }
    case 2: {
      updated.objectStoreNames.contains(storeName)
        && updated.deleteObjectStore(storeName);
      updated.createObjectStore(storeName, { keyPath: 'id' });
    }
    case 3: {
      updated.createObjectStore(storeName, { keyPath: 'id' });
    }
  }
});

const getStore = () =>
  dbPromise.then(function open(db) {
    return db.transaction(storeName, 'readwrite').objectStore(storeName)
  }).catch(console.error); 

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

self.onmessage = async ({ data }) => {
  const { useFor } = data;
  switch (useFor) {
    case 'render': {
      postMessage(md.render(data.markdown || ''));
      break;
    }
    case 'get': {
      const store = await getStore();
      postMessage({
        article: await store.get(data.id)
      });
      break;
    }
    case 'update': {
      const store = await getStore();
      store.put(data.article);
      // 故意的不用 break。性能问题这里先不考虑
      break;
    }
    case 'inital': {
      const sortByDate = sort(descend(prop('updatedDate')));
      // 防止第一次读取的时候没有值， 使用默认值
      const now = Date.now();
      let articles = sortByDate(await retrieveAllArticles());
      postMessage({
        lastArticle: articles[0],
        metas: project(['title', 'updatedDate', 'id'], articles)
      });
      break;
    }
    default:
      throw Error('Spell Error');  
  }
};
