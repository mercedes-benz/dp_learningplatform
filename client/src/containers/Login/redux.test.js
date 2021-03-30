import {reducer, LoginCreators as Creators} from "./redux"

it("processes actions correctly", () => {
  let state = reducer(undefined, {type: "DUMMY"})

  // initial state
  expect(state).toBeDefined()
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.token).toBeNull();
  expect(state.user_email).toBeNull();
  expect(state.user_nicename).toBeNull();
  expect(state.user_display_name).toBeNull();
  expect(state.avatar).toBeNull();
  expect(state.post).toEqual(
    {
      "post_content": '',
    }
  )

  // request
  state = reducer(state, Creators.request("user_email", "user_password"))
  expect(state.token).toBeNull();
  expect(state.user_email).toBeNull();
  expect(state.fetching).toBe(true)

  // success
  state = reducer(state, Creators.success("token","user_email","user_nicename","user_display_name","avatar"))
  expect(state.fetching).toBe(false)
  expect(state.token).toBe("token");
  expect(state.user_email).toBe("user_email");
  expect(state.user_nicename).toBe("user_nicename");
  expect(state.user_display_name).toBe("user_display_name");
  expect(state.avatar).toBe("avatar");

  // error
  state = reducer(state, Creators.error("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")

  // content request
  state = reducer(state, Creators.contentRequest())

  // content success
  state = reducer(state, Creators.contentSuccess({"post_content": "somecontent"}))
  expect(state.fetching).toBe(false)
  expect(state.post).toEqual({"post_content": "somecontent"});

  // content error
  state = reducer(state, Creators.contentError("error msg"))
  expect(state.fetching).toBe(false)
  expect(state.error).toBe("error msg")

  // logout
  state = reducer(state, Creators.logout());
  expect(state.fetching).toBe(false)
  expect(state.error).toBeNull()
  expect(state.token).toBeNull();
  expect(state.user_email).toBeNull();
  expect(state.user_nicename).toBeNull();
  expect(state.user_display_name).toBeNull();
  expect(state.avatar).toBeNull();
  expect(state.post).toEqual(
    {
      "post_content": '',
    }
  )
})
