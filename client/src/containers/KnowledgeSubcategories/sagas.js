import {call, all, put, takeEvery} from "redux-saga/effects"

import api from "../../services/ApiService"
import {
  KnowledgeSubcategoriesCreators as Creators,
  KnowledgeSubcategoriesTypes as Types
} from "./redux"
import {readableErrors} from "../../utils"

export default function* router(dispatch, action) {
  const id = action.payload.params.id

  yield takeEvery(Types.KNOWLEDGE_SUBCATEGORIES_REQUEST, moreSubcategories, dispatch)

  yield put(Creators.request(id))
}

export function* moreSubcategories(dispatch, {id}) {
  try {
    const [subcategoriesResponse, contentResponse, sidebarResponse] = yield all([
      call(api.getKnowledgeSubcategoriesByCategory, id),
      call(api.getPageContentBySlug, "kontakt"),
      call(api.getSidebar)
    ])

    yield put(
      Creators.success(subcategoriesResponse.category, subcategoriesResponse.subcategories, contentResponse, sidebarResponse)
    )
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
