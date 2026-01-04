import { api } from "./client"

import type {
    ApiKeyResponse,
    Company,
    Vehicle,
    CreateUserBody,
    LoginBody,
    CreateVehicleBody,
    JobsRequestModel,
    UserMe,
    AdminChangeUserPasswordRequest,
    AdminPendingJob,
    AdminUser,
    GameSettings,
    JobsTakeRequestModel,
    PendingJob,
    ActiveJob
} from "../types/api"

export async function createUser(body: CreateUserBody) {
    const { data } = await api.post<ApiKeyResponse>("/user/create", body)
    return data
}

export async function login(body: LoginBody) {
    // If your backend has /user/login. If not, remove and use create only.
    const { data } = await api.post<ApiKeyResponse>("/user/login", body)
    return data
}

export async function getMyCompany() {
    const { data } = await api.get<Company>("/company/get_my_company")
    return data
}

export async function getUserVehicles() {
    const { data } = await api.get<Vehicle[]>("/vehicles/get_user_vehicles")
    return data
}

export async function createVehicle(body: CreateVehicleBody) {
    const { data } = await api.post<Vehicle>("/vehicles/create_vehicle", null, {
        params: {
            model: body.model,
            vehicle_type: body.vehicle_type,
        },
    })
    return data
}

export async function setDefaultVehicle(vehicle_id: string) {
    // Optional, if you have it
    const { data } = await api.post<{ ok: true }>("/vehicles/set_default", { vehicle_id })
    return data
}

// User
export async function getMe() {
    const { data } = await api.get<UserMe>("/user/get_me")
    return data
}

// Game settings for users
export async function getGameSettings() {
    const { data } = await api.get<GameSettings>("/game/get_settings")
    return data
}

// Admin
export async function adminGetAllPendingJobs() {
    const { data } = await api.get<AdminPendingJob[]>("/admin/get_all_pending_jobs")
    return data
}

export async function adminGetAllUsers() {
    const { data } = await api.get<AdminUser[]>("/admin/get_all_users")
    return data
}

export async function adminChangeUserPassword(body: AdminChangeUserPasswordRequest) {
    const { data } = await api.post("/admin/change_user_password", body)
    return data
}

export async function adminSetGameSettings(body: GameSettings) {
    const { data } = await api.post("/admin/set_game_settings", body)
    return data
}

export async function adminCreateJobs(body: JobsRequestModel) {
    const { data } = await api.post("/admin/create_jobs", body)
    return data
}

export async function adminDeleteJobs(batch_id: string) {
    const { data } = await api.delete("/admin/delete_jobs", { params: { batch_id } })
    return data
}

export async function adminDeleteJob(job_id: string) {
    const { data } = await api.delete("/admin/delete_job", { params: { job_id } })
    return data
}

export async function getAllPendingJobs() {
    const { data } = await api.get<PendingJob[]>("/jobs/get_all_pending_jobs")
    return data
}

export async function getMyActiveJobs() {
    const { data } = await api.get<ActiveJob[]>("/jobs/get_my_active_jobs")
    return data
}

export async function takeJob(body: JobsTakeRequestModel) {
    const { data } = await api.post("/jobs/take_job", body)
    return data
}

export async function completeJob(vehicle_id: string) {
    const { data } = await api.post("/jobs/complete_job", null, { params: { vehicle_id } })
    return data
}