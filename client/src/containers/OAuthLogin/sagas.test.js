import {call, put, select} from "redux-saga/effects"
import {replace} from "redux-little-router"

import api from "../../services/ApiService"
import router from "./sagas"
import createStore from "../../redux"
import {OAuthLoginCreators as Creators} from "./redux"
import {LoginCreators} from "../Login/redux"

it("processes saga correctly", () => {
  const storage = createStore()
  const {dispatch, getState} = storage
  const iterator = router(dispatch, {})

  const tempState = getState()
  let state = {
    ...tempState,
    router: {
      ...tempState.router,
      query: {
        token: "token"
      },
      params: {
        lang: "de"
      }
    }
  }

  expect(iterator.next(state).value).toEqual(select())

  expect(iterator.next(state).value).toEqual(put(Creators.request("token")))

  expect(iterator.next(getState()).value).toEqual(
    call(api.getUserDataByToken, "token")
  )

  const response = {
    token: "received_token",
    user_email: "user@ema.il",
    user_nicename: "nice",
    user_display_name: "display",
    avatar: "avatar"
  }

  expect(iterator.next(response).value).toEqual(put(Creators.success(response)))

  expect(iterator.next(response).value).toEqual(
    put(
      LoginCreators.success(
        response.token,
        response.user_email,
        response.user_nicename,
        response.user_display_name,
        response.avatar
      )
    )
  )

  expect(iterator.next().value).toEqual(replace("/de?loggedin=oauth"))

  expect(iterator.next(response).done).toBe(true)
})
