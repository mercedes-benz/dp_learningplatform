/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  KNOWLEDGE_SINGLE_REQUEST: "KNOWLEDGE_SINGLE_REQUEST",
  KNOWLEDGE_SINGLE_SUCCESS: "KNOWLEDGE_SINGLE_SUCCESS",
  KNOWLEDGE_SINGLE_ERROR: "KNOWLEDGE_SINGLE_ERROR",

  KNOWLEDGE_SINGLE_CHANGE_BOOKMARK: "KNOWLEDGE_SINGLE_CHANGE_BOOKMARK",

  KNOWLEDGE_SINGLE_CHANGE_LIKE: "KNOWLEDGE_SINGLE_CHANGE_LIKE"
}

/*
 * action creators
 */
const Creators = {
  request: slug => {
    return {
      type: Types.KNOWLEDGE_SINGLE_REQUEST,
      slug
    }
  },

  success: post => {
    return {
      type: Types.KNOWLEDGE_SINGLE_SUCCESS,
      post
    }
  },

  error: error => {
    return {
      type: Types.KNOWLEDGE_SINGLE_ERROR,
      error
    }
  },

  knowledgeSingleChangeBookmark: (is_bookmarked) => {
    return {
      type: Types.KNOWLEDGE_SINGLE_CHANGE_BOOKMARK,
      is_bookmarked
    }
  },

  knowledgeSingleChangeLike: (is_liked, num_likes) => {
    return {
      type: Types.KNOWLEDGE_SINGLE_CHANGE_LIKE,
      is_liked,
      num_likes
    }
  }
}

export const KnowledgeSingleCreators = Creators
export const KnowledgeSingleTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    post: {
      fields: {
        linked_knowledge_articles: []
      },
      subcategory: {
        fields: {}
      },
      category: {
        fields: {}
      },
      is_bookmarked: null,
      is_liked: false,
      num_likes: 0,
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

const knowledgeSingleChangeBookmark = (state, { is_bookmarked }) => {
  return { ...state, post: { ...state.post, is_bookmarked } }
}

const knowledgeSingleChangeLike = (state, { is_liked, num_likes }) => {
  return { 
    ...state,
    post: {
      ...state.post,
      is_liked,
      num_likes: is_liked ? state.post.num_likes + 1 : state.post.num_likes - 1
    }
  }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.KNOWLEDGE_SINGLE_REQUEST:
      return request(state, action)

    case Types.KNOWLEDGE_SINGLE_SUCCESS:
      return success(state, action)

    case Types.KNOWLEDGE_SINGLE_ERROR:
      return error(state, action)

    case Types.KNOWLEDGE_SINGLE_CHANGE_BOOKMARK:
      return knowledgeSingleChangeBookmark(state, action)

    case Types.KNOWLEDGE_SINGLE_CHANGE_LIKE:
      return knowledgeSingleChangeLike(state, action)

    default:
      return state
  }
}
