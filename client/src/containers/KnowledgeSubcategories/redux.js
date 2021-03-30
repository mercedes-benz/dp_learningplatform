/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  KNOWLEDGE_SUBCATEGORIES_REQUEST: "KNOWLEDGE_SUBCATEGORIES_REQUEST",
  KNOWLEDGE_SUBCATEGORIES_SUCCESS: "KNOWLEDGE_SUBCATEGORIES_SUCCESS",
  KNOWLEDGE_SUBCATEGORIES_ERROR: "KNOWLEDGE_SUBCATEGORIES_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: slug => {
    return {
      type: Types.KNOWLEDGE_SUBCATEGORIES_REQUEST,
      slug
    }
  },

  success: (category, subcategories, post, sidebar) => {
    return {
      type: Types.KNOWLEDGE_SUBCATEGORIES_SUCCESS,
      category,
      subcategories,
      post,
      sidebar
    }
  },

  error: error => {
    return {
      type: Types.KNOWLEDGE_SUBCATEGORIES_ERROR,
      error
    }
  }
}

export const KnowledgeSubcategoriesCreators = Creators
export const KnowledgeSubcategoriesTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    category: {},
    subcategories: [],
    post: {},
    sidebar: [],
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true, error: null}
}

const success = (state, {category, subcategories, post, sidebar}) => {
  return {
    ...state,
    fetching: false,
    category,
    subcategories,
    post,
    sidebar
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
    case Types.KNOWLEDGE_SUBCATEGORIES_REQUEST:
      return request(state, action)

    case Types.KNOWLEDGE_SUBCATEGORIES_SUCCESS:
      return success(state, action)

    case Types.KNOWLEDGE_SUBCATEGORIES_ERROR:
      return error(state, action)

    default:
      return state
  }
}
