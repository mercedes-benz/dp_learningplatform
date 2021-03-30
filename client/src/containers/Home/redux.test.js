import {reducer, HomeCreators as Creators} from "./redux"

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.topics).toEqual([])
  expect(state.post).toEqual({})
  expect(state.latest_articles).toEqual([])

  // request
  state = reducer(state, Creators.request())
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success(['topics'],{one: "post"},['latest_articles']))
  expect(state.fetching).toBe(false)
  expect(state.topics).toEqual(['topics'])
  expect(state.post).toEqual({one: "post"})
  expect(state.latest_articles).toEqual(['latest_articles'])

  // error
  state = reducer(state, Creators.error("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")
})
