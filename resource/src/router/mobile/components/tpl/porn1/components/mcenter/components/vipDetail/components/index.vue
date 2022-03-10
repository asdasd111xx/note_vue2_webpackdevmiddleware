<template>
  <div>
    <div :class="$style['table-container']">
      <template v-if="['porn1', 'sg1'].includes(this.themeTPL)">
        <div :class="$style['title']">VIP尊享</div>
      </template>
      <!-- VIP尊享表格 -->
      <div :class="$style['table-wrap']">
        <div :class="$style['table-header']" :style="rowColumn2">
          <div
            v-for="(item, index) in detailData.titleList2"
            :key="`titleList-${index}`"
            :class="[$style['header-item'], $style['new']]"
          >
            {{ item }}
          </div>
        </div>

        <div :class="$style['table-body']">
          <div
            v-for="(cells, index) in detailData.vipList2"
            :key="`list-${index}`"
            :class="$style['content']"
            :style="rowColumn2"
          >
            <div
              v-for="(item, num) in cells"
              :key="`cells-${num}`"
              :class="$style['item']"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <!-- Content-Title -->
      <template v-if="['porn1', 'sg1'].includes(this.themeTPL)">
        <div :class="$style['title']">返水比例</div>
      </template>

      <!-- Content -->

      <!-- 返水比例表格 -->
      <div :class="$style['table-wrap']">
        <div :class="$style['table-header']" :style="rowColumn">
          <div
            v-for="(item, index) in detailData.titleList"
            :key="`titleList-${index}`"
            :class="$style['header-item']"
          >
            {{ item }}
          </div>
        </div>

        <div :class="$style['table-body']">
          <div
            v-for="(cells, index) in detailData.vipList"
            :key="`list-${index}`"
            :class="$style['content']"
            :style="rowColumn"
          >
            <div
              v-for="(item, num) in cells"
              :key="`cells-${num}`"
              :class="$style['item']"
            >
              {{ item }}
            </div>
          </div>
        </div>

        <template v-if="['porn1', 'sg1'].includes(this.routerTPL)">
          <div :class="$style['table-desc']">
            ※当日返水将会在次日北京时间16：00-16：30派发
          </div>
        </template>
        <template v-else>
          <div :class="$style['table-desc']">
            ※当日返水将会在次日北京时间15：00-15：30派发
          </div>
        </template>
      </div>

      <!-- Content-Rule -->
      <div :class="$style['desc-wrap']">
        <div :class="$style['title-play']">活动的一般条款与规则</div>
        <div :class="$style['content']">
          <div
            v-for="(item, index) in detailData.ruleList"
            :key="`ruleList-${index}`"
            :class="$style['cell']"
          >
            <span>{{ item.number }}</span>
            <span>{{ item.title }}</span>
            <div>{{ item.content }}</div>
            <div v-if="item.note">{{ item.note }}</div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style['back-top']" @click="backToTop">
      <img
        :src="
          $getCdnPath(
            `/static/image/common/vip/detail/ic_top_${
              themeTPL === 'sg1' ? 'g' : 'blue'
            }.png`
          )
        "
        alt="top"
      />
      <p>回到顶部</p>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters } from "vuex";
import mobileContainer from "../../../../common/mobileContainer";
import yaboData from "./json/yabo.json";
import sgData from "./json/sg.json";
import aoboData from "./json/aobo.json";

