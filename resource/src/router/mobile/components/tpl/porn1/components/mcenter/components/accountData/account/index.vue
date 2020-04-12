<template>
  <div :class="colorClass">
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
            v-if="currentTab === index"
            :key="index"
            :class="$style['account-data-wrap']"
          >
            <template v-for="(field, fieldIndex) in item.field">
              <component
                :is="`edit-${currentEdit}`"
                v-if="field.key === currentEdit"
                :key="`${currentEdit}-${fieldIndex}`"
                :info="field"
                @cancel="currentEdit = ''"
              />
              <div
                v-else
                :key="fieldIndex"
                :class="[$style['account-data-field'], 'clearfix']"
              >
                <span :class="$style['field-title']">{{ $t(field.text) }}</span>
                <div :class="$style['field-editer']">
                  <span
                    :class="[
                      $style['field-text'],
                      { [$style.yet]: field.status === 'yet' }
                    ]"
                    >{{ field.value }}</span
                  >
                  <div
                    :class="$style['feature-btn']"
                    @click="currentEdit = field.key"
                  >
                    <div :class="$style['btn-next']">
                      <img
                        :src="
                          $getCdnPath(`/static/image/_new/common/btn_next.png`)
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
import { mapGetters } from 'vuex';

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
    receiptAddress: () => import(/* webpackChunkName: 'receiptAddress' */'./receiptAddress')
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
      currentEdit: ''
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo'
    }),
    colorClass() {
      return [
        {
          [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
          [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
        }
      ];
    }
  }
};
</script>
<style lang="scss" src="../css/index.module.scss" module></style>
<style lang="scss" scope>
</style>
