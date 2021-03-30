import {call, put, select} from "redux-saga/effects"
import {replace} from "redux-little-router"

import api from "../../services/ApiService"
import {OAuthLoginCreators as Creators} from "./redux"
import {LoginCreators} from "../Login/redux"
import {readableErrors, cookie} from "../../utils"
import {vars} from "../../config"

export default function* router(dispatch) {
  const state = yield select()
  const {query: {token}, params: {lang}} = state.router

  yield put(Creators.request(token))

  try {
    const response = yield call(api.getUserDataByToken, token)
    yield call(api.backendLogin, token)

    // set logged in cookie before token is set
    yield cookie.set(vars.cookieName, "1", 2);

    yield put(Creators.success(response))
    yield put(LoginCreators.success(response.token, response.user_email, response.user_nicename, response.user_display_name, response.avatar))

    yield dispatch(replace(`/${lang}?loggedin=oauth`))
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
