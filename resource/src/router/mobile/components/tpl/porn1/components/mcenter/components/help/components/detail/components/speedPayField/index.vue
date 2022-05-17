<template>
  <!-- 手動配卡提交欄位 -->
  <div v-if="manualCard" :class="[$style['speed-field-wrap'], 'clearfix']">
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
    <template v-for="info in manualInputData">
      <div
        v-if="info.showCondition"
        :key="`field-${info.objKey}`"
        :class="[$style['detail-cell-manual'], $style[`${info.objKey}`]]"
      >
        <div v-if="info.objKey === 'payUrl'" :class="$style['title']">
          <a href="https://imgbb.com/" target="_blank"> {{ info.title }}</a>
        </div>
        <div v-else :class="$style['title']">
          {{ info.title }}
        </div>
        <div
          :class="[
            $style['speed-edit-value'],
            $style['value'],
            { [$style['waiting']]: info.value === '通道建置中' }
          ]"
        >
          <template>
            <textarea
              v-if="info.objKey === 'payUrl'"
              v-model="info.value"
              :class="$style['speed-deposit-input']"
              :placeholder="info.placeholderText"
              maxlength="50"
              @input="submitInput($event.target.value, info.objKey)"
            />
            <div v-else :class="$style['speed-deposit-input']">
              {{ info.value }}
            </div>
          </template>
        </div>
        <!-- icon1 -->
        <div
          v-if="info.copyShow_t"
          :class="$style['icon-wrap-text']"
          @click="handleCopy(info)"
        >
          <img
            :src="
              $getCdnPath(
                `/static/image/common/ic_copy_${
                  info.value === '通道建置中' ? 'd' : 'n'
                }.png`
              )
            "
          />
        </div>
        <!-- icon2 -->
        <div
          v-if="info.copyShow"
          :class="$style['icon-wrap']"
          @click="handleCopy(info)"
        >
          <img
            :src="
              $getCdnPath(
                `/static/image/common/ic_copy${
                  info.value === '通道建置中' ? '_d2' : ''
                }.png`
              )
            "
          />
        </div>
      </div>
    </template>
  </div>
  <!-- 一般提交欄位 -->
  <div v-else :class="[$style['speed-field-wrap'], 'clearfix']">
    <template v-for="info in allInputData">
      <div
        v-if="info.showCondition"
        :key="`field-${info.objKey}`"
        :class="[$style['detail-cell']]"
      >
        <div :class="$style['title']">
          {{ info.title }}
        </div>
        <div :class="($style['speed-edit-value'], $style['value'])">
          <template v-if="!isEdit">
            <span :class="$style['speed-field-title']">{{
              info.objKey === "depositMethod"
                ? nowSelectData.mainTitle
                : info.value
            }}</span>
          </template>
          <template v-else>
            <template v-if="info.objKey === 'depositMethod'">
              <div
                :class="[
                  $style['speed-field-title'],
                  {
                    [$style['depositMethod-no-data']]: !nowSelectData.mainTitle
                  }
                ]"
                @click="isShowSelect(true)"
              >
                {{ nowSelectData.mainTitle || info.selectTitle }}
              </div>
            </template>
            <template v-else-if="info.objKey === 'depositTime'">
              <date-picker
                v-model="info.value"
                :placeholder="info.placeholderText"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-type="format"
                @open="setDefaultDate"
                @input="submitInput(info.value, info.objKey)"
              />
            </template>
            <input
              v-else
              v-model="info.value"
              :class="$style['speed-deposit-input']"
              :placeholder="info.placeholderText"
              @input="submitInput($event.target.value, info.objKey)"
            />
          </template>
        </div>
      </div>
      <!-- <div
        v-if="info.isError"
        :key="`field-error-${info.objKey}`"
        :class="[
          $style['detail-cell'],
          $style['speed-deposit-input-error-messgae']
        ]"
      >
        {{ info.placeholderText }}
      </div> -->
    </template>
    <select-box
      v-if="isSelectShow"
      :select-data="allInputData[0].selectData"
      :now-select-cur.sync="nowSelectData"
      :close-fuc="isShowSelect"
      :title="allInputData[0].selectTitle"
    />
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import message from "@/router/mobile/components/common/message";

