/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  OAUTH_LOGIN_REQUEST: "OAUTH_LOGIN_REQUEST",
  OAUTH_LOGIN_SUCCESS: "OAUTH_LOGIN_SUCCESS",
  OAUTH_LOGIN_ERROR: "OAUTH_LOGIN_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: token => {
    return {
      type: Types.OAUTH_LOGIN_REQUEST,
      token
    }
  },

  success: userData => {
    return {
      type: Types.OAUTH_LOGIN_SUCCESS,
      userData
    }
  },

  error: error => {
    return {
      type: Types.OAUTH_LOGIN_ERROR,
      error
    }
  }
}

export const OAuthLoginCreators = Creators
export const OAuthLoginTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    fetching: false,
    error: null,
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true}
}

const success = state => {
  return {...state, fetching: false}
}

const error = (state, {error}) => {
  return {...state, fetching: false, error}
}

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = (state, action) => {
  if(typeof state === "undefined") {
    return initialState()
  }

  switch(action.type) {
    case Types.OAUTH_LOGIN_REQUEST:
      return request(state, action)

    case Types.OAUTH_LOGIN_SUCCESS:
      return success(state, action)

    case Types.OAUTH_LOGIN_ERROR:
      return error(state, action)

    default:
      return state
  }
}
