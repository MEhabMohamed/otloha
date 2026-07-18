import { thunk } from 'redux-thunk';
import logger from './logger';
import { applyMiddleware } from 'redux';

const middleware = process.env.NODE_ENV === 'development'
  ? applyMiddleware(thunk as any, logger)
  : applyMiddleware(thunk as any);

export default middleware;
