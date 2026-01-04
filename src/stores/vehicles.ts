import { defineStore } from "pinia"
import type { Vehicle, CreateVehicleBody } from "../types/api"
import { getUserVehicles, createVehicle, setDefaultVehicle } from "../api/endpoints"

function pickDefault(vehicles: Vehicle[]): Vehicle | null {
    if (!vehicles.length) return null
    if (vehicles.length === 1) return vehicles[0]
    const explicit = vehicles.find((v) => v.default)
    return explicit ?? vehicles[0]
}

export const useVehiclesStore = defineStore("vehicles", {
    state: () => ({
        vehicles: [] as Vehicle[],
        selectedVehicleId: "" as string,
        loading: false,
        error: "" as string,
    }),
    getters: {
        selectedVehicle(state): Vehicle | null {
            return state.vehicles.find((v) => v.vehicle_id === state.selectedVehicleId) ?? null
        },
        hasVehicles: (s) => s.vehicles.length > 0,
        needsVehicle: (s) => s.vehicles.length === 0,
    },
    actions: {
        async fetchVehicles() {
            this.loading = true
            this.error = ""
            try {
                this.vehicles = await getUserVehicles()
                const def = pickDefault(this.vehicles)
                this.selectedVehicleId = def?.vehicle_id || ""
            } catch (e: any) {
                this.error = e?.message || "Failed to load vehicles"
                this.vehicles = []
                this.selectedVehicleId = ""
                throw e
            } finally {
                this.loading = false
            }
        },

        selectVehicle(vehicle_id: string) {
            this.selectedVehicleId = vehicle_id
        },

        async createNewVehicle(body: CreateVehicleBody) {
            const v = await createVehicle(body)

            // Hent full liste etter create siden create response kan være "tom" schema i docs
            await this.fetchVehicles()

            // Hvis API returnerer vehicle_id kan vi prøve å velge den
            if (v?.vehicle_id) {
                this.selectedVehicleId = v.vehicle_id
            } else if (!this.selectedVehicleId && this.vehicles.length) {
                this.selectedVehicleId = this.vehicles[0].vehicle_id
            }

            return v
        },

        async makeDefault(vehicle_id: string) {
            // If backend supports it, persist default.
            // If not, you can just keep it in UI.
            await setDefaultVehicle(vehicle_id).catch(() => null)

            this.vehicles = this.vehicles.map((v) => ({
                ...v,
                default: v.vehicle_id === vehicle_id,
            }))
            this.selectedVehicleId = vehicle_id
        },

        clear() {
            this.vehicles = []
            this.selectedVehicleId = ""
            this.loading = false
            this.error = ""
        },
    },
})
