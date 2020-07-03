<template>
  <div :class="$style['detail-info-wrap']">
    <div :class="$style.amount">
      <span :class="$style.symbol">¥</span>
      <span :class="$style.number">{{ detailInfo.amount }}</span>
    </div>
    <div :class="$style.wrap">
      <div :class="[$style.detail, 'clearfix']">
        <div :class="$style.title">交易类型</div>
        <div :class="$style.text">{{ currentCategory.text }}</div>
      </div>
      <div :class="[$style.detail, 'clearfix']">
        <div :class="$style.title">交易方式</div>
        <div :class="$style.text">{{ opcodeList[detailInfo.opcode] }}</div>
      </div>
      <div :class="[$style.detail, 'clearfix']">
        <div :class="$style.title">交易时间</div>
        <div :class="$style.text">{{ detailInfo.created_at | dateFormat }}</div>
      </div>
      <div v-if="detailInfo.ref_id" :class="[$style.detail, 'clearfix']">
        <div :class="$style.title">订单号码</div>
        <div :class="$style.text">
          <span>{{ detailInfo.ref_id }}</span>
          <div :class="$style.copyImg" @click="oncopy">
            <img
              :src="
                $getCdnPath(
                  '/static/image/_new/mcenter/moneyDetail/icon_copy.png'
                )
              "
              alt="copy"
            />
          </div>
        </div>
      </div>
      <div :class="[$style.detail, 'clearfix']">
        <div :class="$style.title">备注</div>
        <div :class="$style.text">
          {{ detailInfo.memo ? detailInfo.memo : "--" }}
        </div>
      </div>
    </div>
    <div :class="$style.tips">
      如需帮助，请
      <span @click="$router.push('/mobile/service')">联系客服</span>
    </div>
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        <div
          style="background-color: transparent ; margin: 0 ; padding: 0"
          v-html="msg"
        />
      </div>
    </message>
  </div>
</template>

<script>
import Vue from 'vue';
import Message from '../../../../../tpl/porn1/components/common/new/message';

export default {
  components: {
    Message
  },
  data() {
    return {
      msg: ''
    }
  },
  filters: {
    dateFormat(date) {
      return Vue.moment(date).utcOffset(-4).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  props: {
    currentCategory: {
      type: Object,
      required: true
    },
    opcodeList: {
      type: Object,
      required: true
    },
    detailInfo: {
      type: Object,
      default: null
    }
  },
  methods: {
    oncopy() {
      this.$copyText(this.detailInfo.ref_id);
      this.msg = '已复制到剪贴板'
    }
  },
  beforeDestroy() {
    this.$emit('update:detailInfo', null);
  }
};
</script>

<style lang="scss" module>
.detail-info-wrap {
  height: calc(100vh - 49px);
  margin-top: 6px;
  padding-top: 32px;
  background-color: #fefffe;
}

.amount {
  height: 25px;
  line-height: 25px;
  color: #414655;
  text-align: center;

  > span {
    display: inline-block;
    vertical-align: top;
  }
}

.symbol {
  font-size: 12px;
  transform: translateY(2px);
}

.number {
  font-weight: 700;
  font-size: 22px;
}

.wrap {
  margin: 39px 25px 46px;
}

.detail {
  line-height: 16px;
  margin-bottom: 22px;
}

.title {
  float: left;
  color: #a6a9b2;
  font-size: 14px;
}

.text {
  float: right;
  color: #414655;
  font-size: 14px;

  .copyImg {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-left: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.tips {
  color: #a6a9b2;
  font-size: 14px;
  text-align: center;

  > span {
    color: #6aaaf5;
  }
}
</style>
