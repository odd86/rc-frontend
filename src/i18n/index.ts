import { createI18n } from "vue-i18n"
import { messages } from "./messages"

const saved = localStorage.getItem("lang")
const fallback = "en"
const initial = saved === "nb" || saved === "en" ? saved : "nb"

export const i18n = createI18n({
    legacy: false,
    locale: initial,
    fallbackLocale: fallback,
    messages,
})

export function setLanguage(locale: "nb" | "en") {
    i18n.global.locale.value = locale
    localStorage.setItem("lang", locale)
}
