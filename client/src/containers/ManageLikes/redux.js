/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  ADD_LIKE: "ADD_LIKE",
  REMOVE_LIKE: "REMOVE_LIKE",

  ADD_ARTICLES_LIKE: "ADD_ARTICLES_LIKE",
  REMOVE_ARTICLES_LIKE: "REMOVE_ARTICLES_LIKE"
}

/*
 * action creators
 */
const Creators = {
  addLike: (id) => {
    return {
      type: Types.ADD_LIKE,
      id
    }
  },

  removeLike: (id) => {
    return {
      type: Types.REMOVE_LIKE,
      id
    }
  },

  addArticlesLike: (id) => {
    return {
      type: Types.ADD_ARTICLES_LIKE,
      id
    }
  },

  removeArticlesLike: (id) => {
    return {
      type: Types.REMOVE_ARTICLES_LIKE,
      id
    }
  },
}

export const ManageLikesCreators = Creators
export const ManageLikesTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const addLike = (state) => {
  return { ...state }
}

const removeLike = (state) => {
  return { ...state }
}

const addArticlesLike = (state) => {
  return { ...state }
}

const removeArticlesLike = (state) => {
  return { ...state }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.ADD_LIKE:
      return addLike(state, action)

    case Types.REMOVE_LIKE:
      return removeLike(state, action)

    case Types.ADD_ARTICLES_LIKE:
      return addArticlesLike(state, action)
      
    case Types.REMOVE_ARTICLES_LIKE:
      return removeArticlesLike(state, action)

    default:
      return state
  }
}
