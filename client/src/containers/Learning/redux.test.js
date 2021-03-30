import {reducer, KnowledgeCreators as Creators} from "./redux"

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.topics).toEqual([])
  expect(state.post).toEqual({})
  expect(state.sidebar).toEqual([])

  // request
  state = reducer(state, Creators.request())
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success(['topics'],{one: "post"},['sidebar']))
  expect(state.fetching).toBe(false)
  expect(state.topics).toEqual(['topics'])
  expect(state.post).toEqual({one: "post"})
  expect(state.sidebar).toEqual(['sidebar'])

  // error
  state = reducer(state, Creators.error("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")
})
