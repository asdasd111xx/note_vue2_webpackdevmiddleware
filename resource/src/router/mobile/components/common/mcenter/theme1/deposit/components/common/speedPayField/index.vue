<template>
  <div :class="[$style['speed-field-wrap'], 'clearfix']">
    <template v-for="info in allInputData">
      <div
        v-if="info.showCondition"
        :key="`field-${info.objKey}`"
        :class="[
          $style['speed-field'],
          { [$style.error]: info.isError },
          'clearfix'
        ]"
      >
        <div :class="$style['field-title']">{{ info.title }}</div>
        <div
          :class="[
            $style['field-info'],
            { [$style['placeholder-error']]: info.isError }
          ]"
        >
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
                :placeholder="info.isError ? '' : info.placeholderText"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-type="format"
                @open="setDefaultDate"
                @input="submitInput(info.value, info.objKey)"
              />
              <div
                v-if="info.isError"
                :class="$style['time-placeholder-error']"
              >
                请选择充值时间
              </div>
            </template>
            <input
              v-else-if="info.objKey === 'depositName'"
              v-model="depositName"
              :class="[
                $style['speed-deposit-input'],
                { [$style['placeholder-error']]: info.isError }
              ]"
              :placeholder="info.placeholderText"
              @input="submitInput($event.target.value, info.objKey)"
            />
            <input
              v-else
              v-model="info.value"
              :class="[
                $style['speed-deposit-input'],
                { [$style['placeholder-error']]: info.isError }
              ]"
              :placeholder="info.placeholderText"
              @input="submitInput($event.target.value, info.objKey)"
            />
          </template>
        </div>
      </div>
      <!-- <div
        v-if="info.isError"
        :key="`field-error-${info.objKey}`"
        :class="$style['speed-deposit-input-error-messgae']"
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
import { mapActions } from "vuex";
import DatePicker from "vue2-datepicker";

export default {
  components: {
    selectBox: () => import(/* webpackChunkName: 'selectBox' */ "../selectBox"),
    DatePicker
  },
  props: {
    showByRequiredFields: {
      type: Boolean,
      default: true
    },
    showByRequiredFieldsError: {
      type: Boolean,
      default: true
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
    }
  },
  data() {
    return {
      depositName: this.speedField.depositName,
      isSelectShow: false
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
            ? this.requiredFields.find(e => e.name === "method")
            : this.methodId === 3 || this.methodId === 6,
          isError: false
        },

        {
          objKey: "depositTime",
          title: "充值时间(当地)",
          value: this.speedField.depositTime,
          placeholderText: "请选择充值时间",
          showCondition: this.showByRequiredFields
            ? this.requiredFields.find(e => e.name === "deposit_at")
            : true,
          isError:
            this.showByRequiredFieldsError &&
            this.requiredFields.find(
              item => item.name === "deposit_at" && item.required
            ) &&
            !this.speedField.depositTime
        },
        {
          objKey: "depositAccount",
          title: "充值银行帐号",
          value: this.speedField.depositAccount,
          placeholderText: "请输入充值银行帐号",
          showCondition: this.showByRequiredFields
            ? this.requiredFields.find(e => e.name === "pay_account")
            : true,
          isError:
            this.showByRequiredFieldsError &&
            this.requiredFields.find(
              item => item.name === "pay_account" && item.required
            ) &&
            !this.speedField.depositAccount
        },

        {
          objKey: "depositName",
          title:
            this.typeId === 6
              ? this.$text("充值昵称")
              : this.$text("充值人姓名"),
          value: this.speedField.depositName,
          placeholderText:
            this.typeId === 6
              ? this.$text("S_ENTER_DEPOSIT_NICKNAME", "请输入充值昵称")
              : this.$text("S_ENTER_DEPOSIT_NAME", "请输入充值人姓名"),
          showCondition: this.showByRequiredFields
            ? this.requiredFields.find(e => e.name === "pay_username")
            : true,
          isError:
            this.showByRequiredFieldsError &&
            this.requiredFields.find(
              item => item.name === "pay_username" && item.required
            ) &&
            !this.speedField.depositName
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
            this.showByRequiredFieldsError &&
            this.requiredFields.find(
              item => item.name === "method" && item.required
            ) &&
            !this.speedField.bankBranch &&
            ["2", "4"].includes(this.speedField.depositMethod)
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
            ? this.requiredFields.find(e => e.name === "sn")
            : true,
          isError:
            this.showByRequiredFieldsError &&
            this.requiredFields.find(
              item => item.name === "sn" && item.required
            ) &&
            !this.speedField.serialNumber
        }
      ];
    },

    nowSelectData: {
      get() {
        return {
          ...this.allInputData[0].selectData.filter(
            info => info.selectId === this.speedField.depositMethod
          )[0],
          objKey: this.allInputData[0].objKey
        };
      },
      set(value) {
        this.submitInput(value.selectId, "depositMethod");
      }
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    submitInput(data, objKey) {
      //充值人姓名移除中文限制
      // if (objKey === "depositName") {
      //   const re = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF.．·]/g;
      //   this.depositName = data.replace(re, "");
      //   data = data.replace(re, "");
      // }

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

<style lang="scss" src="./css/index.scss" module="$styleDefault"></style>
