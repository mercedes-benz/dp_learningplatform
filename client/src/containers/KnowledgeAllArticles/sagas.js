import { call, all, put, select, takeEvery } from "redux-saga/effects"

import api from "../../services/ApiService"
import {
  KnowledgeArticlesCreators as Creators,
  KnowledgeArticlesTypes as Types
} from "./redux"
import { LangSwitchCreators as LangCreators } from "../../components/LangSwitch/redux"
import { readableErrors } from "../../utils"

export default function* router(dispatch, action) {

  yield takeEvery(Types.KNOWLEDGE_ARTICLES_REQUEST, moreArticles, dispatch)

  yield put(Creators.request("order", "ASC"))
}

export function* moreArticles(dispatch, { sortby, orderby }) {
  let state = yield select()
  const lang = state.router.params.lang
  try {
    const [articlesResponse, sidebarResponse, tagsResponse, contentResponse, faqsidebarResponse] = yield all([
      call(api.getAllKnowledgeArticles, sortby, orderby, lang),
      call(api.getSidebar, lang),
      call(api.getKnowledgeTags, lang),
      call(api.getPageContentBySlug, "Wissen", lang),
      call(api.getFAQSidebar, lang),
    ])
    
    yield put(Creators.success(articlesResponse.posts, sidebarResponse, tagsResponse, contentResponse, faqsidebarResponse))

    state = yield select()
    let langurl
    lang === "de" ?
      langurl = state.router.route.replace("/:lang/", "/en/") :
      langurl = state.router.route.replace("/:lang/", "/de/")
    yield put(LangCreators.success(langurl))
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}