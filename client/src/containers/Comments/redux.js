/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  COMMENTS_REQUEST: "COMMENTS_REQUEST",
  COMMENTS_SUCCESS: "COMMENTS_SUCCESS",
  COMMENTS_ERROR: "COMMENTS_ERROR",
  COMMENTS_ADD: "COMMENTS_ADD",
}

/*
 * action creators
 */
const Creators = {
  request: (id, comments_per_page, offset, append = true) => {
    return {
      type: Types.COMMENTS_REQUEST,
      id,
      comments_per_page,
      offset,
      append
    }
  },

  success: (comments, total_comments) => {
    return {
      type: Types.COMMENTS_SUCCESS,
      comments,
      total_comments,
    }
  },

  error: (error) => {
    return {
      type: Types.COMMENTS_ERROR,
      error,
    }
  },

  add: (id, message) => {
    return {
      type: Types.COMMENTS_ADD,
      id,
      message,
    }
  }
}

export const CommentsCreators = Creators
export const CommentsTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    error: null,
    fetching: false,
    comments: [],
    total_comments: 0,
  }
}

/* ------------- Reducers ------------- */
const request = (state, {append}) => {
  if(append) {
    return {...state, fetching: true, error: null}
  } else {
    return {...state, fetching: true, error: null, comments: []}
  }
}

const success = (state, {comments, total_comments}) => {
  return {...state, fetching: false, comments: [...state.comments, ...comments], total_comments}
}

const error = (state, {error}) => {
  return {...state, fetching: false, error}
}

const add = (state) => {
  return {...state, total_comments: state.total_comments + 1, error: null}
}

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = (state, action) => {
  if(typeof state === "undefined") {
    return initialState()
  }

  switch(action.type) {
    case Types.COMMENTS_REQUEST:
      return request(state, action)

    case Types.COMMENTS_SUCCESS:
      return success(state, action)

    case Types.COMMENTS_ERROR:
      return error(state, action)

    case Types.COMMENTS_ADD:
      return add(state, action)

    default:
      return state
  }
}
