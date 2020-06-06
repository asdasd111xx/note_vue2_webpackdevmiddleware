<template>
  <div :class="$style['video-dialog-wrap']" :style="divStyle">
    <div :class="$style['title-block']">
      <span>{{ videoInfo.title }}</span>
      <img
        :src="$getCdnPath('/static/image/_new/common/btn_close.png')"
        alt="close"
        @click="$emit('update:isShowDialog', false)"
      />
    </div>

    <div :class="$style['info-block']">
      <span>播放：{{ videoInfo.views }}次播放</span>
      <video-tag
        :class="$style['tag-block']"
        :tag="videoInfo.tag"
        :is-dialog="true"
      />
    </div>

    <div :class="$style['desc-block']">
      <span>{{ $text("S_DESC", "简介") }}</span>
      <div>{{ videoInfo.desc }}</div>
    </div>
  </div>
</template>

<script>
import split from "lodash/split";
import videoTag from "./videoTag.vue";

export default {
  components: {
    videoTag
  },
  props: {
    videoInfo: {
      type: Object,
      required: true
    },
    isShowDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      divStyle: {
        height: null,
        top: null
      }
    };
  },
  computed: {
    tags() {
      return split(this.tag, ",");
    }
  },
  mounted() {
    // Todo: 轉橫屏的時候，會有問題
    let top = this.$parent.$el.offsetTop;
    if (top) {
      this.divStyle.top = top + "px";
      this.divStyle.height = document.body.offsetHeight - top + "px";
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.video-dialog-wrap {
  position: fixed;
  background: #fefefe;
  width: 100%;
  min-height: 300px;
  padding: 5px 17px;
  z-index: 10;
}

.title-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  margin: 15px 0;

  > span {
    max-width: 90%;
  }

  > img {
    width: 20px;
    height: 20px;
  }
}

.info-block {
  position: relative;
  padding: 10px 0;
  color: $main_text_color2;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;

  .tag-block {
    padding: 5px 0;
  }
}

.desc-block {
  position: relative;
  padding: 10px 0;

  > span {
    font-size: 16px;
    font-weight: 700;
  }

  > div {
    padding-top: 10px;
    color: #a6a9b2;
  }
}
</style>
