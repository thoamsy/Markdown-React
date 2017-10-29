import 'font-awesome/css/font-awesome.min.css';
import './ui/editor.css';
import React, { Component } from 'react';
import GFM from './ui/gfm';

// 用来强制两个 div 出现滚动条
const changeHeight = () => {
  const { offsetHeight } = document.querySelector('.navbar');
  const element = document.querySelector('.my-gfm');
  element.style.height = window.innerHeight - offsetHeight + 'px';
};
window.onresize = changeHeight;
window.addEventListener('load', changeHeight);


class App extends Component {
  render() {
    return <GFM />;
  }
}

export default App;
