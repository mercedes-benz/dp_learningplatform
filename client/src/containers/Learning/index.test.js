import React from "react"
import ReactDOM from "react-dom"
import renderer from "react-test-renderer"
import {Provider} from "react-redux"

import createStore from "../../redux"
import Home from "./"

const store = createStore()

it("renders without crashing", () => {
  const tree = renderer.create(
    <Provider store={store}>
      <Home />
    </Provider>
  )

  expect(tree).toMatchSnapshot()

  tree.unmount()
})
