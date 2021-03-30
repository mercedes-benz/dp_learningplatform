import { call, select, put } from "redux-saga/effects"

import api from "../../services/ApiService"

import { ManageBookmarksCreators as Creators } from "./redux"

import { KnowledgeSingleCreators as KnowledgeCreators } from "../KnowledgeSingle/redux"
import { KnowledgeArticlesCreators } from "../KnowledgeArticles/redux"
import { LearningSingleCreators as LearningCreators } from "../LearningSingle/redux"
import { AppCreators } from "../App/redux"

import { readableErrors } from "../../utils"

export function* addBookmark(dispatch, { id, container }) {
  try {
    const response = yield call(api.addBookmark, id)

    if (response.status === "success") {
      if (container === "knowledge") {
        dispatch(KnowledgeCreators.knowledgeSingleChangeBookmark(true))
      }
      if (container === "learning") {
        dispatch(LearningCreators.learningSingleChangeBookmark(true))
      }

      dispatch(AppCreators.numBookmarksUpdate(response.num_bookmarks))
    }
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* removeBookmark(dispatch, { id, lang, container }) {
  try {
    const response = yield call(api.removeBookmark, id, lang)

    if (response.status === "success") {
      if (container === "knowledge") {
        dispatch(KnowledgeCreators.knowledgeSingleChangeBookmark(false))
      }
      if (container === "learning") {
        dispatch(LearningCreators.learningSingleChangeBookmark(false))
      }

      dispatch(AppCreators.numBookmarksUpdate(response.num_bookmarks))
    }
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* addArticlesBookmark(dispatch, { id }) {
  try {
    const response = yield call(api.addBookmark, id)
    if (response.status === "success") {
      dispatch(KnowledgeArticlesCreators.knowledgeArticlesChangeBookmark(id, true))

      dispatch(AppCreators.numBookmarksUpdate(response.num_bookmarks))
    }
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* removeArticlesBookmark(dispatch, { id }) {
  let state = yield select()
  const lang = state.app.lang
  try {
    const response = yield call(api.removeBookmark, id, lang)
    if (response.status === "success") {
      dispatch(KnowledgeArticlesCreators.knowledgeArticlesChangeBookmark(id, false))

      dispatch(AppCreators.numBookmarksUpdate(response.num_bookmarks))
    }
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}