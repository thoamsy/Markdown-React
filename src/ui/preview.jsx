import React from 'react';
import 'highlight.js/styles/github.css';
const Preview = ({ output }) => (
  <div className="preview"
    dangerouslySetInnerHTML={{ __html: output }}
    style={{ height: `${window.innerHeight}px` }}
  ></div>
);
export default Preview;