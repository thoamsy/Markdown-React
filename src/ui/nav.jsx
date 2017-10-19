import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import fileIcon from '../icons/ic_folder_white_36px.svg';

class Navbar extends Component {
  state = {
    showInput: false,
    title: 'untitled',
    beInput: ''
  };

  handleClick = e => {
    this.setState(prev => ({
      showInput: !prev.showInput,
      beInput: prev.title
    }), () => document.querySelector('nav input[type=text]').select());
  };

  handleTitleChange = ({ target }) => {
    this.setState({
      beInput: target.value
    });
  };

  handleBlur = ({ target }) => {
    this.setState(prev => ({
      showInput: !prev.showInput,
      title: prev.beInput || prev.title
    }));
  };

  render() {
    const { showInput, title, beInput } = this.state;
    return (
      <nav className="navbar navbar-dark bg-dark">
        <ul className="navbar-nav mr-auto">
          {showInput || (
            <li className="nav-item">
              <a className="btn btn-dark text-light" onClick={this.handleClick}>
                {title}
              </a>
            </li>
          )}
          {showInput && (
            <li className="nav-item">
              <input
                type="text"
                className="col-4 form-control"
                placeholder="title here"
                autoFocus
                value={beInput}
                onBlur={this.handleBlur}
                onChange={this.handleTitleChange}
                style={{
                  height: 44,
                  fontSize: 16,
                  width: 400
                }}
              />
            </li>
          )}
        </ul>
        <img src={fileIcon} alt="your history resource" className="library"/>
      </nav>
    );
  }
}
export default Navbar;
