import {all, takeLatest} from "redux-saga/lib/effects"
import {LOCATION_CHANGED} from "redux-little-router"

// types
import {StartupTypes} from "./containers/App/startup.redux"
import {AppTypes} from "./containers/App/redux"
import {LoginTypes} from "./containers/Login/redux"
import {CommentsTypes} from "./containers/Comments/redux"

import { ManageBookmarksTypes } from "./containers/ManageBookmarks/redux"
import { ManageLikesTypes } from "./containers/ManageLikes/redux"

// sagas (independent of router changes)
import startup, {startupLocation} from "./containers/App/startup.sagas"
import fetchMenus, {forceLogout} from "./containers/App/sagas"
import router from "./containers/Router/sagas"
import comments, {add as addCommentSaga} from "./containers/Comments/sagas"
import {checkForLoginCookie} from "./containers/Logout/sagas"

import { addBookmark} from "./containers/ManageBookmarks/sagas"
import { removeBookmark} from "./containers/ManageBookmarks/sagas"
import { addArticlesBookmark } from "./containers/ManageBookmarks/sagas"
import { removeArticlesBookmark } from "./containers/ManageBookmarks/sagas"

import { addLike } from "./containers/ManageLikes/sagas"
import { removeLike } from "./containers/ManageLikes/sagas"
import { addArticlesLike } from "./containers/ManageLikes/sagas"
import { removeArticlesLike } from "./containers/ManageLikes/sagas"

export default function* rootSaga(dispatch) {
  yield all([
    takeLatest(StartupTypes.STARTUP, startup, dispatch),
    takeLatest(StartupTypes.STARTUP_ROUTER_LOCATION, startupLocation, dispatch),
    takeLatest(AppTypes.MENU_REQUEST, fetchMenus, dispatch),
    takeLatest(LOCATION_CHANGED, router, dispatch),
    takeLatest("*", forceLogout, dispatch),
    takeLatest(LoginTypes.LOGIN_SUCCESS, fetchMenus, dispatch), // fetch app data after successful login
    takeLatest(CommentsTypes.COMMENTS_REQUEST, comments, dispatch),
    takeLatest(CommentsTypes.COMMENTS_ADD, addCommentSaga, dispatch),
    takeLatest(StartupTypes.STARTUP, checkForLoginCookie, dispatch),

    takeLatest(ManageBookmarksTypes.ADD_BOOKMARK, addBookmark, dispatch),
    takeLatest(ManageBookmarksTypes.REMOVE_BOOKMARK, removeBookmark, dispatch),
    takeLatest(ManageBookmarksTypes.ADD_ARTICLES_BOOKMARK, addArticlesBookmark, dispatch),
    takeLatest(ManageBookmarksTypes.REMOVE_ARTICLES_BOOKMARK, removeArticlesBookmark, dispatch),

    takeLatest(ManageLikesTypes.ADD_LIKE, addLike, dispatch),
    takeLatest(ManageLikesTypes.REMOVE_LIKE, removeLike, dispatch),
    takeLatest(ManageLikesTypes.ADD_ARTICLES_LIKE, addArticlesLike, dispatch),
    takeLatest(ManageLikesTypes.REMOVE_ARTICLES_LIKE, removeArticlesLike, dispatch)
  ])
}
