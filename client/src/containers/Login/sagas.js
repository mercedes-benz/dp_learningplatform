import {call, put, select, takeEvery} from "redux-saga/effects"

import api from "../../services/ApiService"
import {LoginCreators as Creators, LoginTypes as Types} from "./redux"
import {readableErrors, cookie} from "../../utils"
import {vars} from "../../config"

// on router change
export default function* router(dispatch, _action) {
  yield takeEvery(Types.LOGIN_REQUEST, login, dispatch)
  yield takeEvery(Types.LOGIN_CONTENT_REQUEST, loginContent, dispatch)

  yield put(Creators.contentRequest("login"))
}

// get content by login site
export function* loginContent(_dispatch, {slug}) {
  const state = yield select()
  const lang = state.app.lang
  try {
    const response = yield call(api.getPageContentBySlug, slug, lang)

    yield put(Creators.contentSuccess(response))
  } catch(e) {
    yield put(Creators.contentError(readableErrors(e)))
  }
}

// perform login
export function* login(_dispatch, {username, password}) {
  try {
    const response = yield call(api.getAuthToken, username, password)

    yield call(api.backendLogin, response.token)

    // set logged in cookie before token is set
    yield cookie.set(vars.cookieName, "1", 2);

    yield put(Creators.success(response.token, response.user_email, response.user_nicename, response.user_display_name, response.avatar))
  } catch(e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
