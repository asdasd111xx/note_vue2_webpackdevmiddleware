<template>
  <div :class="$style['add-bankcard']">
    <div :class="$style['card-info']">
      <p :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]">
        {{ errorMsg }}
      </p>

      <div :class="$style['info-item']">
        <p :class="$style['input-title']">
          {{ $text("S_WALLET_TYPE", "钱包类型") }}
        </p>

        <div :class="$style['select-bank']" @click="isShowPop = true">
          <span :class="{ [$style['select-active']]: currentVBank }">
            {{
              currentVBank
                ? currentVBank
                : $text("S_SELECT_WALLET_TYPE", "请选择钱包类型")
            }}
          </span>

          <img
            :class="$style['arrow-icon']"
            src="/static/image/ey1/common/arrow_next.png"
          />
        </div>
      </div>

      <div v-if="currentVBank" :class="$style['info-item']">
        <p :class="$style['input-title']">
          {{ $text("S_WALLET_ADDRESS", "钱包地址") }}
        </p>

        <div
          :class="[
            $style['input-wrap'],
            { [$style['disable']]: isGoBaoWallet }
          ]"
        >
          <input
            v-model.trim="formData.walletAddress"
            type="text"
            :placeholder="placeholdTips"
          />
        </div>

        <div
          v-if="formData.bank_id === 21 || isGoBaoWallet"
          :class="$style['qrcode']"
          @click="isShowPopQrcode = true"
        >
          <img
            :src="
              $getCdnPath('/static/image/ey1/mcenter/bankCard/ic_qrcode.png')
            "
            alt="qrcode"
          />
        </div>
      </div>

      <div v-if="formData.bank_id === 21" :class="$style['info-item']">
        <p :class="$style['input-title']">
          CGP安全防护码
        </p>
        <div :class="$style['input-wrap']">
          <input
            v-model.trim="formData.cgpPwd"
            type="number"
            placeholder="请输入CGP安全防护码"
          />
        </div>
      </div>

      <div v-if="!isGoBaoWallet" :class="$style['info-confirm']">
        <div
          :class="[$style['submit'], { [$style['disabled']]: lockStatus }]"
          @click="submitData"
        >
          {{ $text("S_CONFIRM", "确认") }}
        </div>
      </div>
    </div>

    <div v-if="isShowPop" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" @click="isShowPop = false" />
      <div :class="$style['pop-menu']">
        <div :class="$style['pop-title']">
          <span @click="isShowPop = false">
            {{ $text("S_CANCEL", "取消") }}
          </span>
          请选择钱包类型
        </div>

        <ul :class="$style['pop-list']">
          <li v-for="item in vBankList" :key="item.id" @click="setBank(item)">
            <img v-lazy="getBankImage(item.swift_code)" />
            {{ item.name }}
            <icon
              v-if="item.id === formData.bank_id"
              :class="$style['select-icon']"
              name="check"
            />
          </li>
        </ul>
      </div>
    </div>

    <popup-qrcode
      v-if="isShowPopQrcode"
      :isShowPop.sync="isShowPopQrcode"
      :walletId="formData.bank_id"
    />

    <message v-if="msg" @close="clearMsg">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import virtualBankMixin from "@/mixins/mcenter/bankCard/addCard/virtualBank";
import message from "@/router/mobile/components/common/message";
import popupQrcode from "@/router/mobile/components/common/virtualBank/popupQrcode";

