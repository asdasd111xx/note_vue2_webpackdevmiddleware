<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <div :class="[$style.wrap, 'clearfix']">
        <!-- 錯誤訊息 -->
        <div :class="$style['top-tips']">
          <div v-show="tipMsg">
            {{ tipMsg }}
          </div>
        </div>

        <template v-if="oldEmail.isShow">
          <div :class="$style.block">
            <div :class="$style.title">{{ oldEmail.label }}</div>
            <div :class="$style['input-wrap']">
              <input
                v-model="oldValue"
                :placeholder="oldEmail.label"
                :class="$style.input"
                type="text"
              />
            </div>
          </div>
        </template>

        <template v-if="newEmail.isShow">
          <div :class="$style.block">
            <div :class="$style.title">
              {{ $text("S_NEW_EMAIL2", "邮箱账号") }}
            </div>
            <div :class="$style['input-wrap']">
              <input
                v-model="newValue"
                :placeholder="$text('S_PLS_ENTER_NEW_EMAIL', '请输入邮箱账号')"
                :class="$style.input"
                type="text"
              />
            </div>
          </div>
        </template>

        <template v-if="checkCode.isShow">
          <div :class="$style.block">
            <div :class="$style.title">
              {{ $text("S_MAIL_CHECK_CODE", "邮箱验证码") }}
            </div>
            <div :class="$style['input-wrap']">
              <input
                v-model="codeValue"
                :placeholder="
                  $text('S_PLS_ENTER_MAIL_CODE', '请输入邮箱验证码')
                "
                :class="$style.input"
                type="text"
              />

              <div
                v-if="sendBtn.isShow"
                :class="[
                  $style['btn-send'],
                  { [$style.active]: newValue && !timer }
                ]"
                @click="handleSend()"
              >
                <template>
                  <span v-if="sendBtn.countdownSec">{{
                    `${countdownSec}s`
                  }}</span>
                  <span v-else> {{ sendBtn.label }} </span>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
      <!-- <service-tips /> -->
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import ajax from '@/lib/ajax';
import member from '@/api/member';
import mcenter from '@/api/mcenter';
import mobileContainer from '../../../../../common/new/mobileContainer';
import serviceTips from '../../serviceTips';

export default {
  components: {
    mobileContainer,
    serviceTips
  },
  data() {
    return {
      oldValue: '',
      newValue: '',
      codeValue: '',
      tipMsg: '',
      timer: '',
      countdownSec: 0,

      info: {
        key: 'email',
        text: 'SS_E_MAIL',
        status: '',
        value: '',
        needVerification: true,
        isShow: true
      }
    };
  },
  created() {
    // 取得欄位資訊
    ajax({
      method: 'get',
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then((response) => {
      if (response && response.result === 'ok') {
        this.info.needVerification = response.ret.config[this.info.key].code;
        this.info.isShow = response.ret.config[this.info.key].display;
      }
    });

    member.joinConfig({
      success: (response) => {
        if (response.ret.email.code) {
          mcenter.accountMailSec({
            success: (data) => {
              if (data.ret > 0) {
                this.countdownSec = data.ret;
                this.locker();
              }
            }
          });
        }
      }
    });
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      webInfo: 'getWebInfo'
    }),
    fieldValue() {
      return this.memInfo.email.email;
    },
    oldEmail() {
      return {
        label: this.$text('S_ORIGINAL_EMAIL'),
        isShow: this.fieldValue && this.info.status === 'already'
      };
    },
    newEmail() {
      return {
        label: this.fieldValue && this.info.status === 'already'
          ? this.$text('S_NEW_EMAIL')
          : this.$text('SS_E_MAIL'),
        isShow: true
      };
    },
    checkCode() {
      return {
        label: this.$text('S_CHECK_CODE'),
        isShow: this.info.needVerification
      };
    },
    sendBtn() {
      return {
        label: this.countdownSec
          ? this.$text('S_SEND_CHECK_CODE_ALREADY')
          : this.$text('S_SEND_CHECK_CODE'),
        isShow: this.info.needVerification,
        countdownSec: this.countdownSec
      };
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_E_MAIL', '电子邮箱'),
        onClickFunc: () => {
          this.handleSubmit();
        },
        funcBtn: this.$text('S_COMPLETE', '完成'),
        funcBtnActive: !!(this.newValue) && (this.info.needVerification ? !!(this.codeValue) : true)
      };
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    ...mapActions([
      'actionSetUserdata',
      'actionSetＭcenterBindMessage'
    ]),
    locker() {
      if (this.countdownSec === 0) {
        this.countdownSec = 60;
      }

      this.timer = setInterval(() => {
        if (this.countdownSec === 0) {
          clearInterval(this.timer);
          this.timer = null;
          return;
        }
        this.countdownSec -= 1;
      }, 1000);
    },
    handleSend(send) {
      if (!this.newValue || this.timer) return;

      const getOldEmail = () => {
        if (this.fieldValue) {
          return this.info.status === 'ok' ? this.newValue : this.oldValue;
        }
        return '';
      };

      mcenter.accountMailSend({
        params: {
          old_email: getOldEmail(),
          email: this.newValue
        },
        success: () => {
          this.actionSetUserdata(true);
          this.locker();
          this.tipMsg = `${this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", 5)}${this.$text("S_FIND_TRASH")}`
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.tipMsg = `${res.data.msg}`;
          }
        }
      });
    },
    handleSubmit() {
      // 驗證信箱
      if (this.info.needVerification) {
        return mcenter.accountMailCheck({
          params: {
            email: this.newValue,
            keyring: this.codeValue
          },
          success: () => {
            this.actionSetUserdata(true);
            this.tipMsg = this.$text('S_CR_SUCCESS');
            this.$router.push('/mobile/mcenter/accountData');
            this.successMessage();
          },
          fail: (res) => {
            if (res && res.data && res.data.msg) {
              this.tipMsg = `${res.data.msg}`;
            }
          }
        });
      }

      // 不驗證直接設定信箱
      return mcenter.accountMailEdit({
        params: {
          email: this.newValue
        },
        success: () => {
          this.actionSetUserdata(true);
          this.tipMsg = this.$text('S_CR_SUCCESS');
          this.$router.push('/mobile/mcenter/accountData');
          this.successMessage();
        },
        fail: (res) => {
          if (res && res.data && res.data.msg) {
            this.tipMsg = `${res.data.msg}`;
          }
        }
      });
    },
    successMessage() {
      this.actionSetＭcenterBindMessage({
        msg: this.$text('S_BIND_SUCCESSFULLY', '绑定成功'),
        msgIcon: true
      });
    }
  }
};
</script>
<style src="../../css/index.module.scss" lang="scss" module>
