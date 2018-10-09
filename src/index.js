import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// react-grid-layout CSS classes
import "../node_modules/react-grid-layout/css/styles.css"
import "../node_modules/react-resizable/css/styles.css"

const application = ReactDOM.render(<App />, document.getElementById('root'));

function draw(ev) {

  var file = document.getElementById("openImageButton").files[0];
  if (!file)
    return;

  application.addImage(file);
}

document.getElementById("openImageButton").addEventListener("change", draw)