import {reducer, CommentsCreators as Creators} from "./redux"

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.comments).toEqual([])
  expect(state.total_comments).toBe(0)

  // request
  state = reducer(state, Creators.request())
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success(['comments'],0))
  expect(state.fetching).toBe(false)
  expect(state.comments).toEqual(['comments'])
  expect(state.total_comments).toBe(0)

  // error
  state = reducer(state, Creators.error("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")
})
