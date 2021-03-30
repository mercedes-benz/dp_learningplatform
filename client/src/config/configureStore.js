import {applyMiddleware, compose, createStore} from "redux"
import createSagaMiddleware from "redux-saga"
import {persistStore} from "redux-persist"

import {persistConfig} from "./"

// creates the store
export default (rootReducer, rootSaga, reduxRouter) => {
  /* ------------- Redux Configuration ------------- */
  const middleware = []
  const enhancers = []

  /* ------------- Saga Middleware ------------- */
  const sagaMiddleware = createSagaMiddleware()
  middleware.push(sagaMiddleware)

  /* ------------- Router Middleware ------------- */
  middleware.push(reduxRouter.middleware)

  /* ------------- Routes Enchancer ------------- */
  enhancers.push(reduxRouter.enhancer)

  /* ------------- Assemble Middleware ------------- */
  enhancers.push(applyMiddleware(...middleware))

  /* ------------- Redux DevTools Enhancer ------------- */
  if(window.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__())
  }

  /* ------------- Create Store ------------- */
  const store = createStore(rootReducer, compose(...enhancers))

  // configure persistStore and check reducer version number
  if(persistConfig.active) {
    persistStore(store)
  }

  // run sagas
  sagaMiddleware.run(rootSaga, store.dispatch)

  return store
}
