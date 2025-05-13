import {StrictMode} from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';

import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

const container = document.getElementById('root')
const root = createRoot(container)
const hydrate = hydrateRoot(container)

if(container.hasChildNodes())
{
  hydrate.render(
      <Provider store={store}>
        <App />
      </Provider>
  )
}
else
{
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}

