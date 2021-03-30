/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  HOME_REQUEST: "HOME_REQUEST",
  HOME_SUCCESS: "HOME_SUCCESS",
  HOME_ERROR: "HOME_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: () => {
    return {
      type: Types.HOME_REQUEST
    }
  },

  success: (categories, topics, post, latest_articles) => {
    return {
      type: Types.HOME_SUCCESS,
      categories,
      topics,
      post,
      latest_articles
    }
  },

  error: error => {
    return {
      type: Types.HOME_ERROR,
      error
    }
  }
}

export const HomeCreators = Creators
export const HomeTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    categories: [],
    topics: [],
    post: {},
    latest_articles: [],
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true, error: null}
}

const success = (state, { categories, topics, post, latest_articles}) => {
  return { ...state, fetching: false, categories, topics, post, latest_articles}
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
    case Types.HOME_REQUEST:
      return request(state, action)

    case Types.HOME_SUCCESS:
      return success(state, action)

    case Types.HOME_ERROR:
      return error(state, action)

    default:
      return state
  }
}
