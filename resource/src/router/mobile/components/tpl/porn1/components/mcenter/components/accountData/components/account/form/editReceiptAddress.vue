<template>
  <div slot="content" :class="$style['content-wrap']">
    <account-header :header-config="headerConfig" />
    <div :class="[$style.wrap, 'clearfix']">
      <div
        v-for="(data, index) in addressData"
        :key="index"
        :class="$style['add-content']"
      >
        <div :class="$style['is-default']" @click="checkDefault(index)">
          <div
            :class="[
              $style['icon-default'],
              { [$style.active]: data.is_default }
            ]"
          />
        </div>

        <div :class="$style['address-detail']" @click="goToEditAddress(index)">
          <div :class="$style['line-up']">
            <div :class="$style['text']">{{ data.name }}</div>
            <div :class="$style['text']">{{ data.phone }}</div>
            <div v-if="data.is_default" :class="$style['default-icon']">
              默认
            </div>
          </div>
          <div :class="$style['text-address']">{{ data.address }}</div>
        </div>
        <div :class="$style['adj-content']">
          <img
            :class="[$style['icon-next']]"
            :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
            @click="goToEditAddress(index)"
          />
        </div>
      </div>
      <div
        :class="[
          $style['add-btn-address'],
          { [$style['disabled']]: dataEnough }
        ]"
        @click="goToAddAddress()"
      >
        新增收货地址
      </div>
      <div :class="$style['add-detail']">最多可新增5组地址</div>
    </div>
    <div v-if="onDefault" :class="$style['delete-tips']">
      <div :class="$style['tips-wrap']">
        <div :class="$style['tips-title']">将此地址设为默认?</div>
        <div :class="[$style['tips-button'], 'clearfix']">
          <div :class="$style['delete-cancel']" @click="closeDefault()">
            取消
          </div>
          <div
            :class="[$style['delete-confirm']]"
            @click="setDefault(nextDefaultIdx)"
          >
            好
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountHeader from '../../accountHeader';
import serviceTips from '../../serviceTips';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import ajax from '@/lib/ajax';

export default {
  components: {
    accountHeader,
    serviceTips
  },
  data() {
    return {
      addressData: [],
      onDefault: false,
      defaultIdx: 0,
      nextDefaultIdx: 0,
      dataEnough: false,
    };
  },
  created() {
    this.getAddressAllData(false);
  },
  watch: {
    addressData() {
      this.dataEnough = this.addressData.length >= 5
    }
  },
  mounted() {
    if (localStorage.getItem('set-address-success')) {
      this.actionSetGlobalMessage({ msg: '设定成功' });
      localStorage.removeItem('set-address-success');
    }
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: '收货地址管理',
      };
    },
  },
  methods: {
    ...mapActions(['actionSetGlobalMessage']),

    getAddressAllData(needCheck) {
      axios({
        method: 'get',
        url: '/api/v1/c/player/address',
      }).then(res => {
        if (res && res.data && res.data.result === "ok") {
          this.addressData = res.data.ret

          this.defaultIdx = this.addressData.findIndex((data) => data.is_default)
          // console.log(this.defaultIdx)
          if (this.defaultIdx < 0) {
            this.setDefault(0)
          }
          if (needCheck) {
            if (this.defaultIdx != this.nextDefaultIdx) {
              this.getAddressAllData(true);
            }
          }
        }
      }).catch(error => {

      })
    },

    checkDefault(index) {
      this.onDefault = true;
      this.nextDefaultIdx = index;
    },

    closeDefault() {
      this.onDefault = false;
    },

    setDefault(idx) {
      ajax({
        method: 'put',
        url: `/api/v1/c/player/address/${this.addressData[idx].id}`,
        params: {
          id: this.addressData[idx].id,
          is_default: true,
          name: this.addressData[idx].name,
          phone: this.addressData[idx].phone,
          address: this.addressData[idx].address
        },
        errorAlert: false,
        success: (response) => {
          this.getAddressAllData(true);
          this.closeDefault();
        },
        fail: (response) => {

        }
      });
    },

    goToEditAddress(idx) {
      this.$router.push({
        path: `/mobile/mcenter/accountData/addAddress?index=${idx}`
      });
    },
    goToAddAddress() {
      this.$router.push({
        path: `/mobile/mcenter/accountData/addAddress`
      });
    }
  }
};
</script>
<style src="../../../css/index.module.scss" lang="scss" module>
