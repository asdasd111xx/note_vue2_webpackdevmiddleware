<template>
  <div :class="$style['popup']">
    <div :class="$style['mask']" />
    <div :class="$style['modal-wrap']">
      <!-- 彈窗內容 -->
      <div
        :class="[
          $style['modal-content'],
          { [$style['hasBorderBottom']]: origin === 'home' }
        ]"
      >
        <!-- 內容顯示 -->
        <div :class="$style['modal-news']">
          <div
            v-for="item in wrappedList"
            :key="item.id"
            :class="$style['news-item']"
          >
            <pre :class="$style['news-title']">{{ item.title }}</pre>
            <p
              :class="$style['news-content']"
              v-html="item.content.replace('\n', '<br>')"
              v-if="item.content"
            />
          </div>
        </div>

        <!-- 不再提示勾勾 -->
        <div v-if="isShowTick" :class="[$style['no-remind'], 'clearfix']">
          <span
            :class="[$style['checkbox-circle'], { [$style.active]: isTick }]"
            @click="isTick = !isTick"
          />
          <span :class="$style['checkbox-text']">不再提示</span>
        </div>
      </div>

      <div class="clearfix">
        <div
          :class="[
            $style['modal-button'],
            { [$style[themeTPL]]: origin !== 'home' }
          ]"
          @click="closePop()"
        >
          {{ isShowTick ? "知道了" : "关闭" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    origin: {
      type: String,
      default: ""
    },
    list: {
      type: Array,
      default: []
    },
    isFirstShow: {
      type: Boolean
    }
  },
  data() {
    return {
      isTick: false
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    isShowTick() {
      let hasTickDepositPost =
        this.origin === "deposit" &&
        localStorage.getItem("do-not-show-deposit-post");

      let hasTickWithdrawPost =
        this.origin === "withdraw" &&
        localStorage.getItem("do-not-show-withdraw-post");

      if (
        hasTickDepositPost ||
        hasTickWithdrawPost ||
        !this.isFirstShow ||
        this.origin === "home"
      ) {
        return false;
      }

      return true;
    },
    wrappedList() {
      if (this.isShowTick) {
        return this.list.filter(item => item.announceSwitch === 1);
      } else {
        return this.list;
      }
    }
  },
  methods: {
    // $emit 事件
    closePop() {
      if (this.isTick) {
        if (this.origin === "deposit") {
          localStorage.setItem("do-not-show-deposit-post", true);
        } else if (this.origin === "withdraw") {
          localStorage.setItem("do-not-show-withdraw-post", true);
        }
      }

      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" module>
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.modal-wrap {
  width: 270px;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 100;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 10px;
}

.modal-content {
  padding: 15px 20px;

  &.hasBorderBottom {
    border-bottom: 1px solid #eee;
  }
}

.modal-news {
  height: 192px;
  margin-bottom: 15px;
  overflow-x: hidden;
  overflow-y: auto;
}

.no-remind {
  span {
    float: left;
  }
}

.checkbox-circle {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  opacity: 0.5;
  background: url("/static/image/common/icon_noremember.png") 0 0 / contain
    no-repeat;

  &.active {
    background-image: url("/static/image/common/icon_notips_active.png");
    opacity: 0.5;
  }
}

.checkbox-text {
  line-height: 16px;
  font-size: 12px;
  color: #a5a9b3;
}

.news-item {
  margin-bottom: 20px;
  word-break: break-all;
}

.news-title {
  line-height: 23px;
  margin: 0 0 5px;
  font-size: 18px;
  font-weight: normal;
  color: #414655;
  white-space: pre-wrap;
  font-family: inherit;
  font-weight: inherit;
}

.news-content {
  line-height: 21px;
  font-size: 14px;
  color: #a5a9b3;
}

.modal-button {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;

  &.porn1 {
    color: #d1b79c;
  }

  &.ey1 {
    color: #e42a30;
  }

  &.sg1 {
    color: #bf8646;
  }
}
</style>
