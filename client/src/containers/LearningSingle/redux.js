/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  LEARNING_SINGLE_REQUEST: "LEARNING_SINGLE_REQUEST",
  LEARNING_SINGLE_SUCCESS: "LEARNING_SINGLE_SUCCESS",
  LEARNING_SINGLE_ERROR: "LEARNING_SINGLE_ERROR",

  LEARNING_SINGLE_CHANGE_BOOKMARK: "LEARNING_SINGLE_CHANGE_BOOKMARK"
}

/*
 * action creators
 */
const Creators = {
  request: slug => {
    return {
      type: Types.LEARNING_SINGLE_REQUEST,
      slug
    }
  },

  success: post => {
    return {
      type: Types.LEARNING_SINGLE_SUCCESS,
      post
    }
  },

  error: error => {
    return {
      type: Types.LEARNING_SINGLE_ERROR,
      error
    }
  },

  learningSingleChangeBookmark: (is_bookmarked) => {
    return {
      type: Types.LEARNING_SINGLE_CHANGE_BOOKMARK,
      is_bookmarked
    }
  }

}

export const LearningSingleCreators = Creators
export const LearningSingleTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    post: {
      fields: {
        linked_learning_articles: []
      },
      module: {
        fields: {}
      },
      topic: {
        fields: {}
      },
      is_bookmarked: null,
      prev_post: {},
      next_post: {}
    },
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true}
}

const success = (state, {post}) => {
  return {
    ...state,
    fetching: false,
    error: null,
    post: {...state.post, ...post}
  }
}

const error = (state, {error}) => {
  return {...state, fetching: false, error}
}

const learningSingleChangeBookmark = (state, { is_bookmarked }) => {
  return { ...state, post: { ...state.post, is_bookmarked } }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.LEARNING_SINGLE_REQUEST:
      return request(state, action)

    case Types.LEARNING_SINGLE_SUCCESS:
      return success(state, action)

    case Types.LEARNING_SINGLE_ERROR:
      return error(state, action)

    case Types.LEARNING_SINGLE_CHANGE_BOOKMARK:
      return learningSingleChangeBookmark(state, action)

    default:
      return state
  }
}
