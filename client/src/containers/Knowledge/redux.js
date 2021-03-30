/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  KNOWLEDGE_REQUEST: "KNOWLEDGE_REQUEST",
  KNOWLEDGE_SUCCESS: "KNOWLEDGE_SUCCESS",
  KNOWLEDGE_ERROR: "KNOWLEDGE_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: () => {
    return {
      type: Types.KNOWLEDGE_REQUEST
    }
  },

  success: (post, sidebar, faqsidebar, tags) => {
    return {
      type: Types.KNOWLEDGE_SUCCESS,
      post,
      sidebar: [...sidebar, { name: "FAQ", slug: "faq", children: faqsidebar }],
      tags
    }
  },

  error: error => {
    return {
      type: Types.KNOWLEDGE_ERROR,
      error
    }
  }

}

export const KnowledgeCreators = Creators
export const KnowledgeTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    post: {},
    sidebar: [],
    tags: {},
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true, error: null}
}

const success = (state, { post, sidebar, tags, posts}) => {
  return { ...state, fetching: false, post, sidebar: sidebar, tags}
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
    case Types.KNOWLEDGE_REQUEST:
      return request(state, action)

    case Types.KNOWLEDGE_SUCCESS:
      return success(state, action)

    case Types.KNOWLEDGE_ERROR:
      return error(state, action)

    default:
      return state
  }
}
