<template>
  <BaseButton variant="primary" v-bind="$attrs">
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue"
</script>
