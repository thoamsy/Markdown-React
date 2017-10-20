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
  dbPromise.then(db =>
    db.transaction(storeName, 'readwrite').objectStore(storeName)
  );

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
      postMessage(md.render(data.markdown));
      break;
    }
    case 'get': {
      const store = await getStore();
      postMessage(await store.get(data.id));
      break;
    }
    case 'update': {
      const store = await getStore();
      store.put(data.article);
      // 故意的不用 break。性能问题这里先不考虑
    }
    case 'inital': {
      const sortByDate = sort(descend(prop('updatedDate')));
      let articles = sortByDate(await retrieveAllArticles());
      // TODO: need to be refactor;
      const metas = project(['title', 'updatedDate', 'id'], articles);
      postMessage({
        lastArticle: articles[0],
        metas
      });
      break;
    }
    default:
      throw Error('Spell Error');  
  }
};
