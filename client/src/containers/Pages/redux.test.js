import {reducer, PagesCreators as Creators} from "./redux"

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.post).toEqual({})

  // request
  state = reducer(state, Creators.request())
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success({one: "post"}))
  expect(state.fetching).toBe(false)
  expect(state.post).toEqual({one: "post"})

  // error
  state = reducer(state, Creators.error("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")
})
