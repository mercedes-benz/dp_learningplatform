import {call, select, all, put} from "redux-saga/effects"

import api from "../../services/ApiService"
import {HomeCreators as Creators} from "./redux"

import { LangSwitchCreators as LangCreators } from "../../components/LangSwitch/redux"

export default function* home(dispatch, action) {
  const state = yield select()

  const lang = state.router.params.lang
  let langurl
  lang === "de" ? langurl = "/en/" : langurl = "/de/"
  yield put(Creators.request())

  try {
    const [
      categoriesResponse,
      topicResponse,
      contentResponse,
      latestArticlesResponse
    ] = yield all([
      call(api.getKnowledgeCategories, lang),
      call(api.getLearningThemes, lang),
      call(api.getPageContentBySlug, "startseite", lang),
      call(api.getLatestKnowledgeArticles, lang)
    ])

    yield put(LangCreators.success(langurl))
    yield put(
      Creators.success(
        categoriesResponse,
        topicResponse,
        contentResponse,
        latestArticlesResponse
      )
    )
  } catch (e) {
    yield put(Creators.error(e.message))
  }
}
