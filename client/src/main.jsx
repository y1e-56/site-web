import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './typography.css';
import './animations.css';
import './forms.css';
import './App.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
