<template>
  <div slot="content" :class="$style['content-wrap']">
    <account-header :header-config="headerConfig" />
    <div :class="[$style.wrap, 'clearfix']">
      <!-- 錯誤訊息 -->
      <div :class="$style['top-tips']">
        <div v-show="tipMsg">
          {{ tipMsg }}
        </div>
      </div>
      <div :class="$style['add-wrap']">
        <p :class="$style['input-title']">收货人</p>
        <div :class="$style['address-input-wrap']">
          <input
            ref="input"
            v-model="addressInfo.name"
            :placeholder="$text('S_PLEASE_ENTER_RECEIVER', '请输入收货人姓名')"
            :class="$style.input"
            :maxlength="20"
            type="text"
          />
          <div :class="$style['clear-input']" v-if="addressInfo.name">
            <img
              :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
              @click="addressInfo.name = ''"
            />
          </div>
        </div>
      </div>
      <div :class="$style['add-wrap']">
        <p :class="$style['input-title']">手机号码</p>
        <div :class="$style['address-input-wrap']">
          <select v-model="phoneHead" :class="$style['phone-selected']">
            <option v-for="option in phoneHeadOption" v-bind:value="option">
              {{ option }}
            </option>
          </select>
          <input
            v-model="addressInfo.phone"
            :placeholder="
              $text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')
            "
            :class="$style.input"
            @input="verification($event.target.value, 'phone')"
            type="tel"
          />
          <div :class="$style['clear-input']" v-if="addressInfo.phone">
            <img
              :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
              @click="addressInfo.phone = ''"
            />
          </div>
        </div>
      </div>
      <div :class="$style['add-wrap']">
        <p :class="$style['input-title']">收货地址</p>
        <div :class="$style['address-input-wrap']">
          <input
            ref="input"
            v-model="addressInfo.address"
            :placeholder="
              $text('S_PLEASE_ENTER_RECEIPT_ADDRESS', '请输入收货地址')
            "
            :class="$style.input"
            type="text"
          />
          <div :class="$style['clear-input']" v-if="addressInfo.address">
            <img
              :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
              @click="addressInfo.address = ''"
            />
          </div>
        </div>
      </div>
      <div :class="$style['add-wrap']">
        <div :class="[$style['address-input-wrap'], $style['checked-margin']]">
          设为默认地址
          <div
            :class="
              `ui fitted toggle checkbox field-checkbox ${siteConfig.MOBILE_WEB_TPL}`
            "
          >
            <input
              :checked="addressInfo.is_default"
              type="checkbox"
              @click="
                () => {
                  setDefault();
                }
              "
            />
            <label />
          </div>
        </div>
      </div>
      <div :class="$style['address-submit']">
        <div
          v-if="!isAdd"
          :class="$style['address-delete']"
          @click="checkDelete()"
        >
          删除地址
        </div>
        <div
          :class="[
            $style['address-save'],
            { [$style['disabled']]: !dataNotEnough },
            { [$style['isonly']]: isAdd }
          ]"
          @click="addAddress()"
        >
          保存
        </div>
      </div>
    </div>
    <div v-if="onDelete" :class="$style['delete-tips']">
      <div :class="$style['tips-wrap']">
        <div :class="$style['tips-title']">确定要删除该地址吗?</div>
        <div :class="[$style['tips-button'], 'clearfix']">
          <div :class="$style['delete-cancel']" @click="closeDelete()">
            取消
          </div>
          <div :class="[$style['delete-confirm']]" @click="deleteAddress()">
            刪除
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import { mapGetters, mapActions } from 'vuex';
import accountHeader from '../../accountHeader';
import ajax from '@/lib/ajax';
import mcenter from '@/api/mcenter';

