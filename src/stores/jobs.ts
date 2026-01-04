import { defineStore } from "pinia"
import type { ActiveJob, PendingJob } from "@/types/api"
import { completeJob as apiCompleteJob, getAllPendingJobs, getMyActiveJobs, takeJob as apiTakeJob } from "@/api/endpoints"

export const useJobsStore = defineStore("jobs", {
    state: () => ({
        pending: [] as PendingJob[],
        active: [] as ActiveJob[],

        loadingPending: false,
        loadingActive: false,

        errorPending: "" as string,
        errorActive: "" as string,

        taking: false,
        takeError: "" as string,
        takeSuccess: "" as string,

        completingVehicleId: "" as string,
        completeError: "" as string,
        completeSuccess: "" as string,
    }),

    actions: {
        async fetchPending() {
            this.loadingPending = true
            this.errorPending = ""
            try {
                const data = await getAllPendingJobs()
                this.pending = Array.isArray(data) ? data : []
                return this.pending
            } catch (e: any) {
                this.errorPending = e?.response?.data?.detail || e?.message || "Failed to load pending jobs"
                this.pending = []
                throw e
            } finally {
                this.loadingPending = false
            }
        },

        async fetchActive() {
            this.loadingActive = true
            this.errorActive = ""
            try {
                const data = await getMyActiveJobs()
                this.active = Array.isArray(data) ? data : []
                return this.active
            } catch (e: any) {
                this.errorActive = e?.response?.data?.detail || e?.message || "Failed to load active jobs"
                this.active = []
                throw e
            } finally {
                this.loadingActive = false
            }
        },

        async refreshAll() {
            await Promise.allSettled([this.fetchActive(), this.fetchPending()])
        },

        async takeJob(batch_id: string, vehicle_id: string) {
            this.taking = true
            this.takeError = ""
            this.takeSuccess = ""
            try {
                await apiTakeJob({ batch_id, vehicle_id })
                this.takeSuccess = "OK"
            } catch (e: any) {
                this.takeError = e?.response?.data?.detail || e?.message || "Failed to take job"
                throw e
            } finally {
                this.taking = false
            }
        },

        async completeJob(vehicle_id: string) {
            this.completingVehicleId = vehicle_id
            this.completeError = ""
            this.completeSuccess = ""
            try {
                await apiCompleteJob(vehicle_id)
                this.completeSuccess = "OK"
            } catch (e: any) {
                this.completeError = e?.response?.data?.detail || e?.message || "Failed to complete job"
                throw e
            } finally {
                this.completingVehicleId = ""
            }
        },
    },
})
