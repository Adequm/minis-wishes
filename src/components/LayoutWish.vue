<template>
  <div id="layout-wish" class="layout swiper-horizontal">

    <div class="display">
      <Swiper 
        v-if="lodash.size(wishesTypes)"
        ref="swiper" 
        @activeIndexChange="activeIndexChange" 
        loop
      >
        <SwiperSlide
          v-for="([icon, text]) of lodash.entries(wishesTypes)"
          :key="icon"
        >
          <DisplayWish 
            :text="text" 
            :icon="icon"
            :open="icon == changedWish.type"
            :isHideDisplayDescription="changedWish.type && icon !== changedWish.type"
            @click="$emit('changeWish')"
            @openModal="$emit('openModal', $event)"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <SlideButtons
      @slidePrev="lodash.invoke(swiperRef, 'slidePrev')"
      @slideNext="lodash.invoke(swiperRef, 'slideNext')"
    />
  </div>
</template>

<script>
import _ from 'lodash';

import { Swiper, SwiperSlide } from 'swiper-vue2';
import DisplayWish from './DisplayWish';
import { SlideButtons } from '@minis-core/components';

export default {
  name: 'LayoutWish',

  components: {
    Swiper,
    SwiperSlide,
    SlideButtons,
    DisplayWish,
  },

  props: {
    appWidth: Number,
    bodyHeight: Number,
    changedWish: Object,
    slideStartIndex: Number,
    wishesTypes: Object,
    wishesTypesList: Array,
    wishType: String,
  },

  data: () => ({
    lodash: _,
    swiperRef: null,
    slideHeight: 0,
    slideLength: 0,
    slideIndex: 0,
  }),

  watch: {
    appWidth: ['setSlideHeight', 'setSlidesSize'],
    slideIndex: 'setSlidesSize',
    bodyHeight: {
      immediate: true,
      handler: 'setSlideHeight',
    },
    wishesTypes: {
      deep: true,
      handler: 'init',
    },
  },

  computed: {
    isEnd() {
      const isEmptyList = !this.wishesTypesList.length;
      const isEndSlide = this.slideIndex === this.slideLength - 1;
      return !!this.swiperRef?.isEnd || isEndSlide || isEmptyList;
    },
    isBeginning() {
      const isEmptyList = !this.wishesTypesList.length;
      const isBeginningSlide = this.slideIndex === 0;
      return !!this.swiperRef?.isBeginning || isBeginningSlide || isEmptyList;
    },
  },

  methods: {
    init() {
      this.swiperRef = this.$refs.swiper?.swiperRef;
      this.slideLength = this.swiperRef?.slides?.length || 0;
      const slideIndex = (this.slideStartIndex + 1) % this.wishesTypesList.length;
      _.invoke(this.swiperRef, 'slideTo', slideIndex, 0);
      this.$nextTick(this.setSlidesSize);
    },

    setSlideHeight() {
      this.$nextTick(() => {
        this.slideHeight = this.$refs?.swiper?.$el?.offsetHeight;
      })
    },

    setSlidesSize() {
      const width = this.appWidth - 40;
      const slideTransform = `translate3d(-${ this.slideIndex * width }px, 0px, 0px)`;

      const swiperWrapper = document.querySelector('#layout-wish .swiper-wrapper');
      _.invoke(swiperWrapper?.style, 'setProperty', 'max-width', `${ width }px`);
      _.invoke(swiperWrapper?.style, 'setProperty', 'transform', slideTransform);

      const swiperSlides = document.querySelectorAll('#layout-wish .swiper-slide');
      [].forEach.call(swiperSlides, (slide, slideIndex) => {
        slide.style.setProperty('width', `${ width }px`);
        _.set(this.swiperRef, `slidesGrid[${ slideIndex }]`, slideIndex * width);
        _.set(this.swiperRef, `snapGrid[${ slideIndex }]`, slideIndex * width);
        _.set(this.swiperRef, `slidesSizesGrid[${ slideIndex }]`, width);
      });
    },

    activeIndexChange({ realIndex }) {
      this.slideIndex = realIndex;
      const indexType = (realIndex - 1 + this.wishesTypesList.length) % this.wishesTypesList.length;
      this.$emit('changeWishType', this.wishesTypesList[indexType]);
    }
  },

  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>

.layout {
  border-radius: 10px; 
  overflow: hidden; 
  height: 100%;
  background: var(--main-bg-color);
  &:hover {
    outline: 1px solid var(--special-color);
  }

  &::after, &::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 20px;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
    background-color: var(--special-color);
    top: calc(50% - 10px);
  }
  &::before {
    left: calc(100% - 20px);
  }
  &::after {
    right: calc(100% - 20px);
    transform: scale(-1);
  }

  &.isEnd::before { display: none; }
  &.isBeginning::after { display: none; }

  .display {
    height: calc(100% - 45px);
    box-sizing: border-box;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;

    .slide__container {
      overflow: hidden auto; 
      &::-webkit-scrollbar{
        background: transparent;
      }
    }
  }
}
</style>