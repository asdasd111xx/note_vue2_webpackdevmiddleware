<template>
  <div :class="$style['vip-info-wrap']">
    <template v-if="currentLevelData && currentLevelData.withdraw_fee">
      <!-- <div :class="$style['title']">VIP {{ currentLevelData.seq }}尊享</div> -->
      <div :class="[$style['title']]">
        {{ `${currentLevelData.alias}尊享` }}
      </div>

      <div :class="$style['cells-block']">
        <div :class="$style['cell']">
          <div :class="$style['cell-icon']">
            <img
              :src="
                themeTPL == 'sg1'
                  ? $getCdnPath(`/static/image/sg1/mcenter/vip/img001.png`)
                  : $getCdnPath(`/static/image/common/vip/pic_vip_1.png`)
              "
              alt="icon"
            />
          </div>
          <div :class="$style['cell-text']">
            <div>
              <span v-if="currentLevelData.withdraw_fee.withdraw_count === 0"
                >无限制</span
              >
              <span
                v-else-if="currentLevelData.withdraw_fee.withdraw_count === ''"
                >--</span
              >
              <span v-else>{{
                currentLevelData.withdraw_fee.withdraw_count
              }}</span>
            </div>
            <div>每日提现次数</div>
          </div>
        </div>

        <div :class="$style['cell']">
          <div :class="$style['cell-icon']">
            <img
              :src="
                themeTPL == 'sg1'
                  ? $getCdnPath(`/static/image/sg1/mcenter/vip/img002.png`)
                  : $getCdnPath(`/static/image/common/vip/pic_vip_2.png`)
              "
              alt="icon"
            />
          </div>
          <div :class="$style['cell-text']">
            <div>
              <div>
                <span
                  v-if="
                    currentLevelData.withdraw_fee.withdraw_limit === '' ||
                      currentLevelData.withdraw_fee.withdraw_limit <= 0
                  "
                  >无限制</span
                >
                <span
                  v-else
                  :class="{
                    [$style['long']]:
                      currentLevelData.withdraw_fee.withdraw_limit &&
                      currentLevelData.withdraw_fee.withdraw_limit.length > 9
                  }"
                >
                  {{
                    formatThousandsCurrency(
                      currentLevelData.withdraw_fee.withdraw_limit
                    )
                  }}
                </span>
              </div>
            </div>
            <div>每日提现额度</div>
          </div>
        </div>

        <div v-if="currentLevelData.gift_amount > 0" :class="$style['cell']">
          <div :class="$style['cell-icon']">
            <img
              :src="
                themeTPL == 'sg1'
                  ? $getCdnPath(`/static/image/sg1/mcenter/vip/img003.png`)
                  : $getCdnPath(`/static/image/common/vip/pic_vip_3.png`)
              "
              alt="icon"
            />
          </div>
          <div :class="$style['cell-text']">
            <div
              :class="{
                [$style['long']]:
                  currentLevelData.withdraw_fee.withdraw_limit &&
                  currentLevelData.withdraw_fee.withdraw_limit.length > 9
              }"
            >
              {{ formatThousandsCurrency(currentLevelData.gift_amount) }}
            </div>
            <div>晋级礼金(晋级自动派发)</div>
          </div>
        </div>

        <div
          v-if="
            currentLevelData.monthly_gift != '0' &&
              currentLevelData.monthly_gift != '-' &&
              currentLevelData.monthly_gift != '' &&
              currentLevelData.monthly_gift != '0/0'
          "
          :class="$style['cell']"
        >
          <div :class="$style['cell-icon']">
            <img
              :src="
                themeTPL == 'sg1'
                  ? $getCdnPath(`/static/image/sg1/mcenter/vip/img004.png`)
                  : $getCdnPath(`/static/image/common/vip/pic_vip_4.png`)
              "
              alt="icon"
            />
          </div>
          <div :class="$style['cell-text']">
            <template>
              <div>
                {{ currentLevelData.monthly_gift_str }}
              </div>
              <div>
                {{ currentLevelData.monthly_memo_1 }}
              </div>
            </template>

            <div :class="$style['special-cell']">
              {{ currentLevelData.monthly_memo_2 }}
            </div>
          </div>
        </div>
        <template v-if="['porn1', 'sg1'].includes(themeTPL)">
          <div v-if="currentLevelData > 0" :class="$style['cell']">
            <div :class="$style['cell-icon']">
              <img
                :src="
                  themeTPL == 'sg1'
                    ? $getCdnPath(`/static/image/sg1/mcenter/vip/img005.png`)
                    : $getCdnPath(`/static/image/common/vip/pic_vip_5.png`)
                "
                alt="icon"
              />
            </div>
            <div :class="$style['cell-text']">
              <div
                :class="{
                  [$style['long']]:
                    currentLevelData.withdraw_fee.withdraw_limit &&
                    currentLevelData.withdraw_fee.withdraw_limit.length > 9
                }"
              >
                {{ formatThousandsCurrency(currentLevelData.birth_amount) }}
              </div>
              <div>生日礼金</div>
            </div>
          </div>
        </template>
      </div>
      <div
        :class="[$style['vip-detail']]"
        @click="openPromotion('promotion_vip')"
      >
        查看VIP详情 》
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import goLangApiRequest from "@/api/goLangApiRequest";
export default {
  props: {
    currentLevelData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      url: ""
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
    routerTPL() {
      //先用ROUTER_TPL判斷aobo
      return this.siteConfig.ROUTER_TPL;
    },
    vipTitle() {
      return localStorage.getItem("iframe-third-url-title") || "";
    }
  },
  created() {
    // this.getTitle();
  },
  methods: {
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    },
    openPromotion(position) {
      if (position === "promotion_vip") {
        this.openPromotionEmbedded(position);
      }
    },
    openPromotionEmbedded(position) {
      //優小祕內嵌連結
      this.$router.push(`/mobile/iframe/vipInfo?func=false&alias=${position}`);
    }
  }
};
</script>

<style
  lang="scss"
  src="@/css/page/vip/porn1.vipInfo.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="@/css/page/vip/sg1.vipInfo.scss"
  module="$style_sg1"
></style>
