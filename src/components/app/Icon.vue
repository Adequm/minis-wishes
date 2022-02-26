<template>
  <svg
    :width="size || width"
    :height="size || height"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="{ rotate }"
    @click="$emit('click', $event)"
  >
    <use :href="`./feather-sprite.svg#${ type }`"/>
  </svg>
</template>

<script>
export default {
  name: 'Icon',

  props: {
    type: String,
    size: Number,
    width: {
      type: Number,
      default: 24,
    },
    height: {
      type: Number,
      default: 24,
    },
    strokeWidth: {
      type: Number,
      default: 2,
    },
    rotate: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'currentColor',
    },
  },
}
</script>

<style scoped>
.rotate {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg) }
}
</style>