export default {
  components: {
    mobileContainer
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    rowColumn() {
      let count = this.detailData.titleList.length;

      let rowColumn = {};

      switch (this.themeTPL) {
        // 絲瓜 Vip 有 Icon
        case "sg1":
          rowColumn = {
            gridTemplateColumns: `70px repeat(${count - 1} ,1fr)`
          };
          break;

        default:
          rowColumn = {
            gridTemplateColumns: `45px repeat(${count - 1} ,1fr)`
          };
          break;
      }

      return rowColumn;
    },
    rowColumn2() {
      return {
        gridTemplateColumns: `45px repeat(6 ,1fr)`
      };
    },
    detailData() {
      let data = {
        titleList: [],
        vipList: [],
        ruleList: [],
        titleList2: [],
        vipList2: []
      };
      switch (this.routerTPL) {
        case "aobo1":
          data.titleList = aoboData.titleList;
          data.vipList = aoboData.vipList;
          data.titleList2 = aoboData.titleList2;
          data.vipList2 = aoboData.vipList2;
          data.ruleList = [
            {
              number: "❶",
              title: "晋级标准",
              content:
                "会员的累计充值以及累计流水达到相应级别的要求。即可在次日15点晋级相应的VIP等级。"
            },
            {
              number: "❷",
              title: "晋级顺序",
              content:
                "VIP等级达到相应的要求可每天晋级一级，但VIP等级不可越级晋级。"
            },
            {
              number: "❸",
              title: "保级要求",
              content:
                "会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算。"
            },
            {
              number: "❹",
              title: "晋级礼金",
              content:
                "晋级礼金在会员达到该会员等级后系统自动派发，每个级别的晋级礼金，每位会员仅能领取1次。(晋级礼金12倍流水即可提现)"
            },
            {
              number: "❺",
              title: "生日礼金",
              content:
                "将会在生日的隔月的第2个周四系统自动派发。每年仅可领取一次。(生日彩金12倍流水即可提现)"
            },
            {
              number: "❻",
              title: "每月红包",
              content:
                "会员在上个月有过至少3次的成功充值，即可在每月15号前获得上个月相应等级的每月红包彩金。(每月红包12倍流水即可提现)"
            },
            {
              number: "❼",
              title: `${this.siteConfig.SITE_NAME}保留对活动的修改，停止及最终解释权。`,
              content: ""
            }
          ];
          break;
        case "porn1":
        case "sg1":
          data.titleList =
            this.themeTPL === "porn1" ? yaboData.titleList : sgData.titleList;

          data.vipList =
            this.themeTPL === "porn1" ? yaboData.vipList : sgData.vipList;

          data.ruleList = [
            {
              number: "❶",
              title: "晋级标准",
              content:
                "会员的累计充值以及累计流水达到相应级别的要求。即可在次日04点晋级相应的VIP等级。"
            },
            {
              number: "❷",
              title: "晋级顺序",
              content:
                "VIP等级达到相应的要求可每天晋级一级，但VIP等级不可越级晋级。"
            },
            {
              number: "❸",
              title: "保级要求",
              content:
                "会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算。"
            },
            {
              number: "❹",
              title: "晋级礼金",
              content: `晋级礼金在会员达到该会员等级后系统自动派发，每个级别的晋级礼金，每位会员仅能领取1次。(${
                this.themeTPL === "porn1"
                  ? "晋级礼金12倍流水即可提现"
                  : this.themeTPL === "sg1"
                  ? "晋级礼金8倍流水即可提现"
                  : null
              })`
            },
            {
              number: "❺",
              title: "生日礼金",
              content: `将会在生日的隔月的第2个周四系统自动派发。每年仅可领取一次。(${
                this.themeTPL === "porn1"
                  ? "生日彩金12倍流水即可提现"
                  : this.themeTPL === "sg1"
                  ? "生日彩金8倍流水即可提现"
                  : null
              })`
            },
            {
              number: "❻",
              title: "每月红包",
              content: `会员在上个月有过至少3次成功充值且累计充值 ≧ 当月VIP相应等级的红包金额，即可于每月的第1个周四获得上半月红包，每月的第3个周四前获得下半月红包！(${
                this.themeTPL === "porn1"
                  ? "每月红包12倍流水即可提现"
                  : this.themeTPL === "sg1"
                  ? "每月红包8倍流水即可提现"
                  : null
              })`,
              note: `※成功充值判断条件:【第三方入款、银行卡入款、数字货币（含电子钱包）】渠道所进行的充值。`
            },
            {
              number: "❼",
              title: `${
                this.routerTPL === "aobo1"
                  ? "澳博国际"
                  : this.siteConfig.SITE_NAME
              }保留对活动的修改，停止及最终解释权。`,
              content: ""
            }
          ];
          break;
      }

      return data;
    }
  },
  methods: {
    backToTop() {
      $("#mobile-wrap").animate({ scrollTop: 0 }, 1000);
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/vipDetail/porn1.index.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="@/css/page/vipDetail/sg1.index.scss"
  module="$style_sg1"
></style>
