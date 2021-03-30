import {call, all, select, put} from "redux-saga/effects"

import api from "../../services/ApiService"
import {LearningCreators as Creators} from "./redux"
import { LangSwitchCreators as LangCreators } from "../../components/LangSwitch/redux"
import {readableErrors} from "../../utils"

export default function* learning(dispatch, action) {
  let state = yield select()
  const lang = state.app.lang
  yield put(Creators.request())

  try {
    const [topicResponse, contentResponse, sidebarResponse, userDataResponse] = yield all([
      call(api.getLearningThemes, lang),
      call(api.getPageContentBySlug, "Lernen", lang),
      call(api.getLearningSidebar, lang),
      call(api.getUserProfile)
    ])

    yield put(
      Creators.success(topicResponse, contentResponse, sidebarResponse, userDataResponse)
    )

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
