<template>
  <AdminShell>
    <div class="space-y-4">
      <div class="flex items-center justify-between rounded-3xl border bg-white p-4">
        <div>
          <div class="text-xs font-semibold text-slate-500">{{ t("admin.jobs.listEyebrow") }}</div>
          <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.jobs.listTitle") }}</div>
          <div class="mt-1 text-sm text-slate-600">{{ t("admin.jobs.listSubtitle") }}</div>
        </div>

        <div class="flex gap-2">
          <button
              class="rounded-2xl border bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              :disabled="loadingList"
              @click="refresh"
              type="button"
          >
            {{ t("admin.actions.refresh") }}
          </button>

          <button
              class="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              @click="showCreate = !showCreate"
              type="button"
          >
            {{ t("admin.jobs.addJob") }}
          </button>
        </div>
      </div>

      <!-- Create form -->
      <div v-if="showCreate" class="rounded-3xl border bg-white p-5">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-xs font-semibold text-slate-500">{{ t("admin.jobs.createEyebrow") }}</div>
            <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.jobs.createTitle") }}</div>
            <div class="mt-1 text-sm text-slate-600">{{ t("admin.jobs.createSubtitle") }}</div>
          </div>

          <button
              class="rounded-2xl border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              @click="showCreate = false"
              type="button"
          >
            {{ t("admin.actions.close") }}
          </button>
        </div>

        <form class="mt-4 space-y-3" @submit.prevent="create">
          <div>
            <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.title") }}</label>
            <input v-model="form.title" class="mt-1 w-full rounded-2xl border px-3 py-2" maxlength="24" />
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.description") }}</label>
            <input v-model="form.description" class="mt-1 w-full rounded-2xl border px-3 py-2" maxlength="48" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.jobUnits") }}</label>
              <select v-model="form.job_units" class="mt-1 w-full rounded-2xl border bg-white px-3 py-2">
                <option value="distance">{{ t("admin.jobs.units.distance") }}</option>
                <option value="time">{{ t("admin.jobs.units.time") }}</option>
              </select>
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.unitAmount") }}</label>
              <input v-model.number="form.unit_amount" type="number" class="mt-1 w-full rounded-2xl border px-3 py-2" min="1" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.rewardAmount") }}</label>
              <input v-model.number="form.reward_amount" type="number" class="mt-1 w-full rounded-2xl border px-3 py-2" min="0" />
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.quantity") }}</label>
              <input v-model.number="form.job_quantity" type="number" class="mt-1 w-full rounded-2xl border px-3 py-2" min="1" />
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.allowedVehicleTypes") }}</label>
            <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
              <label
                  v-for="vt in vehicleTypes"
                  :key="vt"
                  class="flex cursor-pointer items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <input type="checkbox" :value="vt" v-model="form.allowed_vehicle_types" />
                <span class="truncate">{{ t(`vehicles.vehicleTypes.${vt}`) }}</span>
              </label>
            </div>
          </div>

          <button
              class="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              :disabled="creating || !isValid"
          >
            {{ creating ? t("auth.working") : t("admin.jobs.actions.create") }}
          </button>

          <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
          <p v-if="createSuccess" class="text-sm text-emerald-700">{{ createSuccess }}</p>
        </form>
      </div>

      <!-- List -->
      <div class="rounded-3xl border bg-white">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="text-sm font-semibold text-slate-900">{{ t("admin.jobs.pending") }}</div>
          <div class="text-xs text-slate-600">
            <span v-if="loadingList">{{ t("auth.working") }}</span>
            <span v-else>{{ t("admin.jobs.countJobs", { count: jobs.length }) }}</span>
          </div>
        </div>

        <div v-if="listError" class="px-4 pb-3 text-sm text-red-600">{{ listError }}</div>

        <div v-if="!loadingList && rows.length === 0" class="px-4 pb-4">
          <div class="rounded-2xl border border-dashed p-4 text-sm text-slate-600">
            {{ t("admin.jobs.empty") }}
          </div>
        </div>

        <div v-else class="divide-y">
          <template v-for="row in rows" :key="row.key">
            <!-- Batch header -->
            <div v-if="row.kind === 'batch'" class="bg-slate-50 px-4 py-3">
              <div class="flex items-center justify-between">
                <div class="min-w-0 flex-grow">
                  <div class="truncate text-sm font-semibold text-slate-900">
                    {{ row.count }} - {{ row.title || t("admin.jobs.unknownTitle") }}
                  </div>
                  <div v-if="row.description" class="mt-1 text-xs text-slate-600 truncate">
                    {{ row.description }}
                  </div>
                  <div v-if="row.reward_amount" class="mt-1 text-xs text-slate-600 truncate">
                    💰 {{ row.reward_amount }}
                </div>
                </div>

                <button
                    class="rounded-xl mr-2 border bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    @click="toggleBatch(row.batch_id)"
                    type="button"
                >
                  {{ expandedBatches.has(row.batch_id) ? t("admin.jobs.collapse") : t("admin.jobs.expand") }}
                </button>
                <button
                    class="rounded-xl border bg-white px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                    :disabled="deletingBatchId === row.batch_id"
                    @click="deleteBatch(row.batch_id)"
                    type="button"
                    :title="t('admin.jobs.actions.deleteBatch')"
                >
                  🗑️
                </button>
              </div>
            </div>

            <!-- Job row -->
            <div
                v-else
                class="px-4 py-3"
                :class="row.batch_id ? 'pl-8' : ''"
                v-show="row.batch_id ? expandedBatches.has(row.batch_id) : true"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-sm font-semibold text-slate-900">
                    {{ row.title || t("admin.jobs.unknownTitle") }}
                  </div>
                  <div class="mt-1 text-xs text-slate-600">
                    {{ row.description || "" }}
                  </div>

                  <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      id: {{ row.job_id }}
                    </span>
                    <span v-if="row.job_units" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      {{ row.job_units }}
                    </span>
                    <span v-if="typeof row.unit_amount === 'number'" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      {{ t("admin.jobs.unitsAmount") }} {{ row.unit_amount }}
                    </span>
                    <span v-if="typeof row.reward_amount === 'number'" class="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                      {{ t("admin.jobs.reward") }} {{ row.reward_amount }}
                    </span>
                  </div>
                </div>

                <button
                    class="rounded-2xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                    :disabled="deletingJobId === row.job_id"
                    @click="deleteJob(row.job_id)"
                    type="button"
                    :title="t('admin.jobs.actions.deleteJob')"
                >
                  🗑️
                </button>
              </div>
            </div>
          </template>
        </div>

        <div v-if="deleteError" class="px-4 py-3 text-sm text-red-600">{{ deleteError }}</div>
        <div v-if="deleteSuccess" class="px-4 py-3 text-sm text-emerald-700">{{ deleteSuccess }}</div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue"
