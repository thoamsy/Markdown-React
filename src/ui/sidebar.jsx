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
  const handleClick = ({ currentTarget }) => {
    const clickedId = currentTarget.getAttribute('data-id');
    if (clickedId === theId) return;
    switchArticle(clickedId);
  }; 
  return (
    <aside className={showSidebar ? 'toggled' : 'hidden'}>
      <div className="nav list-group">
        {
          articleInformations.length ? 
            articleInformations.map(
              ({ title, updatedDate, id }, i) => (
                <a className={
                  `list-group-item list-group-item-action ${theId === id && 'active'}`} href="#" key={i} data-id={id}
                onClick={handleClick}
                >
                  <h5 className="mb-1">{title}</h5>
                  <small>{`上次更新: ${moment(updatedDate).fromNow()}`}</small>
                </a>
              )) :
            <a className='list-group active list-group-item-action'>
              <h5 className="text-capitalize">You have nothing</h5>
            </a>
        }
      </div>
    </aside>
  );
};

export default FileExplore;