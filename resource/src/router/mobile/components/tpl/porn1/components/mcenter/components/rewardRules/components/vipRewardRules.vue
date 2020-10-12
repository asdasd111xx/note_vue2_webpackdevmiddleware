<template>
  <div>
    <div :class="$style['table-container']">
      <div :class="$style['title']">奖励规则</div>
      <div :class="$style['table-wrap']">
        <div :class="$style['table-header']">
          <div :class="$style['header-item']">{{ titleList[0] }}</div>
          <div
            :class="$style['header-item']"
            v-for="(item, index) in rechargeBonusConfig"
            :key="index"
          >
            <div v-if="index == 'monthly'">
              {{ titleList[1] }}<br />赠送彩金
            </div>
            <div v-if="index == 'weekly'">{{ titleList[2] }}<br />赠送彩金</div>
            <div v-if="index == 'first'">{{ titleList[3] }}<br />赠送彩金</div>
          </div>

          <!-- <div :class="$style['table-header']"> -->
          <!-- <div
            v-for="(item, index) in titleList"
            :key="`titleList-${index}`"
            :class="$style['header-item']"
          >
            {{ item }}
          </div> -->
        </div>

        <div :class="$style['table-body']">
          <div
            v-for="(cells, index) in vipRuleData"
            :key="`list-${index}`"
            :class="$style['content']"
          >
            <div
              v-for="(item, index) in cells"
              :key="`cells-${index}`"
              :class="$style['item']"
            >
              <!-- index = 0 為 VIP 等級欄位 -->
              <template v-if="index === 0">
                {{ item === "VIP 0" ? `一般会员(${item})` : item }}
              </template>

              <template v-else>
                {{ commaFormat(item) }}
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../../common/mobileContainer";
import mixin from "@/mixins/mcenter/recharge/recharge";
import axios from "axios";

export default {
  mixins: [mixin],
  components: {
    mobileContainer
  },
  data() {
    return {
      titleList: [
        "特权VIP",
        "每月首转",
        "每周首转",
        "首次转让"
      ],
      //  假資料測試
      //   list: [
      //     ["VIP0", "9元/位", "9元/位", "9元/位"],
      //     ["VIP1", "99元/位", "99元/位", "99元/位"],
      //     ["VIP2", "199元/位", "199元/位", "199元/位"],
      //     ["VIP3", "299元/位", "299元/位", "299元/位"],
      //     ["VIP4", "399元/位", "399元/位", "399元/位"],
      //     ["VIP5", "499元/位", "499元/位", "499元/位"],
      //     ["VIP6", "599元/位", "599元/位", "599元/位"],
      //     ["VIP7", "699元/位", "699元/位", "699元/位"],
      //     ["VIP8", "799元/位", "799元/位", "799元/位"],
      //     ["VIP9", "899元/位", "899元/位", "899元/位"],
      //     ["VIP10", "999元/位", "999元/位", "999元/位"]
      //   ],
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
    vipRuleData() {
      let data = this.rechargeBonusConfig;

      // 確保目前開放的欄位 first / monthly / weekly
      let keys = Object.keys(data);
      // 取 Key 值的欄位設 render 的數量
      let vipNums = data[keys[0]].length;

      let arr = [];

      for (let i = 0; i < vipNums; i++) {
        let tempArr = [data[keys[0]][i].vip_name];

        for (let j = 0; j < keys.length; j++) {
          tempArr.push(data[[keys[j]]][i].bonus + "元/位");
        }

        arr.push(tempArr);
      }

      return arr;
    },
  },
  methods: {
    commaFormat(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/vipDetail/porn1.vipRewardRules.scss"
  module="$style_porn1"
></style>
