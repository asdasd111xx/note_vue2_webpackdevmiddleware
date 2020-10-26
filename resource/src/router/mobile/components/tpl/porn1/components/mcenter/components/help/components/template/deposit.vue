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
            :src="
              $getCdnPath(`/static/image/porn1/mcenter/help/ic_arrow_next.png`)
            "
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
              :src="
                $getCdnPath(
                  `/static/image/porn1/mcenter/help/ic_arrow_next.png`
                )
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="category_currentIndex == 5"
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
            left: `calc(25% + 50% * ${currentTab})`,
          }"
        />
      </div>
    </div>

    <div v-if="currentTab == 0">
      <div
        v-for="(item, index) in categorys[category_currentIndex].list"
        :id="`q-${index}`"
        :class="$style['cell2']"
        :key="`q-${index}`"
      >
        <div :class="$style['cell2-step-title']">
          <span
            >步骤 {{ index + 1 }}/{{
              categorys[category_currentIndex].list.length
            }}</span
          >
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
    </div>

    <div v-if="currentTab == 1">
      <div
        v-for="(item, index) in categorys[category_currentIndex].list2"
        :id="`q-${index}`"
        :class="$style['cell2']"
        :key="`q-${index}`"
      >
        <div :class="$style['cell2-step-title']">
          <span
            >步骤 {{ index + 1 }}/{{
              categorys[category_currentIndex].list2.length
            }}</span
          >
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
          name: "网银支付",
          icon: "bank1",
          list: [
            { key: 0, img: "bank1_step1" },
            { key: 1, img: "bank1_step2" },
          ],
        },
        {
          name: "工商银行",
          icon: "bank2",
          list: [
            { key: 0, img: "bank2_step1" },
            { key: 1, img: "bank2_step2" },
          ],
        },
        {
          name: "建设银行",
          icon: "bank3",
          list: [
            { key: 0, img: "bank3_step1" },
            { key: 1, img: "bank3_step2" },
          ],
        },
        {
          name: "招商银行",
          icon: "bank4",
          list: [
            { key: 0, img: "bank4_step1" },
            { key: 1, img: "bank4_step2" },
          ],
        },
        {
          name: "微信",
          icon: "bank5",
          list: [
            { key: 0, img: "bank5_step1" },
            { key: 1, img: "bank5_step2" },
            { key: 2, img: "bank5_step3" },
            { key: 3, img: "bank5_step4" },
            { key: 4, img: "bank5_step5" },
            { key: 5, img: "bank5_step6" },
          ],
        },
        {
          name: "支付宝",
          icon: "bank6",
          list: [
            { key: 0, img: "bank6_step0_1" },
            { key: 1, img: "bank6_step0_2" },
            { key: 2, img: "bank6_step0_3" },
          ],
          list2: [
            { key: 0, img: "bank6_step1_1" },
            { key: 1, img: "bank6_step1_2" },
          ],
        },
        {
          name: "代客充值",
          icon: "bank7",
          list: [
            { key: 0, img: "bank7_step1" },
            { key: 1, img: "bank7_step2" },
          ],
        },
      ],
    };
  },

  mounted() {
    this.hasCid = getCookie("cid") || false;
    document.title = this.$text("S_HELP_CENTER", "帮助中心");

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
    tabItem() {
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
