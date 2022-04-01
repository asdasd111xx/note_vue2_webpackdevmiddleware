<template>
  <div :class="$style['my-card']">
    <!-- 卡片管理列表 -->
    <template v-if="isRevice && order_card.length > 0">
      <div :class="$style['card-list']">
        <div
          v-for="(item, index) in order_card"
          :key="index"
          :class="$style['card-item']"
        >
          <div :class="$style['card-top']">
            {{ item.bank }}
            <img
              :src="$getCdnPath('/static/image/common/btn_delete.png')"
              @click="deleteOrderCard(item.id)"
            />
          </div>
          <div :class="$style['card-bottom']">{{ item.formatAccount }}</div>
        </div>
      </div>
    </template>

    <!-- 無資料時 -->
    <div v-if="!isRevice || order_card.length === 0" :class="$style['no-data']">
      <div :class="$style['no-bankcard']">
        <img
          :src="$getCdnPath(`/static/image/common/default/no_bankcard.png`)"
        />
      </div>
    </div>

    <!-- 添加卡片按鈕區塊 -->
    <div :class="$style['add-wrap']">
      <div :class="$style['add-btn']" @click="clickAddOrderCard">
        <img :src="`/static/image/common/mcenter/add_2.png`" />
        <span>{{ $text("S_ADD_ORDERCARD", "添加挂单银行卡") }}</span>
      </div>
    </div>

    <div :class="$style['remind']">
      <p>
        1.仅限可挂单的支付方式使用，无法用于提现
      </p>
      <p>
        2.最多支持添加10张挂单银行卡
      </p>
    </div>

    <!-- 掛單銀行卡已達上限彈窗 -->
    <div v-if="isShowPop" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" />
      <div :class="$style['pop-block']">
        <div :class="$style['content']">
          <div :class="$style['title']">
            挂单银行卡已达上限
          </div>

          <p>您所保留的挂单银行卡已达上限10笔</p>
          <p>新的银行卡将覆盖最旧的银行卡</p>
        </div>

        <div :class="[$style['button-block']]">
          <span @click="isShowPop = false">
            {{ $text("S_CANCEL", "取消") }}
          </span>

          <span @click="setPageStatus('addOrderCard', false)">
            {{ $text("S_CONFIRM_2", "确定") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return { order_card: [], isRevice: false, isShowPop: false };
  },
  props: {
    setPageStatus: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  created() {
    this.getUserOrderCardList();
  },
  methods: {
    getUserOrderCardList() {
      this.isRevice = false;
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Transfer/Account/List`
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          this.isRevice = true;
          let temp = res.data.map(v => {
            return {
              ...v,
              formatAccount:
                v.account.slice(0, 4) + " **** **** " + v.account.slice(-4)
            };
          });
          this.order_card = temp;
        }
      });
    },
    deleteOrderCard(id) {
      return goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Transfer/Account/${id}`,
        params: { lang: "zh-cn" }
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          this.order_card = this.order_card.filter(v => v.id !== id);
        }
      });
    },
    clickAddOrderCard() {
      if (this.order_card.length === 10) {
        this.isShowPop = true;
        return;
      }
      this.setPageStatus("addOrderCard", false);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.my-card {
  padding: 15px 17px 0;
}
.card-list {
  margin-bottom: 10px;
  margin-top: 50px;
}
// -----掛單銀行卡------
.card-item {
  background-color: #fefffe;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  margin-bottom: 10px;

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 13px;
    border-bottom: 1px solid #eeeeee;
    img {
      height: 24px;
    }
  }
  .card-bottom {
    padding: 10px 13px;
  }
}

// -----無資料-----
.no-data {
  padding-top: 125px;

  .no-bankcard {
    width: 180px;
    margin: 0 auto 25px;

    img {
      max-width: 100%;
      vertical-align: top;
    }
  }
}
// -----添加區塊-----
.add-wrap {
  margin-bottom: 10px;
  text-align: center;

  img,
  span {
    display: inline-block;
  }

  img {
    max-width: 18px;
    vertical-align: top;
  }

  span {
    line-height: 18px;
    margin-left: 6px;
    font-size: 16px;
    font-weight: 700;
    color: var(--mcenter_slider_text_active_color);
  }

  .add-btn {
    padding: 31px 0;
    background: #fff;
    border-radius: 10px;
  }
}
.remind {
  font-size: 14px;
  color: #a6a9b2;
  margin: 0 auto;
  width: 80%;
  p {
    margin: 0;
  }
}
// Popup Style
.pop-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.pop-mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}

.pop-block {
  position: absolute;
  width: 75%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fefffe;
  border-radius: 20px;
}

.content {
  padding: 17px 18px;
  color: var(--mcenter_slider_text_color);
  text-align: center;

  .title {
    color: var(--mcenter_slider_text_active_color);
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  p {
    margin: 0;
  }
}

.button-block {
  position: relative;
  display: flex;
  height: 50px;
  align-items: center;
  border-top: 1px solid #f7f8fb;
  // color: var(--popup_text_color2);
  color: #6aaaf5;

  &::after {
    content: "";
    position: absolute;
    width: 3px;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #f7f8fb;
  }

  span {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 700;

    &:nth-child(2) {
      // color: var(--popup_text_color1);
      color: #6aaaf5;
    }
  }
}
</style>
