<template>
  <div slot="content">
    <div :class="$style['section']">
      <div
        v-if="hasCid"
        :class="[$style['cell']]"
        :style="{ 'margin-bottom': '10px' }"
        @click="
          $router.push(
            `/mobile/mcenter/help/detail?type=deposit${
              isApp ? '&app=true' : ''
            }`
          )
        "
      >
        <div :class="$style['title']">
          {{ $text("S_RECENTLY_DEPOSIT", "8日内充值记录") }}
        </div>
        <div :class="[$style['arrow-btn']]">
          <img
            :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
          />
        </div>
      </div>

      <div
        slot="content"
        v-if="categorys"
        :class="$style['help-wrap']"
        @click="category_isShowPop = true"
      >
        <div :class="$style.list">
          <div :class="$style['list-icon']">
            <img
              :src="
                $getCdnPath(
                  `/static/image/porn1/mcenter/help/deposit/icon_${categorys[category_currentIndex].icon}.png`
                )
              "
            />
          </div>

          <span> {{ categorys[category_currentIndex].name }} </span>
          <div :class="$style['btn-next']">
            <img
              :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="category_currentIndex == 3 || category_currentIndex > 4"
      :class="[$style['content-wrap'], 'clearfix']"
    >
      <div :class="[$style['tab-wrap']]">
        <div
          v-for="(item, index) in tabItem"
          :key="`tab-${item.key}`"
          :class="[
            $style['tab-item'],
            { [$style['is-current']]: currentTab === index },
          ]"
          @click="setCurrentTab(index)"
        >
          {{ item.text }}
        </div>
        <div
          :class="$style['active-slider']"
          :style="{
            left: tabSlider,
          }"
        />
      </div>
    </div>

    <div
      v-for="(item, index) in tabList"
      :id="`q-${index}`"
      :class="$style['cell2']"
      :key="`q-${index}`"
    >
      <div :class="$style['cell2-step-title']">
        <span>步骤 {{ index + 1 }}/{{ tabList.length }}</span>
      </div>

      <div :class="$style['cell2-step']">
        <img
          :src="
            $getCdnPath(
              `/static/image/porn1/mcenter/help/deposit/step/${item.img}.png`
            )
          "
        />
      </div>
    </div>

    <div v-if="category_isShowPop" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" @click="category_isShowPop = false" />
      <div :class="$style['pop-menu']">
        <div :class="$style['pop-title']">
          <span @click="category_isShowPop = false">{{
            $text("S_CANCEL", "取消")
          }}</span>
          选择充值教程
        </div>
        <ul :class="$style['pop-list']">
          <li
            v-for="(item, index) in categorys"
            :key="index"
            @click="setType(index)"
          >
            <img
              :src="
                $getCdnPath(
                  `/static/image/porn1/mcenter/help/deposit/icon_${item.icon}.png`
                )
              "
            />

            {{ item.name }}
            <icon
              v-if="category_currentIndex === index"
              :class="$style['select-icon']"
              name="check"
            />
          </li>
        </ul>
      </div>
    </div>

    <div :class="$style['gotop']" @click="toTop" v-if="showgo">
      <img
        :src="
          $getCdnPath(`/static/image/porn1/mcenter/help/deposit/btn_gotop.png`)
        "
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import member from "@/api/member";
import { getCookie } from "@/lib/cookie";

