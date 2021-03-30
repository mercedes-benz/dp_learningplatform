import { vars } from "../config"

export default (state) => {
    const languages = {
        de: true,
        en: require("../lang/en.json")
    }
    let langAvailable
    if (typeof state.router.params.lang !== "undefined") {
        langAvailable = Object.keys(languages).some(function (elem) {
            // if (typeof state.router.params.lang !== "undefined") {
                return state.router.params.lang === elem
            // }
        })
    }
    if (!langAvailable) {
        // let fixedURL = window.location.href.replace(state.router.params.lang, vars.defaultLang);
        // window.history.pushState(null, '', fixedURL);
        // state.router.params.lang = vars.defaultLang
        return vars.defaultLang
    }
    return state.router.params.lang
    // return typeof state.router.params.lang !== "undefined" ? state.router.params.lang : vars.defaultLang
}