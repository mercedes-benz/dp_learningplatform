import { call, all, put, select, takeEvery} from "redux-saga/effects"
import {push} from "redux-little-router"

import api from "../../services/ApiService"
import {AppCreators as Creators} from "./redux"
import { AppTypes as Types } from "./redux"
import {LoginCreators} from "../Login/redux"

export default function* fetchMenus(dispatch) {
  const state = yield select()
  const lang = state.app.lang
  yield takeEvery(Types.REFRESH_TOPICS_REQUEST, fetchTopics, dispatch)
  try {
    const [
      mainMenuResponse,
      footerMenuResponse,
      topicMenuResponse,
      sidebarMenuResponse,
      numBookmarksResponse
    ] = yield all([
      call(api.getMenuBySlug, "main", lang),
      call(api.getMenuBySlug, "footer", lang),
      call(api.getLearningThemes, lang),
      call(api.getSidebar, lang),
      call(api.getBookmarksNumber, lang)
    ])

    yield put(
      Creators.success(
        mainMenuResponse,
        footerMenuResponse,
        topicMenuResponse,
        sidebarMenuResponse,
        numBookmarksResponse.num_bookmarks
      )
    )
  } catch (e) {
    yield put(Creators.error(e.message))
  }
}

export function* fetchTopics() {
  const state = yield select()
  const lang = state.app.lang
  try {
    const [
      mainMenuResponse,
      topicMenuResponse,
    ] = yield all([
      call(api.getMenuBySlug, "main", lang),
      call(api.getLearningThemes, lang)
    ])
    yield put(
      Creators.refreshTopicsSuccess(mainMenuResponse, topicMenuResponse)
    )
  } catch (e) {
    yield put(Creators.error(e.message))
  }
}

export function* forceLogout(dispatch, action) {
  const state = yield select()
  const lang = state.app.lang

  if(/_ERROR/g.test(action.type)) {
    switch(action.error) {
      case "jwt_auth_invalid_token: Expired token":
      case "jwt_auth_invalid_token: Invalid signature encoding":
      case "jwt_auth_invalid_token: Signature verification failed":
      case "jwt_auth_no_auth_header: Authorization header not found.":
      case "jwt_auth_bad_auth_header: Authorization header malformed.":
      case "jwt_auth_bad_iss: The iss do not match with this server":
      case "jwt_auth_bad_request: User ID not found in the token":
      case "jwt_auth_failed: Invalid Credentials.":
        dispatch(LoginCreators.logout()) // trigger logout immediately
        yield put(push(`/${lang}/login?revalidate=1`))
        break

      default:
    }
  }
}
