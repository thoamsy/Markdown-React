import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Editor from './ui/editor';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Editor/>
      </div>
    );
  }
}

export default App;