export default {
  components: {
    message,
    selectBox: () =>
      import(
        /* webpackChunkName: 'selectBox' */ "@/router/mobile/components/common/mcenter/theme1/deposit/components/common/selectBox"
      ),
    DatePicker
  },
  props: {
    showByRequiredFields: {
      type: Boolean,
      default: false
    },
    requiredFields: {
      type: Array,
      default: () => []
    },
    classStyle: {
      type: Object,
      default: () => {}
    },
    speedField: {
      type: Object,
      default: () => {}
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    methodId: {
      type: Number,
      default: 0
    },
    typeId: {
      type: Number,
      default: 0
    },
    manualCard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      msg: "",
      isSelectShow: false,
      // 只有show必填欄位的狀況下不顯示錯誤提示
      showError: !this.showByRequiredFields
    };
  },
  computed: {
    $style() {
      return this.classStyle || this.$styleDefault;
    },
    allInputData() {
      return [
        {
          objKey: "depositMethod",
          title: "充值方式",
          curMethodId: this.speedField.depositMethod,
          selectTitle: "请选择充值方式",
          selectData: [
            {
              mainTitle: this.$text("S_ONLINE_BANK", "网银"),
              selectId: "1"
            },
            {
              mainTitle: "ATM",
              selectId: "2"
            },
            {
              mainTitle: this.$text("S_BANK_COUNTER", "银行柜台"),
              selectId: "4"
            },
            {
              mainTitle: this.$text("S_MOBILE_TRANSFER", "手机银行转帐"),
              selectId: "8"
            },
            {
              mainTitle: this.$text("S_ZALO_PAY", "其他"),
              selectId: "16"
            }
          ],
          showCondition: this.showByRequiredFields
            ? this.requiredFields.find(e => e.name === "method" && e.required)
            : this.methodId === 3 || this.methodId === 6,
          isError: false
        },
        {
          objKey: "depositTime",
          title: "充值时间(当地)",
          value: this.speedField.depositTime,
          placeholderText: this.$text("S_ENTER_DEPOSIT_TIME", "请选择充值时间"),
          showCondition: this.showByRequiredFields
            ? this.requiredFields.find(
                e => e.name === "deposit_at" && e.required
              )
            : true,
          isError:
            this.showError &&
            this.requiredFields.find(
              item => item.name === "deposit_at" && item.required
            ) &&
            !this.speedField.depositTime
        },
        {
          objKey: "depositAccount",
          title: "充值银行帐号",
          value: this.speedField.depositAccount,
          placeholderText: this.$text(
            "S_ENTER_DEPOSIT_ACCOUNT",
            "请输入充值银行帐号"
          ),
          showCondition: this.showByRequiredFields
            ? this.requiredFields.find(
                e => e.name === "pay_account" && e.required
              )
            : true,
          isError:
            this.showError &&
            this.requiredFields.find(
              item => item.name === "pay_account" && item.required
            ) &&
            !this.speedField.depositAccount
        },
        {
          objKey: "depositName",
          title: "充值人姓名",
          value: this.speedField.depositName,
          placeholderText: "请输入充值人姓名",
          showCondition: this.showByRequiredFields
            ? this.requiredFields.find(
                e => e.name === "pay_username" && e.required
              )
            : true,
          isError:
            this.showError &&
            this.requiredFields.find(
              item => item.name === "pay_username" && item.required
            ) &&
            !this.speedField.depositName
        },
        {
          objKey: "serialNumber",
          title: this.$text("S_SERIAL_NUMBER2", "流水号"),
          value: this.speedField.serialNumber,
          placeholderText: this.$text(
            "S_PLZ_ENTER_SERIAL_NUMBER",
            "请输入流水号"
          ),
          showCondition: this.showByRequiredFields
            ? this.requiredFields.find(e => e.name === "sn" && e.required)
            : true,
          isError:
            this.showError &&
            this.requiredFields.find(
              item => item.name === "sn" && item.required
            ) &&
            !this.speedField.serialNumber
        },
        {
          objKey: "bankBranch",
          title: this.$text("S_DEPOSIT_BRANCH", "银行支行"),
          value: this.speedField.bankBranch,
          placeholderText: this.$text(
            "S_ENTER_DEPOSIT_BRANCH",
            "请输入银行支行"
          ),
          showCondition:
            this.speedField.depositMethod === "2" ||
            this.speedField.depositMethod === "4",
          isError:
            this.showError &&
            this.requiredFields.find(
              item => item.name === "method" && item.required
            ) &&
            !this.speedField.bankBranch &&
            ["2", "4"].includes(this.speedField.depositMethod)
        }
      ];
    },
    manualInputData() {
      return [
        {
          objKey: "manualCardBankName",
          title: "收款银行",
          value:
            this.speedField.manualCard.bank_name === ""
              ? "通道建置中"
              : this.speedField.manualCard.bank_name,
          placeholderText: "通道建置中",
          showCondition: true,
          isError: this.showError,
          copyShow: true
          // copyShow_t: true
        },
        {
          objKey: "manualCardBankBranch",
          title: "收款支行",
          value:
            this.speedField.manualCard.account_branch === ""
              ? "通道建置中"
              : this.speedField.manualCard.account_branch,
          placeholderText: "通道建置中",
          showCondition: true,
          isError: this.showError,
          copyShow: true
          // copyShow_t: true
        },
        {
          objKey: "manualCardAccount",
          title: "收款帐号",
          value:
            this.speedField.manualCard.account === ""
              ? "通道建置中"
              : this.speedField.manualCard.account,
          placeholderText: "通道建置中",
          showCondition: true,
          isError: this.showError,
          copyShow: true
        },

        {
          objKey: "manualCardAccountName",
          title: "收款人姓名",
          value:
            this.speedField.manualCard.account_name === ""
              ? "通道建置中"
              : this.speedField.manualCard.account_name,
          placeholderText: "请输入充值人姓名",
          showCondition: true,
          isError: this.showError,
          copyShow: true
        },
        {
          objKey: "payUrl",
          title: "上传图片",
          value: this.speedField.payUrl,
          placeholderText: "请贴上图片网址",
          showCondition: true,
          isError: this.showError,
          copyShow: false
        }
      ];
    },
    nowSelectData: {
      get() {
        return {
          ...this.allInputData[0].selectData.filter(
            info => info.selectId === this.speedField.depositMethod
          )[0],
          objKey: this.allInputData[1].objKey
        };
      },
      set(value) {
        this.submitInput(value.selectId, "depositMethod");
      }
    }
  },
  methods: {
    handleCopy(info) {
      if (info.value === "通道建置中") {
        return;
      }

      let copy = info.value;
      this.msg = "已复制到剪贴板";
      this.copyInfo(copy);
    },
    copyInfo(text) {
      this.$copyText(text);
      this.msg = "已复制到剪贴板";
    },
    submitInput(data, objKey) {
      this.$emit("update:speedField", { data, objKey });
    },
    /**
     * 是否顯示選擇框
     * @method isShowSelect
     * @param {Boolean} show - 是否顯示
     */
    isShowSelect(show = "") {
      if (show !== "") {
        this.isSelectShow = show;
        return;
      }

      this.isSelectShow = !this.isSelectShow;
    },
    setDefaultDate() {
      Date.prototype.Format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小時
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
      //預設當前時間
      this.speedField["depositTime"] = new Date().Format("yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>
<style lang="scss" src="../../../../css/edit.module.scss" module></style>
