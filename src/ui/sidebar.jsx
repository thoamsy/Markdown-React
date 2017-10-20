import React from 'react';
import moment from 'moment';
import { zip } from 'ramda';
const FileExplore = ({
  articles = [],
  currentArticle: { id, title },
  articlesId = [],
  lastEditedDates = [],
  switchArticle,
}) => {
  const handleClick = ({ target }) => {
    const clickedId = target.getAttribute('data-id');
    console.log(clickedId, id);
    if (clickedId === id) return;
    switchArticle(clickedId);
  }; 
  return (
    <aside>
      <div className="nav list-group">
        {
          zip(articles, lastEditedDates).map(([theTitle, date], i) => (
            <a className={
              `list-group-item list-group-item-action ${theTitle === title && 'active'}`} href="#" key={i} data-id={articlesId[i]}
            onClick={handleClick}
            >
              <h5 className="mb-1">{theTitle}</h5>
              <small>{moment(date).fromNow()}</small>
            </a>
          ))
        }
      </div>
    </aside>
  );
};

export default FileExplore;