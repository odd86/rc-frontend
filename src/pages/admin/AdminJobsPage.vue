<template>
  <AdminShell>
    <div class="space-y-4">
      <Card>
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-xs font-semibold text-slate-500">{{ t("admin.jobs.listEyebrow") }}</div>
            <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.jobs.listTitle") }}</div>
            <div class="mt-1 text-sm text-slate-600">{{ t("admin.jobs.listSubtitle") }}</div>
          </div>

          <div class="flex gap-2">
            <SecondaryButton :disabled="loadingList" @click="refresh" type="button">
              {{ t("admin.actions.refresh") }}
            </SecondaryButton>

            <PrimaryButton @click="showCreate = !showCreate" type="button">
              {{ t("admin.jobs.addJob") }}
            </PrimaryButton>
          </div>
        </div>
      </Card>

      <Card v-if="showCreate">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-xs font-semibold text-slate-500">{{ t("admin.jobs.createEyebrow") }}</div>
            <div class="mt-1 text-lg font-semibold text-slate-900">{{ t("admin.jobs.createTitle") }}</div>
            <div class="mt-1 text-sm text-slate-600">{{ t("admin.jobs.createSubtitle") }}</div>
          </div>

          <SecondaryButton size="sm" @click="showCreate = false" type="button">
            {{ t("admin.actions.close") }}
          </SecondaryButton>
        </div>

        <form class="mt-4 space-y-3" @submit.prevent="create">
          <TextInput v-model="form.title" :label="t('admin.jobs.fields.title')" placeholder="Job title" />
          <TextInput v-model="form.description" :label="t('admin.jobs.fields.description')" placeholder="Short description" />

          <div class="grid grid-cols-2 gap-3">
            <Select v-model="form.job_units" :label="t('admin.jobs.fields.jobUnits')">
              <option value="distance">{{ t("admin.jobs.units.distance") }}</option>
              <option value="time">{{ t("admin.jobs.units.time") }}</option>
            </Select>

            <div>
              <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.unitAmount") }}</label>
              <input
                v-model.number="form.unit_amount"
                type="number"
                class="ds-input"
                min="1"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.rewardAmount") }}</label>
              <input
                v-model.number="form.reward_amount"
                type="number"
                class="ds-input"
                min="0"
              />
            </div>

            <div>
              <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.quantity") }}</label>
              <input
                v-model.number="form.job_quantity"
                type="number"
                class="ds-input"
                min="1"
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-700">{{ t("admin.jobs.fields.allowedVehicleTypes") }}</label>
            <div class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
              <Checkbox
                v-for="vt in vehicleTypes"
                :key="vt"
                :label="t(`vehicles.vehicleTypes.${vt}`)"
                :model-value="form.allowed_vehicle_types.includes(vt)"
                @update:model-value="toggleVehicleType(vt, $event)"
              />
            </div>
          </div>

          <PrimaryButton class="w-full" :disabled="creating || !isValid" type="submit">
            {{ creating ? t("auth.working") : t("admin.jobs.actions.create") }}
          </PrimaryButton>

          <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
          <p v-if="createSuccess" class="text-sm text-emerald-700">{{ createSuccess }}</p>
        </form>
      </Card>

      <Card>
        <div class="flex items-center justify-between px-1 pb-2">
          <div class="text-sm font-semibold text-slate-900">{{ t("admin.jobs.pending") }}</div>
          <div class="text-xs text-slate-600">
            <span v-if="loadingList">{{ t("auth.working") }}</span>
            <span v-else>{{ t("admin.jobs.countJobs", { count: jobs.length }) }}</span>
          </div>
        </div>

        <div v-if="listError" class="px-1 pb-3 text-sm text-red-600">{{ listError }}</div>

        <EmptyState v-if="!loadingList && rows.length === 0" :title="t('admin.jobs.empty')" />

        <div v-else class="divide-y">
          <template v-for="row in rows" :key="row.key">
            <div v-if="row.kind === 'batch'" class="bg-slate-50 px-2 py-3">
              <div class="flex items-center justify-between gap-2">
                <div class="min-w-0 flex-grow">
                  <div class="truncate text-sm font-semibold text-slate-900">
                    {{ row.count }} - {{ row.title || t("admin.jobs.unknownTitle") }}
                  </div>
                  <div v-if="row.description" class="mt-1 truncate text-xs text-slate-600">
                    {{ row.description }}
                  </div>
                  <div v-if="row.reward_amount" class="mt-1 truncate text-xs text-slate-600">
                    {{ row.reward_amount }}
                  </div>
                </div>

                <SecondaryButton size="sm" @click="toggleBatch(row.batch_id)" type="button">
                  {{ expandedBatches.has(row.batch_id) ? t("admin.jobs.collapse") : t("admin.jobs.expand") }}
                </SecondaryButton>
                <DestructiveButton
                  size="sm"
                  :disabled="deletingBatchId === row.batch_id"
                  @click="deleteBatch(row.batch_id)"
                  type="button"
                >
                  {{ t("admin.jobs.actions.deleteBatch") }}
                </DestructiveButton>
              </div>
            </div>

            <div
              v-else
              class="px-2 py-3"
              :class="row.batch_id ? 'pl-6' : ''"
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
                    <Badge>id: {{ row.job_id }}</Badge>
                    <Badge v-if="row.job_units">{{ row.job_units }}</Badge>
                    <Badge v-if="typeof row.unit_amount === 'number'">
                      {{ t("admin.jobs.unitsAmount") }} {{ row.unit_amount }}
                    </Badge>
                    <Badge v-if="typeof row.reward_amount === 'number'">
                      {{ t("admin.jobs.reward") }} {{ row.reward_amount }}
                    </Badge>
                  </div>
                </div>

                <DestructiveButton
                  size="sm"
                  :disabled="deletingJobId === row.job_id"
                  @click="deleteJob(row.job_id)"
                  type="button"
                >
                  {{ t("admin.jobs.actions.deleteJob") }}
                </DestructiveButton>
              </div>
            </div>
          </template>
        </div>

        <div v-if="deleteError" class="px-1 py-3 text-sm text-red-600">{{ deleteError }}</div>
        <div v-if="deleteSuccess" class="px-1 py-3 text-sm text-emerald-700">{{ deleteSuccess }}</div>
      </Card>
    </div>
  </AdminShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import AdminShell from "@/components/AdminShell.vue"
