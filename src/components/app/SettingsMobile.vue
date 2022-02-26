<template>
  <div class="settings" :class="{ isClosedSettings: value }">
    <Icon :type="themeIcon" @click.prevent="$emit('switchTheme', 'main')"/>
    <Icon type="heart" @click.prevent="$emit('switchTheme', 'special')"/>
    <Icon type="globe" @click.prevent="$emit('switchLang')"/>
    <Icon v-if="isWidthMore768" type="minimize-2" @click.prevent="$emit('switchFullscreen')"/>
  </div>
</template>

<script>
import Icon from './Icon.vue'

export default {
  name: 'SettingsMobile',

  components: { 
    Icon,
  },

  props: {
    themeIcon: String,
    value: Boolean,
    isWidthMore768: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.settings {
  display: grid;
  color: var(--special-color);
  z-index: 1;
  max-width: 60vw;
  align-items: center;
  justify-content: space-evenly;

  & > svg {
    cursor: pointer;
    width: 30px;
    height: 30px;
    margin: 15px;
    &:hover {
      color: var(--text-color);
    }
  }
}
</style>