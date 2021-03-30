import {call, all, select, put} from "redux-saga/effects"

import api from "../../services/ApiService"
import {KnowledgeCreators as Creators} from "./redux"
import {readableErrors} from "../../utils"

export default function* knowledge(dispatch, action) {
  yield put(Creators.request())
  let state = yield select()
  const lang = state.router.params.lang
  try {
    const [contentResponse, sidebarResponse, faqsidebarResponse, tagsResponse] = yield all([
      call(api.getPageContentBySlug, "Wissen", lang),
      call(api.getSidebar, lang),
      call(api.getFAQSidebar, lang),
      call(api.getKnowledgeTags, lang),
      call(api.getKnowledgeTags, lang)
    ])

    yield put(
      Creators.success(contentResponse, sidebarResponse, faqsidebarResponse, tagsResponse)
    )
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}