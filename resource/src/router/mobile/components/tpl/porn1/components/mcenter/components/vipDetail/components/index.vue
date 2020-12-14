<template>
  <div>
    <div :class="$style['table-container']">
      <!-- Content-Title -->
      <template v-if="['porn1', 'sg1'].includes(this.themeTPL)">
        <div :class="$style['title']">返水比例</div>
      </template>

      <!-- Content -->
      <template v-if="['ey1'].includes(this.themeTPL)">
        <div :class="$style['title']">活动内容</div>
        <div :class="$style['title-desc']">
          活动期间内，满足累积存款额与全产品累积总有效投注的等级门槛，即可获得晋级金！达指定等级，每周每月再领奖！！
        </div>
      </template>

      <div :class="$style['table-wrap']">
        <div :class="$style['table-header']">
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

        <template v-if="['porn1', 'sg1'].includes(this.themeTPL)">
          <div :class="$style['table-desc']">
            ※当日返水将会在次日北京时间16：00-16：30派发
          </div>
        </template>
      </div>

      <!-- Content-Rule -->
      <div :class="$style['desc-wrap']">
        <div :class="$style['title']">活动的一般条款与规则</div>
        <div :class="$style['content']">
          <div
            v-for="(item, index) in detailData.ruleList"
            :key="`ruleList-${index}`"
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
            `/static/image/common/vip/detail/ic_top.png`
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
      list: [
        ["VIP0", "0.3%", "0.3%", "2.0%", "0.8%", "1.0%", "3%"],
        ["VIP1", "0.4%", "0.4%", "2.1%", "1.0%", "1.1%", "3%"],
        ["VIP2", "0.5%", "0.5%", "2.2%", "1.2%", "1.2%", "3%"],
        ["VIP3", "0.6%", "0.6%", "2.3%", "1.3%", "1.3%", "3%"],
        ["VIP4", "0.7%", "0.7%", "2.4%", "1.4%", "1.4%", "3%"],
        ["VIP5", "0.8%", "0.8%", "2.5%", "1.5%", "1.5%", "3%"],
        ["VIP6", "0.9%", "0.9%", "2.6%", "1.6%", "1.6%", "3%"],
        ["VIP7", "1.0%", "1.0%", "2.7%", "1.7%", "1.7%", "3%"],
        ["VIP8", "1.1%", "1.1%", "2.8%", "1.8%", "1.8%", "3%"],
        ["VIP9", "1.2%", "1.2%", "2.9%", "1.9%", "1.9%", "3%"],
        ["VIP10", "1.3%", "1.3%", "3.0%", "2.0%", "2.0%", "3%"]
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
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    detailData() {
      let data = {
        titleList: [],
        vipList: [],
        ruleList: []
      };

      switch (this.themeTPL) {
        case "porn1":
        case "sg1":
          data.titleList = [
            "VIP等级",
            "体育电竞",
            "视讯返水",
            "电子返水",
            "捕鱼返水",
            "棋牌返水",
            "热门返水"
          ];

          data.vipList = [
            ["VIP0", "0.3%", "0.3%", "2.0%", "0.8%", "1.0%", "3%"],
            ["VIP1", "0.4%", "0.4%", "2.1%", "1.0%", "1.1%", "3%"],
            ["VIP2", "0.5%", "0.5%", "2.2%", "1.2%", "1.2%", "3%"],
            ["VIP3", "0.6%", "0.6%", "2.3%", "1.3%", "1.3%", "3%"],
            ["VIP4", "0.7%", "0.7%", "2.4%", "1.4%", "1.4%", "3%"],
            ["VIP5", "0.8%", "0.8%", "2.5%", "1.5%", "1.5%", "3%"],
            ["VIP6", "0.9%", "0.9%", "2.6%", "1.6%", "1.6%", "3%"],
            ["VIP7", "1.0%", "1.0%", "2.7%", "1.7%", "1.7%", "3%"],
            ["VIP8", "1.1%", "1.1%", "2.8%", "1.8%", "1.8%", "3%"],
            ["VIP9", "1.2%", "1.2%", "2.9%", "1.9%", "1.9%", "3%"],
            ["VIP10", "1.3%", "1.3%", "3.0%", "2.0%", "2.0%", "3%"]
          ];

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
              title: "晋级礼金",
              content:
                "晋级礼金在会员达到该会员等级后系统自动派发，每个级别的晋级礼金，每位会员仅能领取1次。(晋级礼金12倍流水即可提现)"
            },
            {
              number: "❹",
              title: "生日礼金",
              content:
                "将会在生日的隔月5日前，系统自动派发。每年仅可领取一次。(生日彩金12倍流水即可提现)"
            },
            {
              number: "❺",
              title: "每月红包",
              content:
                "会员在上个月有过至少1次的成功充值，即可在每月5号获得上个月相应等级的每月红包彩金。(每月红包12倍流水即可提现)"
            },
            {
              number: "❻",
              title: `${this.siteConfig.SITE_NAME}保留对活动的修改，停止及最终解释权。`,
              content: ""
            }
          ];
          break;

        case "ey1":
          data.titleList = [
            "VIP等级",
            "当日存款",
            "累积存款",
            "累积总有效投注",
            "90天保级投注",
            "晋级礼金",
            "每周领",
            "每周领"
          ];

          data.vipList = [
            [
              "VIP10",
              "1万",
              "1.25亿",
              "10亿",
              "1,100万",
              "100万",
              "9,000",
              "1.5万"
            ],
            [
              "VIP9",
              "1万",
              "6,250万",
              "5亿",
              "500万",
              "50万",
              "5,000",
              "7,000"
            ],
            [
              "VIP8",
              "5,000",
              "1,875万",
              "1.5亿",
              "100万",
              "15.5万",
              "1,500",
              "2,000"
            ],
            ["VIP7", "5,000", "250万", "2,000万", "20万", "1.88万", "200", "-"],
            ["VIP6", "1,000", "75万", "600万", "6万", "5,000", "60", "-"],
            ["VIP5", "1,000", "12.5万", "100万", "1万", "1,000", "10", "-"],
            ["VIP4", "500", "1.25万", "10万", "1,000", "120", "-", "-"],
            ["VIP3", "500", "2,500", "2万", "200", "50", "-", "-"],
            ["VIP2", "100", "750", "6,000", "60", "20", "-", "-"],
            ["VIP1", "100", "250", "2,000", "20", "10", "-", "-"],
            ["VIP0", "-", "-", "-", "-", "-", "-", "-"]
          ];

          data.ruleList = [
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
              content: "北京时间当日中午12点-隔日中午12点。"
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
                "会员在达到该VIP等级后系统自动派发，每个级别的晋级礼金仅能领取1次。可使用【亿元】任何游戏，打码3倍即可出款。"
            },
            {
              number: "❼",
              title: "每周红包",
              content:
                "会员当周达该等级门槛，于隔周一下午6点后系统自动派发，可使用【亿元】任何游戏，打码3倍即可出款。"
            },
            {
              number: "❽",
              title: "每月红包",
              content:
                "会员当月达该等级门槛，于每月1号下午6点后系统自动派发，可使用【亿元】任何游戏，打码3倍即可出款。"
            },
            {
              number: "❾",
              title: `${this.siteConfig.SITE_NAME}保有本活动执行、修正、解释及终止等权力。`,
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
  src="@/css/page/vipDetail/ey1.index.scss"
  module="$style_ey1"
></style>
<style
  lang="scss"
  src="@/css/page/vipDetail/sg1.index.scss"
  module="$style_sg1"
></style>
