import {call, all, put, select, takeEvery} from "redux-saga/effects"

import api from "../../services/ApiService"
import {
  FaqArticlesCreators as Creators,
  FaqArticlesTypes as Types
} from "./redux"
import { LangSwitchCreators as LangCreators } from "../../components/LangSwitch/redux"
import {readableErrors} from "../../utils"

export default function* router(dispatch, action) {
  const id = action.payload.params.id

  yield takeEvery(Types.FAQ_ARTICLES_REQUEST, moreArticles, dispatch)

  yield put(Creators.request(id))
}

export function* moreArticles(dispatch, { id}) {
  let state = yield select()
  const lang = state.app.lang
  const preview = typeof state.router.query.preview !== "undefined"

  try {
    const [articlesResponse, sidebarResponse, faqsidebarResponse] = yield all([
      call(api.getFAQArticlesByCategory, id, lang, preview),
      call(api.getSidebar, lang),
      call(api.getFAQSidebar, lang)
    ])

    yield put(Creators.success(articlesResponse.category, articlesResponse.articles, sidebarResponse, faqsidebarResponse))

    state = yield select()
    let langurl
    lang === "de" ?
      langurl = state.router.route.replace("/:lang/", "/en/").replace(":id", state.faqarticles.category.translations.en) :
      langurl = state.router.route.replace("/:lang/", "/de/").replace(":id", state.faqarticles.category.translations.de)
    yield put(LangCreators.success(langurl))

  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
