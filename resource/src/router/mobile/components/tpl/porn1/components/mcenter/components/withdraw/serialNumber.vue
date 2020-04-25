<template>
  <transition :name="'fade'">
    <div :class="$style['serial-number-wrap']">
      <div v-if="!isShow" :class="$style['serial-number']">
        <span :class="$style['serial-title']">
          {{ $text("S_SERIAL_CHANGE", "流水检查") }}
          <div :class="$style['serial-close-wrap']" @click="closeFuc(false)">
            <icon
              :class="$style['serial-close-btn']"
              width="30"
              height="30"
              name="times"
            />
          </div>
        </span>
        <div :class="$style['serial-info-wrap']">
          <div :class="[$style['basic-info-wrap'], 'clearfix']">
            <span :class="$style['basic-title']"
              >{{ $text("S_CHECK_TIME", "检查时间") }}：{{ nowTime }}</span
            >
            <div
              :class="[
                $style['serial-basic-table'],
                $style['serial-info-change']
              ]"
            >
              <div
                :class="[
                  $style['serial-basic-thead'],
                  $style['serial-basic-tr']
                ]"
              >
                <div
                  :class="[
                    $style['serial-basic-td'],
                    $style['serial-important']
                  ]"
                >
                  {{ $text("S_SERIAL_CHANGE", "流水检查") }}
                </div>
                <div
                  :class="[
                    $style['serial-basic-td'],
                    $style['serial-important']
                  ]"
                />
              </div>
              <div :class="$style['serial-basic-tr']">
                <div :class="$style['serial-basic-td']">
                  {{ $text("S_SERIAL_CHANGE", "流水要求") }}
                </div>
                <div :class="$style['serial-basic-td']">
                  {{ serialNumberData.total.audit_amount }}
                </div>
              </div>
              <div :class="$style['serial-basic-tr']">
                <div :class="$style['serial-basic-td']">
                  {{ $text("S_SERIAL_POOR", "流水不足") }}
                </div>
                <div :class="$style['serial-basic-td']">
                  {{ serialNumberData.total.audit_amount_lack }}
                </div>
              </div>
            </div>
            <div :class="[$style['serial-basic-table'], $style['serial-cost']]">
              <div
                :class="[
                  $style['serial-basic-thead'],
                  $style['serial-basic-tr']
                ]"
              >
                <div
                  :class="[
                    $style['serial-basic-td'],
                    $style['serial-important']
                  ]"
                >
                  {{ $text("S_CH_CHARGE", "费用") }}
                </div>
                <div
                  :class="[
                    $style['serial-basic-td'],
                    $style['serial-important']
                  ]"
                />
              </div>
              <div :class="$style['serial-basic-tr']">
                <div :class="$style['serial-basic-td']">
                  {{ $text("S_DEDUCTION_MONEY", "扣除金额") }}
                </div>
                <div :class="$style['serial-basic-td']">
                  {{ serialNumberData.total.deduction }}
                </div>
              </div>
              <div :class="$style['serial-basic-tr']">
                <div :class="$style['serial-basic-td']">
                  {{ $text("S_FEE", "手续费") }}
                </div>
                <div :class="$style['serial-basic-td']">
                  {{ serialNumberData.total.fee }}
                </div>
              </div>
              <div :class="$style['serial-basic-tr']">
                <div :class="$style['serial-basic-td']">
                  {{ $text("S_SERIAL_TOTAL", "合计") }}
                </div>
                <div :class="$style['serial-basic-td']">
                  {{ serialNumberData.total.total_deduction }}
                </div>
              </div>
            </div>
          </div>
          <div
            :class="[$style['serial-number-table'], $style['serial-change']]"
          >
            <div
              :class="[
                $style['serial-number-thead'],
                $style['serial-number-tr']
              ]"
            >
              <div
                v-for="(info, index) in serialHeader"
                :key="`serial-thead-${index}`"
                :class="[$style['serial-number-td'], info.className]"
              >
                <span>{{ info.value }}</span>
                <div
                  v-if="info.objKey === 'deduction'"
                  :class="$style['icon-wrap']"
                  :title="
                    `${$text('S_SERIAL_TIP02', '行政费用')}：${
                      serialNumberData.administrative_rate
                    }%`
                  "
                >
                  <icon name="info-circle" />
                </div>
                <div
                  v-if="info.objKey === 'change_serial'"
                  :class="$style['icon-wrap']"
                  :title="$text('S_SERIAL_TIP', '系统流水稽核顺序为存款->优惠')"
                >
                  <icon name="info-circle" />
                </div>
              </div>
            </div>
            <div
              v-for="(serialInfo, serialIndex) in serialNumberData.ret"
              :key="`serial-data-${serialIndex}`"
              :class="$style['serial-number-tr']"
            >
              <div
                v-for="(info, index) in serialHeader"
                :key="`serial-thead-${index}`"
                :class="[
                  $style['serial-number-tbody-item'],
                  $style['serial-number-td'],
                  info.className
                ]"
              >
                <template v-if="info.objKey === 'audit_multiple'">
                  <div>
                    {{ $text("S_ACCOUNT_DEPOSITE", "存款") }}：
                    {{ +serialInfo.audit_rate ? serialInfo.audit_rate : "-" }}
                  </div>
                  <div>
                    {{ $text("S_PROMOTION", "优惠") }}：
                    {{
                      +serialInfo.offer_audit_rate
                        ? serialInfo.offer_audit_rate
                        : "-"
                    }}
                  </div>
                </template>
                <template v-if="info.objKey === 'change_serial'">
                  <div>
                    {{ $text("S_SERIAL_STATUS01", "存款稽核") }}：
                    {{
                      getSerialValue(serialInfo, info.objKey, serialIndex)
                        .depositAudit
                    }}
                  </div>
                  <div>
                    {{ $text("S_SERIAL_STATUS02", "优惠稽核") }}：
                    {{
                      getSerialValue(serialInfo, info.objKey, serialIndex)
                        .promotionAudit
                    }}
                  </div>
                </template>
                <div v-else :class="$style['serial-info-text']">
                  {{ getSerialValue(serialInfo, info.objKey, serialIndex) }}
                  <div
                    v-if="info.objKey === 'total_audit_amount'"
                    :class="$style['audit-tip-wrap']"
                  >
                    <div
                      :class="[
                        $style['audit-tip-text'],
                        'ui pointing below label'
                      ]"
                    >
                      <div>
                        {{ $text("S_DSEPOSIT_SERIAL", "存款流水") }}：{{
                          +serialInfo.audit_amount
                            ? serialInfo.audit_amount
                            : "-"
                        }}
                      </div>
                      <div>
                        {{ $text("S_PROMOTION_SERIAL", "优惠流水") }}：{{
                          +serialInfo.offer_audit_amount
                            ? serialInfo.offer_audit_amount
                            : "-"
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import mixin from '@/mixins/mcenter/withdraw/serialNumber';

export default {
  mixins: [mixin],
  props: {
    closeFuc: {
      type: Function,
      default: () => { }
    }
  }
};
</script>

<style lang="scss" src="./css/serialNumber.scss" module></style>
