import {call, put, select, takeEvery} from "redux-saga/effects"
import {push} from "redux-little-router"

import {LoginCreators, LoginTypes} from "../Login/redux"
import {urls, vars} from "../../config"
import {cookie} from "../../utils"

export default function* logout(_dispatch, {redirectToFrontend}) {
  yield put(LoginCreators.logout())

  // delete logged in cookie
  yield cookie.remove(vars.cookieName)

  // redirect to backend logout
  if(redirectToFrontend) {
    const lang = (yield select()).app.lang

    yield put(push(`/${lang}/login?revalidate=1`))
  } else {
    const url = new URL(urls.api)
    yield document.location.assign(`${url.protocol}//${url.hostname}/?logout`)
  }
}

export function* checkForLoginCookie(dispatch, _action) {
  yield takeEvery(LoginTypes.LOGIN_COOKIE_CHECK, noCookieLogout, dispatch)

  yield setInterval(() => {
    dispatch(LoginCreators.cookieCheck())
  }, vars.cookieCheckInterval)
}

export function* noCookieLogout(dispatch, action) {
  const {token} = (yield select()).login

  // cancel if token is null (logged out)
  if(!token) {
    return;
  }

  // call logout when there is no logged in cookie
  if(cookie.get(vars.cookieName) === "") {
    yield call(logout, dispatch, {...action, redirectToFrontend: true})
  }
}
