import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import fileIcon from '../icons/folder.svg';
import addIcon from '../icons/add.svg';

const Navbar = ({ title, createNewDocument }) => {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <a className="btn btn-dark text-light">
            {title}
          </a>
        </li>
      </ul>

      <div className="d-flex justify-content-between" style={{ width: 100 }}>
        <img src={addIcon} alt="add file icon"
          title="create new document" onClick={createNewDocument} />
        <img src={fileIcon} alt="your history resource" />
      </div>
    </nav>
  );
};
export default Navbar;
