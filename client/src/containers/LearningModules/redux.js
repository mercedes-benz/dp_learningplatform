/* ------------- Types and Action Creators ------------- */

/*
 * action types
 */
const Types = {
  LEARNING_MODULES_REQUEST: "LEARNING_MODULES_REQUEST",
  LEARNING_MODULES_SUCCESS: "LEARNING_MODULES_SUCCESS",
  LEARNING_MODULES_ERROR: "LEARNING_MODULES_ERROR",

  LEARNING_ARTICLES_REQUEST: "LEARNING_ARTICLES_REQUEST",
  LEARNING_ARTICLES_SUCCESS: "LEARNING_ARTICLES_SUCCESS",

  QUIZ_REQUEST: "QUIZ_REQUEST",
  QUIZ_SUCCESS: "QUIZ_SUCCESS"
}

/*
 * action creators
 */
const Creators = {
  request: id => {
    return {
      type: Types.LEARNING_MODULES_REQUEST,
      id
    }
  },

  success: (topic, modules, sidebar, userdata) => {
    return {
      type: Types.LEARNING_MODULES_SUCCESS,
      topic,
      modules,
      sidebar,
      userdata
    }
  },

  error: error => {
    return {
      type: Types.LEARNING_MODULES_ERROR,
      error
    }
  },

  articlesRequest: id => {
    return {
      type: Types.LEARNING_ARTICLES_REQUEST,
      id
    }
  },

  articlesSuccess: (articles) => {
    return {
      type: Types.LEARNING_ARTICLES_SUCCESS,
      articles
    }
  },

  quizRequest: id => {
    return {
      type: Types.QUIZ_REQUEST,
      id
    }
  },

  quizSuccess: (quizpost) => {
    return {
      type: Types.QUIZ_SUCCESS,
      quizpost
    }
  }
}

export const LearningModulesCreators = Creators
export const LearningModulesTypes = Types

/* ------------- Initial State ------------- */
const initialState = () => {
  return {
    topic: {},
    modules: [],
    articles: {},
    quizpost: {},
    sidebar: [],
    userdata: {},
    error: null,
    fetching: false
  }
}

/* ------------- Reducers ------------- */
const request = state => {
  return {...state, fetching: true, error: null}
}

const success = (state, { topic, modules, sidebar, userdata}) => {
  return {
    ...state,
    fetching: false,
    topic,
    modules,
    sidebar,
    userdata
  }
}

const error = (state, {error}) => {
  return {...state, fetching: false, error}
}

const articlesRequest = state => {
  return { ...state, fetching: true, error: null }
}

const articlesSuccess = (state, { articles }) => {
  return {
    ...state,
    fetching: false,
    articles: { ...state.articles, ...articles }
  }
}

const quizRequest = state => {
  return { ...state, fetching: true, error: null }
}

const quizSuccess = (state, { quizpost }) => {
  return {
    ...state,
    fetching: false,
    quizpost: { ...state.quizpost, ...quizpost }
  }
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = (state, action) => {
  if (typeof state === "undefined") {
    return initialState()
  }

  switch (action.type) {
    case Types.LEARNING_MODULES_REQUEST:
      return request(state, action)

    case Types.LEARNING_MODULES_SUCCESS:
      return success(state, action)

    case Types.LEARNING_MODULES_ERROR:
      return error(state, action)

    case Types.LEARNING_ARTICLES_REQUEST:
      return articlesRequest(state, action)

    case Types.LEARNING_ARTICLES_SUCCESS:
      return articlesSuccess(state, action)

    case Types.QUIZ_REQUEST:
      return quizRequest(state, action)

    case Types.QUIZ_SUCCESS:
      return quizSuccess(state, action)

    default:
      return state
  }
}
