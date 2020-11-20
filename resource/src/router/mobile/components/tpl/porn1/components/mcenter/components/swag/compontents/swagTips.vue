<template>
  <transition name="fade">
    <div :class="$style['check-wrap']">
      <div :class="[$style['check-container']]">
        <div :class="$style['check-header']">
          <div :class="$style['title']">温馨提示</div>
          <!-- <div :class="$style['btn-close']" @click="closeTips">
            <img
              :src="$getCdnPath('/static/image/_new/common/btn_close_w.png')"
              alt="close"
            />
          </div> -->
        </div>

        <div v-if="tipsType === 'deposit'" :class="$style['check-content']">
          <div :class="$style['title']">
            只需充值一次 开通兑换功能
          </div>
        </div>

        <div :class="$style['check-button-wrap']">
          <template v-if="tipsType === 'deposit'">
            <div
              :class="$style['check-btn']"
              @click="handleClickBtn('buymethod')"
            >
              如何购买
            </div>
            <div :class="$style['check-btn']" @click="handleClickBtn('usage')">
              使用方法
            </div>
            <div
              :class="[$style['check-btn'], $style['submit']]"
              @click="handleClickBtn('deposit')"
            >
              立即充值
            </div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import mixin from "@/mixins/mcenter/swag/swag";
import { mapGetters } from "vuex";

export default {
  mixins: [mixin],
  data() {
    return {
      tipsType: 'deposit'
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
  },
  methods: {
    closeTips() {
      this.$emit("close");
    },
    handleClickBtn(target) {

      switch (target) {
        case 'buymethod':
          this.$router.push('/mobile/mcenter/help/detail?type=buymethod');
          return;
        case 'usage':
          this.$router.push('/mobile/mcenter/help/detail?type=usage&key=2');
          return;
        case 'deposit':
          this.$router.push('/mobile/mcenter/deposit');
          return;
      }
    },

  },
};
</script>

<style lang="scss"  module>
@import "../css/index.module.scss";

.check-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.check-container {
  width: 320px;
  min-height: 190px;
  z-index: 3;
  background-color: #ffffff;
  border-radius: 4px;
  position: relative;

  .check-header {
    width: 100%;
    height: 50px;
    background: #be9e7f;
    border-radius: 3px 3px 0 0;
    color: white;
    position: relative;
    line-height: 50px;

    .title {
      width: 100%;
      font-size: 17px;
      font-weight: 400;
      text-align: center;
    }

    .btn-close {
      width: 23px;
      height: 100%;
      position: absolute;
      right: 10px;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 23px;
        width: 100%;
      }
    }
  }

  .check-content {
    background-color: #ffffff;
    font-size: 15px;

    .title {
      font-size: 16px;
      font-weight: 700;
      color: #414655;
      text-align: center;
      min-height: 67px;
      line-height: 67px;
    }
  }

  .check-button-wrap {
    padding: 10px 11px;
    color: #be9e7f;
    text-align: center;
    bottom: 12px;
    width: 100%;

    .check-btn {
      width: 90px;
      height: 45px;
      line-height: 45px;
      background: #faf5f0;
      border-radius: 3px;
      margin: 0 3px;
      display: inline-block;

      &.submit {
        color: white;
        background: linear-gradient(to left, #bd9d7d, #f9ddbd);
      }
    }
  }
}
</style>

