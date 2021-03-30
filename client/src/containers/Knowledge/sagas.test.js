import {call, put} from "redux-saga/effects"

import api from "../../services/ApiService"
import home from "./sagas"
import createStore from "../../redux"
import {HomeCreators as Creators} from "./redux"

it("processes sagas correctly", () => {
  const storage = createStore()
  const {dispatch, getState} = storage
  const iterator = home(dispatch, {})

  expect(iterator.next(getState()).value).toEqual(put(Creators.request()))

  expect(iterator.next(getState()).value).toEqual(call(api.getCategories))

  expect(iterator.next(["category"]).value).toEqual(
    put(Creators.success(["category"]))
  )

  expect(iterator.next().done).toBe(true)
})
