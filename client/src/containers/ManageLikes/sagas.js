import { call, put } from "redux-saga/effects"

import api from "../../services/ApiService"

import { ManageLikesCreators as Creators } from "./redux"

import { KnowledgeSingleCreators as KnowledgeCreators } from "../KnowledgeSingle/redux"
import { KnowledgeArticlesCreators } from "../KnowledgeArticles/redux"
// import { LearningSingleCreators as LearningCreators } from "../LearningSingle/redux"
// import { AppCreators } from "../App/redux"

import { readableErrors } from "../../utils"

export function* addLike(dispatch, { id }) {
  try {
    const response = yield call(api.addLike, id)
    if (response.status === "success") {
      dispatch(KnowledgeCreators.knowledgeSingleChangeLike(true))

      // dispatch(AppCreators.numBookmarksUpdate(response.num_bookmarks))
    }
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* removeLike(dispatch, { id }) {
  try {
    const response = yield call(api.removeLike, id)
    if (response.status === "success") {
      dispatch(KnowledgeCreators.knowledgeSingleChangeLike(false))

      // dispatch(AppCreators.numBookmarksUpdate(response.num_bookmarks))
    }
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* addArticlesLike(dispatch, { id }) {
  try {
    const response = yield call(api.addLike, id)
    if (response.status === "success") {
      dispatch(KnowledgeArticlesCreators.knowledgeArticlesChangeLike(id, true))

      // dispatch(AppCreators.numBookmarksUpdate(response.num_bookmarks))
    }
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* removeArticlesLike(dispatch, { id }) {
  // let state = yield select()
  // const lang = state.app.lang
  try {
    const response = yield call(api.removeLike, id)
    if (response.status === "success") {
      dispatch(KnowledgeArticlesCreators.knowledgeArticlesChangeLike(id, false))

      // dispatch(AppCreators.numBookmarksUpdate(response.num_bookmarks))
    }
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}