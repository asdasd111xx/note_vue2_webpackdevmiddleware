<template>
  <div>
    <div :class="$style['table-container']">
      <div :class="$style['title']">奖励规则</div>
      <div :class="$style['table-wrap']">
        <div :class="$style['table-header']">
          <div :class="$style['header-item']">{{titleList[0]}}</div>
          <div :class="$style['header-item']" v-for="(item, index) in rechargeBonusConfig" :key="index"> 
            <div v-if="index=='monthly'">
              {{titleList[1]}}
            </div>
            <div v-if="index=='weekly'">
              {{titleList[2]}}
            </div>
            <div v-if="index=='first'">
              {{titleList[3]}}
            </div>
          </div>
        
        <!-- <div :class="$style['table-header']">
          <div
            v-for="(item, index) in titleList"
            :key="`titleList-${index}`"
            :class="$style['header-item']"
          >
            {{ item }}
          </div> -->
        </div>

        <div :class="$style['table-body']">
        <div v-if='rechargeConfig.first_bonus_enable==true'>
          <div :class="$style['content']" v-for="(item, index) in rechargeBonusConfig" :key="index"> 
            <span :class="$style['item']" v-for="(vip, index_vip) in item" :key="index_vip">
              <div v-if="index=='first'">
                {{vip.vip_name}}
              </div>
            </span>
          </div> 
        </div>
        <div v-if='rechargeConfig.first_bonus_enable==false'>
          <div :class="$style['promotion-tips']" v-for="(item, index) in rechargeBonusConfig" :key="index"> 
            <span v-for="(vip, index_vip) in item" :key="index_vip">
              <div v-if="index=='monthly'">
                {{vip.vip_name}}
              </div>
              <div v-else>
                {{vip.vip_name}}
              </div>
            </span>
          </div> 
        </div>
        </div>

    <div :class="$style['table-body']">
    <div :class="$style['content']" v-for="(item, index) in rechargeBonusConfig" :key="index"> 
        <span v-for="(vip, index_vip) in item" :key="index_vip">
          <template v-if="index=='first'">
              <div v-if="rechargeConfig.first_bonus_enable==true">
              {{vip.bonus}}元/位
              </div>
          </template>
          <template v-if="index=='monthly'">
              <div v-if="rechargeConfig.monthly_bonus_enable==true">{{vip.bonus}}元/位</div>
          </template>
          <template v-if="index=='weekly'">
              <div v-if="rechargeConfig.weekly_bonus_enable==true">
                {{vip.bonus}}元/位 </div>
          </template>       
          </span>
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
              {{item}}
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
import mixin from '@/mixins/mcenter/recharge/recharge';
import axios from 'axios';

export default {
  mixins: [mixin],
  components: {
    mobileContainer,
  },
  data() {
    return {
      titleList: [
        "VIP等级",
        "每月首转赠送彩金",
        "每周首转赠送彩金",
        "终身首转赠送彩金",
        
      ],
      list: [
        ["VIP0", "9元/位", "9元/位", "9元/位"],
        ["VIP1", "99元/位", "99元/位", "99元/位"],
        ["VIP2", "199元/位", "199元/位", "199元/位"],
        ["VIP3", "299元/位", "299元/位", "299元/位"],
        ["VIP4", "399元/位", "399元/位", "399元/位"],
        ["VIP5", "499元/位", "499元/位", "499元/位"],
        ["VIP6", "599元/位", "599元/位", "599元/位"],
        ["VIP7", "699元/位", "699元/位", "699元/位"],
        ["VIP8", "799元/位", "799元/位", "799元/位"],
        ["VIP9", "899元/位", "899元/位", "899元/位"],
        ["VIP10", "999元/位", "999元/位", "999元/位"]
      ],
      
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

  },
  methods: {
  }
};
</script>

<style lang="scss" src="@/css/page/vipDetail/porn1.vipRewardRules.scss" module="$style_porn1"></style>

