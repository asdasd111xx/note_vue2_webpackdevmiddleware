<template>
  <div :class="$style['vip-info-wrap']">
    <template v-if="currentLevelData && currentLevelData.withdraw_fee">
      <!-- <div :class="$style['title']">VIP {{ currentLevelData.seq }}尊享</div> -->
      <div :class="$style['title']">{{ `${currentLevelData.alias}尊享` }}</div>

      <div :class="$style['cells-block']">
        <div :class="$style['cell']">
          <div :class="$style['cell-icon']">
            <img
              :src="$getCdnPath(`/static/image/common/vip/pic_vip_1.png`)"
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
              :src="$getCdnPath(`/static/image/common/vip/pic_vip_2.png`)"
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
                <span v-else>
                  {{ currentLevelData.withdraw_fee.withdraw_limit }}
                </span>
              </div>
            </div>
            <div>每日提现额度</div>
          </div>
        </div>

        <div :class="$style['cell']">
          <div :class="$style['cell-icon']">
            <img
              :src="$getCdnPath(`/static/image/common/vip/pic_vip_3.png`)"
              alt="icon"
            />
          </div>
          <div :class="$style['cell-text']">
            <div>{{ currentLevelData.gift_amount }}</div>
            <div>晋级礼金(晋级自动派发)</div>
          </div>
        </div>

        <div :class="$style['cell']">
          <div :class="$style['cell-icon']">
            <img
              :src="$getCdnPath(`/static/image/common/vip/pic_vip_4.png`)"
              alt="icon"
            />
          </div>
          <div :class="$style['cell-text']">
            <template v-if="['porn1', 'sg1'].includes(themeTPL)">
              <div>
                {{
                  currentLevelData.monthly_gift == ""
                    ? "--"
                    : currentLevelData.monthly_gift
                }}
              </div>
              <div>每月红包(月初自动派发)</div>
            </template>

            <template v-if="['ey1'].includes(themeTPL)">
              <div>{{ currentLevelData.weekly_gift }}</div>
              <div>每周红包(周一自动派发)</div>
            </template>
          </div>
        </div>

        <div v-if="['porn1', 'sg1'].includes(themeTPL)" :class="$style['cell']">
          <div :class="$style['cell-icon']">
            <img
              :src="$getCdnPath(`/static/image/common/vip/pic_vip_5.png`)"
              alt="icon"
            />
          </div>
          <div :class="$style['cell-text']">
            <div>{{ currentLevelData.birth_amount }}</div>
            <div>生日礼金</div>
          </div>
        </div>

        <div v-if="['ey1'].includes(themeTPL)" :class="$style['cell']">
          <div :class="$style['cell-icon']">
            <img
              :src="$getCdnPath(`/static/image/common/vip/pic_vip_4.png`)"
              alt="icon"
            />
          </div>
          <div :class="$style['cell-text']">
            <div>
              {{
                currentLevelData.monthly_gift == ""
                  ? "--"
                  : currentLevelData.monthly_gift
              }}
            </div>
            <div>每月红包(月初自动派发)</div>
          </div>
        </div>
      </div>

      <div
        :class="$style['vip-detail']"
        @click="$router.push('/mobile/mcenter/accountVIP/detail')"
      >
        查看VIP详情 》
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    currentLevelData: {
      type: Object,
      required: true
    }
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
  src="@/css/page/vip/ey1.vipInfo.scss"
  module="$style_ey1"
></style>
<style
  lang="scss"
  src="@/css/page/vip/sg1.vipInfo.scss"
  module="$style_sg1"
></style>
