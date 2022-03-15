<template>
  <div class="slide-buttons__container">

    <button 
      class="slide-button" 
      :disabled="startDisabled"
      @click="$emit('slidePrev') && setSlide(-1)">
      <Icon type="angle-double-small-left"/>
    </button>
    <button 
      v-if="showCenterButton && centerButtonIcon"
      class="slide-button slide-button-center"
      :style="{ color: centerButtonColor }"
      :disabled="centerButtonDisabled"
      @click="$emit('clickToCenterButton')">
      <Icon :type="centerButtonIcon" :size="centerButtonSize"/>
    </button>
    <button 
      class="slide-button" 
      :disabled="endDisabled"
      @click="$emit('slideNext') && setSlide(1)">
      <Icon type="angle-double-small-right"/>
    </button>

  </div>
</template>

<script>
import _ from 'lodash';
import Icon from './Icon';

export default {
  name: 'SlideButtons',

  components: {
    Icon,
  },

  props: {
    value: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 0,
    },
    isEnd: {
      type: Boolean,
      default: null,
    },
    isBeginning: {
      type: Boolean,
      default: null,
    },
    showCenterButton: Boolean,
    centerButtonDisabled: Boolean,
    centerButtonIcon: String,
    centerButtonSize: {
      type: Number,
      default: () => 20,
    },
    centerButtonColor: String
  },

  computed: {
    startDisabled: ths => _.isBoolean(ths.isBeginning) && ths.isBeginning,
    endDisabled: ths => _.isBoolean(ths.isEnd) && ths.isEnd,
  },

  methods: {
   setSlide(shift) {
     const value = _.clamp(this.value + shift, 0, this.limit - 1);
     this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.slide-buttons__container {
  gap: 10px; 
  padding: 10px;
  display: flex;
  .slide-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--content-bg-color);
    border-radius: 10px;
    border: none;
    outline: none;
    cursor: pointer;
    width: 100%;
    &-center {
      width: 80px;
    }
    &:not(&[disabled]):hover {
      color: var(--special-color);
      opacity: .8;
    }
    &[disabled] {
      cursor: default;
      color: var(--main-bg-color) !important;
    }
    &:focus {
      box-shadow: inset 0 0 0 1px var(--special-color);
    }
  }
}
</style>