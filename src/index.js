import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import PetTestPage from './PetTestPage';
import reportWebVitals from './reportWebVitals';

const TEST_SPRITES = true; // set to false to restore normal app

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {TEST_SPRITES ? <PetTestPage /> : <App />}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
