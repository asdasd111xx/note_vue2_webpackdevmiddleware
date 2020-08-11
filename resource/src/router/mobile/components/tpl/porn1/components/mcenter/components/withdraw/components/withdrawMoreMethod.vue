<template>
  <!-- 提款前提示彈窗 -->
  <transition name="fade">
    <div v-if="show" :class="$style['more-method-wrap']">
      <div :class="$style['more-method-container']">
        <div :class="$style['more-method-header']">
          <div @click="close" :class="$style['prev']">
            {{ $text("S_CANCEL", "取消") }}
          </div>

          <div :class="$style['title']">
            {{ "更多提现方式" }}
          </div>
        </div>

        <div :class="$style['more-method-content']">
          <div
            v-for="item in methodList"
            :class="$style['cell']"
            @click="addMethod(item)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      methodList: [
        {
          key: 'bankCard',
          title: '添加 提现银行卡',
          isShow: true,
        },
        {
          key: '',
          title: '添加 电子钱包',
          isShow: true,
        },
        {
          key: 'CGPay',
          title: '新增 CGPay',
          isShow: true,
        },
        {
          key: '',
          title: '新增 购宝钱包',
          isShow: true,
        }
      ]
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // to do api 決定哪需要顯示
    // methodList

    // axios({
    //   method: '',
    //   url: '',
    // }).then(res => {

    // }).catch(res => {
    // this.actionSetGlobalMessage({ msg: res.data.msg })
    // })
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    close() {
      this.$emit('close');
    },
    addMethod(item) {
      //  to do 添加選擇方式
      console.log(item);
      this.close();
    },
  },
};
</script>

<style lang="scss"  module>
.more-method-wrap {
  background-color: rgba(0, 0, 0, 0.8);
  color: #414655;
  height: 100%;
  margin: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  max-width: 420px;
}

.more-method-container {
  background-color: #f8f8f7;
  border-radius: 20px 20px 0px 0px;
  bottom: 0;
  height: 312px;
  overflow: hidden;
  position: absolute;
  width: 100%;
}

.more-method-header {
  background-color: #ffffff;
  color: #414655;
  font-size: 17px;
  height: 75px;
  line-height: 75px;

  .prev {
    left: 14px;
    position: absolute;
    text-align: center;
    width: 40px;
  }

  .title {
    width: 100%;
    text-align: center;
  }
}

.more-method-content {
  background-color: #f8f8f7;
  margin-top: 10px;

  .cell {
    font-size: 14px;
    background-color: #ffffff;
    color: #0477e9;
    height: 50px;
    line-height: 50px;
    margin-bottom: 1px;
    padding-left: 23px;
  }
}
</style>
