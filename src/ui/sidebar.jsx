import React from 'react';
import moment from 'moment';
// import { transpose } from 'ramda';
const FileExplore = ({
  theId,
  theTitle,
  articleInformations = [],
  switchArticle,
}) => {
  const handleClick = ({ currentTarget }) => {
    const clickedId = currentTarget.getAttribute('data-id');
    if (clickedId === theId) return;
    switchArticle(clickedId);
  }; 
  return (
    <aside>
      <div className="nav list-group">
        {
          articleInformations.map(
            ({ title, updatedDate, id }, i) => (
              <a className={
                `list-group-item list-group-item-action ${theTitle === title && 'active'}`} href="#" key={i} data-id={id}
              onClick={handleClick}
              >
                <h5 className="mb-1">{title}</h5>
                <small>{`Last updated: ${moment(updatedDate).fromNow()}`}</small>
              </a>
            ))
        }
      </div>
    </aside>
  );
};

export default FileExplore;