/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  USER_PROFILE_REQUEST: "USER_PROFILE_REQUEST",
  USER_PROFILE_SUCCESS: "USER_PROFILE_SUCCESS",
  USER_PROFILE_ERROR: "USER_PROFILE_ERROR",

  DECREASE_BOOKMARKS_AMOUNT: "DECREASE_BOOKMARKS_AMOUNT",
  CLEAR_BOOKMARKS_AMOUNT: "CLEAR_BOOKMARKS_AMOUNT"
}

/*
 * action creators
 */
const Creators = {
  request: (slug) => {
    return {
      type: Types.USER_PROFILE_REQUEST,
      slug
    }
  },

  success: (userdata, userprogress, userbookmarks, usercertificates, num_bookmarks) => {
    return {
      type: Types.USER_PROFILE_SUCCESS,
      userdata,
      userprogress,
      userbookmarks,
      usercertificates,
      num_bookmarks
    }
  },

  error: error => {
    return {
      type: Types.USER_PROFILE_ERROR,
      error
    }
  },

  decreaseBookmarksAmount: (num_bookmarks) => {
    return {
      type: Types.DECREASE_BOOKMARKS_AMOUNT,
      num_bookmarks
    }
  },

  clearBookmarksAmount: (num_bookmarks) => {
    return {
      type: Types.CLEAR_BOOKMARKS_AMOUNT,
      num_bookmarks
    }
  }

}

export const UserProfileCreators = Creators
export const UserProfileTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    userdata: {},
    userprogress: {},
    userbookmarks: {},
    usercertificates: {},
    num_bookmarks: null,
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true}
}

const success = (state, { userdata, userprogress, userbookmarks, usercertificates, num_bookmarks}) => {
  return {
    ...state,
    fetching: false,
    userdata,
    userprogress,
    userbookmarks,
    usercertificates,
    num_bookmarks
  }
}

const error = (state, {error}) => {
  return {...state, fetching: false, error}
}

const decreaseBookmarksAmount = (state, { num_bookmarks }) => {
  return { 
    // ...state,
    // num_bookmarks: state.num_bookmarks.num_bookmarks - 1
    ...state,
    num_bookmarks: {
      ...state.num_bookmarks,
      num_bookmarks: state.num_bookmarks.num_bookmarks - 1
    }
  }
}

const clearBookmarksAmount = (state, { num_bookmarks }) => {
  return {
    ...state,
    num_bookmarks: 0
  }
}


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.USER_PROFILE_REQUEST:
      return request(state, action)

    case Types.USER_PROFILE_SUCCESS:
      return success(state, action)

    case Types.USER_PROFILE_ERROR:
      return error(state, action)

    case Types.DECREASE_BOOKMARKS_AMOUNT:
      return decreaseBookmarksAmount(state, action)

    case Types.CLEAR_BOOKMARKS_AMOUNT:
      return clearBookmarksAmount(state, action)

    default:
      return state
  }
}
