import { defineStore } from "pinia"
import type { Company } from "../types/api"
import { getMyCompany } from "../api/endpoints"

export const useCompanyStore = defineStore("company", {
    state: () => ({
        company: null as Company | null,
        loading: false,
        error: "" as string,
    }),
    actions: {
        async fetchMyCompany() {
            this.loading = true
            this.error = ""
            try {
                this.company = await getMyCompany()
            } catch (e: any) {
                this.error = e?.message || "Failed to load company"
                this.company = null
                throw e
            } finally {
                this.loading = false
            }
        },
        clear() {
            this.company = null
            this.loading = false
            this.error = ""
        },
    },
})
