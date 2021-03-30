/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  LS_REQUEST: "LS_REQUEST",
  UPDATE_LANG_URLS: "UPDATE_LANG_URLS"
}

/*
 * action creators
 */
const Creators = {
  success: (langurl) => {
    return {
      type: Types.UPDATE_LANG_URLS,
      langurl
    }
  }
}

export const LangSwitchCreators = Creators
export const LangSwitchTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    langurl: '',
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const success = (state, langurl) => {
  return { ...state, langurl }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.UPDATE_LANG_URLS:
      return success(state, action)

    default:
      return state
  }
}
