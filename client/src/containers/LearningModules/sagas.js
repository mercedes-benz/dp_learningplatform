import {call, all, put, select, takeEvery} from "redux-saga/effects"

import api from "../../services/ApiService"
import {
  LearningModulesCreators as Creators,
  LearningModulesTypes as Types
} from "./redux"
import { LangSwitchCreators as LangCreators } from "../../components/LangSwitch/redux"
import {readableErrors} from "../../utils"

export default function* router(dispatch, action) {
  const id = action.payload.params.id
  yield takeEvery(Types.LEARNING_MODULES_REQUEST, moreModules, dispatch)
  yield takeEvery(Types.LEARNING_ARTICLES_REQUEST, loadArticles, dispatch)
  yield takeEvery(Types.QUIZ_REQUEST, loadQuiz, dispatch)

  yield put(Creators.request(id))
}

export function* moreModules(dispatch, { id }) {

  let state = yield select()
  const lang = state.app.lang

  try {
    const [modulesResponse, sidebarResponse, userDataResponse] = yield all([
      call(api.getLearningModulesByTheme, id, lang),
      call(api.getLearningSidebar, lang),
      call(api.getUserProfile)
    ])

    yield put(
      Creators.success(modulesResponse.topic, modulesResponse.modules, sidebarResponse, userDataResponse)
    )

    state = yield select()
    let langurl
    lang === "de" ?
      langurl = state.router.route.replace("/:lang/", "/en/").replace(":id", state.learningmodules.topic.translations.en) :
      langurl = state.router.route.replace("/:lang/", "/de/").replace(":id", state.learningmodules.topic.translations.de)
    yield put(LangCreators.success(langurl))
  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* loadArticles(dispatch, { id }) {
  let state = yield select()
  const lang = state.app.lang

  try {
    const articlesResponse = yield call(api.getLearningArticlesByModuleWithContent, id, lang)
    yield put(
      Creators.articlesSuccess(articlesResponse)
    )

  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}

export function* loadQuiz(dispatch, { id }) {
  let state = yield select()
  const lang = state.app.lang

  try {
    const postResponse = yield call(api.getLearningArticleByID, id, lang)
    yield put(Creators.quizSuccess(postResponse))

  } catch (e) {
    yield put(Creators.error(readableErrors(e)))
  }
}
