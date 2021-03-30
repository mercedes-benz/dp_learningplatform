import React from "react"
import ReactDOM from "react-dom"
import renderer from "react-test-renderer"
import {Provider} from "react-redux"

import createStore from "../../redux"
import Router from "./"

const boilerplateStore = createStore()
const store = {
  ...boilerplateStore,
  getState: () => {
    return {
      ...boilerplateStore.getState(),
      router: {
        route: "/"
      }
    }
  }
}

it("renders without crashing", () => {
  const tree = renderer.create(
    <Provider store={store}>
      <Router />
    </Provider>
  )

  expect(tree).toMatchSnapshot()
})
