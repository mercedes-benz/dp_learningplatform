import {reducer, MenuCreators as Creators} from "./redux"

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.main_menu).toEqual({children: []})
  expect(state.footer_menu).toEqual({children: []})
  expect(state.categories_menu).toEqual([])

  // request
  state = reducer(state, Creators.request())
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success(
    {"children": ['child']},
    {"children": ['child']},
    ['categories_menu']
  ))
  expect(state.fetching).toBe(false)
  expect(state.main_menu).toEqual({"children": ['child']})
  expect(state.footer_menu).toEqual({"children": ['child']})
  expect(state.categories_menu).toEqual(['categories_menu'])

  // error
  state = reducer(state, Creators.error("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")
})
