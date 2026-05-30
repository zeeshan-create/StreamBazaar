import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './App.css'

// Disable Right Click (Context Menu)
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable DevTools shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C)
document.addEventListener('keydown', function(event) {
  // F12
  if (event.key === 'F12' || event.keyCode === 123) {
    event.preventDefault();
  }
  // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
  if (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'i' || event.key === 'J' || event.key === 'j' || event.key === 'C' || event.key === 'c')) {
    event.preventDefault();
  }
  // Ctrl+U (View Source)
  if (event.ctrlKey && (event.key === 'U' || event.key === 'u')) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
