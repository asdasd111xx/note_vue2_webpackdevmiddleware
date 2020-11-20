<template>
  <div>
    <transition name="fade">
      <div v-show="showSuccess" :class="$style['success-dialog-masker']">
        <div :class="$style['success-dialog-wrap']">
          <img
            :class="$style['success-icon']"
            :src="
              $getCdnPath('/static/image/_new/mcenter/popup_ic_success.png')
            "
          />
          <span :class="$style.meg">绑定成功</span>
        </div>
      </div>
    </transition>

    <account-wrap>
      <template scope="{ filteredDataList }">
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
                :info="field"
                @cancel="currentEdit = ''"
                @success="editedSuccess"
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
                      >{{
                        //提現密碼*呈現
                        field.text === "S_DAW_DRWAL_PASSWORD" &&
                        field.status === "already"
                          ? "****"
                          : field.value
                      }}
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
          <div
            v-if="item.title === 'receiptAddress' && themeTPL === 'ey1'"
            :key="index"
            :class="[
              $style['account-data-field'],
              $style['address-border'],
              'clearfix'
            ]"
            @click="handleClick(item)"
          >
            <span :class="$style['field-title']">{{
              $text("S_RECEIPT_ADDRESS", "收货地址")
            }}</span>
            <div :class="$style['field-value']">
              <template v-if="addressInfo.id === ''">
                <span :class="[$style['field-text'], $style.yet]">未设定 </span>
              </template>

              <template v-else>
                <div :class="$style['address-detail']">
                  <div :class="$style['line-up']">
                    <div :class="$style['text']">{{ addressInfo.name }}</div>
                    <div :class="$style['text']">{{ addressInfo.phone }}</div>
                    <div :class="$style['default-icon']">
                      默认
                    </div>
                  </div>
                  <div :class="$style['line-down']">
                    {{ addressInfo.address }}
                  </div>
                </div>
              </template>

              <div v-if="item.btnShow" :class="$style['feature-btn']">
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
          </div>
        </template>
      </template>
    </account-wrap>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  components: {
    accountWrap: () => import(/* webpackChunkName: 'accountWrap' */'./accountWrap'),
    editName: () => import(/* webpackChunkName: 'editName' */'./form/editName'),
    editAlias: () => import(/* webpackChunkName: 'editAlias' */'./form/editAlias'),
    editEmail: () => import(/* webpackChunkName: 'editEmail' */'./form/editEmail'),
    editPhone: () => import(/* webpackChunkName: 'editPhone' */'./form/editPhone'),
    editBirthday: () => import(/* webpackChunkName: 'editBirthday' */'./form/editBirthday'),
    editGender: () => import(/* webpackChunkName: 'editGender' */'./form/editGender'),
    editQq: () => import(/* webpackChunkName: 'editQq' */'./form/editQq'),
    editWeixin: () => import(/* webpackChunkName: 'editWeixin' */'./form/editWeixin'),
    editLine: () => import(/* webpackChunkName: 'editLine' */'./form/editLine'),
    editFacebook: () => import(/* webpackChunkName: 'editFacebook' */'./form/editFacebook'),
    editZalo: () => import(/* webpackChunkName: 'editZalo' */'./form/editZalo'),
    editWithdrawPwd: () => import(/* webpackChunkName: 'editWithdrawPwd' */'./form/editWithdrawPwd'),
  },
  data() {
    return {
      currentTab: 0,
      currentEdit: '',
      showSuccess: false,
      addressInfo: {
        id: "",
        is_default: false,
        name: "",
        phone: "",
        address: ""
      },
    };
  },
  created() {
    this.getAddress();
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  mounted() {
    if (localStorage.getItem('set-account-success')) {
      this.editedSuccess();
      this.$router.push({ query: { success: true } });
    }
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
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

      if (['alias', 'name', 'phone', 'email', 'qq', 'weixin', 'line', 'withdrawPwd'].includes(field.key)) {
        this.$router.push({
          path: `/mobile/mcenter/accountData/${field.key}`
        });
        return;
      } else if (field.key === "receiptAddress") {
        this.$router.push({
          path: `/mobile/mcenter/accountData/${field.key}`
        });
        return;
      }
      this.currentEdit = field.key;
    },
    editedSuccess(msg) {
      this.actionSetUserdata(true);
      this.currentEdit = '';
      this.showSuccess = true;
      localStorage.removeItem('set-account-success');
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000)
    },
    getAddress() {
      axios({
        method: 'get',
        url: '/api/v1/c/player/address',
      }).then(res => {
        if (res && res.data && res.data.result === "ok") {
          if (res.data.ret.length > 0) {
            this.addressInfo = res.data.ret.find((data) => data.is_default);
          }
        }
      }).catch(error => {

      })
    }
  }
}
</script>
<style lang="scss" src="../../css/index.module.scss" module></style>
