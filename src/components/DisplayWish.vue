<template>
  <div class="container" @click="$emit('click')">
    <div class="container__image" :icon="icon" :class="{ open }">

      <div class="img" :style="{ backgroundImage: `url(./icons/${icon}.png)` }"/>
      <div class="img" :style="{ backgroundImage: `url(./icons/${icon}.png)` }"/>
      

      <div class="container__wish">
        <span>
          <Icon 
            type="gift" 
            :size="40"
            @click="$emit('openModal', 'wish')"
          />
        </span>
      </div>

      <div class="container__text">
        <span v-text="text"/>
        <span 
          v-if="!isHideDisplayDescription"
          style="color: var(--text-color)" 
          v-text="translate('display.description')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@minis-core/components';
import { translateMixin } from '@minis-core/mixins';

export default {
  name: 'DisplayWish',

  mixins: [translateMixin],

  components: {
    Icon,
  },

  props: {
    text: String,
    icon: String,
    open: Boolean,
    isHideDisplayDescription: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: var(--special-color);
  user-select: none; 
  padding: 50px;
  box-sizing: border-box;

  &__image {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 160px;
    height: 160px;
    transition: height 1s, opacity .2s;
    max-height: 250px;
    opacity: .75;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }

    > .img {
      content: "";
      position: absolute;
      width: inherit;
      height: 160px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      left: 0;
      transition: transform 1s;
    }

    > .img:nth-child(1) {
      top: 0;
      clip-path: polygon(
        0 0, 100% 0, 100% calc(55% + 1px), 80% calc(45% + 1px), 60% calc(55% + 1px), 
        40% calc(45% + 1px), 20% calc(55% + 1px), 0 calc(45% + 1px));
    }
    > .img:nth-child(2) {
      bottom: 0;
      clip-path: polygon(0 45%, 20% 55%, 40% 45%, 60% 55%, 80% 45%, 100% 55%, 100% 100%, 0 100%);
    }


    &.open {
      opacity: 1;
      height: 100%;
    }

    .container__wish {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: -1;
      color: transparent;
      border-radius: 10px;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;
      z-index: 10;
      clip-path: polygon(
        100% 88px, 80% 72px, 60% 88px, 40% 72px, 20% 88px, 0 72px,
        0 calc(100% - 88px), 20% calc(100% - 72px), 40% calc(100% - 88px), 
        60% calc(100% - 72px), 80% calc(100% - 88px), 100% calc(100% - 72px));
      span {
        background: var(--text-color);
        color: var(--main-bg-color);
        padding: 10px;
        border-radius: 10px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          cursor: pointer;
          &:hover {
            color: var(--special-color);
          }
        }
      }
    }

    .container__text {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 100%;
      width: inherit;
    }
  }
}
</style>