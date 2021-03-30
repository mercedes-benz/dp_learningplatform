import {createTransform} from "redux-persist"
import storage from "redux-persist/lib/storage"

const excluder = createTransform((inboundState, key) => {
  switch(key) {
    case "login":
      return {...inboundState, error: null, post: {post_content: ""}}

    default:
      return {...inboundState, error: null}
  }
})

const REDUX_PERSIST = {
  active: true,
  key: "dps",
  storage,
  whitelist: ["login"],
  transforms: [excluder],
}

export default REDUX_PERSIST
