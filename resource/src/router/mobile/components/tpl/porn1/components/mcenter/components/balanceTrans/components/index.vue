<template>
  <div :class="['clearfix']">
    <div :class="[$style['balance-item-wrap'], 'clearfix']">
      <div
        v-if="redJackpotData.enable"
        :class="[
          $style['balance-item'],
          {
            [$style['is-last-item']]: !isShowMore
          },
          $style['item-fix']
        ]"
        @click="$router.push('/mobile/mcenter/redJackpot')"
      >
        <span
          :class="[
            $style['balance-item-vendor'],
            $style['balance-redjackpot-text']
          ]"
        >
          <template v-if="['porn1', 'sg1'].includes(themeTPL)">
            {{ "红包彩金" }}
          </template>
        </span>

        <span
          :class="[
            $style['balance-item-money'],
            $style['balance-redjackpot-money']
          ]"
        >
          {{ formatThousandsCurrency(redJackpotData.remain_bonus) }}
        </span>
        <span
          :class="[
            $style['balance-redjackpot-image'],
            $style[siteConfig.ROUTER_TPL]
          ]"
        />
      </div>
      <div
        v-if="bonus.balance"
        :class="[
          $style['balance-item'],
          {
            [$style['is-last-item']]: !isShowMore
          },
          $style['item-fix']
        ]"
        @click="$router.push('/mobile/mcenter/bonus')"
      >
        <span :class="$style['balance-item-vendor']">
          <template v-if="['porn1', 'sg1'].includes(themeTPL)">
            {{ $text("S_BONUS", "红利彩金") }}
          </template>
        </span>

        <span :class="[$style['balance-item-money'], $style['more']]">
          {{ bonus.balance ? formatThousandsCurrency(bonus.balance) : "0.00" }}
        </span>
      </div>

      <template v-if="!isShowMore">
        <div
          v-for="(item, key, index) in firstThirdBalanceInfo"
          :key="`balance-item-${key}`"
          :class="[
            $style['balance-item'],
            {
              [$style['is-last-item']]:
                Object.keys(firstThirdBalanceInfo).length - index <=
                (Object.keys(firstThirdBalanceInfo).length % 3 || 3)
            }
          ]"
        >
          <span :class="$style['balance-item-vendor']">{{ item.text }}</span>
          <span
            v-if="item.maintain"
            :class="$style['balance-info-maintain']"
            @click="onClickMaintain(item.maintain)"
          >
            {{ $t("S_MAINTAIN") }}
            <img
              :src="
                $getCdnPath(`/static/image/${routerTPL}/mcenter/ic_tips.png`)
              "
              :class="$style['balance-wrench']"
            />
          </span>
          <span v-else :class="$style['balance-item-money']">{{
            item.amount
          }}</span>
        </div>

        <div
          :class="[$style['balance-item'], $style['expend']]"
          @click="toggleShowMore"
        >
          <span :class="$style['balance-item-vendor']">更多</span>
          <div :class="[$style['icon']]">
            <img
              :src="
                $getCdnPath(
                  `/static/image/common/mcenter/balanceTrans/ic_expand.png`
                )
              "
              alt="expend"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <div
          v-for="(item, key, index) in balanceInfo"
          :key="`balance-item-${key}`"
          :class="[
            $style['balance-item'],
            {
              [$style['is-last-item']]:
                Object.keys(balanceInfo).length - index <=
                (Object.keys(balanceInfo).length % 4 || 4)
            }
          ]"
        >
          <span :class="$style['balance-item-vendor']">{{ item.text }}</span>
          <span
            v-if="item.maintain"
            :class="$style['balance-info-maintain']"
            @click="onClickMaintain(item.maintain)"
          >
            {{ $t("S_MAINTAIN") }}
            <img
              :src="
                $getCdnPath(`/static/image/${routerTPL}/mcenter/ic_tips.png`)
              "
              :class="$style['balance-wrench']"
            />
          </span>
          <span v-else :class="$style['balance-item-money']">{{
            item.amount
          }}</span>
        </div>

        <div
          v-if="Object.keys(balanceInfo).length > 3"
          :class="[$style['balance-item'], $style['collapse']]"
          @click="toggleShowMore"
        >
          <span :class="$style['balance-item-vendor']">收起</span>
          <div :class="[$style['icon']]">
            <img
              :src="
                $getCdnPath(
                  `/static/image/common/mcenter/balanceTrans/ic_collapse.png`
                )
              "
              alt="collapse"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- 鴨博：自動免轉 -->
    <template
      v-if="['porn1'].includes(themeTPL) && isNeedShowAutotransferSwitch"
    >
      <div v-if="isReceiveAuto" :class="[$style['balance-wrap'], 'clearfix']">
        <div :class="$style['balance-tip-wrap']">
          {{ $text("S_AUTO_FREE_TRANSFER", "自动免转") }}
          <span :class="$style['balance-auto-tip']"
            >({{
              $text("S_AUTOSWTICH_HINT_GAME", "开启后余额自动转入游戏场馆")
            }})</span
          >
        </div>

        <div
          v-if="isNeedShowManualtransferSwitch"
          :class="`ui fitted toggle checkbox field-checkbox ${themeTPL}`"
        >
          <input
            :checked="isAutotransfer"
            type="checkbox"
            @click="
              () => {
                if (isReceiveAuto) {
                  if (isAutotransfer) {
                    closeAutotransfer();
                  } else {
                    enableAutotransfer();
                  }
                }
              }
            "
          />
          <label />
        </div>
      </div>
    </template>

    <!-- 絲瓜：自動免轉 -->
    <template v-if="['sg1'].includes(themeTPL) && isNeedShowAutotransferSwitch">
      <div v-if="isReceiveAuto" :class="[$style['balance-wrap'], 'clearfix']">
        <div :class="$style['balance-tip-wrap']">
          {{ $text("S_AUTO_FREE_TRANSFER", "自动免转") }}
          <span :class="$style['balance-auto-tip']"
            >({{
              $text("S_AUTOSWTICH_HINT_GAME", "开启后余额自动转入游戏场馆")
            }})</span
          >
        </div>

        <label
          v-if="isNeedShowManualtransferSwitch"
          :class="[
            $style['balance-auto-switch'],
            { [$style.active]: isAutotransfer }
          ]"
          @click="
            () => {
              if (isReceiveAuto) {
                if (isAutotransfer) {
                  closeAutotransfer();
                } else {
                  enableAutotransfer();
                }
              }
            }
          "
        >
          <span />
        </label>

        <!-- <div :class="`ui fitted toggle checkbox field-checkbox ${themeTPL}`">
          <input
            :checked="isAutotransfer"
            type="checkbox"
            @click="
              () => {
                if (isReceiveAuto) {
                  if (isAutotransfer) {
                    closeAutotransfer();
                  } else {
                    enableAutotransfer();
                  }
                }
              }
            "
          />
          <label />
        </div> -->
      </div>
    </template>

    <!-- 手動轉換功能 -->
    <template v-if="!isAutotransfer && isNeedShowManualtransferSwitch">
      <div :class="[$style['balance-manual-wrap'], 'clearfix']">
        <div :class="[$style['balance-transfer-wrap'], 'clearfix']">
          <div :class="$style['balance-select-wrap']">
            <div :class="$style['select-title']">
              {{ $text("S_OUT_WALLET", "转出钱包") }}
            </div>
            <div
              :class="$style['balance-transfer-list']"
              @click="isShowTransOutSelect = true"
            >
              {{ transOutText }}
              <span :class="$style['select-arrow-icon']"></span>
            </div>

            <div
              v-if="isShowTransOutSelect"
              :class="$style['select-container']"
            >
              <div :class="$style['select-wrap']">
                <div :class="$style['select-header']">
                  <span :class="$style['cancel']" @click="closeSelect">
                    取消
                  </span>
                  选择钱包
                </div>

                <div :class="$style['select-content']">
                  <div
                    :class="$style['option']"
                    v-for="vendor in transOutList"
                    :key="vendor.value"
                    @click="setTranOut(vendor)"
                  >
                    <span>{{ vendor.text }}</span>
                    <img
                      v-if="transOutText === vendor.text"
                      :src="
                        $getCdnPath(
                          `/static/image/${routerTPL}/mcenter/balanceTrans/ic_transfer_sel.png`
                        )
                      "
                      alt="sel"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            :class="[
              $style['balance-select-wrap'],
              $style['select-right-wrap']
            ]"
          >
            <div :class="$style['select-title']">
              {{ $text("S_IN_WALLET", "转入钱包") }}
            </div>
            <div
              :class="$style['balance-transfer-list']"
              @click="isShowTransInSelect = true"
            >
              {{ transInText }}
              <span :class="$style['select-arrow-icon']"></span>
            </div>

            <div v-if="isShowTransInSelect" :class="$style['select-container']">
              <div :class="$style['select-wrap']">
                <div :class="$style['select-header']">
                  <span :class="$style['cancel']" @click="closeSelect">
                    取消
                  </span>
                  选择钱包
                </div>

                <div :class="$style['select-content']">
                  <div
                    :class="$style['option']"
                    v-for="vendor in transInList"
                    :key="vendor.value"
                    @click="setTranIn(vendor)"
                  >
                    {{ vendor.text }}
                    <img
                      v-if="transInText === vendor.text"
                      :src="
                        $getCdnPath(
                          `/static/image/${routerTPL}/mcenter/balanceTrans/ic_transfer_sel.png`
                        )
                      "
                      alt="sel"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="[$style['balance-manual-wrap'], 'clearfix']">
        <div :class="[$style['balance-input-wrap'], 'clearfix']">
          <span :class="$style['transfer-money']">
            <span>¥</span>
            <input
              v-model="displayTransferMoney"
              :class="$style['transfer-money-input']"
              @input="verification($event.target.value)"
              type="tel"
              placeholder="请输入转帐金额"
            />
          </span>
          <div
            :class="[$style['max-money-btn']]"
            @click="getMaxMoney(membalance, tranOut)"
          >
            {{ $text("S_MAX", "最大") }}
          </div>
        </div>
      </div>
      <div
        :class="[
          $style['transfer-btn'],
          {
            [$style['is-disable']]: btnLock || !displayTransferMoney
          }
        ]"
        @click="
          () => {
            if (memInfo.blacklist.includes(3)) {
              this.$emit('update:isShowBlockTips', true);
            } else {
              handleSubmit();
            }
          }
        "
      >
        立即转帐
      </div>
    </template>

    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        <div
          v-html="msg"
          style="background-color: transparent; margin: 0; padding: 0"
        ></div>
      </div>
    </message>
    <envelope
      v-if="needShowRedEnvelope"
      @closeEvelope="closeEvelope"
      :redEnvelopeData="redEnvelopeData"
    />
  </div>
