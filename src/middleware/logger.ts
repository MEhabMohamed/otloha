import { Middleware } from 'redux';

const logger: Middleware = (store) => (next) => (action) => {
  const returnValue = next(action);
  const newState = store.getState();

  // Send log to the server in a non-blocking way
  fetch('/api/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      newState,
    }),
  }).catch((err) => {
    // Fail silently in the browser if backend logging fails
    console.error('Failed to log to server:', err);
  });

  return returnValue;
};

export default logger;
