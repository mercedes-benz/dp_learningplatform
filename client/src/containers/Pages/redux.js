/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  PAGES_REQUEST: "PAGES_REQUEST",
  PAGES_SUCCESS: "PAGES_SUCCESS",
  PAGES_ERROR: "PAGES_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: slug => {
    return {
      type: Types.PAGES_REQUEST,
      slug
    }
  },

  success: post => {
    return {
      type: Types.PAGES_SUCCESS,
      post
    }
  },

  error: error => {
    return {
      type: Types.PAGES_ERROR,
      error
    }
  }
}

export const PagesCreators = Creators
export const PagesTypes = Types

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
    case Types.PAGES_REQUEST:
      return request(state, action)

    case Types.PAGES_SUCCESS:
      return success(state, action)

    case Types.PAGES_ERROR:
      return error(state, action)

    default:
      return state
  }
}
