<template>
  <component
    :is="componentTag"
    v-bind="componentProps"
    class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition"
    :class="[variantClass, sizeClass, disabledClass]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { RouterLink } from "vue-router"

const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    type?: "button" | "submit" | "reset"
    variant?: "primary" | "secondary" | "destructive" | "ghost"
    size?: "sm" | "md" | "lg"
    disabled?: boolean
  }>(),
  {
    type: "button",
    variant: "primary",
    size: "md",
    disabled: false,
  }
)

const componentTag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return "a"
  return "button"
})

const componentProps = computed(() => {
  if (props.to) {
    return { to: props.to, "aria-disabled": props.disabled || undefined }
  }
  if (props.href) return { href: props.href, target: "_blank", rel: "noreferrer" }
  return { type: props.type, disabled: props.disabled }
})

const variantClass = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
    case "destructive":
      return "bg-red-500/10 text-red-700 hover:bg-red-500/20"
    case "ghost":
      return "bg-transparent text-slate-700 hover:bg-slate-100"
    default:
      return "bg-slate-900 text-white hover:bg-slate-800"
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-3 py-1.5 text-xs"
    case "lg":
      return "px-5 py-3 text-base"
    default:
      return "text-sm"
  }
})

const disabledClass = computed(() =>
  props.disabled ? "cursor-not-allowed opacity-50 pointer-events-none" : "active:scale-[0.98]"
)
</script>
