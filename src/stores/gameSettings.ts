import { defineStore } from "pinia"
import type { GameSettings } from "@/types/api"
import { getGameSettings } from "@/api/endpoints"

export const useGameSettingsStore = defineStore("game_settings", {
    state: () => ({
        settings: null as GameSettings | null,
        loading: false,
        error: "" as string,
    }),
    actions: {
        async fetch() {
            this.loading = true
            this.error = ""
            try {
                this.settings = await getGameSettings()
                return this.settings
            } catch (e: any) {
                this.error = e?.response?.data?.detail || e?.message || "Failed to load game settings"
                this.settings = null
                throw e
            } finally {
                this.loading = false
            }
        },
    },
})
