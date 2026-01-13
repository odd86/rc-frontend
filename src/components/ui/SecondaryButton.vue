<template>
  <BaseButton variant="secondary" v-bind="$attrs">
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue"
</script>
