<template>
  <div>
    <message v-if="msg" @close="handleCloseMsg">
      <div slot="msg">
        <img
          v-if="msg === $text('S_CR_SUCCESS') || msgIcon"
          :class="$style['success-icon']"
          :src="$getCdnPath('/static/image/_new/mcenter/popup_ic_success.png')"
        />
        <span :class="$style.meg">{{ msg }}</span>
      </div>
    </message>

    <account-wrap>
      <template scope="{ filteredDataList }">
        <!-- <div :class="[$style['account-list-wrap'], 'clearfix']">
          <div
            v-for="(item, index) in filteredDataList"
            :key="`account-list-${index}`"
            :class="[
              $style['account-list-item'],
              { [$style['is-current']]: currentTab === index }
            ]"
            :style="{ width: `${100 / filteredDataList.length}%` }"
            @click="currentTab = index"
          >
            {{ $t(item.text) }}
          </div>
        </div> -->
        <template v-for="(item, index) in filteredDataList">
          <div
            v-if="currentTab === index && index === 1"
            :key="index"
            :class="$style['top-tip-personal']"
          >
            {{ $text("S_PERSONAL_INFORMATION_SET") }}
          </div>
          <receipt-address
            v-if="currentTab === index && index === 2"
            :key="index"
          />
          <div
            v-if="item.title === 'realName'"
            :key="index"
            :class="[$style['account-data-field'], 'clearfix']"
          >
            <span :class="$style['field-title']">{{
              $text("S_USER_NAME", "用户名")
            }}</span>
            <div :class="$style['field-value']">
              <span>
                {{
                  memInfo.user.show_alias
                    ? memInfo.user.alias
                    : memInfo.user.username
                }}</span
              >
            </div>
          </div>
          <div
            v-if="currentTab === index"
            :key="index"
            :class="$style['account-data-wrap']"
          >
            <template v-for="(field, fieldIndex) in item.field">
              <!-- 編輯顯示 -->
              <components
                :is="`edit-${currentEdit}`"
                v-if="field.key === currentEdit"
                :key="`${currentEdit}-${fieldIndex}`"
                refs="isComponent"
                :class="[$style['account-data-field']]"
                :test-fuc="currentTab"
                :info="field"
                @msg="setMessage"
                @cancel="currentEdit = ''"
              />

              <!-- 顯示欄位 -->
              <div
                v-else
                :key="fieldIndex"
                :class="[$style['account-data-field'], 'clearfix']"
                @click="handleClick(field)"
              >
                <span :class="$style['field-title']">{{ $t(field.text) }}</span>
                <div :class="$style['field-value']">
                  <template>
                    <span
                      :class="[
                        $style['field-text'],
                        { [$style.yet]: field.status === 'yet' }
                      ]"
                      >{{ field.value }}
                    </span>
                  </template>

                  <div v-if="field.btnShow" :class="$style['feature-btn']">
                    <div :class="$style['btn-next']">
                      <img
                        :src="
                          $getCdnPath(
                            `/static/image/_new/mcenter/ic_arrow_next.png`
                          )
                        "
                      />
                    </div>
                  </div>
                </div>

                <!-- 是否顯示編輯 -->
                <!-- <template v-if="field.btnShow"> -->
              </div>
            </template>
          </div>
        </template>
      </template>
    </account-wrap>
  </div>
</template>

<script>
import message from '../../../../common/new/message';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    accountWrap: () => import(/* webpackChunkName: 'accountWrap' */'./accountWrap'),
    editName: () => import(/* webpackChunkName: 'editName' */'./form/editName'),
    editAlias: () => import(/* webpackChunkName: 'editAlias' */'./form/editAlias'),
    editEmail: () => import(/* webpackChunkName: 'editEmail' */'./form/editEmail'),
    editPhone: () => import(/* webpackChunkName: 'editPhone' */'./form/editPhone'),
    editPassword: () => import(/* webpackChunkName: 'editPassword' */'./form/editPassword'),
    editWithdrawPwd: () => import(/* webpackChunkName: 'editWithdrawPwd' */'./form/editWithdrawPwd'),
    editBirthday: () => import(/* webpackChunkName: 'editBirthday' */'./form/editBirthday'),
    editGender: () => import(/* webpackChunkName: 'editGender' */'./form/editGender'),
    editQq_num: () => import(/* webpackChunkName: 'editQq_num' */'./form/editQq_num'),
    editWeixin: () => import(/* webpackChunkName: 'editWeixin' */'./form/editWeixin'),
    editLine: () => import(/* webpackChunkName: 'editLine' */'./form/editLine'),
    editFacebook: () => import(/* webpackChunkName: 'editFacebook' */'./form/editFacebook'),
    editSkype: () => import(/* webpackChunkName: 'editSkype' */'./form/editSkype'),
    editZalo: () => import(/* webpackChunkName: 'editZalo' */'./form/editZalo'),
    message
  },
  data() {
    return {
      headerSetting: {
        title: this.$text('S_ACCOUNT_DATA', '帐户资料'),
        leftBtns: {
          icon: 'arrow',
          onClick: () => this.$router.push('/mobile/mcenter')
        },
        balance: true
      },
      currentTab: 0,
      currentEdit: '',
      msg: '',
      msgIcon: false
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
      mcenterBindMessage: 'getMcenterBindMessage',
      mobileCheck: 'getMobileCheck'
    }),
    colorClass() {
      return [
        {
          [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
          [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
        }
      ];
    }
  },
  created() {
    this.setMessage(this.mcenterBindMessage);
  },
  mounted() {
    // this.actionSetUserdata(true);
  },
  methods: {
    ...mapActions([
      'actionSetＭcenterBindMessage', 'actionSetUserdata'
    ]),
    handleCloseMsg() {
      this.msg = '';
      this.actionSetＭcenterBindMessage({
        msg: '',
        msgIcon: false
      })
    },
    handleClick(field) {
      if (field.key === "phone") {
        //   手機未驗證能設定

        if (!field.verification) {
          this.$router.push({
            path: `/mobile/mcenter/accountData/phone`
          });
        }
        // 只能設定一次
        if (this.memInfo.user.phone && !this.memInfo.config.user_edit_phone) {
          return;
        }
      }

      if (!field.btnShow) {
        return;
      }

      if (['name', 'phone', 'email'].includes(field.key)) {
        this.$router.push({
          path: `/mobile/mcenter/accountData/${field.key}`
        });
        return;
      }
      this.currentEdit = field.key;
    },
    setMessage(msg) {
      this.actionSetUserdata(true);
      if (msg instanceof Object) {
        this.msg = msg.msg;
        this.msgIcon = msg.msgIcon;
        return;
      }
      this.msg = msg;
    }
  }
};
</script>
<style lang="scss" src="../css/index.module.scss" module></style>
