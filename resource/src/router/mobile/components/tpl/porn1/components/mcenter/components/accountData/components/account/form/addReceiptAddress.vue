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
            v-model="newAddressInfo.name"
            :placeholder="$text('S_PLEASE_ENTER_RECEIVER', '请输入收货人姓名')"
            :class="$style.input"
            :maxlength="20"
            @input="verification($event.target.value, 'name')"
            type="text"
          />
          <div
            :class="$style['clear-input-address']"
            v-if="newAddressInfo.name"
          >
            <img
              :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
              @click="newAddressInfo.name = ''"
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
            v-model="newAddressInfo.phone"
            :placeholder="
              $text('S_PLEASE_ENTER_MOBILE_NUMBER', '请输入手机号码')
            "
            :class="$style.input"
            @input="verification($event.target.value, 'phone')"
            type="tel"
          />
          <div
            :class="$style['clear-input-address']"
            v-if="newAddressInfo.phone"
          >
            <img
              :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
              @click="newAddressInfo.phone = ''"
            />
          </div>
        </div>
      </div>
      <div :class="$style['add-wrap']">
        <p :class="$style['input-title']">收货地址</p>
        <div :class="$style['address-input-wrap']">
          <input
            ref="input"
            v-model="newAddressInfo.address"
            :placeholder="
              $text('S_PLEASE_ENTER_RECEIPT_ADDRESS', '请输入收货地址')
            "
            :class="$style.input"
            @input="verification($event.target.value, 'address')"
            type="text"
          />
          <div
            :class="$style['clear-input-address']"
            v-if="newAddressInfo.address"
          >
            <img
              :src="$getCdnPath(`/static/image/_new/common/ic_clear.png`)"
              @click="newAddressInfo.address = ''"
            />
          </div>
        </div>
      </div>
      <div :class="$style['add-wrap']">
        <div
          :class="[
            $style['address-input-wrap'],
            $style['checked-margin'],
            $style['disable-check']
          ]"
        >
          设为默认地址
          <div
            :class="[
              `ui fitted toggle checkbox field-checkbox ${siteConfig.MOBILE_WEB_TPL}`
            ]"
          >
            <input
              :checked="newAddressInfo.is_default"
              type="checkbox"
              @click="
                () => {
                  checkDefault();
                }
              "
            />
            <label />
          </div>
        </div>
        <div
          v-if="isFirstAdd"
          :class="$style['checkbox-mask']"
          @click.stop="
            () => {
              checkDefault();
            }
          "
        ></div>
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
          :class="[$style['address-save'], { [$style['isonly']]: isAdd }]"
          @click="addAddress()"
        >
          保存
        </div>
      </div>
    </div>
    <div v-if="onDelete" :class="$style['delete-tips']">
      <div :class="$style['tips-wrap']">
        <div v-if="newAddressInfo.is_default" :class="$style['tips-title']">
          此为默认地址,<br />确定要删除?
        </div>
        <div v-else :class="$style['tips-title']">确定要删除该地址吗?</div>
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
    <div v-if="onChangeDefault" :class="$style['delete-tips']">
      <div :class="$style['tips-wrap']">
        <div v-if="newAddressInfo.is_default" :class="$style['tips-title']">
          是否取消默认?
        </div>
        <div v-else :class="$style['tips-title']">将此地址设为默认?</div>
        <div :class="[$style['tips-button'], 'clearfix']">
          <div :class="$style['delete-cancel']" @click="closeDefault()">
            取消
          </div>
          <div :class="[$style['delete-confirm']]" @click="setDefault()">
            好
          </div>
        </div>
      </div>
    </div>
    <div v-if="onBack" :class="$style['delete-tips']">
      <div :class="$style['tips-wrap']">
        <div :class="$style['tips-title']">是否保存本次编辑结果?</div>
        <div :class="[$style['tips-button'], 'clearfix']">
          <div :class="$style['delete-cancel']" @click="backView()">
            不保存
          </div>
          <div :class="[$style['delete-confirm']]" @click="addAddress()">
            保存
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
import axios from 'axios';
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
      allAddressData: [],
      addressInfo: {
        id: "",
        is_default: false,
        name: "",
        phone: "",
        address: ""
      },
      newAddressInfo: {
        id: "",
        is_default: false,
        name: "",
        phone: "",
        address: ""
      },
      // dataNotEnough: false,
      isAdd: true,
      onDelete: false,
      onChangeDefault: false,
      onBack: false,
      isFirstAdd: false
    };
  },
  watch: {
    // 'newAddressInfo.name'() {
    //   this.checkData();
    // },
    // 'newAddressInfo.phone'() {
    //   this.checkData();
    // },
    // 'newAddressInfo.address'() {
    //   this.checkData();
    // }
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
        onClick: () => {
          if (this.addressInfo.name != this.newAddressInfo.name
            || this.addressInfo.phone != this.newAddressInfo.phone
            || this.addressInfo.address != this.newAddressInfo.address) {
            this.onBack = true;
          } else {
            this.$router.back();
          }
        },
        title: this.headerTitle,
      };
    }
  },
  created() {
    //取得所有地址資料
    axios({
      method: 'get',
      url: '/api/v1/c/player/address',
    }).then(res => {
      if (res && res.data && res.data.result === "ok") {
        this.isFirstAdd = res.data.ret.length === 0
        if (this.isFirstAdd) {
          this.newAddressInfo.is_default = true;
          this.addressInfo.is_default = true;
        } else {
          this.allAddressData = res.data.ret
          if (this.$route.query && this.$route.query.index) {//編輯
            this.headerTitle = "编辑收货地址";
            this.addressInfo = this.allAddressData[this.$route.query.index];
            // this.addressInfo.is_default = this.addressInfo.is_default === "true";
            this.phoneHead = "+" + this.addressInfo.phone.split("-")[0];
            this.addressInfo.phone = this.addressInfo.phone.split("-")[1];
            this.newAddressInfo = Object.assign({}, this.addressInfo);
            this.isAdd = false;
            if (this.allAddressData.length < 2 && this.$route.query.index === "0") {
              this.isFirstAdd = true;
            }
          } else {//新增
            this.headerTitle = "添加收货地址";
            this.isAdd = true;
          }
        }

      }
    }).catch(error => {

    })

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
      this.tipMsg = '';
      if (target === 'phone') {
        this.actionVerificationFormData({ target: 'phone', value: value }).then((val => {
          this.newAddressInfo.phone = val;
        }));

        // 億元 不客端判斷手機號碼位數
        if (this.siteConfig.MOBILE_WEB_TPL === 'ey1' || value.length >= 11) {
          this.tipMsg = '';
        }
      } else if (target === 'name') {
        this.actionVerificationFormData({ target: 'name', value: value }).then((val => {
          this.newAddressInfo.name = val
        }));
      }
    },

    checkDefault() {
      if (this.isFirstAdd) {
        this.actionSetGlobalMessage({ msg: '首笔地址不可关闭' });
        this.newAddressInfo.is_default = true;
      } else {
        this.onChangeDefault = true;
      }
    },

    closeDefault() {
      this.onChangeDefault = false;
    },

    setDefault() {
      this.newAddressInfo.is_default = !this.newAddressInfo.is_default
      this.onChangeDefault = false;
      if (this.addressInfo.is_default && !this.newAddressInfo.is_default) {
        this.actionSetGlobalMessage({ msg: '保存成功后, 请重新设定默认地址' });
      }
    },

    // checkData() {
    //   if (this.newAddressInfo.name != "" && this.newAddressInfo.phone != "" && this.newAddressInfo.address != "") {
    //     this.dataNotEnough = true;
    //   } else {
    //     this.dataNotEnough = false;
    //   }
    // },

    addAddress() {
      this.onBack = false;
      if (this.newAddressInfo.name === "") {
        this.tipMsg = '请输入收货人姓名';
      } else if (this.newAddressInfo.phone === "") {
        this.tipMsg = '请输入手机号码';
      } else if (this.newAddressInfo.address === "") {
        this.tipMsg = '请输入收货地址';
      } else {
        this.tipMsg = '';

        if (this.isAdd) {
          // 新增一筆收貨地址
          ajax({
            method: 'post',
            url: `/api/v1/c/player/address`,
            params: {
              name: this.newAddressInfo.name,
              phone: `${this.phoneHead.replace(/\+/ig, '')}-${this.newAddressInfo.phone}`,
              address: this.newAddressInfo.address,
              is_default: this.newAddressInfo.is_default,
            },
            errorAlert: false,
            success: (response) => {
              localStorage.setItem('set-address-success', true);
              this.$router.back();
            },
            fail: (response) => {
              this.tipMsg = response.data.msg;
            }
          });
        } else {
          //原為默認地址, 保存時,為"關閉默認"時, 需將第1筆地址(不含此筆)設為"默認" (例如:本筆為第一筆地址時, 需將第二筆設為默認)
          if (this.$route.query.index === "0"
            && this.addAddress.is_default
            && !this.newAddressInfo.is_default
            && this.allAddressData.length >= 2) {
            //第二筆設為默認
            this.setDefaultAPI(1);
          }
          // 編輯收貨地址
          ajax({
            method: 'put',
            url: `/api/v1/c/player/address/${this.newAddressInfo.id}`,
            params: {
              id: this.newAddressInfo.id,
              is_default: this.newAddressInfo.is_default,
              name: this.newAddressInfo.name,
              phone: `${this.phoneHead.replace(/\+/ig, '')}-${this.newAddressInfo.phone}`,
              address: this.newAddressInfo.address
            },
            errorAlert: false,
            success: (response) => {
              localStorage.setItem('set-address-success', true);
              this.$router.back();
            },
            fail: (response) => {
              this.tipMsg = response.data.msg;
            }
          });
        }
      }
    },

    deleteAddress() {
      if (this.newAddressInfo.is_default) {
        if (this.$route.query.index === "0" && this.allAddressData.length >= 2) {
          this.setDefaultAPI(1);
        } else {
          this.setDefaultAPI(0);
        }
      }
      // 刪除一筆收貨地址
      ajax({
        method: 'delete',
        url: `/api/v1/c/player/address/${this.newAddressInfo.id}`,
        errorAlert: false
      }).then((response) => {
        this.onDelete = false;
        if (response && response.result === 'ok') {
          if (this.newAddressInfo.is_default) {
            this.actionSetGlobalMessage({
              msg: '删除成功,请重新设定默认地址',
              cb: () => {
                this.$router.back();
              }
            });
          } else {
            this.actionSetGlobalMessage({
              msg: '删除成功',
              cb: () => {
                this.$router.back();
              }
            });
          }
        }
      });
    },

    setDefaultAPI(idx) {
      //第idx筆設為默認
      ajax({
        method: 'put',
        url: `/api/v1/c/player/address/${this.allAddressData[idx].id}`,
        params: {
          id: this.allAddressData[idx].id,
          is_default: true,
          name: this.allAddressData[idx].name,
          phone: `${this.allAddressData[idx].phone}`,
          address: this.allAddressData[idx].address
        },
        errorAlert: false,
        success: (response) => {
          // console.log(`第${idx}筆設為默認`)
        },
        fail: (response) => {

        }
      });
    },


    checkDelete() {
      this.onDelete = true;
    },

    closeDelete() {
      this.onDelete = false;
    },

    backView() {
      this.onBack = false;
      this.$router.back();
    }

  },
};
</script>

<style src="../../../css/index.module.scss" lang="scss" module />
