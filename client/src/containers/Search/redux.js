/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  SEARCH_REQUEST: "SEARCH_REQUEST",
  SEARCH_SUCCESS: "SEARCH_SUCCESS",
  SEARCH_ERROR: "SEARCH_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: (slug, offset, append) => {
    return {
      type: Types.SEARCH_REQUEST,
      slug,
      offset,
      append
    }
  },

  success: (results, query_vars, others, append) => {
    return {
      type: Types.SEARCH_SUCCESS,
      results,
      query_vars,
      others,
      append
    }
  },

  error: error => {
    return {
      type: Types.SEARCH_ERROR,
      error
    }
  }
}

export const SearchCreators = Creators
export const SearchTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    results: [],
    query_vars: {},
    others: {},
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true}
}

const success = (state, { results, query_vars, others, append}) => {
  return {
    ...state,
    fetching: false,
    results: append ? [...state.results, ...results] : results,
    query_vars: query_vars,
    others: others
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
    case Types.SEARCH_REQUEST:
      return request(state, action)

    case Types.SEARCH_SUCCESS:
      return success(state, action)

    case Types.SEARCH_ERROR:
      return error(state, action)

    default:
      return state
  }
}
