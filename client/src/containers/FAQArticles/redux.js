/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  FAQ_ARTICLES_REQUEST: "FAQ_ARTICLES_REQUEST",
  FAQ_ARTICLES_SUCCESS: "FAQ_ARTICLES_SUCCESS",
  FAQ_ARTICLES_ERROR: "FAQ_ARTICLES_ERROR"
}

/*
 * action creators
 */
const Creators = {
  request: (id) => {
    return {
      type: Types.FAQ_ARTICLES_REQUEST,
      id
    }
  },

  success: (category, articles, sidebar, faqsidebar) => {
    return {
      type: Types.FAQ_ARTICLES_SUCCESS,
      category,
      articles,
      sidebar: [...sidebar, { name: "FAQ", slug: "faq", children: faqsidebar }],
    }
  },

  error: error => {
    return {
      type: Types.FAQ_ARTICLES_ERROR,
      error
    }
  }
}

export const FaqArticlesCreators = Creators
export const FaqArticlesTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    category: {},
    articles: [],
    sidebar: [],
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true}
}

const success = (state, { category, articles, sidebar}) => {
  return {
    ...state,
    fetching: false,
    category,
    articles,
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
    case Types.FAQ_ARTICLES_REQUEST:
      return request(state, action)

    case Types.FAQ_ARTICLES_SUCCESS:
      return success(state, action)

    case Types.FAQ_ARTICLES_ERROR:
      return error(state, action)

    default:
      return state
  }
}
