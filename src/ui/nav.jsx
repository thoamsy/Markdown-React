import React from 'react';

const Navbar = ({ title, createNewDocument, toggleSidebar }) => {
  return (
    <nav className="navbar is-light">
      <div className="navbar-brand">
        <a className="navbar-item title">
          {title}
        </a>
      </div>

      <div className="navbar-end">
        <a href="#123" className="navbar-item"
          onClick={createNewDocument}>
          <span className="icon is-large">
            <i className="fa fa-plus"></i>
          </span>
        </a>

        <a href="#456" className="navbar-item"
          onClick={toggleSidebar}
        >
          <span className="icon is-large">
            <i className="fa fa-file-text"></i>
          </span>
        </a>
      </div>
    </nav>
  );
};
export default Navbar;