export default {
  components: {},
  data() {
    return {
      showgo: false,
      hasCid: false,
      category_currentIndex: 0,
      category_isShowPop: false,
      currentTab: 0,

      categorys: [
        {
          name: "代客充值",
          icon: "bank7",
          list: [
            { key: 0, img: "tutorial_deposit_valet_01" },
            { key: 1, img: "tutorial_deposit_valet_02" },
            { key: 2, img: "tutorial_deposit_valet_03" },
            { key: 3, img: "tutorial_deposit_valet_04" },
          ],
        },
        {
          name: "网银支付",
          icon: "bank1",
          list: [
            { key: 0, img: "tutorial_deposit_onlinebank_01" },
            { key: 1, img: "tutorial_deposit_onlinebank_02" },
            { key: 2, img: "tutorial_deposit_onlinebank_03" },
            { key: 3, img: "tutorial_deposit_onlinebank_04" },
          ],
        },
        {
          name: "微信",
          icon: "bank5",
          list: [
            { key: 0, img: "tutorial_deposit_wechat_01" },
            { key: 1, img: "tutorial_deposit_wechat_02" },
            { key: 2, img: "tutorial_deposit_wechat_03" },
          ],
        },
        {
          name: "支付宝",
          icon: "bank6",
          list: [
            { key: 0, img: "tutorial_deposit_alipay_transfercard_01" },
            { key: 1, img: "tutorial_deposit_alipay_transfercard_02" },
            { key: 2, img: "tutorial_deposit_alipay_transfercard_03" },
            { key: 3, img: "tutorial_deposit_alipay_transfercard_04" },
          ],
          list2: [
            { key: 0, img: "tutorial_deposit_alipay_qrcode_01" },
            { key: 1, img: "tutorial_deposit_alipay_qrcode_02" },
            { key: 2, img: "tutorial_deposit_alipay_qrcode_03" },
          ],
        },
        {
          name: "银联快捷",
          icon: "bank11",
          list: [
            { key: 0, img: "tutorial_deposit_unionpay_01" },
            { key: 1, img: "tutorial_deposit_unionpay_02" },
            { key: 2, img: "tutorial_deposit_unionpay_03" },
            { key: 3, img: "tutorial_deposit_unionpay_04" },
          ],
        },
        {
          name: "CGPay",
          icon: "bank8",
          list: [
            { key: 0, img: "tutorial_deposit_cgpay_01" },
            { key: 1, img: "tutorial_deposit_cgpay_02" },
            { key: 2, img: "tutorial_deposit_cgpay_03" },
            { key: 3, img: "tutorial_deposit_cgpay_04" },
          ],
          list2: [{ key: 0, img: "tutorial_deposit_cgpay_securitycode_01" }],
          list3: [{ key: 0, img: "tutorial_deposit_cgpay_qrcode_01" }],
        },
        {
          name: "购宝钱包",
          icon: "bank9",
          list: [
            { key: 0, img: "tutorial_deposit_gawa_01" },
            { key: 1, img: "tutorial_deposit_gawa_02" },
            { key: 2, img: "tutorial_deposit_gawa_03" },
          ],
          list2: [
            { key: 0, img: "tutorial_deposit_gawa_qrcode_01" },
            { key: 1, img: "tutorial_deposit_gawa_qrcode_02" },
          ],
        },
        {
          name: "极速-USDT",
          icon: "bank10",
          list: [
            { key: 0, img: "tutorial_deposit_usdt_01" },
            { key: 1, img: "tutorial_deposit_usdt_02" },
          ],
          list2: [
            { key: 0, img: "tutorial_deposit_usdt_qrcode_01" },
            { key: 1, img: "tutorial_deposit_usdt_qrcode_02" },
          ],
        },
      ],
    };
  },

  mounted() {
    this.hasCid = getCookie("cid") || false;

    let vm = this;
    $("#mobile-wrap").scroll(function () {
      if ($(this).scrollTop() > 1) {
        vm.showgo = true;
      } else {
        vm.showgo = false;
      }
    });
  },
  methods: {
    setType(index) {
      this.currentTab = 0;
      this.category_currentIndex = index;
      this.category_isShowPop = false;
      console.log(`this.category_currentIndex is  ${this.category_currentIndex}`)
    },
    toTop() {
      if ($("#mobile-wrap").scrollTop() < 30) {
        $("#mobile-wrap").animate({ scrollTop: 0 }, 200);
      } else {
        $("#mobile-wrap").animate({ scrollTop: 0 }, 1000);
      }
    },

    setCurrentTab(index) {
      switch (index) {
        default:
        case 0:
          this.currentTab = index;
          break;

        case 1:
          this.currentTab = index;
          break;
      }
    },
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
    }),
    tabList() {
      switch (this.currentTab) {
        case 0:
          return this.categorys[this.category_currentIndex].list;
        case 1:
          return this.categorys[this.category_currentIndex].list2;
        case 2:
          return this.categorys[this.category_currentIndex].list3;
        default:
          return this.categorys[this.category_currentIndex].list;
      }
    },
    tabItem() {
      switch (this.category_currentIndex) {
        case 3:
          return [
            {
              key: "transfer-card",
              text: "支付宝快捷",
            },
            {
              key: "scan-code",
              text: this.$text("SCAN_CODE", "截屏扫码"),
            },
          ];
        case 5:
          return [
            {
              key: "transfer-card",
              text: "如何绑定CGPay",
            },
            {
              key: "safe-card",
              text: "安全防护码",
            },
            {
              key: "scan-code",
              text: "扫码支付",
            },
          ];
        case 6:
          return [
            {
              key: "transfer-card",
              text: "如何绑定购宝",
            },
            {
              key: "scan-code",
              text: "扫码支付",
            },
          ];
        case 7:
          return [
            {
              key: "transfer-card",
              text: "如何绑定USDT",
            },
            {
              key: "scan-code",
              text: "扫码支付",
            },
          ];
        default:
          return [
            {
              key: "transfer-card",
              text: this.$text("TRANSFER_CARD", "支付宝转卡"),
            },
            {
              key: "scan-code",
              text: this.$text("SCAN_CODE", "截屏扫码"),
            },
          ];
      }
    },
    tabSlider() {
      switch (this.category_currentIndex) {
        case 5:
          return `calc(16.5% + 33% * ${this.currentTab})`;
        default:
          return `calc(25% + 50% * ${this.currentTab})`;
      }
    },
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      return isApp;
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_HELP_CENTER", "帮助中心"),
      };
    },
  },
};
</script>
<style src="../../css/index.module.scss" lang="scss" module>
