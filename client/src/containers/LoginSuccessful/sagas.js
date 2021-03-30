import {call, put} from "redux-saga/effects"

import api from "../../services/ApiService"
import {LoginSuccessfulCreators as Creators} from "./redux"
import {readableErrors} from "../../utils"

export default function* router(dispatch, {payload}) {
  yield put(Creators.request("login-successful"))

  try {
    const contentResponse = yield call(api.getPageContentBySlug, "login-successful")

    yield put(Creators.success(contentResponse))
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
