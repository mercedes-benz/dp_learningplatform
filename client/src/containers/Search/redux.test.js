import {reducer, SearchCreators as Creators} from "./redux"

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.results).toEqual([])
  expect(state.query_vars).toEqual({})

  // request
  state = reducer(state, Creators.request())
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success(['results'],{query: "vars"}))
  expect(state.fetching).toBe(false)
  expect(state.results).toEqual(['results'])
  expect(state.query_vars).toEqual({query: "vars"})
  // success append
  state = reducer(state, Creators.success(['moreResults'],{query: "anotherVars"}, true))
  expect(state.fetching).toBe(false)
  expect(state.results).toEqual(['results','moreResults'])
  expect(state.query_vars).toEqual({query: "anotherVars"})

  // error
  state = reducer(state, Creators.error("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")
})
