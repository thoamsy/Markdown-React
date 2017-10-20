import React from 'react';
import moment from 'moment';
import { zip } from 'ramda';
const FileExplore = ({ files = [], currentFile, writedDates = []}) => {
  return (
    <aside>
      <div className="nav list-group">
        {
          zip(files, writedDates).map(([title, date], i) => (
            <a className={
              `list-group-item list-group-item-action ${title === currentFile && 'active'}`} href="#" key={i}>
              <h5 className="mb-1">{title}</h5>
              <small>{moment(date).fromNow()}</small>
            </a>
          ))
        }
      </div>
    </aside>
  );
};

export default FileExplore;