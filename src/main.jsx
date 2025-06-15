// main.jsx or index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './app.css'; // ✅ Only this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
