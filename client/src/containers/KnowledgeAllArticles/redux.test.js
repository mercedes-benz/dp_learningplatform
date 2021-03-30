import {reducer, KnowledgeArticlesCreators as Creators} from "./redux"

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.topic).toEqual({})
  expect(state.module).toEqual({})
  expect(state.posts).toEqual([])
  expect(state.sidebar).toEqual([])
  expect(state.tags).toEqual({})

  // request
  state = reducer(state, Creators.request())
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success(
    {one: "topic"},
    {one: "module"},
    ['posts'],
    ['sidebar'],
    {one: "tags"}
  ))
  expect(state.fetching).toBe(false)
  expect(state.topic).toEqual({one: "topic"})
  expect(state.module).toEqual({one: "module"})
  expect(state.posts).toEqual(['posts'])
  expect(state.sidebar).toEqual(['sidebar'])
  expect(state.tags).toEqual({one: "tags"})

  // error
  state = reducer(state, Creators.error("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")
})