export default {
  components: {
    message,
    popupQrcode
  },
  props: {
    changePage: {
      type: Function,
      default: () => {}
    },
    showTab: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      vBankList: [],
      currentVBank: "",
      isShowPop: false,
      isShowPopQrcode: false,
      isGoBaoWallet: false,
      formData: {
        bank_id: "",
        cgpPwd: "",
        walletAddress: ""
      },
      placeholdTips: "",
      lockStatus: false,
      errorMsg: "",
      msg: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    showPopQrcode: {
      get() {
        return this.showPopupQrcode;
      },
      set(value) {
        this.showPopupQrcode = value;
      }
    }
  },
  watch: {
    "formData.bank_id"(value) {
      // 不確定點擊相同錢包時，是否要清除資料?假如有，將以下 code 搬至 setBank
      this.formData.cgpPwd = "";
      this.formData.walletAddress = "";
      this.isGoBaoWallet = false;

      switch (value) {
        case 21:
          this.placeholdTips = "请输入CGP邮箱/手机号或扫扫二维码";
          break;
        case 33:
          this.placeholdTips = "请输入比特币取款地址";
          break;
        case 34:
          this.placeholdTips = "请输入Ecopayz取款帐号";
          break;
        case 35:
          this.placeholdTips = "请输入iWallet取款帐号";
          break;
        case 36:
          this.placeholdTips = "请输入STICPAY注册信箱";
          break;
        case 37:
          this.placeholdTips = "请点击二維碼綁定";
          this.isGoBaoWallet = true;
          break;
        case 38:
          this.placeholdTips = "请输入VenusPoint取款帐号";
          break;
      }
    }
  },
  created() {
    this.getVirtualBankList();
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetGlobalMessage"]),
    setBank(bank) {
      this.isShowPop = false;
      this.currentVBank = bank.name;
      this.formData.bank_id = bank.id;
    },
    getVirtualBankList() {
      axios({
        method: "get",
        url: "/api/payment/v1/c/virtual/bank/list"
      }).then(res => {
        if (!res.data || res.data.result !== "ok") {
          return;
        }

        this.vBankList = res.data.ret;
      });
    },
    submitData() {
      if (this.lockStatus) {
        return;
      }

      this.lockStatus = true;
      this.errorMsg = "";

      axios({
        method: "post",
        url: "/api/v1/c/player/user_virtual_bank",
        data: {
          address: this.formData.walletAddress,
          payment_gateway_id: this.formData.bank_id
        }
      })
        .then(res => {
          this.lockStatus = false;
          // Todo 將所有 msg 替換成 actionSetGlobalMessage
          this.actionSetGlobalMessage({ msg: "绑定成功" });
          this.showTab(true);
          this.changePage("virtualBankCardInfo");
        })
        .catch(res => {
          if (res.response && res.response.data && res.response.data.msg) {
            this.errorMsg = `${res.response.data.msg}[${res.response.data.code}]`;
            this.lockStatus = false;
            return;
          }
        });
    },
    clearMsg() {
      const { query } = this.$route;
      if (!this.msg.includes("绑定成功")) {
        this.msg = "";
        return;
      }

      // 綁定成功後添加成功後回到遊戲 影片
      this.msg = "";
      let redirect = query.redirect;
      if (!redirect) {
        this.changePage("virtualBankCardInfo");
        return;
      }

      let split = redirect.split("-");
      if (split.length === 2) {
        this.$router.push(`/mobile/${split[0]}/${split[1]}`);
        return;
      }

      // 有分類的遊戲大廳 card casino
      if (split.length === 3) {
        this.$router.push(`/mobile/${split[0]}/${split[1]}?label=${split[2]}`);
        return;
      }

      switch (redirect) {
        case "deposit":
          this.$router.push(`/mobile/mcenter/deposit`);
          return;
        case "wallet":
          this.$router.push(`/mobile/mcenter/wallet`);
          return;
        case "withdraw":
        case "balanceTrans":
          this.$router.push(`/mobile/mcenter/${redirect}`);
          return;
        case "liveStream":
        case "home":
          this.$router.push(`/mobile/${redirect}`);
          return;
        default:
          this.changePage("virtualBankCardInfo");
          return;
      }
    },

    verifyNumber(e) {
      const regex = /^[0-9]+$/;
      if (!regex.test(e.key)) {
        e.preventDefault();
      }
    },
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath(
          "/static/image/_new/default/bank_default_2.png"
        ),
        loading: this.$getCdnPath(
          "/static/image/_new/default/bank_default_2.png"
        )
      };
    }
  }
};
</script>

<style lang="scss" src="../css/addCard.module.scss" module />
