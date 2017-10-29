import React from 'react';
import 'highlight.js/styles/github.css';
const Preview = ({ output }) => (
  <div className="content column"
    dangerouslySetInnerHTML={{ __html: output }}
    style={{ height: `${window.innerHeight}px` }}
  ></div>
);
export default Preview;