import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PlaceValueChart from './PlaceValueChart';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <PlaceValueChart />
  </React.StrictMode>,
  document.getElementById('alef_pvc')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// Prevent any log, if by any chance remained Open
console.log = function() {}
