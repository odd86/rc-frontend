import { defineStore } from "pinia"
import type { UserMe } from "@/types/api"
import { getMe } from "@/api/endpoints"

export const useMeStore = defineStore("me", {
    state: () => ({
        me: null as UserMe | null,
        loading: false,
        error: "" as string,
    }),
    getters: {
        isAdmin: (s) => Boolean(s.me?.is_admin),
        username: (s) => s.me?.username || "",
    },
    actions: {
        async fetchMe() {
            this.loading = true
            this.error = ""
            try {
                this.me = await getMe()
                return this.me
            } catch (e: any) {
                this.error = e?.message || "Failed to load user"
                this.me = null
                throw e
            } finally {
                this.loading = false
            }
        },
        clear() {
            this.me = null
            this.loading = false
            this.error = ""
        },
    },
})
