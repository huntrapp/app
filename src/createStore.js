import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { FeedState, reducer as feed } from './redux/feed';
import { reducer as token, TokenState } from './redux/token';
import { apiMiddleware } from 'redux-api-middleware';
import { autoRehydrate, persistStore } from 'redux-persist';
import SyncStorage from './services/SyncStorage';
import localForage from 'localforage';
import isChromeExtension from './constants/isChromeExtension';
import logger from 'redux-logger';
import colors, { ColorsState } from './redux/colors';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export type RootState = {
    feed: FeedState,
    token: TokenState,
    colors: ColorsState
};

const reducer = combineReducers({
    feed,
    token,
    colors
});
export default (cb) => {
    let middlewares = [apiMiddleware];
    if(process.env.NODE_ENV !== 'production' && isChromeExtension) {
        // we only use logger middleware when running from the extension, because we have no other choice.
        // (redux devtools can't access other extensions)
        middlewares.push(logger);
    }
    
    const store = createStore(reducer, undefined, composeEnhancers(
        applyMiddleware(...middlewares),
        autoRehydrate()
    ));
    
    let storage = SyncStorage;
    if(!isChromeExtension) {
        // eslint-disable-next-line no-console
        console.warn('createStore: Not going to use SyncStorage (not running as a chrome extension), falling back to localStorage');
        storage = localForage;
    }
    
    persistStore(store, { storage }, () => cb(store));
};