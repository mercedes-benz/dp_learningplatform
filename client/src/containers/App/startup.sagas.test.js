import startup, {startupLocation} from "./startup.sagas"
import {LOCATION_CHANGED} from "redux-little-router"
import createStore from "../../redux"
import {apply} from "redux-saga/effects"
import Creators from "./startup.redux"

it("handles startup", () => {
  const {dispatch} = createStore()
  const action = {}
  const iterator = startup(dispatch, action)

  iterator.next() // empty saga so far

  expect(iterator.next().done).toBe(true)
})

it("handles startup location", () => {
  const {dispatch} = createStore()
  const action = {payload: {route: "/:dummy"}}
  const iterator = startupLocation(dispatch, action)

  expect(iterator.next().value).toEqual({type: LOCATION_CHANGED, ...action})

  expect(iterator.next().done).toBe(true)
})
