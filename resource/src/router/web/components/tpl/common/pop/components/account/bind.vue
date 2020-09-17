<template>
  <div
    :class="`${!select.verification ? 'no-verification' : ''} account-pop-bind`"
  >
    <div
      v-if="select.key === 'email'"
      :class="
        `${!infoSelect && !select.verification ? 'alone' : ''} account-pop-text`
      "
    >
      {{ $t("S_SECURITY_LEVEL") }}
    </div>
    <div
      :class="
        `${!infoSelect && select.key === 'phone' ? 'no-radio' : ''} clearfix`
      "
    >
      <!-- 填寫舊資料欄位(原信箱有資料且狀態為already才會顯示) -->
      <select
        v-if="
          infoSelect && select.status === 'already' && select.key === 'phone'
        "
        v-model="oldCountryCode"
        :class="{ 'no-verification': !select.verification }"
      >
        <template v-for="value in options">
          <option :key="value" :value="value">{{ value }}</option>
        </template>
      </select>
      <div
        v-if="infoSelect && select.status === 'already'"
        class="account-pop-field main-input"
      >
        <input
          v-model="bindOld"
          :placeholder="
            `${
              select.key === 'email'
                ? $t('S_ORIGINAL_EMAIL')
                : $t('S_ORIGINAL_PHONE')
            }`
          "
          type="text"
        />
      </div>
      <select
        v-if="select.key === 'phone'"
        v-model="newCountryCode"
        :class="{ 'no-verification': !select.verification }"
      >
        <template v-for="value in options">
          <option :key="value" :value="value">{{ value }}</option>
        </template>
      </select>
      <div
        :class="
          `${
            select.verification ? 'verification' : ''
          } account-pop-field main-input`
        "
      >
        <input v-model="bindNew" :placeholder="selectNewText" type="text" />
      </div>
      <!-- 選擇短信或語音(電話才會顯示) 先隱藏 -->
      <!-- <select v-if="select.key==='phone' && select.verification" v-model="bindType">
                <option value="message">{{ $t('S_SMS_RECEPTION') }}</option>
                <option value="voice">{{ $t('S_VOICE_RECEPTION') }}</option>
            </select> -->
      <div
        v-if="select.verification"
        :title="$t('S_SEND_CHECK_CODE')"
        :class="`main-btn${btnLock ? ' lock' : ''}`"
        @click="bindSend(select.key)"
      >
        <template v-if="!btnLock">
          {{ $t("S_SEND_CHECK_CODE") }}
        </template>
        <template v-else>
          {{ $t("S_SEND_CHECK_CODE_ALREADY") }}(<span>{{ timer }}</span
          >)
        </template>
      </div>
      <div v-if="select.verification" class="account-pop-field main-input code">
        <input v-model="code" :placeholder="$t('S_CHECK_CODE')" type="text" />
      </div>
    </div>
    <div v-if="btnLock" class="account-pop-tip">
      {{ checkCodeText }}
      <template v-if="select.key === 'email'">
        {{ $t("S_FIND_TRASH") }}
      </template>
    </div>
    <div
      class="account-pop-btn"
      @click="
        select.verification ? bindCheck(select.key) : setUserData(select.key)
      "
    >
      {{ $t("S_JM_SURE_SEND") }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import agent from '@/api/agent';
import mcenter from '@/api/mcenter';
import agcenter from '@/api/agcenter';
import ajax from '@/lib/ajax';

export default {
  props: {
    select: {
      type: Object,
      default: () => ({})
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      apiSelect: this.select.position === 'member' ? mcenter : agcenter,
      infoSelect: '',
      bindOld: '',
      bindNew: '',
      bindType: 'message',
      code: '',
      btnLock: false,
      timer: 0,
      Interval: '',
      options: [],
      oldCountryCode: '',
      newCountryCode: '',
      apiLock: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      agentInfo: 'getAgentInfo'
    }),
    selectNewText() {
      // 判斷身份以及手機信箱是否已驗證
      if (this.infoSelect && this.select.status === 'already') {
        if (this.select.key === 'email') {
          return this.$t('S_NEW_EMAIL');
        }

        return this.$t('S_NEW_PHONE');
      }

      return this.$t(this.select.text);
    },
    checkCodeText() {
      // 目前驗證碼時間為 5 分鐘
      return this.$t('S_SEND_CHECK_CODE_VALID_TIME').replace('%s', '五');
    }
  },
  created() {
    const { key } = this.select;

    // 判斷該取信箱還是手機的api
    const type = key === 'email' ? 'accountMailSec' : 'accountPhoneSec';

    // 判斷身份是會員或代理 取對應資料
    this.infoSelect = this.select.position === 'member' ? this.memInfo[key][key] : this.agentInfo[key][key];

    // 判斷該取會員還是代理的api
    const configSelect = this.select.position === 'member' ? member.joinConfig : agent.joinConfig;

    // 取 會員或代理(apiSelect) 的 信箱或手機(type) 驗證倒數秒數
    configSelect({
      success: (response) => {
        this.select.verification = response.ret[key].code;
        if (response.ret[key].code) {
          this.apiSelect[type]({
            success: (data) => {
              if (data.ret > 0) {
                this.timer = data.ret;
                this.lock();
              }
            }
          });
        }
      }
    });

    const position = this.select.position === 'member' ? 'player' : 'agent';

    ajax({
      method: 'get',
      url: `/api/v1/c/${position}/country_codes`,
      success: ({ result, ret }) => {
        if (result !== 'ok') {
          return;
        }

        this.options = ret;
        this.oldCountryCode = ret[0];
        this.newCountryCode = ret[0];
      }
    });
  },
  destroyed() {
    clearInterval(this.Interval);
  },
  methods: {
    ...mapActions([
      'actionSetPop',
      'actionSetUserdata',
      'actionSetAgentdata'
    ]),
    lock() {
      this.btnLock = true;
      if (this.timer === 0) {
        this.timer = this.select.key === 'email' ? 30 : 60;
      }
      this.Interval = setInterval(() => {
        if (this.timer === 0) {
          this.apiLock = false;
          this.btnLock = false;
          clearInterval(this.Interval);
          return;
        }
        this.timer -= 1;
      }, 1000);
    },
    // 不驗證直接設定信箱/手機
    setUserData(key) {
      const type = this.select.key === 'email' ? 'accountMailEdit' : 'accountPhoneEdit';
      let sendInfo;

      if (key === 'email') {
        sendInfo = {
          email: this.bindNew
        };
      } else {
        sendInfo = {
          phone: `${this.newCountryCode.replace('+', '')}-${this.bindNew}`
        };
      }

      this.apiSelect[type]({
        params: sendInfo,
        success: () => {
          if (this.select.position === 'member') {
            this.actionSetUserdata(true);
          } else {
            this.actionSetAgentdata(true);
          }

          alert(this.$t('S_EDIT_SUCCESS'));
          this.actionSetPop();
        }
      });
    },
    // 寄出驗證信箱的信件/手機的簡訊
    bindSend(key) {
      if (this.apiLock) {
        return;
      }
      this.apiLock = true;
      const type = this.select.key === 'email' ? 'accountMailSend' : 'accountPhoneSend';
      let sendInfo;

      if (key === 'email') {
        sendInfo = {
          old_email: '',
          email: this.bindNew
        };
        if (this.infoSelect) {
          sendInfo.old_email = (this.select.status === 'ok') ? this.bindNew : this.bindOld;
        }
      } else {
        sendInfo = {
          old_phone: '',
          phone: `${this.newCountryCode.replace('+', '')}-${this.bindNew}`,
          kind: this.bindType
        };
        if (this.infoSelect) {
          sendInfo.old_phone = (this.select.status === 'ok') ? `${this.newCountryCode.replace('+', '')}-${this.bindNew}` : `${this.oldCountryCode.replace('+', '')}-${this.bindOld}`;
        }
      }

      this.apiSelect[type]({
        params: sendInfo,
        success: () => {
          if (this.select.position === 'member') {
            this.actionSetUserdata(true);
          } else {
            this.actionSetAgentdata(true);
          }

          this.lock();
        },
        fail: () => {
          this.apiLock = false;
        }
      });
    },
    // 驗證信箱 / 手機
    bindCheck(key) {
      // 判斷該取信箱還是手機的api
      const type = this.select.key === 'email' ? 'accountMailCheck' : 'accountPhoneCheck';

      let checkInfo;

      if (key === 'email') {
        checkInfo = {
          email: this.bindNew,
          keyring: this.code
        };
      } else {
        checkInfo = {
          phone: `${this.newCountryCode.replace('+', '')}-${this.bindNew}`,
          keyring: this.code
        };
      }

      this.apiSelect[type]({
        params: checkInfo,
        success: () => {
          alert(this.$t('S_CR_SUCCESS'));
          this.actionSetPop();
          if (this.select.position === 'member') {
            this.actionSetUserdata(true);
          } else {
            this.actionSetAgentdata(true);
          }
        }
      });
    }
  }
};
</script>