import {useI18n} from "vue-i18n"
import AdminShell from "@/components/AdminShell.vue"

import type {AdminPendingJob, JobsRequestModel, VehicleType} from "@/types/api"
import {adminCreateJobs, adminDeleteJob, adminDeleteJobs, adminGetAllPendingJobs} from "@/api/endpoints"

const { t } = useI18n()

const vehicleTypes: VehicleType[] = [
  "excavator","backhoe","bulldozer","wheel_loader","skid_steer","dump_truck","articulated_dump_truck",
  "semi_truck","tractor_truck","trailer","forklift","telehandler","crane","tower_crane","knuckle_boom_crane",
  "grader","roller","asphalt_paver","compactor","tractor","agricultural_implement","service_truck","fuel_truck",
  "water_truck","tow_truck","maintenance_vehicle","demolition_machine","drill_rig","conveyor","rock_crusher","specialty",
]

const showCreate = ref(false)

// List state
const jobs = ref<AdminPendingJob[]>([])
const loadingList = ref(false)
const listError = ref("")

const expandedBatches = ref<Set<string>>(new Set())

function toggleBatch(batchId: string) {
  const s = new Set(expandedBatches.value)
  if (s.has(batchId)) s.delete(batchId)
  else s.add(batchId)
  expandedBatches.value = s
}

async function refresh() {
  loadingList.value = true
  listError.value = ""
  try {
    const data = await adminGetAllPendingJobs()
    jobs.value = Array.isArray(data) ? data : []

    const batchIds = new Set(
        jobs.value
            .map((j) => (j.batch_id || "").trim())
            .filter((x) => x.length > 0)
    )
    expandedBatches.value = new Set(expandedBatches.value)
  } catch (e: any) {
    listError.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    loadingList.value = false
  }
}

