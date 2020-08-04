<template>
  <div :class="$style['video-info-wrap']">
    <!-- Yabo -->
    <template v-if="!isCustom">
      <div :class="$style['intro-wrap']">
        <div :class="$style['v-line']" />
        <span> {{ $text("S_DESC", "简介") }}</span>
      </div>

      <div :class="$style['info-wrap']">
        <div :class="$style['title']">{{ videoInfo.title }}</div>
        <div :class="$style['views']">
          <img :src="$getCdnPath('/static/image/_new/discover/ic_video.png')" />
          <span> {{ videoInfo.views }}</span>
          <span> {{ videoInfo.created_at }} </span>
        </div>

        <div :class="[$style['desc'], { [$style['open']]: isOpenDesc }]">
          <span> {{ videoInfo.desc }}</span>
        </div>

        <div :class="$style['more-btn']" @click="isOpenDesc = !isOpenDesc">
          <img :class="[{ [$style['open']]: isOpenDesc }]" :src="openImgSrc" />
        </div>
      </div>
    </template>

    <!-- 針對smallPig , gay , les -->
    <template v-else>
      <div :class="[$style['info-wrap'], { [$style['custom']]: isCustom }]">
        <div
          :class="[
            $style['title'],
            { [$style['custom']]: isCustom },
            { [$style['smallPig']]: source === 'smallPig' }
          ]"
        >
          {{ videoInfo.title }}
        </div>

        <div :class="$style['views']">
          <span> {{ videoInfo.updated_at }} </span>
          <img :src="$getCdnPath('/static/image/_new/discover/ic_video.png')" />
          <span> {{ videoInfo.views }}</span>
        </div>

        <div
          :class="[
            $style['desc'],
            { [$style['custom']]: isCustom },
            { [$style['smallPig']]: source === 'smallPig' }
          ]"
        >
          <span> {{ videoInfo.desc }}</span>
          <span @click="toggleDialog = true">
            {{ $text("S_DESC", "简介") }}</span
          >
          <img
            :src="$getCdnPath('/static/image/_new/source/smallPig/ic_more.png')"
          />
        </div>
      </div>
    </template>

    <video-info-dialog
      v-if="isShowDialog"
      :video-info="videoInfo"
      :isShowDialog.sync="isShowDialog"
    />
  </div>
</template>

<script>
import videoInfoDialog from "./videoInfoDialog";
import videoTag from "./videoTag";

export default {
  components: {
    videoInfoDialog,
    videoTag
  },
  props: {
    videoInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      active: 0,
      isOneLine: true,
      isOpenDesc: false,
      toggleDialog: false,
      source: this.$route.query.source
    };
  },
  computed: {
    openImgSrc() {
      if (this.isOpenDesc)
        return this.$getCdnPath("/static/image/_new/video/btn_arrow.png");
      else
        return this.$getCdnPath("/static/image/_new/video/btn_arrow_close.png");
    },
    tabs() {
      return [{ key: 0, name: "简介" }];
    },
    isCustom() {
      return ["smallPig", "gay", "les"].includes(this.source);
    },
    isShowDialog: {
      get() {
        return this.toggleDialog;
      },
      set(value) {
        this.toggleDialog = !this.toggleDialog;
      }
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.intro-wrap {
  margin: 6px 10px 9px;
  font-size: 12px;

  > span:last-child {
    color: $main_text_color4;
  }
}

.v-line {
  display: inline-block;
  width: 3px;
  height: 15px;
  vertical-align: middle;
  background: -webkit-linear-gradient(top, #bd9d7d, #f9ddbd);
  background: -o-linear-gradient(bottom, #bd9d7d, #f9ddbd);
  background: -moz-linear-gradient(bottom, #bd9d7d, #f9ddbd);
  background: linear-gradient(to bottom, #bd9d7d, #f9ddbd);
}

.info-wrap {
  padding: 0 14px;
  position: relative;
  color: $main_text_color2;
  border-top: 1px solid #eee;
  border-bottom: solid 1px #eee;

  &.custom {
    padding: 10px 14px;
    border-top: none;
    border-bottom: none;
  }

  .title {
    color: $main_text_color4;
    font-size: 12px;
    line-height: 14px;
    width: 80%;
    padding: 8px 0;

    &.custom {
      font-size: 17px;
      line-height: 17px;
    }

    &.smallPig {
      color: #fff;
    }
  }

  .views {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    font-size: 12px;

    > img {
      margin-right: 3px;
      width: 13px;
      height: 13px;
    }
    > span {
      margin-right: 14px;
    }
  }

  .desc {
    display: none;
    font-size: 12px;
    line-height: 14px;
    padding-bottom: 6px;
    margin-top: -5px;

    &.custom {
      display: inline-flex;
      align-items: center;
      width: 100%;
      height: 50px;
      border-radius: 3px;
      background: #eee;
      color: #333;
      padding: 0 10px;

      span:first-child {
        flex: 9;
        max-height: 35px;
        line-height: 17px;
        padding-right: 17px;
        overflow: hidden;
      }

      img {
        width: 10px;
        height: 10px;
        margin-left: 3px;
      }
    }

    &.smallPig {
      background: #414141;
      color: #bfbfbf;
    }

    &.open {
      display: block;
    }
  }
}

.more-btn {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 14px;
  top: 8px;

  > img {
    height: 100%;
  }
}
</style>
