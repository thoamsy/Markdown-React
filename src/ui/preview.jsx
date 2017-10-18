import React from 'react';
import 'highlight.js/styles/github-gist.css';
const Preview = ({ output }) => (
  <div className="preview" dangerouslySetInnerHTML={{__html:output}}></div>
);
export default Preview;