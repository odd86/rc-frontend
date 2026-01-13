<template>
  <div class="ds-card ds-card-strong">
    <div class="px-4 pt-4">
      <div class="text-xs font-semibold text-slate-500">{{ eyebrow }}</div>
      <div class="mt-1 text-base font-semibold text-slate-900">{{ title }}</div>
      <div v-if="subtitle" class="mt-1 text-xs text-slate-500">{{ subtitle }}</div>
    </div>
    <div class="px-4 pb-4 pt-3">
      <canvas ref="canvasRef" class="h-40 w-full"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue"

type ChartConfiguration = Record<string, any>

const props = defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
  config: ChartConfiguration
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: any = null

const renderChart = () => {
  if (!canvasRef.value) return
  const ChartRef = (window as any).Chart
  if (!ChartRef) return
  if (chartInstance) chartInstance.destroy()
  chartInstance = new ChartRef(canvasRef.value, props.config)
}

onMounted(renderChart)
watch(() => props.config, renderChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>
