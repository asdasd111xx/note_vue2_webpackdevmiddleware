<template>
  <div :class="$style['content-wrap']">
    <div
      :class="$style['category-wrap']"
      :style="{ top: isApp ? '0px' : '43px' }"
    >
      <div @click="showCondition = !showCondition">
        {{ currentCategory.text
        }}<span :class="{ [$style['arrow-up']]: showCondition }" />
      </div>
    </div>
    <div
      v-if="showCondition"
      :class="$style['list-mask']"
      :style="{ top: isApp ? 'calc(50px)' : 'calc(43px + 50px)' }"
    >
      <div :class="$style['list-wrap']">
        <div
          v-for="option in categoryOpt"
          :key="option.key"
          :class="[
            $style['item'],
            { [$style['active']]: currentCategory.key === option.key }
          ]"
          @click="setCategory(option)"
        >
          <span>{{ option.text }}</span>
        </div>
      </div>
    </div>

    <div :class="[$style['detail-wrap']]" style="margin-top: calc(50px + 10px)">
      <div :class="[$style['deposit-detail-help']]">
        如需帮助，请<a @click="toService">联系客服</a>
      </div>
      <div v-if="data" :class="$style['detail-content-wrap']">
        <div
          v-for="(item, index) in data"
          :class="$style['detail-block']"
          :key="index"
        >
          <div :class="[$style['detail-cell'], $style['item-status']]">
            <div :class="[$style['title']]">
              {{ $text("S_STATUS", "状态") }}
            </div>

            <div
              :class="[
                $style['value'],
                {
                  [$style['match']]:
                    [34, 41].includes(item.method_id) &&
                    item.status === 'process'
                }
              ]"
            >
              <div
                v-if="item.status === 'submit_data'"
                :class="$style['edit']"
                @click="openEdit(item)"
              >
                提交资料
              </div>
              <div
                v-else-if="
                  [34, 41].includes(item.method_id) && item.status === 'process'
                "
                @click="openMatchLink(item)"
              >
                搓合查询
              </div>
              <div
                v-else
                @click="
                  () => {
                    item.method_id === 25 ||
                    item.method_id === 30 ||
                    item.method_id === 37 ||
                    item.method_id === 38 ||
                    item.method_id === 402 ||
                    item.method_id === 404
                      ? showDetailPop(item)
                      : '';
                  }
                "
                :class="[{ [$style['processing']]: item.status === 'process' }]"
              >
                {{ getStatus(item.status) }}
              </div>
              <div
                v-if="
                  item.method_id === 25 ||
                    item.method_id === 30 ||
                    item.method_id === 37 ||
                    item.method_id === 38 ||
                    item.method_id === 402 ||
                    item.method_id === 404
                "
                :class="$style['processing-icon']"
                @click="showDetailPop(item)"
              >
                <img :src="`/static/image/${theme}/mcenter/ic_remark.png`" />
              </div>
            </div>
          </div>

          <div :class="$style['item-status-border']" />
          <template v-for="(col, index) in columns">
            <div
              v-if="item.hasOwnProperty(col.key)"
              :class="$style['detail-cell']"
              :key="`col-'${index}`"
            >
              <div :class="$style['title']">
                {{ $text(col.title) }}
              </div>
              <div :class="$style['value']">
                {{ item[col.key] }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <div v-if="detailRate" :class="$style['tips-wrap']">
        <div :class="$style['tips-mask']" @click="detailRate = null" />

        <div :class="$style['tips-block']">
          <div :class="$style['tips-cell']">
            实际汇率：&nbsp;{{ detailRate && detailRate.crypto_rate }}
          </div>
          <div :class="$style['tips-cell']">
            入帐数量：&nbsp;{{ detailRate && detailRate.crypto_num }}
          </div>
          <div v-if="detailRate.memo" :class="$style['tips-cell']">
            <span>备注：</span>
            <div :class="$style['tips-content']" v-html="detailRate.memo" />
          </div>

          <div :class="[$style['close']]" @click="detailRate = null">关闭</div>
        </div>
      </div>

      <edit-deposit-field
        v-if="editOpen"
        :required-fields="requiredFields"
        :depositData="singleDeposit"
        :close-fuc="
          () => {
            editOpen = false;
          }
        "
      />

      <div v-if="!data.length" :class="$style['no-data-wrap']">
        <img :src="$getCdnPath(`/static/image/${theme}/mcenter/no_data.png`)" />
        <div :class="$style['tips']">暂时没有新的充值记录</div>
      </div>
    </div>
    <infinite-loading v-if="isLoading" />
  </div>
</template>

<script>
import { getCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import editDepositField from "./editDepositField";
import member from "@/api/member";
import mixin from "@/mixins/mcenter/deposit/recordDeposit";
import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest.js";
import InfiniteLoading from "vue-infinite-loading";

export default {
  mixins: [mixin],
  components: {
    editDepositField,
    InfiniteLoading
  },
  props: {
    isApp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: [],
      detailRate: null,
      editOpen: false,
      isShowDepositInfo: false,
      isLoading: false,
      columns: [
        // 日期
        { key: "created_at", title: "S_DATE" },
        // 单号
        { key: "order_number", title: "S_ORDER_NUMBER" },
        // 实际到帐
        { key: "method_name", title: "S_DEPOSIT_METHOD" },
        // 申请金额
        { key: "amount", title: "S_APPLICATION_AMOUNT" },
        // 实际到帐
        { key: "actual_deposit", title: "S_REAL_ENTER" }
      ],
      categoryOpt: [
        { key: "all", text: "全部" },
        { key: "complete", text: "成功" },
        { key: "process", text: "处理中" },
        { key: "cancel", text: "取消" }
      ],
      currentCategory: { key: "all", text: "全部" },
      showCondition: false
    };
  },
  mounted() {
    this.getData();
    document.title = "8日内充值记录";
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    theme() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    showDetailPop(item) {
      this.detailRate = item;
    },
    toService() {
      // 發送事件給app
      appEvent.jsToAppMessage("TO_SERVICE");

      setTimeout(() => {
        if (this.isApp) {
          this.$router.push(`/mobile/service?prev=true&app=true`);
        } else {
          this.$router.push("/mobile/service?prev=true");
        }
      }, 500);
    },
    setCategory(option) {
      if (this.isLoading) return;
      this.showCondition = false;
      this.isLoading = true;
      this.currentCategory = option;
      this.getData(option.key).then(() => {
        this.isLoading = false;
      });
    },
    getData(key = "all") {
      let params = {
        firstResult: 0
      };
      if (key !== "all") params[key] = true;

      let cid = getCookie("cid");
      if (!cid) return;
      return goLangApiRequest({
        method: "post",
        url: this.siteConfig.YABO_GOLANG_API_DOMAIN + "/xbb/Ext/Stat/List",
        params
      })
        .then(res => {
          if (res.status === "000" && res.errorCode === "00") {
            this.data = res.data.ret;
            this.total = res.data.pagination.total; //????
          }
        })
        .catch(err => {
          this.actionSetGlobalMessage({
            msg: err.response.data.msg,
            code: err.response.data.code
          });
        });
    },
    getStatus(status) {
      status = status.toLowerCase();

      switch (status) {
        case "submit_data":
          return this.$text("S_SUBMIT_DEPOSIT", "提交资料");
        case "cancel":
          return this.$text("S_CANCEL", "取消");
        case "complete":
          return this.$text("S_CR_SUCCESS", "成功");
        default:
          return this.$text("S_PROCESSING_TEXT", "处理中");
      }
    },
    openEdit(info) {
      // this.editOpen = true;
      this.getSingleInfo(info.order_number);
    },
    openMatchLink(item) {
      axios({
        method: "get",
        url: "/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/stat/match/url",
        errorAlert: false,
        params: {
          entry_id: item.order_number,
          type: "deposit"
        }
      })
        .then(res => {
          console.log(res);
          if (res && res.data && res.data.result === "ok") {
            // let newWindow;
            // newWindow = window.open(`${res.data.ret}`, "_blank");
            localStorage.setItem("iframe-third-url", res.data.ret);
            localStorage.setItem("iframe-third-url-title", "搓合查询");
            this.$router.push(
              `/mobile/iframe/history?func=false${
                this.isApp ? "&hasHeader=false" : ""
              }`
            );
          }
        })
        .catch(error => {
          this.actionSetGlobalMessage({
            msg: error.response.data.msg,
            code: error.response.data.code
          });
        });
    }
  }
};
</script>
<style scoped>
.infinite-loading-container {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
</style>
<style src="../../css/index.module.scss" lang="scss" module />
