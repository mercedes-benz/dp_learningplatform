/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  ADD_BOOKMARK: "ADD_BOOKMARK",
  REMOVE_BOOKMARK: "REMOVE_BOOKMARK",

  ADD_ARTICLES_BOOKMARK: "ADD_ARTICLES_BOOKMARK",
  REMOVE_ARTICLES_BOOKMARK: "REMOVE_ARTICLES_BOOKMARK"
}

/*
 * action creators
 */
const Creators = {
  addBookmark: (id, container) => {
    return {
      type: Types.ADD_BOOKMARK,
      id,
      container
    }
  },

  removeBookmark: (id, lang, container) => {
    return {
      type: Types.REMOVE_BOOKMARK,
      id,
      lang,
      container
    }
  },

  addArticlesBookmark: (id) => {
    return {
      type: Types.ADD_ARTICLES_BOOKMARK,
      id
    }
  },

  removeArticlesBookmark: (id) => {
    return {
      type: Types.REMOVE_ARTICLES_BOOKMARK,
      id
    }
  },
}

export const ManageBookmarksCreators = Creators
export const ManageBookmarksTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const addBookmark = (state) => {
  return { ...state }
}

const removeBookmark = (state) => {
  return { ...state }
}

const addArticlesBookmark = (state) => {
  return { ...state }
}

const removeArticlesBookmark = (state) => {
  return { ...state }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.ADD_BOOKMARK:
      return addBookmark(state, action)

    case Types.REMOVE_BOOKMARK:
      return removeBookmark(state, action)

    case Types.ADD_ARTICLES_BOOKMARK:
      return addArticlesBookmark(state, action)
      
    case Types.REMOVE_ARTICLES_BOOKMARK:
      return removeArticlesBookmark(state, action)

    default:
      return state
  }
}
