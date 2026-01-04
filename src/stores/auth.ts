import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        apiKey: localStorage.getItem("api_key") || "",
    }),
    getters: {
        isAuthed: (s) => Boolean(s.apiKey),
    },
    actions: {
        setApiKey(key: string) {
            this.apiKey = key
            localStorage.setItem("api_key", key)
        },
        logout() {
            this.apiKey = ""
            localStorage.removeItem("api_key")
        },
    },
})
