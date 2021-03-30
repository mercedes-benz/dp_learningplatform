import { call, put, select} from "redux-saga/effects"

import api from "../../services/ApiService"
import {CommentsCreators as Creators} from "./redux"
import {readableErrors} from "../../utils"

export default function* comments(dispatch, {id, comments_per_page, offset}) {
  let state = yield select()
  const lang = state.router.params.lang
  try {
    const commentsResponse = yield call(api.getCommentsByKnowledgeArticleID, id, comments_per_page, offset, lang)

    yield put(Creators.success(commentsResponse.comments, commentsResponse.total_comments))
  } catch(e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* add(dispatch, {id, message}) {
  try {
    yield call(api.addCommentToKnowledgeArticle, id, message)
  } catch(e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
