import { default as i18n } from "i18next"

class BackendMock {
    type = "backend"
}

i18n
    .use(BackendMock)
    .init({
        debug: false,
        lng: false,
        fallbackLng: false,
        keySeparator: false,
        nsSeparator: false,
        defaultNS: 'default',
        wait: true,
        resources: {
            en: {
                default: require('../lang/en.json')
            }
        }
    })

export default i18n