<template>
  <div>
    <div :class="$style['table-container']">
      <div :class="$style['title']">返水比例</div>

      <div :class="$style['table-wrap']">
        <div :class="$style['table-header']">
          <div
            v-for="(item, index) in titleList"
            :key="`titleList-${index}`"
            :class="$style['header-item']"
          >
            {{ item }}
          </div>
        </div>

        <div :class="$style['table-body']">
          <div
            v-for="(cells, index) in list"
            :key="`list-${index}`"
            :class="$style['content']"
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

        <div :class="$style['table-desc']">
          ※每日返水将会在每日04:00-04:30派发
        </div>
      </div>

      <div :class="$style['desc-wrap']">
        <div :class="$style['title']">活动的一般条款与规则</div>
        <div :class="$style['content']">
          <div
            v-for="(item, index) in contentList"
            :key="`contentList-${index}`"
            :class="$style['cell']"
          >
            <span>{{ item.number }}</span>
            <span>{{ item.title }}</span>
            <div>{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style['back-top']" @click="backToTop">
      <img
        :src="
          $getCdnPath(
            `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/vip/detail/ic_top.png`
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

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      titleList: [
        "VIP等级",
        "体育返水",
        "电竞返水",
        "视讯返水",
        "电子返水",
        "棋牌返水",
        "返水上限"
      ],
      list: [
        ["VIP0", "0.38%", "0.48%", "0.40%", "0.80%", "0.55%", "10,888"],
        ["VIP1", "0.38%", "0.48%", "0.45%", "0.90%", "0.60%", "12,888"],
        ["VIP2", "0.38%", "0.48%", "0.45%", "0.90%", "0.75%", "16,888"],
        ["VIP3", "0.40%", "0.55%", "0.55%", "0.95%", "0.80%", "18,888"],
        ["VIP4", "0.45%", "0.55%", "0.55%", "0.95%", "0.85%", "28,888"],
        ["VIP5", "0.45%", "0.55%", "0.60%", "1.00%", "0.90%", "38,888"],
        ["VIP6", "0.50%", "0.60%", "0.65%", "1.00%", "0.95%", "58,888"],
        ["VIP7", "0.55%", "0.70%", "0.70%", "1.10%", "1.00%", "88,888"],
        ["VIP8", "0.68%", "0.80%", "0.75%", "1.10%", "1.05%", "128,888"],
        ["VIP9", "0.80%", "0.90%", "0.85%", "1.20%", "1.10%", "188,888"],
        ["VIP10", "1.00%", "1.10%", "1.00%", "1.20%", "1.20%", "388,888"]
      ]
    };
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
    contentList() {
      let list = [
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
            "会员在达到某VIP等级后，90天内需达到相对应的推广会员人数，如果在此期间完成晋级保级要求。"
        },
        {
          number: "❹",
          title: "降级标准",
          content:
            "如果会员在一个季度(90天计算)内没有完成相应的保级要求，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级。"
        },
        {
          number: "❺",
          title: "晋级礼金",
          content:
            "晋级礼金在会员达到该会员等级后系统自动派发，每个级别的晋级礼金，每位会员仅能领取1次。"
        },
        {
          number: "❻",
          title: "生日礼金",
          content:
            "将会在生日的隔月5日前，系统自动派发。每年仅可领取一次。(生日彩金1倍流水即可提現)"
        },
        {
          number: "❼",
          title: "每月红包",
          content:
            "会员在上个月有过至少1次的成功充值，即可在每月1号获得上个月相应等级的每月红包彩金。"
        },
        {
          number: "❽",
          title: `${this.siteConfig.SITE_NAME}保留对活动的修改，停止及最终解释权。`,
          content: ""
        }
      ];
      return list;
    }
  },
  methods: {
    backToTop() {
      $("#mobile-wrap").animate({ scrollTop: 0 }, 1000);
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.index.scss" module="$style_ey1"></style>
