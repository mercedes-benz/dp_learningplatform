import {call, all, put, takeEvery} from "redux-saga/effects"

import api from "../../services/ApiService"
import {
  LearningArticlesCreators as Creators,
  LearningArticlesTypes as Types
} from "./redux"
import {readableErrors} from "../../utils"

export default function* router(dispatch, action) {
  const slug = action.payload.params.slug

  yield takeEvery(Types.LEARNING_ARTICLES_REQUEST, moreArticles, dispatch)

  yield put(Creators.request(slug, "", "order", "ASC"))
}

export function* moreArticles(dispatch, { slug, tag, sortby, orderby}) {

  try {
    const [articlesResponse, sidebarResponse, tagsResponse] = yield all([
      call(api.getLearningArticlesBySort, slug, tag, sortby, orderby),
      call(api.getLearningSidebar),
      call(api.getLearningTags)
    ])    

    yield put(Creators.success(articlesResponse.topic, articlesResponse.module, articlesResponse.posts, sidebarResponse, tagsResponse))
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
