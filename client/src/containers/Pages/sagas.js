import { call, select, put} from "redux-saga/effects"

import api from "../../services/ApiService"
import {PagesCreators as Creators} from "./redux"
import { LangSwitchCreators as LangCreators } from "../../components/LangSwitch/redux"
import {readableErrors} from "../../utils"

export default function* router(dispatch, {payload}) {
  let state = yield select()
  let slug = ""
  const lang = state.router.params.lang
  const preview = typeof state.router.query.preview !== "undefined"
  const useId = typeof state.router.query.use_id !== "undefined"

  if (typeof payload.params.slug === "undefined") {
    slug = payload.pathname.replace(`/${lang}`, "")
  } else {
    slug = payload.params.slug
  }

  yield put(Creators.request(slug))

  try {
    const contentResponse = yield call(api.getPageContentBySlug, slug, lang, preview, useId)

    yield put(Creators.success(contentResponse))

    state = yield select()
    let langurl
    lang === "de" ?
      langurl = state.router.route.replace("/:lang/", "/en/").replace(":slug", state.pages.post.translations.en) :
      langurl = state.router.route.replace("/:lang/", "/de/").replace(":slug", state.pages.post.translations.de)
    yield put(LangCreators.success(langurl))

  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
