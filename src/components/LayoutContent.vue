<template>
  <div 
    class="minis__content"
    :style="{ 
      minHeight: `${ appHeight }px`,
      gridTemplateRows
    }"
  >

    <div 
      class="minis__header"
      v-text="translate('header') + ':'"
    />

    <div class="minis__display">
      <div class="minis__body">
        <LayoutWish
          ref="layoutWish"
          :appWidth="appWidth"
          :bodyHeight="bodyHeight"
          :changedWish="changedWish"
          :wishesTypesList="wishesTypesList"
          :slideStartIndex="lodash.findIndex(wishesTypesList, { icon: wishType })"
          :wishType="wishType"
          @changeWishType="changeWishType"
          @changeWish="changeWishHandler"
          @openModal="$emit('openModal', $event)"
        />
      </div>


      <div class="minis__footer">
        <div 
          class="minis__button minis__button-change" 
          :disabled="checkTime"
          @click.prevent="changeWishHandler"
          v-text="checkTimeFormat || translateDef('change')"
        />
        <div 
          v-if="!isDesktop" 
          class="minis__button minis__button-settings"
          @click="$emit('openModal', 'settings')"
        >
          <Icon type="settings"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import _ from 'lodash';
import Icon from './app/Icon';
import LayoutWish from './LayoutWish';

import { mapState, mapMutations } from 'vuex';
import translateMixin from '../mixins/translate.mixin';

export default {
  name: 'LayoutContent',

  mixins: [translateMixin],
  components: {
    Icon,
    LayoutWish,
  },

  props: {
    appWidth: Number,
    appHeight: Number,
    bodyHeight: Number,
    isDesktop: Boolean,
    isWidthMore768: Boolean,
  },

  data: () => ({
    lodash: _,
    checkTime: null,
  }),

  computed: {
    ...mapState([
      'wishes', 
      'wishType', 
      'changedWish',
      'wishesTypesList',
    ]),
    gridTemplateRows() {
      const header = Math.min(this.appHeight * 0.1, 60);
      const content = this.appHeight - header;
      return `${ header }px ${ content }px`;
    },
    checkTimeFormat() {
      if(!this.checkTime) return;
      const offset = new Date().getTimezoneOffset() / 60;
      const hour = (new Date(this.checkTime).getHours() + offset).toString().padStart(2, 0);
      const minutes = new Date(this.checkTime).getMinutes().toString().padStart(2, 0);
      const seconds = new Date(this.checkTime).getSeconds().toString().padStart(2, 0);
      return `${ hour }:${ minutes }:${ seconds }`;
    }
  },

  methods: {
    ...mapMutations(['changeWishType', 'changeWish']),

    changeWishHandler() {
      if(this.checkTime) return;
      const length = this.wishesTypesList.length;
      const typeIndex = _.findIndex(this.wishesTypesList, { icon: this.wishType });
      const type = this.wishesTypesList[typeIndex % length];
      this.changeWish({
        type: type.icon,
        text: _.sample(this.wishes),
        time: Date.now() + new Date().getTimezoneOffset()*60*1000,
      });
    },

    keydown({ key, shiftKey }) {
      switch(key) {
        case 'Escape':
          this.$emit('switchSettings');
          break;
        case 'ArrowLeft':
          _.invoke(this.$refs.layoutWish, 'swiperRef.slidePrev');
          break;
        case 'ArrowRight':
          _.invoke(this.$refs.layoutWish, 'swiperRef.slideNext');
          break;
        case ' ':
          this.changeWishHandler();
          break;
      }
    },
  },

  beforeMount() {
    document.addEventListener('keydown', this.keydown);
    setInterval(() => {
      requestAnimationFrame(() => {
        const time = Date.now() - 1000*60*60*4 + new Date().getTimezoneOffset()*60*1000;
        this.checkTime = time < this.changedWish.time ? this.changedWish.time - time + 1000 : null;
        if(!this.checkTime) {
          this.changeWish({ type: null, time: null, text: null });
        }
      })
    }, 100);
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
  },
};
</script>

<style lang="scss">
.swiper-container, 
.swiper-wrapper, 
.swiper-slide {
  height: 100% !important;
}

.swiper-horizontal {
  .swiper-wrapper {
    display: grid !important;
    grid-auto-flow: column !important;
  }
}

.swiper-vertical {
  .swiper-wrapper {
    display: block !important;
    grid-auto-flow: column !important;
  }
}

.minis__content {
  display: grid;
  height: inherit;
  background-color: var(--main-bg-color);
  color: var(--text-color);
  font-size: 18px;
  position: relative;
  top: 0;
  z-index: 1;

  .minis__header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: var(--special-color);
    user-select: none;
  }

  .minis__display {
    padding: 20px;
    z-index: 2;
    background-color: var(--content-bg-color);
    border-radius: 10px;
    display: grid;
    grid-template-rows: 1fr;
    gap: 10px;

    .minis__body {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      background: var(--main-bg-color);
    }

    .minis__footer {
      display: flex;
      gap: 10px;
      .minis__button {
        border-radius: 10px;
        background: var(--main-bg-color);
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
          opacity: .8;
        }
        &-change {
          width: 100%;
          background: var(--special-color);
          font-weight: bold;
          &[disabled] {
            background-color: var(--main-bg-color);
            color: var(--text-color);
            cursor: default;
          }
        }
        &-settings {
          width: 50px;
        }
      }
    }
  }
}

@media screen and (min-width: 768px) {
  .minis__content {
    border-radius: 10px;
    clip-path: polygon(
      0 5px, 5px 0, calc(100% - 5px) 0, 101% 5px, 
      101% calc(100% - 5px), calc(100% - 5px) 101%, 5px 101%, 0 calc(100% - 5px)
    );
    .minis__display {
      padding-bottom: 30px;
    }
  }
}
</style>