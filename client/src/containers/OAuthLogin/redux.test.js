import {reducer, OAuthLoginCreators as Creators} from "./redux"
import { isIterable } from "core-js";

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()

  // request
  state = reducer(state, Creators.request("test-token"))
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success({}))
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()

  // error
  state = reducer(state, Creators.error("reason"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("reason")
})
