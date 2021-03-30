/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  MENU_REQUEST: "MENU_REQUEST",
  MENU_SUCCESS: "MENU_SUCCESS",
  MENU_ERROR: "MENU_ERROR",

  SET_LANGUAGE: "SET_LANGUAGE",
  NUM_BOOKMARKS_UPDATE: "NUM_BOOKMARKS_UPDATE",

  REFRESH_TOPICS_REQUEST: "REFRESH_TOPICS_REQUEST",
  REFRESH_TOPICS_SUCCESS: "REFRESH_TOPICS_SUCCESS"
}

/*
 * action creators
 */
const Creators = {
  request: () => {
    return {
      type: Types.MENU_REQUEST
    }
  },

  success: (main_menu, footer_menu, topic_menu, categories_menu, num_bookmarks) => {
    return {
      type: Types.MENU_SUCCESS,
      main_menu,
      footer_menu,
      topic_menu,
      categories_menu,
      num_bookmarks
    }
  },

  error: error => {
    return {
      type: Types.MENU_ERROR,
      error
    }
  },

  setLanguage: lang => {
    return {
      type: Types.SET_LANGUAGE,
      lang,
    }
  },

  numBookmarksUpdate: (num_bookmarks) => {
    return {
      type: Types.NUM_BOOKMARKS_UPDATE,
      num_bookmarks,
    }
  },

  refreshTopicsRequest: () => {
    return {
      type: Types.REFRESH_TOPICS_REQUEST
    }
  },
  refreshTopicsSuccess: (main_menu,topic_menu) => {
    return {
      type: Types.REFRESH_TOPICS_SUCCESS,
      main_menu,
      topic_menu
    }
  }
}

export const AppCreators = Creators
export const AppTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    main_menu: {children: []},
    footer_menu: {children: []},
    topic_menu: [],
    categories_menu: [],
    lang: '',
    num_bookmarks: null,
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true}
}

const success = (state, { main_menu, footer_menu, topic_menu, categories_menu, num_bookmarks}) => {
  return {
    ...state,
    fetching: false,
    main_menu: main_menu,
    footer_menu: footer_menu,
    topic_menu: topic_menu,
    categories_menu: categories_menu,
    num_bookmarks
  }
}

const error = (state, {error}) => {
  return {...state, fetching: false, error}
}

const setLanguage = (state, {lang}) => {
  return {...state, lang}
}

const numBookmarksUpdate = (state, {num_bookmarks}) => {
  return {...state, num_bookmarks}
}

const refreshTopicsRequest = state => {
  return { ...state, fetching: true }
}
const refreshTopicsSuccess = (state, { main_menu, topic_menu }) => {
  return { ...state, main_menu, topic_menu }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.MENU_REQUEST:
      return request(state, action)

    case Types.MENU_SUCCESS:
      return success(state, action)

    case Types.MENU_ERROR:
      return error(state, action)

    case Types.SET_LANGUAGE:
      return setLanguage(state, action)

    case Types.NUM_BOOKMARKS_UPDATE:
      return numBookmarksUpdate(state, action)

    case Types.REFRESH_TOPICS_REQUEST:
      return refreshTopicsRequest(state, action)
    case Types.REFRESH_TOPICS_SUCCESS:
      return refreshTopicsSuccess(state, action)

    default:
      return state
  }
}
