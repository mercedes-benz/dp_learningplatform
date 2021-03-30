import "./polyfills"
import React from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import { I18nextProvider } from "react-i18next"

import App from "./containers/App"
import createStore from "./redux"
import { i18n } from "./utils"
// import registerServiceWorker from "./registerServiceWorker"
import { unregister as unregisterServiceWorker } from "./registerServiceWorker"
import enqueueTracking from "./tracking"

const store = createStore()

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <App />
    </Provider>
  </I18nextProvider>,
  document.getElementById("root")
)
// registerServiceWorker()
unregisterServiceWorker()

// azure monitoring
enqueueTracking()

export {store}
