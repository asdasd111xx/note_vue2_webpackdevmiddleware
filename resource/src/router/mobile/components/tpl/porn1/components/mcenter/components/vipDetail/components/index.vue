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
          ※当日返水将会在次日北京时间16：00-16：30派发
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
        "熱門返水"
      ],
      list: [
        ["VIP0", "0.3%", "0.3%", "0.3%", "2.0%", "1.0%", "3%"],
        ["VIP1", "0.4%", "0.4%", "0.4%", "2.1%", "1.1%", "3%"],
        ["VIP2", "0.5%", "0.5%", "0.5%", "2.2%", "1.2%", "3%"],
        ["VIP3", "0.6%", "0.6%", "0.6%", "2.3%", "1.3%", "3%"],
        ["VIP4", "0.7%", "0.7%", "0.7%", "2.4%", "1.4%", "3%"],
        ["VIP5", "0.8%", "0.8%", "0.8%", "2.5%", "1.5%", "3%"],
        ["VIP6", "0.9%", "0.9%", "0.9%", "2.6%", "1.6%", "3%"],
        ["VIP7", "1.0%", "1.0%", "1.0%", "2.7%", "1.7%", "3%"],
        ["VIP8", "1.1%", "1.1%", "1.1%", "2.8%", "1.8%", "3%"],
        ["VIP9", "1.2%", "1.2%", "1.2%", "2.9%", "1.9%", "3%"],
        ["VIP10", "1.3%", "1.3%", "1.3%", "3.0%", "2.0%", "3%"]
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
          title: "晋级礼金",
          content:
            "晋级礼金在会员达到该会员等级后系统自动派发，每个级别的晋级礼金，每位会员仅能领取1次。"
        },
        {
          number: "❹",
          title: "生日礼金",
          content:
            "将会在生日的隔月5日前，系统自动派发。每年仅可领取一次。(生日彩金1倍流水即可提現)"
        },
        {
          number: "❺",
          title: "每月红包",
          content:
            "会员在上个月有过至少1次的成功充值，即可在每月5号获得上个月相应等级的每月红包彩金。"
        },
        {
          number: "❻",
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

<style lang="scss" src="@/css/page/vipDetail/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="@/css/page/vipDetail/ey1.index.scss" module="$style_ey1"></style>
