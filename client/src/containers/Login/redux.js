/**
 * Login
 * -----
 * types, creators (actions) and reducers
 */

/* ------------- Types ------------- */
const Types = {
  LOGIN_CONTENT_REQUEST: "LOGIN_CONTENT_REQUEST",
  LOGIN_CONTENT_SUCCESS: "LOGIN_CONTENT_SUCCESS",
  LOGIN_CONTENT_ERROR: "LOGIN_CONTENT_ERROR",
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_ERROR: "LOGIN_ERROR",
  LOGOUT: "LOGOUT",
  LOGOUT_NO_COOKIE: "LOGOUT_NO_COOKIE",

  LOGIN_COOKIE_CHECK: "LOGIN_COOKIE_CHECK",

  LOGIN_REPLACE_AVATAR: "LOGIN_REPLACE_AVATAR"
}

/* ------------- Creators ------------- */
const Creators = {
  // content
  contentRequest: (slug) => {
    return {
      type: Types.LOGIN_CONTENT_REQUEST,
      slug
    }
  },

  contentSuccess: (post) => {
    return {
      type: Types.LOGIN_CONTENT_SUCCESS,
      post,
    }
  },

  contentError: (error) => {
    return {
      type: Types.LOGIN_CONTENT_ERROR,
      error,
    }
  },

  // login
  request: (username, password) => {
    return {
      type: Types.LOGIN_REQUEST,
      username,
      password
    }
  },

  success: (token, user_email, user_nicename, user_display_name, avatar) => {
    return {
      type: Types.LOGIN_SUCCESS,
      token,
      user_email,
      user_nicename,
      user_display_name,
      avatar
    }
  },

  error: (error) => {
    return {
      type: Types.LOGIN_ERROR,
      error
    }
  },

  logout: () => {
    return {
      type: Types.LOGOUT,
    }
  },

  logoutNoCookie: () => {
    return {
      type: Types.LOGOUT_NO_COOKIE,
    }
  },

  cookieCheck: () => {
    return {
      type: Types.LOGIN_COOKIE_CHECK,
    }
  },

  replaceAvatar: (avatar) => {
    return {
      type: Types.LOGIN_REPLACE_AVATAR,
      avatar
    }
  }
}

export const LoginCreators = Creators
export const LoginTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    fetching: false,
    error: null,
    token: null,
    user_email: null,
    user_nicename: null,
    user_display_name: null,
    avatar: null,
    post: {
      post_content: "",
    },
  }
}

/* ------------- Reducers ------------- */
const contentRequest = (state, {slug}) => {
  return {...state, fetching: true, error: null}
}

const contentSuccess = (state, {post}) => {
  return {...state, fetching: false, post}
}

const contentError = (state, {error}) => {
  return {...state, fetching: false, error}
}

const request = (state) => {
  return {...state, fetching: true, error: null}
}

const success = (state, {token, user_email, user_nicename, user_display_name, avatar}) => {
  return {...state, fetching: false, token, user_email, user_nicename, user_display_name, avatar}
}

const error = (state, {error}) => {
  return {...state, fetching: false, error}
}

const logout = () => {
  return initialState()
}

const logoutNoCookie = (state) => {
  return state
}

const cookieCheck = (state) => {
  return state
}

const replaceAvatar = (state, {avatar}) => {
  return { ...state, avatar }
}

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = (state, action) => {
  if(typeof state === "undefined")
    return initialState()

  switch(action.type) {
    case Types.LOGIN_CONTENT_REQUEST:
      return contentRequest(state, action)

    case Types.LOGIN_CONTENT_SUCCESS:
      return contentSuccess(state, action)

    case Types.LOGIN_CONTENT_ERROR:
      return contentError(state, action)

    case Types.LOGIN_REQUEST:
      return request(state, action)

    case Types.LOGIN_SUCCESS:
      return success(state, action)

    case Types.LOGIN_ERROR:
      return error(state, action)

    case Types.LOGOUT:
      return logout()

    case Types.LOGOUT_NO_COOKIE:
      return logoutNoCookie(state)

    case Types.LOGIN_COOKIE_CHECK:
      return cookieCheck(state)

    case Types.LOGIN_REPLACE_AVATAR:
      return replaceAvatar(state, action)

    default:
      return state
  }
}
