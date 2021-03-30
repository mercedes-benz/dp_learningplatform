/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  KNOWLEDGE_ARTICLES_REQUEST: "KNOWLEDGE_ARTICLES_REQUEST",
  KNOWLEDGE_ARTICLES_SUCCESS: "KNOWLEDGE_ARTICLES_SUCCESS",
  KNOWLEDGE_ARTICLES_ERROR: "KNOWLEDGE_ARTICLES_ERROR",

  KNOWLEDGE_SUBCATEGORY_REQUEST: "KNOWLEDGE_SUBCATEGORY_REQUEST",
  KNOWLEDGE_SUBCATEGORY_SUCCESS: "KNOWLEDGE_SUBCATEGORY_SUCCESS",

  KNOWLEDGE_ARTICLES_CHANGE_BOOKMARK: "KNOWLEDGE_ARTICLES_CHANGE_BOOKMARK",

  KNOWLEDGE_ARTICLES_CHANGE_LIKE: "KNOWLEDGE_ARTICLES_CHANGE_LIKE"
}

/*
 * action creators
 */
const Creators = {
  request: (id, tag, sortby, orderby) => {
    return {
      type: Types.KNOWLEDGE_ARTICLES_REQUEST,
      id,
      tag,
      sortby,
      orderby
    }
  },

  success: (category, subcategory, posts, sidebar, tags, faqsidebar) => {
    return {
      type: Types.KNOWLEDGE_ARTICLES_SUCCESS,
      category,
      subcategory,
      posts,
      sidebar: [...sidebar, { name: "FAQ", slug: "faq", children: faqsidebar }],
      tags
    }
  },

  error: error => {
    return {
      type: Types.KNOWLEDGE_ARTICLES_ERROR,
      error
    }
  },

  subcategoryWithContentRequest: id => {
    return {
      type: Types.KNOWLEDGE_SUBCATEGORY_REQUEST,
      id
    }
  },

  subcategoryWithContentSuccess: (subcategoryWithContent) => {
    return {
      type: Types.KNOWLEDGE_SUBCATEGORY_SUCCESS,
      subcategoryWithContent
    }
  },

  knowledgeArticlesChangeBookmark: (id, value) => {
    return {
      type: Types.KNOWLEDGE_ARTICLES_CHANGE_BOOKMARK,
      id,
      value
    }
  },

  knowledgeArticlesChangeLike: (id, value) => {
    return {
      type: Types.KNOWLEDGE_ARTICLES_CHANGE_LIKE,
      id,
      value
    }
  }
}

export const KnowledgeArticlesCreators = Creators
export const KnowledgeArticlesTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    category: {},
    subcategory: {},
    posts: [],
    sidebar: [],
    tags: {},
    subcategoryWithContent: {},
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return { ...state, fetching: true }
}

const success = (state, { category, subcategory, posts, sidebar, tags }) => {
  return {
    ...state,
    fetching: false,
    category,
    subcategory,
    posts,
    sidebar,
    tags
  }
}

const error = (state, { error }) => {
  return { ...state, fetching: false, error }
}

const subcategoryWithContentRequest = state => {
  return { ...state, fetching: true, error: null }
}

const subcategoryWithContentSuccess = (state, { subcategoryWithContent }) => {
  return {
    ...state,
    fetching: false,
    subcategoryWithContent: { ...state.subcategoryWithContent, ...subcategoryWithContent }
  }
}

const knowledgeArticlesChangeBookmark = (state, { id, value }) => {
  const newPosts = state.posts.map((post) => {
    if (post.ID === id) {
      post.is_bookmarked = value
    }
    return post
  })

  return { ...state, posts: newPosts }
}

const knowledgeArticlesChangeLike = (state, { id, value }) => {
  const newPosts = state.posts.map((post) => {
    if (post.ID === id) {
      post.is_liked = value
      // eslint-disable-next-line
      value ? post.num_likes + 1 : post.num_likes - 1
    }
    return post
  })

  return { ...state, posts: newPosts }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.KNOWLEDGE_ARTICLES_REQUEST:
      return request(state, action)

    case Types.KNOWLEDGE_ARTICLES_SUCCESS:
      return success(state, action)

    case Types.KNOWLEDGE_ARTICLES_ERROR:
      return error(state, action)

    case Types.KNOWLEDGE_SUBCATEGORY_REQUEST:
      return subcategoryWithContentRequest(state, action)

    case Types.KNOWLEDGE_SUBCATEGORY_SUCCESS:
      return subcategoryWithContentSuccess(state, action)

    case Types.KNOWLEDGE_ARTICLES_CHANGE_BOOKMARK:
      return knowledgeArticlesChangeBookmark(state, action)

    case Types.KNOWLEDGE_ARTICLES_CHANGE_LIKE:
      return knowledgeArticlesChangeLike(state, action)

    default:
      return state
  }
}
