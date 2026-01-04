export type ApiKeyResponse = {
    api_key: string
}

export type Company = {
    company_id: string
    owner_id: string
    name: string
    xp: number
    total_distance: number
    jobs_completed: number
    money_earned: number
    money_spent: number
    money: number
    created_at: string
    updated_at: string
    deleted: boolean
}

export type Vehicle = {
    vehicle_id: string
    vehicle_type: VehicleType
    owner_id: string
    company_id: string
    model: string
    name: string
    created_at: string
    updated_at: string
    deleted: boolean
    vehicle_units: string
    total_units: number
    jobs_completed: number
    money_earned: number
    money_spent: number
    last_service_date: string
    last_service_distance: number
    last_wheel_change_date: string
    last_wheel_change_distance: number
    default?: boolean
}

export type CreateUserBody = { username: string; password: string }
export type LoginBody = { username: string; password: string }

export type CreateVehicleBody = {
    vehicle_type: VehicleType
}

export type JobUnits = "distance" | "time"

export type PendingJob = {
    job_id: string
    batch_id: string

    title: string
    description: string
    job_units: JobUnits
    unit_amount: number
    reward_amount: number
    allowed_vehicle_types: VehicleType[]

    created_at?: string
}

export type ActiveJob = {
    job_id: string
    batch_id: string
    vehicle_id: string

    title?: string
    description?: string
    job_units?: "distance" | "time"
    unit_amount?: number
    reward_amount?: number

    created_at?: string
}

export type JobsTakeRequestModel = {
    batch_id: string
    vehicle_id: string
}


export type JobsRequestModel = {
    title: string
    description: string
    job_units: JobUnits
    unit_amount: number
    reward_amount: number
    allowed_vehicle_types: VehicleType[]
    job_quantity?: number | null
}

export type UserMe = {
    user_id: string
    username: string
    created_at: string
    updated_at: string
    is_admin: boolean
    deleted: boolean
}

export type AdminChangeUserPasswordRequest = {
    user_id: string
    password: string
}

export type GameSettings = {
    base_tax: number
    max_dirty_units: number
    fuel_tank_capacity: number
    fuel_consumption_rate: number
    company_name_change_cost: number
    vehicle_name_change_cost: number
}

// Admin list endpoints return schemas as {} in OpenAPI, so be defensive.
// These match typical shapes you likely return.
export type AdminUser = {
    user_id: string
    username: string
    created_at: string
    updated_at: string
    is_admin: boolean
    deleted: boolean
}

export type AdminPendingJob = {
    batch_id: string
    title?: string
    description?: string
    job_units?: "distance" | "time"
    unit_amount?: number
    reward_amount?: number
    allowed_vehicle_types?: VehicleType[]
    job_quantity?: number
    created_at?: string
}

export type VehicleType =
    | "excavator"
    | "backhoe"
    | "bulldozer"
    | "wheel_loader"
    | "skid_steer"
    | "dump_truck"
    | "articulated_dump_truck"
    | "semi_truck"
    | "tractor_truck"
    | "trailer"
    | "forklift"
    | "telehandler"
    | "crane"
    | "tower_crane"
    | "knuckle_boom_crane"
    | "grader"
    | "roller"
    | "asphalt_paver"
    | "compactor"
    | "tractor"
    | "agricultural_implement"
    | "service_truck"
    | "fuel_truck"
    | "water_truck"
    | "tow_truck"
    | "maintenance_vehicle"
    | "demolition_machine"
    | "drill_rig"
    | "conveyor"
    | "rock_crusher"
    | "specialty"
