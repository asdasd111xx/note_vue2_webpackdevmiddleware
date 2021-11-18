<template>
  <div :class="sliderClass">
    <div :class="[$style['serial-header'], [$style[themeTPL]]]">
      <div :class="$style['btn-prev']">
        <img
          :src="
            $getCdnPath(
              `/static/image/common/btn_back_${
                themeTPL === 'porn1'
                  ? 'grey'
                  : themeTPL === 'ey1'
                  ? 'white'
                  : themeTPL === 'sg1'
                  ? 'black'
                  : null
              }.png`
            )
          "
          @click="onClose()"
        />
      </div>
      <span :class="$style['title']">
        {{ $text("S_SERIAL_CHECK", "流水检查") }}</span
      >
    </div>
    <div :class="[$style['serial-number-wrap']]">
      <div :class="$style['serial-time']">
        {{ $text("S_CHECK_TIME", "检查时间") }}：{{ getNowTime() }}
      </div>

      <div
        :class="[$style['basic-info-wrap'], 'clearfix']"
        v-if="serialNumberData && serialNumberData.total"
      >
        <div :class="$style['serial-basic-cell']">
          <div :class="$style['serial-basic-title']">
            {{ $text("S_SERIAL_CHANGE", "流水要求") }}
          </div>
          <div :class="$style['serial-basic-value']">
            {{ formatThousandsCurrency(serialNumberData.total.audit_amount) }}
          </div>
        </div>

        <div :class="$style['serial-basic-cell']">
          <div :class="$style['serial-basic-title']">
            {{ $text("S_SERIAL_POOR", "流水不足") }}
          </div>
          <div :class="$style['serial-basic-value']">
            {{
              formatThousandsCurrency(serialNumberData.total.audit_amount_lack)
            }}
          </div>
        </div>

        <div :class="$style['serial-basic-hr']" />

        <div :class="$style['serial-basic-cell']">
          <div :class="$style['serial-basic-title']">
            扣除行政费用({{
              `${formatThousandsCurrency(
                serialNumberData.administrative_rate
              )}%`
            }})
          </div>
          <div :class="$style['serial-basic-value']">
            {{
              serialNumberData.total.administrative_amount > 0
                ? `-${formatThousandsCurrency(
                    serialNumberData.total.administrative_amount
                  )}`
                : `0.00`
            }}
          </div>
        </div>
        <div :class="$style['serial-basic-cell']">
          <div :class="$style['serial-basic-title']">
            扣除优惠
          </div>
          <div :class="$style['serial-basic-value']">
            {{
              serialNumberData.total.offer_deduction > 0
                ? `-${formatThousandsCurrency(
                    serialNumberData.total.offer_deduction
                  )}`
                : `0.00`
            }}
          </div>
        </div>
        <div :class="$style['serial-basic-cell']">
          <div :class="$style['serial-basic-title']">
            {{ $text("S_FEE", "手续费") }}
          </div>
          <div :class="$style['serial-basic-value']">
            {{
              serialNumberData.total.fee > 0
                ? `-${formatThousandsCurrency(serialNumberData.total.fee)}`
                : `0.00`
            }}
          </div>
        </div>

        <div :class="$style['serial-basic-cell']">
          <div :class="$style['serial-basic-title']">扣除总计</div>
          <div :class="$style['serial-basic-value']">
            {{
              serialNumberData.total.total_deduction > 0
                ? `-${formatThousandsCurrency(
                    serialNumberData.total.total_deduction
                  )}`
                : `0.00`
            }}
          </div>
        </div>
      </div>
      <div
        v-if="serialNumberList && serialNumberList.length > 0"
        :class="[$style['serial-number-wrap']]"
      >
        <div
          v-for="(serialDate, serialIndex) in serialNumberList"
          :key="`serial-block-${serialIndex}`"
          :class="$style['serial-number-block']"
        >
          <div :class="$style['serial-number-title']">
            {{ serialDate._confirmDate }}
          </div>

          <div
            v-for="(serialInfo, index) in serialDate.list"
            :key="`serial-cell-${index}`"
            :class="$style['serial-number-cell']"
            @click="handleClickSerial(serialInfo)"
          >
            <div>
              <div :class="$style['title']">{{ serialInfo.opcode }}</div>
              <div :class="$style['time']">
                {{
                  serialInfo.confirm_at.split(" ") &&
                    serialInfo.confirm_at.split(" ")[1]
                }}
              </div>
            </div>

            <div>
              <div>
                <span :class="$style['sub-title']">
                  {{ $text("S_SERIAL_CHANGE", "流水要求") }}:
                </span>
                <span :class="$style['money']">
                  {{
                    serialInfo.total_audit_amount > 0
                      ? formatThousandsCurrency(serialInfo.total_audit_amount)
                      : "-"
                  }}
                </span>
              </div>
              <div>
                <span :class="$style['sub-title']">
                  {{ $text("S_DEDUCTION_MONEY", "扣除金额") }}:
                </span>
                <span :class="$style['money']">
                  {{
                    serialInfo.deduction > 0
                      ? `-${formatThousandsCurrency(serialInfo.deduction)}`
                      : `0.00`
                  }}
                </span>
              </div>
            </div>

            <div :class="$style['serial-next']">
              <img
                :class="$style['arrow-icon']"
                :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
      <span slot="no-more" />
      <span slot="no-results" />
    </infinite-loading>
    <serial-detail
      v-if="showDetail"
      :handle-close="() => (showDetail = false)"
      :data="selectedSerialDetail"
    />
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import mixin from "@/mixins/mcenter/withdraw/serialNumber";
import serialDetail from "./serialDetail";
import { mapGetters, mapActions } from "vuex";
import { thousandsCurrency } from "@/lib/thousandsCurrency";

export default {
  mixins: [mixin],
  components: {
    serialDetail,
    InfiniteLoading
  },
  data() {
    return {
      sliderClass: "slider",
      serialNumberList: [],
      selectedSerialDetail: {},
      isShow: true,
      showDetail: false
    };
  },
  props: {
    handleClose: {
      type: Function,
      default: () => {}
    },
    swiftCode: {
      type: String,
      default: ""
    }
  },
  created() {
    //this.getSerialNumberData(this.swiftCode);
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  watch: {
    serialNumberData() {
      if (this.serialNumberData.ret) {
        let result = [];
        let dateArray = [];
        this.serialNumberData.ret.map((item, index) => {
          if (item.confirm_at.split(" ") && item.confirm_at.split(" ")[0]) {
            let day = item.confirm_at.split(" ")[0];
            if (dateArray.includes(day)) {
              result.find(i => i._confirmDate == day).list.push({ ...item });
            } else {
              dateArray.push(day);
              result.push({
                _confirmDate: day,
                list: [{ ...item }]
              });
            }
          }
        });
        this.serialNumberList = this.serialNumberList.concat(result);
      }
    }
  },
  methods: {
    onClose() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.handleClose();
        }, 280);
      });
      this.sliderClass = "slider-close slider";
    },
    handleClickSerial(data) {
      this.selectedSerialDetail = data;
      this.showDetail = true;
    },
    infiniteHandler($state) {
      this.getSerialNumberData(this.swiftCode).then(result => {
        if (result !== "ok") {
          return;
        }
        if (
          !this.totalAmount ||
          this.page + this.pageInterval >= +this.totalAmount
        ) {
          $state.complete();
          return;
        }
        $state.loaded();
        this.page += this.pageInterval;
      });
    }
  }
};
</script>

<style lang="scss" src="../css/serialNumber.scss" module></style>
