import React from "react"
import ReactDOM from "react-dom"
import renderer from "react-test-renderer"
import {Provider} from "react-redux"

import createStore from "../../redux"
import Button from "./"

const store = createStore()

it("renders without crashing", () => {
  const tree = renderer.create(
    <Provider store={store}>
      <Button href="/">Button</Button>
    </Provider>
  )

  expect(tree).toMatchSnapshot()
})
