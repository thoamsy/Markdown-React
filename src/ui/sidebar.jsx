import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const FileExplore = ({
  theId,
  theTitle,
  articleInformations = [],
  switchArticle,
  showSidebar
}) => {
  const handleClick = ({ target }) => {
    const clickedId = target.getAttribute('data-id');
    if (!clickedId || clickedId === theId) return;
    switchArticle(clickedId);
  }; 
  return (
    <aside className={`menu ${showSidebar ? 'toggled' : 'hidden'}`}>
      <p className="menu-label">已保存</p>
      <ul className="menu-list" onClick={handleClick}>
        {
          articleInformations.length ? 
            articleInformations.map(
              ({ title, updatedDate, id }, i) => (
                <li key={i} data-id={id}>
                  <a className={
                    `${theId === id && 'is-active'} is-dark`} href="#" data-id={id}
                  >
                    {title}
                    <div className="tags has-addons">
                      <span className="tag is-light">上次更新</span>
                      <span className="tag is-success">
                        {moment(updatedDate).fromNow()}
                      </span>
                    </div>
                  </a>
                </li>
              )) :
            <article className="message">
              <div className="message-body">
                You have nothing writed.
              </div>
            </article>
        }
      </ul>
    </aside>
  );
};

export default FileExplore;