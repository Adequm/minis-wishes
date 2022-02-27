<template>
  <div class="icon" :area-text="text" :side="side">
    <svg
      fill="none"
      :width="size || width"
      :height="size || height"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="{ rotate }"
      @click="$emit('click', $event)"
    >
      <use :href="`./feather-sprite.svg#${ type }`"/>
      <div v-if="text" v-text="text"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Icon',

  props: {
    type: String,
    size: [Number, String],
    text: String,
    side: {
      type: String,
      default: 'left',
    },
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
};
</script>

<style lang="scss" scoped>
div.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  $sides: (
    "left": "right",
    "right": "left",
    "top": "bottom",
    "bottom": "top",
  );

  @each $side, $antiside in $sides {
    &[area-text][side="#{$side}"] {
      &::after { #{$antiside}: 100% }
      &:hover::after {
        display: flex;
        animation: #{$side} .2s linear 1 forwards;
      }
    }
  }


  &[area-text]::after {
    content: attr(area-text);
    display: none;
    position: absolute;
    z-index: 100;
    white-space: nowrap;
    background-color: var(--special-color);
    color: var(--text-color);
    padding: 10px;
    border-radius: 10px;
    user-select: none;
    pointer-events: none;
  }
}

svg {
  z-index: 1;
  &.rotate {
    animation: rotate 2s linear infinite;
  }
}

@keyframes rotate {
  to { transform: rotate(360deg) }
}

@keyframes left {
  to { transform: translateX(-10px) }
}
@keyframes right {
  to { transform: translateX(10px) }
}
@keyframes top {
  to { transform: translateY(-10px) }
}
@keyframes bottom {
  to { transform: translateY(10px) }
}
</style>