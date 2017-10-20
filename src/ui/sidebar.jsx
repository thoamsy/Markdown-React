import React from 'react';
import moment from 'moment';
import { transpose } from 'ramda';
const FileExplore = ({
  articles = [],
  currentArticle: { id, title },
  articlesId = [],
  lastEditedDates = [],
  switchArticle,
}) => {
  const handleClick = ({ currentTarget }) => {
    const clickedId = currentTarget.getAttribute('data-id');
    if (clickedId === id) return;
    switchArticle(clickedId);
  }; 
  return (
    <aside>
      <div className="nav list-group">
        {
          transpose([articles, lastEditedDates, articlesId]).map(
            ([theTitle, date, id], i) => (
              <a className={
                `list-group-item list-group-item-action ${theTitle === title && 'active'}`} href="#" key={i} data-id={id}
              onClick={handleClick}
              >
                <h5 className="mb-1">{theTitle}</h5>
                <small>{`lastUpdated: ${moment(date).fromNow()}`}</small>
              </a>
            ))
        }
      </div>
    </aside>
  );
};

export default FileExplore;