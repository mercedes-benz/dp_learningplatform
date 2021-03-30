import { call, all, put, select, takeEvery } from "redux-saga/effects"

import api from "../../services/ApiService"
import {
  KnowledgeArticlesCreators as Creators,
  KnowledgeArticlesTypes as Types
} from "./redux"
import { LangSwitchCreators as LangCreators } from "../../components/LangSwitch/redux"
import { readableErrors } from "../../utils"

export default function* router(dispatch, action) {
  const id = action.payload.params.id

  yield takeEvery(Types.KNOWLEDGE_ARTICLES_REQUEST, moreArticles, dispatch)
  yield takeEvery(Types.KNOWLEDGE_SUBCATEGORY_REQUEST, loadSubcategoryWithContent, dispatch)

  yield put(Creators.request(id, "", "order", "ASC"))
}

export function* moreArticles(dispatch, { id, tag, sortby, orderby }) {
  let state = yield select()
  const lang = state.router.params.lang
  try {
    const [articlesResponse, sidebarResponse, tagsResponse, faqsidebarResponse] = yield all([
      call(api.getKnowledgeArticlesBySort, id, tag, sortby, orderby, lang),
      call(api.getSidebar, lang),
      call(api.getKnowledgeTags, lang),
      call(api.getFAQSidebar, lang),
    ])

    yield put(Creators.success(articlesResponse.category, articlesResponse.subcategory, articlesResponse.posts, sidebarResponse, tagsResponse, faqsidebarResponse))

    state = yield select()
    let langurl
    if (state.knowledgearticles.subcategory.translations !== undefined) {
      lang === "de" ?
        langurl = state.router.route.replace("/:lang/", "/en/").replace(":id", state.knowledgearticles.subcategory.translations.en) :
        langurl = state.router.route.replace("/:lang/", "/de/").replace(":id", state.knowledgearticles.subcategory.translations.de)
      yield put(LangCreators.success(langurl))
    }
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* loadSubcategoryWithContent(dispatch, { id }) {
  let state = yield select()
  const lang = state.app.lang
  try {
    const subcategoryWithContentResponse = yield call(api.getKnowledgeArticlesBySubcategoryWithContent, id, lang)
    yield put(
      Creators.subcategoryWithContentSuccess(subcategoryWithContentResponse)
    )

  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
