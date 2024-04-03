import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import middleware from './middleware';
import { legacy_createStore as createStore } from 'redux';
import reducer from './reducers'

const store = createStore(reducer, middleware);
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
);