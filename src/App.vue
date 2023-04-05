<template>
  <div 
    class="container" 
    :class="{ fullscreen: isFullscreen || isFrame }"
    :style="{ 
      height: `${ innerHeight }px`, 
      maxWidth: isDesktop ? `${ containerWidth }px` : '100vw',
      maxHeight: isDesktop ? `${ containerHeight }px` : '100vh',
    }"
  >
    <Icon class="woman" type="woman-head" :size="22"/>

    <AppLoader v-if="!isPageLoad" :size="100" rotate/>

    <div v-else class="minis__wrapper">
      <SettingsDesktop
        v-if="isDesktop && !isFrame"
        :themeIcon="themeMain.icon"
        :appHeight="appHeight"
        :appWidth="appWidth"
        :translate="translate"
        :translateDef="translateDef"
        :showHints="minisHints"
        v-model="isClosedSettings"
        @switchHints="switchHints"
        @switchTheme="switchTheme"
        @switchLang="switchLang"
        @switchFullscreen="$store.commit(switchFullscreenKey)"
      />

      <LayoutContent
        ref="layoutContent"
        :appWidth="appWidth" 
        :appHeight="appHeight"
        :bodyHeight="innerHeight"
        :isFrame="isFrame"
        :isDesktop="isDesktop"
        :isWidthMore768="isWidthMore768"
        :style="{ filter: openedModalName ? 'blur(2px)' : 'none' }"
        @switchSettings="isClosedSettings = !isClosedSettings"
        @openModal="openedModalName = $event"
      />

      <AppModal 
        v-model="openedModalName" 
        :isRoundedBorder="isWidthMore768 && !isFullscreen"
      >
        <SettingsMobile 
          v-if="openedModalName == 'settings'"
          :themeIcon="themeMain.icon"
          :isWidthMore768="isWidthMore768"
          :translate="translate"
          @switchTheme="switchTheme"
          @switchLang="switchLang"
          @switchFullscreen="$store.commit(switchFullscreenKey)"
        />
        <div 
          v-if="openedModalName == 'wish'"
          style="text-align: center;" 
          v-text="lodash.get(wishes, changedWish.textId, translateErrorMessage)"
        />
      </AppModal>

      <div 
        v-if="isDesktop" 
        class="resize_button" 
        @mousedown.prevent="startResize"
        @dblclick.prevent="autoResize"
      />
      <a 
        v-if="isDesktop" 
        href="https://adequm.github.io/minis" 
        target="_blank" 
        class="minis"
        v-text="'Minis'"
      />
    </div>

  </div>
</template>

<script>
import _ from 'lodash';

import LayoutContent from './components/LayoutContent';

import { Icon, AppLoader, AppModal, SettingsDesktop, SettingsMobile } from '@minis-core/components';
import { minisMixin, resizeMixin, faviconMixin, translateMixin } from '@minis-core/mixins';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    LayoutContent,
    AppModal,
    SettingsDesktop,
    SettingsMobile,
    AppLoader,
    Icon,
  },

  mixins: [minisMixin, resizeMixin, faviconMixin, translateMixin],

  data: () => ({
    lodash: _,
    isClosedSettings: true,
    openedModalName: null,
  }),

  watch: {
    isDesktop(isDesktop) {
      if(isDesktop && this.openedModalName == 'settings') {
        this.openedModalName = null;
        this.isClosedSettings = false;
      }
    },
    changedWish: {
      deep: true,
      handler(changedWish) {
        if(changedWish.time) return;
        if(this.openedModalName == 'settings') return;
        this.openedModalName = null;
      }
    }
  },

  computed: {
    ...mapState([
      'changedWish', 
      'switchFullscreenKey'
    ]),
    ...mapGetters(['wishes']),
  },

  beforeMount() {
    document.body.addEventListener('click', event => {
      if(document.body !== event.target) return;
      if(!this.isDesktop) return;
      if(this.isClosedSettings) return;
      this.isClosedSettings = true;
    });
  },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 5px; 
	background-color: var(--content-bg-color);
}
::-webkit-scrollbar-thumb {
  width: 5px; 
	background-color: var(--special-color); 
}
::selection {
	background: var(--special-color); 
}

button {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  border: none;
  outline: none;
  color: inherit;
}

body {
  font-family: 'Noto Sans', sans-serif;
  margin: 0;
  display: flex;
  background-image: url("assets/confetti.svg");
  background-repeat: repeat;
  background-position: center;
  background-color: #333;
  min-height: 100vh;
  overflow: hidden;

  .woman {
    position: absolute !important;
    bottom: 10px;
    left: 10px;
    cursor: pointer;
    color: var(--special-color);
    opacity: .25;
    &:hover {
      opacity: 1;
    }
  }

  .container {
    width: 100vw;
    margin: 0 auto;

    .minis__wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      box-shadow: 0 3px 0 2px var(--main-bg-color);
      border-radius: 10px;
      box-sizing: border-box;

      .confirmation {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 18px;
        strong {
          color: var(--special-color);
        }
        button {
          margin-top: 10px;
          border-radius: 10px;
          padding: 10px;
          background: var(--special-color);
          cursor: pointer;
          &:hover {
            opacity: .8;
          }
        }
      }

      .minis {
        display: flex;
        position: absolute;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        color: var(--special-color);
        opacity: .5;
        cursor: pointer;
        transition: opacity .2s;
        text-decoration: none;
        border: none;
        outline: none;
        width: 50px;
        height: 30px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 5;
        user-select: none; 
        &:hover { opacity: 1; }
        &:focus { color: var(--text-color); }
      }

      .resize_button {
        position: absolute;
        display: block;
        width: 10px;
        height: 10px;
        background: var(--special-color);
        transform: translateY(-100%);
        right: 0;
        top: 100%;
        z-index: 101;
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
        border-radius: 0 0 10px 0;
        cursor: se-resize;
      }
    }

  }
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

@media screen and (min-width: 768px) {
  body .container {
    margin: auto;
  }
}
</style>
