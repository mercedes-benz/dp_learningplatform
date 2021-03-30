/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  LEARNING_REQUEST: "LEARNING_REQUEST",
  LEARNING_SUCCESS: "LEARNING_SUCCESS",
  LEARNING_ERROR: "LEARNING_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: () => {
    return {
      type: Types.LEARNING_REQUEST
    }
  },

  success: (topics, post, sidebar, userdata) => {
    return {
      type: Types.LEARNING_SUCCESS,
      topics,
      post,
      sidebar,
      userdata
    }
  },

  error: error => {
    return {
      type: Types.LEARNING_ERROR,
      error
    }
  }
}

export const LearningCreators = Creators
export const LearningTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    topics: [],
    post: {},
    sidebar: [],
    userdata: {},
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true, error: null}
}

const success = (state, { topics, post, sidebar, userdata}) => {
  return { ...state, fetching: false, topics, post, sidebar: sidebar, userdata}
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
    case Types.LEARNING_REQUEST:
      return request(state, action)

    case Types.LEARNING_SUCCESS:
      return success(state, action)

    case Types.LEARNING_ERROR:
      return error(state, action)

    default:
      return state
  }
}
