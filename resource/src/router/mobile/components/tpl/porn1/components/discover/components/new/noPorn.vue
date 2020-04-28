<template>
  <div :class="$style['no-porn-wrap']">
    <div :class="$style['no-porn-img']">
      <img src="/static/image/_new/discover/no_porn.png" />
    </div>

    <span :class="$style['no-porn-title']">{{
      $text("S_PORN_CLOSE_TIP", "目前关闭中，欲开启色站请点击按钮")
    }}</span>
    <template v-if="memInfo.config.content_rating">
      <div :class="$style['porn-open-btn']" @click="openPorn">
        {{ $text("S_OPEN_PORN", "开启色站") }}
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    })
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    openPorn() {
      mcenter.accountDataSet({
        params: {
          content_rating: 1
        },
        success: () => {
          this.actionSetUserdata();
        }
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.no-porn-wrap {
  text-align: center;
  background-color: white;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/_new/common/bg.png");
  height: 100vh;
  padding-top: 89px;
}

.no-porn-img {
  display: block;
  width: 100%;
  height: 233px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 44px;

  > img {
    height: 233px;
    width: 243px;
  }
}

.no-porn-title {
  color: #A6A9B2;
}

.porn-open-btn {
  display: block;
  color: white;
  width: 300px;
  height: 50px;
  line-height: 50px;
  margin: 26px auto 0;
  border-radius: 3px;
  background: -webkit-linear-gradient(right, #bd9d7d, #f9ddbd);
  background: -o-linear-gradient(left, #bd9d7d, #f9ddbd);
  background: -moz-linear-gradient(left, #bd9d7d, #f9ddbd);
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);
}

@media screen and (min-width: $phone) {
  .no-porn-title {
    font-size: 16px;
  }

  .porn-open-btn {
    font-size: 13px;
  }
}

@media screen and (min-width: $pad) {
  .no-porn-title {
    font-size: 18px;
  }

  .porn-open-btn {
    font-size: 15px;
  }
}
</style>
