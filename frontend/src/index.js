import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Open Sans:300,300i,400,400i,600,600i,700,700i', 'Raleway:300,300i,400,400i,500,500i,600,600i,700,700i', 'Poppins:300,300i,400,400i,500,500i,600,600i,700,700i']
  }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
