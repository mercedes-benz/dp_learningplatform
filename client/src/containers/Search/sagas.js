import {call, put, select, takeEvery} from "redux-saga/effects"

import api from "../../services/ApiService"
import {SearchCreators as Creators, SearchTypes as Types} from "./redux"

export default function* router(dispatch, action) {
  const state = yield select()
  const query = state.router.query.q

  yield takeEvery(Types.SEARCH_REQUEST, moreResults, dispatch)

  if (typeof query !== "undefined") {
    yield put(Creators.request(query, 0, false))
  }
}

export function* moreResults(dispatch, {slug, offset, append}) {
  const state = yield select()
  const lang = state.app.lang
  try {
    const searchResponse = yield call(api.getSearchedArticles, slug, offset, lang)

    yield put(
      Creators.success(
        searchResponse.results,
        searchResponse.query_vars,
        searchResponse.others,
        append
      )
    )
  } catch (e) {
    yield put(Creators.error(e.message))
  }
}
