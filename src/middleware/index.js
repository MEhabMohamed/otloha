import { thunk } from 'redux-thunk'
import logger from './logger'
import { applyMiddleware } from 'redux'

export default process.env.NODE_ENV === 'development' ? applyMiddleware(
    thunk,
    logger,
) : applyMiddleware(thunk)