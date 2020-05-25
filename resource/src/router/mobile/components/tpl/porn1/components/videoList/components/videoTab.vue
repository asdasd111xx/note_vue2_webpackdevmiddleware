<template>
  <div :class="$style.box">
    <swiper :options="{ slidesPerView: 'auto', slideClass: $style.tab }">
      <swiper-slide v-for="info in videoTabs" :key="info.id">
        <div
          :class="[$style.wrap, { [$style.active]: info.id === +sortId }]"
          @click="$emit('update:sortId', `${info.id}`)"
        >
          <span>{{ info.title }}</span>
          <div />
        </div>
      </swiper-slide>
    </swiper>
    <div :class="Permutation" @click="$emit('update:isSingle')" />
  </div>
</template>

<script>
import axios from "axios";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import pornRequest from '@/api/pornRequest';

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    sortId: {
      type: Number,
      required: true
    },
    isSingle: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      videoTabs: []
    };
  },
  computed: {
    Permutation() {
      return this.isSingle
        ? this.$style["is-single"]
        : this.$style["is-multiple"];
    }
  },
  created() {
    pornRequest({
      method: "get",
      url: `/video/sort`,
      timeout: 30000,
    }).then(response => {
      if (response.status !== 200) {
        return;
      }

      this.videoTabs = [
        { id: 0, title: "全部" },
        ...response.result
      ];
    });
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.box {
  position: relative;
  padding-right: 40px;
  background: $main_white_color1;
}

.tab {
  display: inline-block;
  margin: 0 15px;
}

.wrap {
  position: relative;
  line-height: 44px;
  color: #bcbdc1;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;

  &.active {
    color: $main_text_color4;

    > div {
      display: block;
    }
  }

  > div {
    display: none;
    position: absolute;
    width: 48px;
    height: 2px;
    left: 50%;
    bottom: 2px;
    transform: translateX(-50%);
    border-radius: 1px;
    background-color: #be9e7f;
  }
}

.btn-column {
  $size: 20px;
  position: absolute;
  top: 50%;
  right: 10px;
  width: $size;
  height: $size;
  background-position: 0 50%;
  background-repeat: no-repeat;
  background-size: $size $size;
  transform: translateY(-50%);
}

.is-multiple {
  composes: btn-column;
  background-image: url("/static/image/_new/discover/ic_list_double.png");
}

.is-single {
  composes: btn-column;
  background-image: url("/static/image/_new/discover/ic_list_single.png");
}

@media screen and (min-width: $phone) {
  .wrap {
    font-size: 15px;
  }
}

@media screen and (min-width: $pad) {
  .wrap {
    font-size: 16px;
  }
}
</style>
