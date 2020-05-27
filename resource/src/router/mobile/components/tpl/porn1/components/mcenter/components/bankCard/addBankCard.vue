<template>
  <div :class="$style['add-bankcard']">
    <template v-if="addBankCardStep === 'one'">
      <div :class="$style['username-wrap']">
        <p :class="$style['input-title']">持卡人姓名</p>
        <div :class="$style['input-wrap']">
          <div
            v-if="memInfo.user.name"
            :class="[
              $style['input-wrap'],
              { [$style['has-name']]: memInfo.user.name }
            ]"
          >
            {{ username }}
          </div>
          <input
            v-else
            v-model="formData.account_name"
            type="text"
            placeholder="请输入持卡人姓名，仅支持中文、英文、“·”"
            @input="checkData"
          />
        </div>
      </div>
      <p v-if="!memInfo.user.name" :class="$style['username-remind']">
        为了您的资金能够迅速到账，请确保填写的姓名与银行卡的开户姓名一致
      </p>
    </template>
    <div :class="$style['card-info']">
      <template v-if="addBankCardStep === 'one'">
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">所属银行</p>
          <div :class="$style['select-bank']" @click="isShowPop = true">
            <span :class="{ [$style['select-active']]: currentBank }">{{
              currentBank ? currentBank : "请选择银行"
            }}</span>
            <img
              :class="$style['arrow-icon']"
              src="/static/image/_new/common/arrow_next.png"
            />
          </div>
        </div>
        <!-- <div :class="$style['info-item']">
                    <p :class="$style['input-title']">省/直辖市</p>
                    <div :class="$style['input-wrap']">
                        <input
                            v-model.trim="formData.province"
                            type="text"
                            placeholder="请输入省/直辖市"
                            maxlength="36"
                            @input="checkData"
                        />
                    </div>
                </div>
                <div :class="$style['info-item']">
                    <p :class="$style['input-title']">县/市</p>
                    <div :class="$style['input-wrap']">
                        <input
                            v-model.trim="formData.city"
                            type="text"
                            placeholder="请输入县/市"
                            maxlength="36"
                            @input="checkData"
                        />
                    </div>
                </div> -->
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">开户支行</p>
          <div :class="$style['input-wrap']">
            <input
              v-model.trim="formData.branch"
              type="text"
              placeholder="请输入开户支行名称"
              maxlength="36"
              @input="checkData"
            />
          </div>
        </div>
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">银行卡号</p>
          <div :class="$style['input-wrap']">
            <input
              v-model="formData.account"
              type="number"
              placeholder="请输入银行卡卡号(限定16位以上数字)"
              minlength="16"
              maxlength="19"
              @input="checkData"
            />
          </div>
        </div>
      </template>
      <template v-if="addBankCardStep === 'two'">
        <p :class="[$style['error-msg'], { [$style['is-hide']]: !errorMsg }]">
          {{ errorMsg }}
        </p>
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">手机号码</p>
          <div :class="$style['input-wrap']">
            <input
              v-model="formData.phone"
              type="number"
              placeholder="11位手机号码"
              maxlength="36"
              @input="checkData"
            />
          </div>
        </div>
        <div :class="$style['info-item']">
          <p :class="$style['input-title']">手机验证码</p>
          <div :class="$style['input-wrap']">
            <input
              v-model="formData.keyring"
              type="number"
              placeholder="请输入手机验证码"
              maxlength="36"
              @input="checkData"
            />
            <div
              :class="[$style['send-keyring'], { [$style.disabled]: mustWait }]"
              @click="getKeyring"
            >
              {{ time ? `${time}s` : "获取验证码" }}
            </div>
          </div>
        </div>
      </template>
      <div :class="$style['info-confirm']">
        <p :class="$style['confirm-remind']">
          {{
            addBankCardStep === "one"
              ? "请认真校对银行卡号，卡号错误资金将无法到帐"
              : "手机号码将有助于您找回帐号，同时也是客服人员确认您身份的重要依据。"
          }}
        </p>
        <div
          :class="[$style['submit'], { [$style['disabled']]: !NextStepStatus }]"
          @click="sendData"
        >
          {{
            addBankCardStep === "one" && memInfo.config.player_user_bank_mobile
              ? "下一步"
              : "提交"
          }}
        </div>
      </div>
    </div>
    <p :class="$style['service-remind']">
      如需帮助，请<span
        :class="$style['service-btn']"
        @click="$router.push('/mobile/service')"
        >联系客服</span
      >
    </p>

    <div v-if="isShowPop" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" @click="isShowPop = false" />
      <div :class="$style['pop-menu']">
        <div :class="$style['pop-title']">
          <span @click="isShowPop = false">{{
            $text("S_CANCEL", "取消")
          }}</span>
          选择所属银行
        </div>
        <ul :class="$style['pop-list']">
          <li v-for="item in bankList" :key="item.id" @click="setBank(item)">
            <!-- <img :src="`https://bbos.bbin-asia.com/elibom/bank/${item.id}.png`" /> -->
            <img v-lazy="getImg(item.id)" />
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
    <message v-if="msg" @close="clearMsg">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import message from '../../../common/new/message';

