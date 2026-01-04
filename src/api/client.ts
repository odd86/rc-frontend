import axios from "axios"
import { useAuthStore } from "../stores/auth"

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 30000,
})

api.interceptors.request.use((config) => {
    const auth = useAuthStore()
    const apiKey = auth.apiKey
    if (apiKey) {
        config.headers = config.headers ?? {}
        config.headers["x-api-key"] = apiKey
        // If your backend uses Authorization instead, swap to:
        // config.headers["Authorization"] = `Bearer ${apiKey}`
    }
    return config
})
