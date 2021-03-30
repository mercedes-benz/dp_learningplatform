import {reducer, KnowledgeSingleCreators as Creators} from "./redux"

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.post).toEqual(
    {
      "fields": {
        "linked_knowledge_articles": []
      },
      "module": {
        "fields": {}
      },
      "topic": {
        "fields": {}
      },
      "next_post": {},
      "prev_post": {}
    }
  )

  // request
  state = reducer(state, Creators.request())
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success(
    {
      "fields": {
        "linked_knowledge_articles": ['articles']
      },
      "module": {
        "fields": {one: "fields"}
      },
      "topic": {
        "fields": {one: "topic"}
      },
      "next_post": {one: "next"},
      "prev_post": {one: "prev"}
    }
  ))
  expect(state.fetching).toBe(false)
  expect(state.post).toEqual(
    {
      "fields": {
        "linked_knowledge_articles": ['articles']
      },
      "module": {
        "fields": {one: "fields"}
      },
      "topic": {
        "fields": {one: "topic"}
      },
      "next_post": {one: "next"},
      "prev_post": {one: "prev"}
    }
  )

  // error
  state = reducer(state, Creators.error("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")
})
