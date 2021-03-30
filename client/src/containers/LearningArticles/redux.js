/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  LEARNING_ARTICLES_REQUEST: "LEARNING_ARTICLES_REQUEST",
  LEARNING_ARTICLES_SUCCESS: "LEARNING_ARTICLES_SUCCESS",
  LEARNING_ARTICLES_ERROR: "LEARNING_ARTICLES_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: (slug, tag, sortby, orderby) => {
    return {
      type: Types.LEARNING_ARTICLES_REQUEST,
      slug,
      tag,
      sortby,
      orderby
    }
  },

  success: (topic, module, posts, sidebar, tags) => {
    return {
      type: Types.LEARNING_ARTICLES_SUCCESS,
      topic,
      module,
      posts,
      sidebar,
      tags
    }
  },

  error: error => {
    return {
      type: Types.LEARNING_ARTICLES_ERROR,
      error
    }
  }
}

export const LearningArticlesCreators = Creators
export const LearningArticlesTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    topic: {},
    module: {},
    posts: [],
    sidebar: [],
    tags: {},
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true}
}

const success = (state, {topic, module, posts, sidebar, tags}) => {
  return {
    ...state,
    fetching: false,
    topic,
    module,
    posts,
    sidebar,
    tags
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
    case Types.LEARNING_ARTICLES_REQUEST:
      return request(state, action)

    case Types.LEARNING_ARTICLES_SUCCESS:
      return success(state, action)

    case Types.LEARNING_ARTICLES_ERROR:
      return error(state, action)

    default:
      return state
  }
}