onMounted(async () => {
  await refresh()
})

// Create
const creating = ref(false)
const createError = ref("")
const createSuccess = ref("")

const form = ref<JobsRequestModel>({
  title: "",
  description: "",
  job_units: "distance",
  unit_amount: 100,
  reward_amount: 100,
  allowed_vehicle_types: ["tow_truck"],
  job_quantity: 1,
})

const isValid = computed(() => {
  return (
      form.value.title.trim().length >= 3 &&
      form.value.unit_amount > 0 &&
      form.value.reward_amount >= 0 &&
      form.value.allowed_vehicle_types.length > 0
  )
})

async function create() {
  creating.value = true
  createError.value = ""
  createSuccess.value = ""
  try {
    await adminCreateJobs({
      ...form.value,
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      job_quantity: form.value.job_quantity ?? 1,
    })
    createSuccess.value = t("admin.jobs.createdOk")
    showCreate.value = false
    await refresh()
    form.value.title = ""
    form.value.description = ""
  } catch (e: any) {
    createError.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    creating.value = false
  }
}

// Delete job by job_id
const deletingJobId = ref("")
const deleteError = ref("")
const deleteSuccess = ref("")

async function deleteJob(jobId: string) {
  deletingJobId.value = jobId
  deleteError.value = ""
  deleteSuccess.value = ""
  try {
    await adminDeleteJob(jobId)
    deleteSuccess.value = t("admin.jobs.deletedOk")
    await refresh()
  } catch (e: any) {
    deleteError.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    deletingJobId.value = ""
  }
}

const deletingBatchId = ref("")
async function deleteBatch(batchId: string) {
  deletingBatchId.value = batchId
  deleteError.value = ""
  deleteSuccess.value = ""
  try {
    await adminDeleteJobs(batchId)
    deleteSuccess.value = t("admin.jobs.deletedBatchOk")
    await refresh()
  } catch (e: any) {
    deleteError.value = e?.response?.data?.detail || e?.message || t("auth.errorGeneric")
  } finally {
    deletingBatchId.value = ""
  }
}


// Build list rows
type BatchRow = {
  kind: "batch"
  key: string
  batch_id: string
  count: number
  title?: string
  description?: string
  job_units?: "distance" | "time"
  unit_amount?: number
  reward_amount?: number
}

type JobRow = {
  kind: "job"
  key: string
  job_id: string
  batch_id?: string
  title?: string
}

const rows = computed<(BatchRow | JobRow)[]>(() => {
  const unbatched: AdminPendingJob[] = []
  const byBatch = new Map<string, AdminPendingJob[]>()

  for (const j of jobs.value) {
    const b = (j.batch_id || "").trim()
    if (!b) {
      unbatched.push(j)
      continue
    }
    const arr = byBatch.get(b) || []
    arr.push(j)
    byBatch.set(b, arr)
  }

  const out: (BatchRow | JobRow)[] = []

  // Unbatched jobs first
  for (const j of unbatched) {
    out.push({
      kind: "job",
      key: `job_${j.job_id}`,
      job_id: j.job_id,
      title: j.title,
      description: j.description,
      job_units: j.job_units,
      unit_amount: j.unit_amount,
      reward_amount: j.reward_amount,
    })
  }

  // Batches
  const batchIds = Array.from(byBatch.keys()).sort()
  for (const id of batchIds) {
    const list = byBatch.get(id) || []
    const head = list[0]

    out.push({
      kind: "batch",
      key: `batch_${id}`,
      batch_id: id,
      count: list.length,
      title: head?.title,
      description: head?.description,
      job_units: head?.job_units,
      unit_amount: head?.unit_amount,
      reward_amount: head?.reward_amount,
    })

    const sorted = [...list].sort((a, b) => a.job_id.localeCompare(b.job_id))
    for (const j of sorted) {
      out.push({
        kind: "job",
        key: `job_${j.job_id}`,
        job_id: j.job_id,
        batch_id: id,
        title: j.title,
      })
    }
  }
  return out
})
</script>
