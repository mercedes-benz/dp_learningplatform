import {call, all, put, select, takeEvery} from "redux-saga/effects"

import api from "../../services/ApiService"
import {
  UserProfileCreators as Creators,
  UserProfileTypes as Types
} from "./redux"
import { LangSwitchCreators as LangCreators } from "../../components/LangSwitch/redux"
import {readableErrors} from "../../utils"

export default function* router(dispatch, action) {
  const slug = action.payload.params.slug

  yield takeEvery(Types.USER_PROFILE_REQUEST, fetchUserData, dispatch)

  yield put(Creators.request(slug))
}

export function* fetchUserData(dispatch, { slug, userdata, userprogress, userbookmarks, num_bookmarks}) {
  let state = yield select()
  const lang = state.router.params.lang

  try {
    const [userDataResponse, userProgressResponse, userBookmarksResponse, userCertificatesResponse, numBookmarksResponse] = yield all([
      call(api.getUserProfile),
      call(api.getUserProgress),
      call(api.getBookmarks, lang),
      call(api.getUserCertificates, lang),
      call(api.getBookmarksNumber, lang)
    ])

    yield put(Creators.success(userDataResponse, userProgressResponse, userBookmarksResponse, userCertificatesResponse, numBookmarksResponse))

    state = yield select()
    let langurl
    lang === "de" ?
      // langurl = state.router.route.replace("/:lang/", "/en/").replace(":slug", state.userprofile.translations.en) :
      // langurl = state.router.route.replace("/:lang/", "/de/").replace(":slug", state.userprofile.translations.de)
      // langurl = state.router.route.replace("/:lang/", "/en/") :
      // langurl = state.router.route.replace("/:lang/", "/de/")
      langurl = state.router.pathname.replace("/de/", "/en/") :
      langurl = state.router.pathname.replace("/en/", "/de/")
    yield put(LangCreators.success(langurl))
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