</template>

<script>
import { getCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import ajax from "@/lib/ajax";
import mcenter from "@/api/mcenter";
import message from "@/router/mobile/components/common/message";
import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest";
import { lib_useGlobalWithdrawCheck } from "@/lib/withdrawCheckMethod";
import { thousandsCurrency } from "@/lib/thousandsCurrency";

export default {
  components: {
    message,
    envelope: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/home/redEnvelope"
      )
  },
  props: {
    isShowMoreOut: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  data() {
    return {
      updateBalance: null,
      balanceLock: true,
      btnLock: false,
      timer: null,
      lockSec: 0,

      tranOut: "",
      tranIn: "",

      transferMoney: null,
      balanceList: {},
      total: 0,
      isAutotransfer: "",
      isReceiveAuto: false,
      isNeedShowAutotransferSwitch: false,
      isNeedShowManualtransferSwitch: false,
      AutotransferLock: false,
      recentlyData: {},
      tranOutList: {},
      msg: "",
      isShowMore: true,
      isShowTransOutSelect: false,
      isShowTransInSelect: false,
      transInText: "请选择帐户",
      transOutText: "请选择帐户",
      transInList: [],
      transOutList: [],
      bonus: {},
      isInitTranList: false,
      needShowRedEnvelope: false,
      RedEnvelopeTouchType: true,
      redEnvelopeData: {},
      redJackpotData: { enable: false },
      displayTransferMoney: ""
    };
  },
  watch: {
    transferMoney(val) {
      localStorage.setItem("tranfer-money", val);
    },
    showRedEnvelope() {
      this.needShowRedEnvelope = true;
      this.redEnvelopeData = this.showRedEnvelope;
    },
    isShowTransOutSelect() {
      if (this.isShowTransOutSelect) {
        this.setTranOutList(true);
      }
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      membalance: "getMemBalance",
      siteConfig: "getSiteConfig",
      showRedEnvelope: "getShowRedEnvelope",
      withdrawCheckStatus: "getWithdrawCheckStatus"
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
      return this.siteConfig.ROUTER_TPL;
    },
    balanceInfo() {
      const data = {};

      Object.keys(this.membalance.vendor).forEach(key => {
        if (key === "default") {
          return;
        }

        data[key] = this.membalance.vendor[key];
      });

      return data;
    },
    firstThirdBalanceInfo() {
      const data = {};
      let nums = this.redJackpotData.enable ? 2 : 3;

      Object.keys(this.membalance.vendor)
        .slice(0, nums)
        .forEach(key => {
          if (key === "default") {
            return;
          }

          data[key] = this.membalance.vendor[key];
        });

      return data;
    },
    tipText() {
      return this.$text("S_AUTO_SWITCH", {
        text:
          "切换为【自动转换】模式重新开启游戏平台，系统会自动将主帐户余额转入正在进行中的游戏 (包含新入款成功)。",
        replace: [
          { target: "%s", value: "<br/>" },
          { target: "%s", value: "<br/>" }
        ]
      });
    }
  },
  created() {
    this.isShowMore = this.isShowMoreOut;
    this.actionSetUserdata(true).then(() => {
      this.isAutotransfer = this.memInfo.auto_transfer.enable;

      this.isNeedShowAutotransferSwitch = this.memInfo.config.auto_transfer;
      this.isNeedShowManualtransferSwitch = this.memInfo.config.manual_transfer;
      //只開放單種轉帳 將使用者重設轉帳方式
      if (
        !this.isNeedShowAutotransferSwitch ||
        !this.isNeedShowManualtransferSwitch
      ) {
        if (this.isNeedShowManualtransferSwitch) {
          this.closeAutotransfer();
        } else {
          this.enableAutotransfer();
        }
      }
      this.isReceiveAuto = true;
      //   http://fb.vir888.com/default.asp?438355#3743844
      //   進到轉帳頁面不需自動回收額度
      //   if (this.isAutotransfer) {
      //     this.backAccount();
      //   }
    });
    this.getDomainConfig();
    this.initTranList(true);
    this.getRedJackpot();
  },
  mounted() {
    //   保留輸入資料
    if (localStorage.getItem("form-withdraw-account")) {
      this.transferMoney = localStorage.getItem("tranfer-money") || "";
      this.displayTransferMoney = this.formatThousandsCurrency(
        this.transferMoney
      );
      if (localStorage.getItem("tranfer-tranIn")) {
        this.setTranIn(JSON.parse(localStorage.getItem("tranfer-tranIn")));
      }

      if (localStorage.getItem("tranfer-tranOut")) {
        this.setTranOut(JSON.parse(localStorage.getItem("tranfer-tranOut")));
      }

      localStorage.removeItem("form-withdraw-account");
      localStorage.removeItem("tranfer-money");
      localStorage.removeItem("tranfer-tranIn");
      localStorage.removeItem("tranfer-tranOut");
    }

    this.updateBalance = setInterval(() => {
      this.actionSetUserBalance();
    }, 20000);
  },
  beforeDestroy() {
    clearInterval(this.updateBalance);
    this.updateBalance = null;
  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionSetShowRedEnvelope"
    ]),
    initTranList(reload) {
      this.actionSetUserBalance().then(() => {
        this.setTranInList(reload);
        this.setTranOutList(reload);
        this.transferMoney = null;
        this.displayTransferMoney = "";
        this.isInitTranList = true;
      });
    },
    verification(value) {
      if (!value) {
        return;
      }
      this.transferMoney = value
        .replace(" ", "")
        .trim()
        .replace(/[^0-9]/g, "");

      this.displayTransferMoney = this.transferMoney
        ? this.formatThousandsCurrency(this.transferMoney)
        : "";
    },
    setTranOut(vendor) {
      this.tranOut = vendor.value;
      this.transOutText = vendor.text;
      this.closeSelect();
      this.setTranInList();
      localStorage.setItem("tranfer-tranOut", JSON.stringify(vendor));
    },
    setTranIn(vendor) {
      this.tranIn = vendor.value;
      this.transInText = vendor.text;
      this.closeSelect();
      this.setTranOutList();
      localStorage.setItem("tranfer-tranIn", JSON.stringify(vendor));
    },
    setTranInList(reload) {
      if (reload) {
        this.transInList = [];
        this.tranIn = "";
        this.transInText = "请选择帐户";
      }
      const list = [{ value: "", text: this.$t("S_SELECT_ACCOUNT") }];
      // 維護時不可轉入
      Object.keys(this.membalance.vendor).forEach(index => {
        if (index === this.tranOut) {
          return;
        }
        if (!this.membalance.vendor[index].maintain) {
          const text =
            index === "default"
              ? "中心钱包"
              : this.membalance.vendor[index].text;
          list.push({ value: index, text });
        }
      });
      this.transInList = list;
    },
    setTranOutList(reload) {
      if (reload) {
        this.transOutList = [];
        this.tranOut = "";
        this.transOutText = "请选择帐户";
      }
      const list = [{ value: "", text: this.$t("S_SELECT_ACCOUNT") }];
      // 轉出列表只塞有額度的平台（額度需>=1，只有小數位不允許轉）
      // 維護時不可轉出
      Object.keys(this.membalance.vendor).forEach(index => {
        if (index === this.tranIn) {
          return;
        }

        if (
          this.membalance.vendor[index].amount !== "--" &&
          +this.membalance.vendor[index].balance >= 1 &&
          !this.membalance.vendor[index].maintain
        ) {
          const text =
            index === "default"
              ? "中心钱包"
              : this.membalance.vendor[index].text;
          list.push({ value: index, text });
        }
      });
      this.transOutList = list;
    },
    getBalanceAll(status) {
      if (status === "lockStatus" && this.balanceLock) {
        return new Promise((resolve, reject) => {
          resolve(false);
        });
      }

      this.balanceLock = true;
      return this.actionSetUserBalance().then(() => {
        this.timer = setInterval(() => {
          if (this.lockSec >= 15) {
            clearInterval(this.timer);
            this.lockSec = 0;
            this.balanceLock = false;
            return;
          }
          this.lockSec += 1;
        }, 1000);
      });
    },
    getMaxMoney(balanceList, transferTargetOut) {
      if (balanceList.vendor[transferTargetOut]) {
        this.transferMoney = Math.floor(
          +balanceList.vendor[transferTargetOut].balance
        );

        this.displayTransferMoney = this.formatThousandsCurrency(
          this.transferMoney
        );

        return;
      }

      this.transferMoney = 0;
      this.displayTransferMoney = 0;
    },
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
      this.$emit("update:isShowMoreOut", this.isShowMore);
    },
    closeSelect() {
      this.isShowTransOutSelect = false;
      this.isShowTransInSelect = false;
    },
    setTransInText(value) {
      this.transInText = value;
      this.closeSelect();
    },
    onClickMaintain(value) {
      this.msg = `美东时间：
          <br>
          <span>${value.etc_start_at}</span>
          <p style="margin: 0 ; padding: 0 ; text-align: center">|</p>
          <span>${value.etc_end_at}</span>
          <p></p>
          北京时间：
          <br>
          <span>${value.start_at}</span>
          <p style="margin: 0 ; padding: 0 ; text-align: center">|</p>
          <span>${value.end_at}</span>
        `;
    },
    enableAutotransfer() {
      if (this.isAutotransfer || this.AutotransferLock) {
        return;
      }
      this.AutotransferLock = true;
      mcenter.balanceTranAutoEnable({
        errorAlert: false,
        success: () => {
          // this.actionSetGlobalMessage({ msg: "回收成功" });
          this.isAutotransfer = true;
          this.backAccount({}, true);
          this.actionSetUserdata(true);

          this.AutotransferLock = false;
        },
        fail: error => {
          this.isAutotransfer = false;
          this.AutotransferLock = false;
          this.actionSetGlobalMessage({ msg: error.data.msg });
        }
      });

      this.getRecentlyOpened();
    },
    closeAutotransfer() {
      if (!this.isAutotransfer || this.AutotransferLock) {
        return;
      }
      this.AutotransferLock = true;
      mcenter.balanceTranAutoClose({
        success: () => {
          this.actionSetGlobalMessage({ msg: "切换成功" });
          this.isAutotransfer = false;
          this.actionSetUserdata(true);

          this.AutotransferLock = false;

          this.initTranList(true);
        },
        fail: () => {
          this.isAutotransfer = true;
          this.AutotransferLock = false;
        }
      });
    },
    backAccount({ afterSetUserBalance } = {}, fromAuto) {
      mcenter.balanceTranBack({
        success: () => {
          this.lockSec = 0;
          this.actionSetUserBalance().then(() => {
            // if (!fromAuto) {
            //   this.actionSetGlobalMessage({ msg: "回收成功" });
            // }
            this.tranOut = "";
            if (afterSetUserBalance) {
              afterSetUserBalance();
            }
          });
        },
        fail: res => {
          this.actionSetGlobalMessage({ msg: res.data.msg || "系统错误" });
        }
      });
    },
    handleSubmit() {
      this.sendBalanceTran();
    },
    sendBalanceTran() {
      // 阻擋連續點擊
      if (this.btnLock) {
        return;
      }

      this.btnLock = true;

      const re = /^[1-9]*[1-9][0-9]*$/;
      const source = this.tranOut;
      const target = this.tranIn;
      const money = this.transferMoney;

      let isError = false;

      if (+source === 0 || +target === 0) {
        this.actionSetGlobalMessage({ msg: this.$t("S_SELECT_ACCOUNT") });
        isError = true;
      }

      if (money === "") {
        this.actionSetGlobalMessage({ msg: this.$t("S_AMOUNT_NULL_VALUE") });
        isError = true;
      }

      if (!re.test(money)) {
        this.actionSetGlobalMessage({ msg: this.$t("S_DAW_ONLY_INT") });
        isError = true;
      }

      if (isError) {
        setTimeout(() => {
          this.btnLock = false;
        }, 1500);
        return;
      }

      if (!this.RedEnvelopeTouchType) {
        mcenter.balanceTran(
          {
            params: {
              amount: money
            },
            success: () => {
              this.actionSetGlobalMessage({ msg: "转帐成功" });
              localStorage.removeItem("tranfer-money");
              localStorage.removeItem("tranfer-tranIn");
              localStorage.removeItem("tranfer-tranOut");

              this.lockSec = 0;
              setTimeout(() => {
                this.btnLock = false;
              }, 1500);
              this.actionSetUserBalance();
              this.isInitTranList = false;
              this.initTranList(true);
            },
            fail: res => {
              setTimeout(() => {
                this.btnLock = false;
              }, 1500);
              this.actionSetGlobalMessage({
                code: res.data.code,
                origin: "balanceTrans",
                msg: res.data.msg
              });
            }
          },
          source,
          target
        );
      } else {
        this.RedEnvelopeTouchType = false;
        goLangApiRequest({
          method: "get",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/Drawing/GetDrawing`,
          params: {
            cid: getCookie("cid")
          }
        }).then(res => {
          // console.log(res);
          if (res.status === "000") {
            if (res.data.status != -1) {
              this.actionSetShowRedEnvelope(res.data);
            } else {
              mcenter.balanceTran(
                {
                  params: {
                    amount: money
                  },
                  success: () => {
                    this.actionSetGlobalMessage({ msg: "转帐成功" });
                    localStorage.removeItem("tranfer-money");
                    localStorage.removeItem("tranfer-tranIn");
                    localStorage.removeItem("tranfer-tranOut");

                    this.lockSec = 0;
                    setTimeout(() => {
                      this.btnLock = false;
                    }, 1500);
                    this.actionSetUserBalance();
                    this.isInitTranList = false;
                    this.initTranList(true);
                  },
                  fail: res => {
                    setTimeout(() => {
                      this.btnLock = false;
                    }, 1500);
                    this.actionSetGlobalMessage({
                      code: res.data.code,
                      origin: "balanceTrans",
                      msg: res.data.msg
                    });
                  }
                },
                source,
                target
              );
            }
          }
        });
      }
    },
    getRecentlyOpened() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Last`
      }).then(res => {
        if (res && res.status === "000") {
          this.recentlyData = res.data;
        }
      });
    },

    closeEvelope() {
      this.needShowRedEnvelope = false;
      this.initTranList(true);
      this.actionSetGlobalMessage({
        msg: "红包派发中，到帐后即可畅玩游戏"
      });
    },
    getRedJackpot() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Event/Info`,
        headers: {
          cid: getCookie("cid")
        },
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        // console.log(res);
        if (res.errorCode === "00" && res.status === "000") {
          this.redJackpotData = res.data;
        } else {
          this.redJackpotData = null;
        }
      });
    },
    getDomainConfig() {
      return axios({
        method: "get",
        url: "/api/v2/c/domain-config"
      })
        .then(res => {
          if (res && res.data && res.data.ret) {
            if (res.data.ret.gift_card) {
              // 紅利帳戶api C02.112
              goLangApiRequest({
                method: "get",
                url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Gift/Card`
              }).then(res => {
                if (res && res.status === "000") {
                  this.bonus = res.data.total;
                }
              });
            }
          }
        })
        .catch(res => {
          this.actionSetGlobalMessage({
            msg: res.response.data.msg,
            code: res.response.data.code,
            origin: "home"
          });
        });
    },
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
