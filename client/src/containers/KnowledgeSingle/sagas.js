import {call, select, put} from "redux-saga/effects"

import api from "../../services/ApiService"
import {KnowledgeSingleCreators as Creators} from "./redux"
import {CommentsCreators} from "../Comments/redux"
import { LangSwitchCreators as LangCreators } from "../../components/LangSwitch/redux"
import {vars} from "../../config"
import {readableErrors} from "../../utils"

export default function* knowledgesingle(dispatch, action) {
  let state = yield select()
  const lang = state.app.lang
  const id = action.payload.params.id
  const preview = typeof state.router.query.preview !== "undefined"
  const useId = typeof state.router.query.use_id !== "undefined"

  yield put(Creators.request(id))
  try {
    const postResponse = yield call(api.getKnowledgeArticleByID, id, lang, preview, useId)

    yield put(Creators.success(postResponse))

    state = yield select()
    let langurl
    lang === "de" ?
      langurl = state.router.route.replace("/:lang/", "/en/").replace(":id", state.knowledgesingle.post.translations.en) :
      langurl = state.router.route.replace("/:lang/", "/de/").replace(":id", state.knowledgesingle.post.translations.de)
    yield put(LangCreators.success(langurl))

    // trigger comments
    yield put(CommentsCreators.request(id, vars.comments.per_page, 0, false))
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
