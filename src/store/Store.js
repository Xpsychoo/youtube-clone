import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk'; // Change here to import thunk as a named export
import { persistStore, persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

import rootReducer from './RootReducer';

  const persistConfig = {
    key: 'ocRoot',
    storage: storageSession,
  };

  const enhancers = [];
  const middlewares = [thunk];

  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'development') {
    // add this enhancer to show our Redux state in Redux dev tool
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(...middlewares),
    ...enhancers,
  );

  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer, composedEnhancers);
  const persistor = persistStore(store);

  export { store, persistor };



