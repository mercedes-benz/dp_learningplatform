import {put, select, take} from "redux-saga/effects"
import {LOCATION_CHANGED, push} from "redux-little-router"
import {REHYDRATE} from "redux-persist"

import {AppCreators as Creators} from "./redux"
import { getLang } from "../../utils"
import { vars } from "../../config"

export default function* startup(dispatch, action) {
  // set language
  const state = yield select()

  const fixedURL = state.router.pathname.replace(state.router.params.lang, vars.defaultLang);

  if (state.router.params.lang === getLang(state)) {
    // change language or it useless at all for now
  } else {
    if (state.router.pathname === "/") {
      dispatch(push(state.router.pathname + "de/"))
    } else {
      state.router.params.lang = getLang(state)
      dispatch(push(fixedURL))
    }
  }
  const lang = getLang(state)

  yield put(Creators.setLanguage(lang))

  // wait for rehydrate before initial request
  yield take(REHYDRATE)

  // if(state.login.token !== null) {
  if ((yield select()).login.token !== null) {
    yield put(Creators.request())
  }
}

export function* startupLocation(dispatch, {payload}) {
  // wait for rehydrate before changing initial location
  yield take(REHYDRATE)

  yield dispatch({
    type: LOCATION_CHANGED,
    payload
  })
}