export default {
  components: {
    accountHeader
  },
  data() {
    return {
      headerTitle: "",
      tipMsg: "",
      // 國碼
      phoneHead: '+86',
      phoneHeadOption: [],
      addressInfo: {
        id: "",
        is_default: false,
        name: "",
        phone: "",
        address: ""
      },
      dataNotEnough: false,
      isAdd: true,
      onDelete: false,
    };
  },
  watch: {
    'addressInfo.name'() {
      this.checkData();
    },
    'addressInfo.phone'() {
      this.checkData();
    },
    'addressInfo.address'() {
      this.checkData();
    }
  },
  mounted() {

  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.headerTitle,
      };
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {//編輯
      this.headerTitle = "编辑收货地址";
      this.addressInfo = this.$route.query
      this.addressInfo.is_default = this.addressInfo.is_default === "true";
      this.phoneHead = "+" + this.addressInfo.phone.split("-")[0];
      this.addressInfo.phone = this.addressInfo.phone.split("-")[1];
      this.isAdd = false;
    } else {//新增
      this.headerTitle = "添加收货地址";
      this.isAdd = true;
    }

    ajax({
      method: 'get',
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then((response) => {
      if (response && response.result === 'ok') {
        this.phoneHeadOption = response.ret.config.phone.country_codes
      }
    });
  },
  methods: {
    ...mapActions(['actionSetUserdata', 'actionSetGlobalMessage', 'actionVerificationFormData']),

    verification(value, target) {

      if (target === 'phone') {
        this.actionVerificationFormData({ target: 'phone', value: value }).then((val => {
          this.addressInfo.phone = val;
        }));

        // 億元 不客端判斷手機號碼位數
        if (this.siteConfig.MOBILE_WEB_TPL === 'ey1' || value.length >= 11) {
          this.tipMsg = '';
        }
      }

      if (target === 'code') {
        this.actionVerificationFormData({ target: 'code', value: value }).then((val => {
          this.codeValue = val;
        }));
      }
    },

    setDefault() {
      this.addressInfo.is_default = !this.addressInfo.is_default
    },

    checkData() {
      if (this.addressInfo.name != "" && this.addressInfo.phone != "" && this.addressInfo.address != "") {
        this.dataNotEnough = true;
      } else {
        this.dataNotEnough = false;
      }
    },

    addAddress() {
      if (this.addressInfo.name != "" && this.addressInfo.phone != "" && this.addressInfo.address != "") {
        if (this.isAdd) {
          // 新增一筆收貨地址
          ajax({
            method: 'post',
            url: `/api/v1/c/player/address`,
            params: {
              name: this.addressInfo.name,
              phone: `${this.phoneHead.replace(/\+/ig, '')}-${this.addressInfo.phone}`,
              address: this.addressInfo.address,
              is_default: this.addressInfo.is_default,
            },
            errorAlert: false,
            success: (response) => {
              this.$router.back();
            },
            fail: (response) => {
              alert(response.data.msg);
            }
          });
        } else {
          // 編輯一筆收貨地址
          ajax({
            method: 'put',
            url: `/api/v1/c/player/address/${this.addressInfo.id}`,
            params: {
              id: this.addressInfo.id,
              is_default: this.addressInfo.is_default,
              name: this.addressInfo.name,
              phone: `${this.phoneHead.replace(/\+/ig, '')}-${this.addressInfo.phone}`,
              address: this.addressInfo.address
            },
            errorAlert: false,
            success: (response) => {
              this.$router.back();
            },
            fail: (response) => {
              alert(response.data.msg);
            }
          });
        }


      }
    },

    deleteAddress() {
      // 刪除一筆收貨地址
      ajax({
        method: 'delete',
        url: `/api/v1/c/player/address/${this.addressInfo.id}`,
        errorAlert: false
      }).then((response) => {
        if (response && response.result === 'ok') {
          this.$router.back();
        }
      });
    },


    checkDelete() {
      this.onDelete = true;
    },

    closeDelete() {
      this.onDelete = false;
    },

  }
};
</script>

<style src="../../../css/index.module.scss" lang="scss" module />