export default {
  components: {
    message
  },
  props: {
    changePage: {
      type: Function,
      default: () => { }
    },
    addBankCardStep: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      bankList: [],
      currentBank: '',
      isShowPop: false,
      formData: {
        account_name: '',
        bank_id: '',
        // province: '',
        // city: '',
        branch: '',
        account: '',
        phone: '',
        keyring: ''
      },
      NextStepStatus: false,
      errorMsg: '',
      lockStatus: false,
      mustWait: false,
      time: 0,
      msg: ''

    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    username() {
      if (!this.memInfo.user.name) {
        return '';
      }

      return this.memInfo.user.name.split('').map((item, index) => {
        if (index === 0) {
          return item;
        }
        return '*';
      }).join('');
    }
  },
  watch: {
    addBankCardStep() {
      if (this.addBankCardStep === 'one') {
        this.formData.phone = '';
        this.formData.keyring = '';
        this.errorMsg = '';
        this.checkData();
      }
    }
  },
  created() {
    this.formData.account_name = this.memInfo.user.name;

    ajax({
      method: 'get',
      url: '/api/payment/v1/c/withdraw/bank/list',
      errorAlert: false
    }).then((response) => {
      if (!response || response.result !== 'ok') {
        return;
      }

      this.bankList = response.ret;
    });
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    sendData() {
      if (this.addBankCardStep === 'one' && this.memInfo.config.player_user_bank_mobile) {
        this.NextStepStatus = false;
        this.$emit('update:addBankCardStep', 'two');
        return;
      }

      if (this.lockStatus) {
        return;
      }

      this.lockStatus = true;

      const params = {
        ...this.formData,
        phone: `86-${this.formData.phone}`
      };

      ajax({
        method: 'post',
        url: '/api/v1/c/player/user_bank',
        errorAlert: false,
        params,
        success: () => {
          this.msg = '绑定成功';
          this.lockStatus = false;
          if (!this.memInfo.user.name) {
            this.actionSetUserdata(true);
          }
        },
        fail: (error) => {
          this.lockStatus = false;
          this.errorMsg = error.data.msg;
        }
      });
    },
    clearMsg() {
      const { query } = this.$route;
      this.msg = '';

      let redirect = query.redirect;
      if (!redirect) {
        this.changePage('bankCardInfo');
        return;
      }

      // 預設提現銀行卡添加成功後回到遊戲 影片
      let split = redirect.split('-');
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
        case "withdraw":
        case "balanceTrans":
          this.$router.push(`/mobile/mcenter/${redirect}`);
          return;
        case "liveStream":
        case "home":
          this.$router.push(`/mobile/${redirect}`);
          return
        default:
          this.changePage('bankCardInfo');
          return;
      }
    },
    setBank(bank) {
      this.isShowPop = false;
      this.formData.bank_id = bank.id;
      this.currentBank = bank.name;
      this.checkData();
    },
    checkData() {
      this.NextStepStatus = Object.keys(this.formData).every((key) => {
        if (this.addBankCardStep === 'one') {
          if (key === 'account') {
            return this.formData[key].length > 15;
          }
          if (key !== 'phone' && key !== 'keyring') {
            return this.formData[key];
          }
          return true;
        }

        if (this.addBankCardStep === 'two') {
          if (key === 'phone' || key === 'keyring') {
            this.errorMsg = '';
            return this.formData[key];
          }
          return true;
        }

        return true;
      });
    },
    getImg(id) {
      return {
        src: `https://images.dormousepie.com/icon/cardBank/${id}.png`,
        error: this.$getCdnPath('/static/image/_new/default/bank_card_default.png'),
        loading: this.$getCdnPath('/static/image/game_loading_s.gif')
      };
    },
    getKeyring() {
      if (this.lockStatus) {
        return;
      }

      this.lockStatus = true;

      ajax({
        method: 'post',
        url: '/api/v1/c/player/verify/user_bank/sms',
        errorAlert: false,
        params: {
          phone: `86-${this.formData.phone}`
        },
        success: () => {
          ajax({
            method: 'get',
            url: '/api/v1/c/player/phone/ttl',
            errorAlert: false,
            success: ({ ret }) => {
              this.lockStatus = false;
              this.mustWait = true;
              this.time = ret;
              const timer = () => {
                setTimeout(() => {
                  if (this.time === 1) {
                    this.mustWait = false;
                  }

                  if (this.time <= 0) {
                    return;
                  }
                  this.time -= 1;
                  timer();
                }, 1000);
              };
              timer();
            },
            fail: (error) => {
              this.lockStatus = false;
              this.errorMsg = error.data.msg;
            }
          });
        },
        fail: (error) => {
          this.lockStatus = false;
          this.errorMsg = error.data.msg;
        }
      });
    }
  }
};
</script>

<style lang="scss" src="./css/addBankCard.module.scss" module />
