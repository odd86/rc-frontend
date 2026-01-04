import {createRouter, createWebHistory} from "vue-router"

import LoginPage from "@/pages/LoginPage.vue"
import DashboardPage from "@/pages/DashboardPage.vue"
import CompanyPage from "@/pages/CompanyPage.vue"
import VehicleDetailsPagePage from "@/pages/VehicleDetailsPage.vue"
import JobsPage from "@/pages/JobsPage.vue"
import ScoreboardPage from "@/pages/ScoreboardPage.vue"
import AddVehiclePage from "@/pages/AddVehiclePage.vue"
import VehiclesPage from "../pages/VehiclesPage.vue";

import {useAuthStore} from "@/stores/auth"
import {useVehiclesStore} from "@/stores/vehicles"
import {useMeStore} from "@/stores/me"
import AdminHomePage from "@/pages/admin/AdminHomePage.vue";
import AdminJobsPage from "@/pages/admin/AdminJobsPage.vue";
import AdminUsersPage from "@/pages/admin/AdminUsersPage.vue";

const routes = [
    {path: "/", redirect: "/dashboard"},

    {path: "/login", name: "login", component: LoginPage},

    {path: "/dashboard", name: "dashboard", component: DashboardPage, meta: {requiresAuth: true}},
    {path: "/company", name: "company", component: CompanyPage, meta: {requiresAuth: true}},
    {path: "/vehicles", name: "vehicles", component: VehiclesPage, meta: {requiresAuth: true}},
    {path: "/vehicles/add", name: "vehicles-add", component: AddVehiclePage, meta: {requiresAuth: true}},
    {path: "/vehicles/:id", name: "vehicles-details-page", component: VehicleDetailsPagePage, meta: {requiresAuth: true}},
    {path: "/jobs", name: "jobs", component: JobsPage, meta: {requiresAuth: true}},
    {path: "/scoreboard", name: "scoreboard", component: ScoreboardPage, meta: {requiresAuth: true}},

    // Admin
    { path: "/admin", redirect: "/admin/dashboard" },
    { path: "/admin/dashboard", name: "admin-dashboard", component: AdminHomePage, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: "/admin/jobs", name: "admin-jobs", component: AdminJobsPage, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: "/admin/users", name: "admin-users", component: AdminUsersPage, meta: { requiresAuth: true, requiresAdmin: true } },


    {path: "/:pathMatch(.*)*", redirect: "/dashboard"},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const vehicles = useVehiclesStore()
    const me = useMeStore()

    // Only guard routes that actually require auth
    if (to.meta.requiresAuth && !auth.isAuthed) return { name: "login" }
    if (to.name === "login" && auth.isAuthed) return { name: "dashboard" }

    // Load me when needed (admin pages)
    if (to.meta.requiresAdmin) {
        console.log("Admin area requested, checking user...")
        console.log(me.isAdmin)
        if (!me.me) {
            await me.fetchMe().catch(() => null)
        }
        if (!me.isAdmin) return { name: "dashboard" }
    }

    // Force vehicle onboarding for non admin area
    if (!to.path.startsWith("/admin") && to.meta.requiresAuth) {
        if (!vehicles.vehicles.length) await vehicles.fetchVehicles().catch(() => null)
        if (vehicles.needsVehicle && to.name !== "vehicles-add") return { name: "vehicles-add" }
    }
})
