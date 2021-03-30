/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  KNOWLEDGE_ARTICLES_REQUEST: "KNOWLEDGE_ARTICLES_REQUEST",
  KNOWLEDGE_ARTICLES_SUCCESS: "KNOWLEDGE_ARTICLES_SUCCESS",
  KNOWLEDGE_ARTICLES_ERROR: "KNOWLEDGE_ARTICLES_ERROR",

  KNOWLEDGE_ARTICLES_CHANGE_BOOKMARK: "KNOWLEDGE_ARTICLES_CHANGE_BOOKMARK",

  KNOWLEDGE_ARTICLES_CHANGE_LIKE: "KNOWLEDGE_ARTICLES_CHANGE_LIKE"
}

/*
 * action creators
 */
const Creators = {
  request: (slug, tag, sortby, orderby) => {
    return {
      type: Types.KNOWLEDGE_ARTICLES_REQUEST,
      slug,
      tag,
      sortby,
      orderby
    }
  },

  success: (posts, sidebar, tags, post, faqsidebar) => {
    return {
      type: Types.KNOWLEDGE_ARTICLES_SUCCESS,
      posts,
      sidebar: [...sidebar, { name: "FAQ", slug: "faq", children: faqsidebar }],
      tags, 
      post
    }
  },

  error: error => {
    return {
      type: Types.KNOWLEDGE_ARTICLES_ERROR,
      error
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
    posts: [],
    sidebar: [],
    tags: {},
    post: {},
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return { ...state, fetching: true }
}

const success = (state, { posts, sidebar, tags, post }) => {
  return {
    ...state,
    fetching: false,
    posts,
    sidebar,
    tags,
    post
  }
}

const error = (state, { error }) => {
  return { ...state, fetching: false, error }
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
      post.num_likes = value ? post.num_likes + 1 : post.num_likes - 1
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

    case Types.KNOWLEDGE_ARTICLES_CHANGE_BOOKMARK:
      return knowledgeArticlesChangeBookmark(state, action)

    case Types.KNOWLEDGE_ARTICLES_CHANGE_LIKE:
      return knowledgeArticlesChangeLike(state, action)

    default:
      return state
  }
}