<template>
  <div>
    <div :class="$style['table-container']">
      <div :class="$style['title']">活动内容</div>
      <div :class="$style['title-desc']">
        活动期间内，满足累积存款额与全产品累积总有效投注的等级门槛，即可获得晋级金！
        ！达指定等级，每周每月再奖！ ！
      </div>

      <div :class="$style['table-wrap']">
        <div :class="$style['table-header']">
          <div :class="$style['header-item']">
            VIP等级
          </div>
          <div :class="$style['header-item']">当日<br />存款</div>

          <div :class="$style['header-item']">累积<br />存款</div>

          <div :class="$style['header-item']">累积<br />总有效投注</div>

          <div :class="$style['header-item']">90天<br />保级投注</div>

          <div :class="$style['header-item']">晋级<br />礼金</div>

          <div :class="$style['header-item']">
            每周领
          </div>

          <div :class="$style['header-item']">
            每月领
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
            <div v-html="item.content" />
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
      // titleList: [
      //   "VIP等级",
      //   "累积存款",
      //   "累积投注",
      //   "90天 保级投注",
      //   "晋级礼金",
      //   "每周领",
      //   "每月领"
      // ],
      list: [
        ["VIP10", "1万", "1.25亿", "10亿", "1,100万", "100万", "9,000", "1.5万"],
        ["VIP9", "1万", "6,250万", "5亿", "500万", "50万", "5,000", "7,000"],
        ["VIP8", "5,000", "1,875万", "1.5亿", "100万", "15.5万", "1,500", "2,000"],
        ["VIP7", "5,000", "250万", "2,000万", "20万", "1.88万", "200", "-"],
        ["VIP6", "1,000", "75万", "600万", "6万", "5,000", "60", "-"],
        ["VIP5", "1,000", "12.5万", "100万", "1万", "1,000", "10", "-"],
        ["VIP4", "500", "1.25万", "10万", "1,000", "120", "-", "-"],
        ["VIP3", "500", "2,500", "2万", "200", "50", "-", "-"],
        ["VIP2", "100", "750", "6,000", "60", "20", "-", "-"],
        ["VIP1", "100", "250", "2,000", "20", "10", "-", "-"],
        ["VIP0", "-", "-", "-", "-", "-", "-"]
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
            "累积全产品总有效投注达相对应级别门槛，即可晋级相对应的VIP等级，等级更新时间为北京时间每日下午4点。"
        },
        {
          number: "❷",
          title: "晋级顺序",
          content: "VIP等级可越级晋级。"
        },
        {
          number: "❸",
          title: "当日存款计算区间",
          content:
            "北京时间当日中午12点-隔日中午12点。"
        },
        {
          number: "❹",
          title: "保级要求",
          content:
            "会员在达到该VIP等级后，90天内需达到保级投注门槛，在此期间完成晋级保级要求。"
        },
        {
          number: "❺",
          title: "降级标准",
          content:
            "如未在90天内完成相对应保级要求，系统会自动降级一个等级，每周、每月红包也会调整至降级后的等级。"
        },
        {
          number: "❻",
          title: "晋级礼金",
          content:
            "会员在达到该VIP等级后系统自动派发，每个级别的晋级礼金仅能领取1次。"
        },
        {
          number: "❼",
          title: "每周红包",
          content:
            "会员当周达该等级门槛，请于隔周一下午5点后前往【优惠活动】-【领取优惠】自动领取，并于截止日前领取(领奖区间为1周)，逾其视同放弃，可使用【亿元】任何游戏，打码3倍即可出款。"
        },
        {
          number: "❽",
          title: "每月红包",
          content:
            "会员当月达该等级门槛，请于每月1号下午5点后前往【优惠活动】-【领取优惠】自动领取，并于截止日前领取(领奖区间为1周)，逾其视同放弃，可使用【亿元】任何游戏，打码3倍即可出款。"
        },
        {
          number: "❾",
          title: `${this.siteConfig.SITE_NAME}保有本活动执行、修正、解释及终止等权力。`,
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

<style
  lang="scss"
  src="@/css/page/vipDetail/porn1.index.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="@/css/page/vipDetail/ey1.index.scss"
  module="$style_ey1"
></style>
