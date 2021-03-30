/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  LOGIN_SUCCESSFUL_REQUEST: "LOGIN_SUCCESSFUL_REQUEST",
  LOGIN_SUCCESSFUL_SUCCESS: "LOGIN_SUCCESSFUL_SUCCESS",
  LOGIN_SUCCESSFUL_ERROR: "LOGIN_SUCCESSFUL_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: slug => {
    return {
      type: Types.LOGIN_SUCCESSFUL_REQUEST,
      slug
    }
  },

  success: post => {
    return {
      type: Types.LOGIN_SUCCESSFUL_SUCCESS,
      post
    }
  },

  error: error => {
    return {
      type: Types.LOGIN_SUCCESSFUL_ERROR,
      error
    }
  }
}

export const LoginSuccessfulCreators = Creators
export const LoginSuccessfulTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    post: {},
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true}
}

const success = (state, {post}) => {
  return {
    ...state,
    fetching: false,
    post: {...state.post, ...post}
  }
}

const error = (state, {error}) => {
  return {...state, fetching: false, error}
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.LOGIN_SUCCESSFUL_REQUEST:
      return request(state, action)

    case Types.LOGIN_SUCCESSFUL_SUCCESS:
      return success(state, action)

    case Types.LOGIN_SUCCESSFUL_ERROR:
      return error(state, action)

    default:
      return state
  }
}
