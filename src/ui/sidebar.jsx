import React from 'react';
import moment from 'moment';
// import { transpose } from 'ramda';
const FileExplore = ({
  theId,
  theTitle,
  articleInformations = [], // 因为第一次取的时候是 undefined，导致 map 失败。至于为什么刚开始是 undefined， 可能是异步的原因。
  switchArticle,
  showSidebar
}) => {
  const handleClick = ({ currentTarget }) => {
    const clickedId = currentTarget.getAttribute('data-id');
    if (clickedId === theId) return;
    switchArticle(clickedId);
  }; 
  return (
    <aside className={showSidebar ? 'toggled' : 'hidden'}>
      <div className="nav list-group">
        {
          articleInformations.map(
            ({ title, updatedDate, id }, i) => (
              <a className={
                `list-group-item list-group-item-action ${theId === id && 'active'}`} href="#" key={i} data-id={id}
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