import Card from "@/components/ui/Card.vue"
import PrimaryButton from "@/components/ui/PrimaryButton.vue"
import SecondaryButton from "@/components/ui/SecondaryButton.vue"
import DestructiveButton from "@/components/ui/DestructiveButton.vue"
import TextInput from "@/components/ui/TextInput.vue"
import Select from "@/components/ui/Select.vue"
import Checkbox from "@/components/ui/Checkbox.vue"
import EmptyState from "@/components/ui/EmptyState.vue"
import Badge from "@/components/ui/Badge.vue"

import type { AdminPendingJob, JobsRequestModel, VehicleType } from "@/types/api"
import { adminCreateJobs, adminDeleteJob, adminDeleteJobs, adminGetAllPendingJobs } from "@/api/endpoints"

const { t } = useI18n()

const vehicleTypes: VehicleType[] = [
  "excavator",
  "backhoe",
  "bulldozer",
  "wheel_loader",
  "skid_steer",
  "dump_truck",
  "articulated_dump_truck",
  "semi_truck",
  "tractor_truck",
  "trailer",
  "forklift",
  "telehandler",
  "crane",
  "tower_crane",
  "knuckle_boom_crane",
  "grader",
  "roller",
  "asphalt_paver",
  "compactor",
  "tractor",
  "agricultural_implement",
  "service_truck",
  "fuel_truck",
  "water_truck",
  "tow_truck",
  "maintenance_vehicle",
  "demolition_machine",
  "drill_rig",
  "conveyor",
  "rock_crusher",
  "specialty",
]

const showCreate = ref(false)

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

function toggleVehicleType(vt: VehicleType, enabled: boolean) {
  const set = new Set(form.value.allowed_vehicle_types)
  if (enabled) set.add(vt)
  else set.delete(vt)
  form.value.allowed_vehicle_types = Array.from(set)
}

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
  description?: string
  job_units?: "distance" | "time"
  unit_amount?: number
  reward_amount?: number
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

  for (const j of unbatched) {
    out.push({
      kind: "job",
      key: j.job_id,
      job_id: j.job_id,
      title: j.title,
      description: j.description,
      job_units: j.job_units,
      unit_amount: j.unit_amount,
      reward_amount: j.reward_amount,
    })
  }

  for (const [batchId, items] of byBatch.entries()) {
    const first = items[0]
    out.push({
      kind: "batch",
      key: batchId,
      batch_id: batchId,
      count: items.length,
      title: first?.title,
      description: first?.description,
      job_units: first?.job_units,
      unit_amount: first?.unit_amount,
      reward_amount: first?.reward_amount,
    })

    for (const j of items) {
      out.push({
        kind: "job",
        key: j.job_id,
        job_id: j.job_id,
        batch_id: batchId,
        title: j.title,
        description: j.description,
        job_units: j.job_units,
        unit_amount: j.unit_amount,
        reward_amount: j.reward_amount,
      })
    }
  }

  return out
})
</script>
