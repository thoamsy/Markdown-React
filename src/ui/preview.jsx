import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'highlight.js/styles/atom-one-light.css';
const Preview = ({ output }) => (
  <div className="preview" dangerouslySetInnerHTML={{__html:output}}></div>
);
export default Preview;