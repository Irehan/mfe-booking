import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './App.css';

const REGISTRY_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_REGISTRY_URL) ??
  'http://localhost:4000/registry';

async function selfRegister() {
  try {
    const res = await fetch('/plugin-manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('manifest not found');
    const manifest = await res.json();

    await fetch(REGISTRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manifest),
    });

    console.log('✅ Registered plugin:', manifest.scope);
  } catch (e) {
    console.warn('⚠️ Plugin self-register failed', e);
  }
}
selfRegister();

const mount = (el: HTMLElement) => {
  const root = ReactDOM.createRoot(el);
  const isStandalone = !String(window.name || '').includes('host');

  root.render(
    <React.StrictMode>
      {isStandalone ? (
        <Router>
          <App />
        </Router>
      ) : (
        <App />
      )}
    </React.StrictMode>
  );
};

if ((import.meta as any)?.env?.DEV) {
  const devRoot = document.getElementById('root');
  if (devRoot && !String(window.name || '').includes('host')) {
    mount(devRoot);
  }
}

export { mount };
