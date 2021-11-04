<template>
  <div>
    <!-- 資料修改/綁定成功提示 -->
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
      <template>
        <template>
          <!-- 平台資料  -->
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">帳號</span>
            <div :class="$style['field-value']">
              <span>
                {{
                  memInfo.user.show_alias
                    ? memInfo.user.alias
                    : memInfo.user.username
                }}
              </span>
            </div>
          </div>
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">出生日期</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.birthday" :class="$style['field-text']">
                {{ memInfo.user.birthday }}</span
              >
              <template v-else>
                <span :class="[$style['field-text'], [$style.yet]]">
                  <date-picker
                    v-model="birthdayValue"
                    :placeholder="'添加日期，确保您已满18岁'"
                    type="date"
                    format="YYYY-MM-DD"
                    value-type="format"
                    @input="onInputBirthday(birthdayValue)"
                  />
                </span>

                <div :class="$style['feature-btn']">
                  <div :class="$style['btn-next']">
                    <img
                      :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">性別</span>
            <div :class="$style['field-value']" v-if="!showGenderEdit">
              <span v-if="memInfo.user.gender" :class="$style['field-text']">
                {{ memInfo.user.gender == 1 ? "男" : "女" }}</span
              >
              <template v-else>
                <span :class="[$style['field-text'], $style['yet']]"
                  >未選擇</span
                >
                <div
                  :class="$style['feature-btn']"
                  @click="showGenderEdit = true"
                >
                  <div :class="$style['btn-next']">
                    <img
                      :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                    />
                  </div>
                </div>
              </template>
            </div>
            <!-- 性別編輯/修改 -->
            <template>
              <div v-if="showGenderEdit" :class="$style['gender-input-wrap']">
                <select v-model="selectGenderValue">
                  <option value="1">{{ $t("S_MALE") }}</option>
                  <option value="2">{{ $t("S_FEMALE") }}</option>
                </select>
                <div :class="$style['btn-wrap']">
                  <span
                    :class="$style['btn-cancel']"
                    @click="cancelGenderEdit()"
                  >
                    {{ $text("S_CANCEL", "取消") }}
                  </span>
                  <span
                    :class="$style['btn-confirm']"
                    @click="handleGenderSubmit()"
                  >
                    {{ $text("S_CONFIRM", "確認") }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <!-- 直播資料  -->
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">直播暱稱</span>
            <div :class="$style['field-value']">
              <span
                v-if="paopaoMemberCardInfo.alias"
                :class="$style['field-text']"
              >
                {{ paopaoMemberCardInfo.alias }}</span
              >
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >尚未設定</span
              >
              <div
                :class="$style['feature-btn']"
                @click="$router.push('/mobile/mcenter/accountData/alias')"
              >
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">簽名</span>
            <div :class="$style['field-value']">
              <span
                v-if="paopaoMemberCardInfo.intro"
                :class="$style['field-text']"
                >{{ paopaoMemberCardInfo.intro }}</span
              >
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >TA好像忘記簽名了</span
              >
              <div
                :class="$style['feature-btn']"
                @click="$router.push('/mobile/mcenter/accountData')"
              >
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">地區</span>
            <div :class="$style['field-value']">
              <span
                v-if="paopaoMemberCardInfo.hometown"
                :class="$style['field-text']"
                >{{ paopaoMemberCardInfo.hometown }}
              </span>
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >請選擇所在地區
              </span>
              <div
                :class="$style['feature-btn']"
                @click="showHometownEdit = true"
              >
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>
            <!-- 修改地區 -->
            <template v-if="showHometownEdit">
              <div :class="$style['more-method-wrap']">
                <div :class="$style['more-method-container']">
                  <div :class="$style['more-method-header']">
                    <div
                      :class="$style['prev']"
                      @click="showHometownEdit = false"
                    >
                      {{ $text("S_CANCEL", "取消") }}
                    </div>
                    <div
                      :class="[
                        selectedCity == '' && selectedDistrict == ''
                          ? $style['notconfirm']
                          : $style['confirm']
                      ]"
                      @click="submitHometown"
                    >
                      {{ $text("S_CONFIRM_2", "确定") }}
                    </div>
                    <div :class="$style['title']">
                      地區
                    </div>
                  </div>

                  <div :class="$style['more-method-content']">
                    <div :class="$style['city']">
                      <div
                        v-for="(item, index) in cityList"
                        :key="index"
                        :class="$style['cell']"
                      >
                        <button :key="index" @click="getSelectedCity(item)">
                          <span
                            :class="[
                              selectedCity == item.title ? $style['active'] : ''
                            ]"
                            >{{ item.title }}</span
                          >
                        </button>
                      </div>
                    </div>
                    <div :class="$style['district']">
                      <div
                        v-for="(item, index) in districtList"
                        :key="index"
                        :class="$style['cell']"
                      >
                        <button :key="index" @click="getSelectedDistrict(item)">
                          <span
                            :class="[
                              selectedDistrict == item.title
                                ? $style['active']
                                : ''
                            ]"
                            >{{ item.title }}</span
                          >
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- <div :class="$style['more-method-content']">
                    <select
                      :class="$style['city']"
                      v-model="selectedCity"
                      id="selectcity"
                      autofocus
                    >
                      <option
                        v-for="(item, index) in cityList"
                        :key="index"
                        :class="$style['cell']"
                      >
                        {{ item.title }}
                      </option>
                    </select>
                    <select
                      :class="$style['district']"
                      v-model="selectedDistrict"
                      id="selectdistrict"
                      autofocus
                    >
                      <option
                        v-for="(item, index) in districtList"
                        :key="index"
                        :class="$style['cell']"
                      >
                        {{ item.title }}
                      </option>
                    </select>
                  </div> -->
                </div>
              </div>
            </template>
          </div>
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">感情</span>
            <div :class="$style['field-value']">
              <span
                v-if="paopaoMemberCardInfo.relationship"
                :class="$style['field-text']"
                >{{ paopaoMemberCardInfo.relationship }}</span
              >
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >尚未設定</span
              >
              <div
                :class="$style['feature-btn']"
                @click="$router.push('/mobile/mcenter/accountData')"
              >
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 平台資料  -->
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">真實姓名</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.name" :class="$style['field-text']">
                {{ memInfo.user.name }}</span
              >
              <template v-else>
                <span :class="[$style['field-text'], $style['yet']]"
                  >姓名需与银行持卡人姓名一致，否则无法提现</span
                >
                <div
                  :class="$style['feature-btn']"
                  @click="$router.push('/mobile/mcenter/accountData/name')"
                >
                  <div :class="$style['btn-next']">
                    <img
                      :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                    />
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">手機號碼</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.phone" :class="$style['field-text']">{{
                memInfo.user.phone
              }}</span>
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >绑定手机保护帐号安全</span
              >
              <div
                :class="$style['feature-btn']"
                @click="$router.push('/mobile/mcenter/accountData/phone')"
              >
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">電子郵箱</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.email" :class="$style['field-text']">
                {{ memInfo.user.email }}</span
              >
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >绑定邮箱保护帐号安全</span
              >
              <div
                :class="$style['feature-btn']"
                @click="$router.push('/mobile/mcenter/accountData/email')"
              >
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">QQ</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.qq_num" :class="$style['field-text']">{{
                memInfo.user.qq_num
              }}</span>
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >尚未設定</span
              >
              <div
                :class="$style['feature-btn']"
                @click="$router.push('/mobile/mcenter/accountData/qq')"
              >
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">微信</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.weixin" :class="$style['field-text']">{{
                memInfo.user.weixin
              }}</span>
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >尚未設定</span
              >
              <div
                :class="$style['feature-btn']"
                @click="$router.push('/mobile/mcenter/accountData/weixin')"
              >
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
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
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import DatePicker from "vue2-datepicker";
import Vue from "vue";
import mcenter from "@/api/mcenter";
import { API_MCENTER_USER_CONFIG } from "@/config/api";

export default {
  components: {
    accountWrap: () =>
      import(/* webpackChunkName: 'accountWrap' */ "./accountWrap"),
    editName: () =>
      import(/* webpackChunkName: 'editName' */ "./form/editName"),
    editAlias: () =>
      import(/* webpackChunkName: 'editAlias' */ "./form/editAlias"),
    editEmail: () =>
      import(/* webpackChunkName: 'editEmail' */ "./form/editEmail"),
    editPhone: () =>
      import(/* webpackChunkName: 'editPhone' */ "./form/editPhone"),
    editBirthday: () =>
      import(/* webpackChunkName: 'editBirthday' */ "./form/editBirthday"),
    editQq: () => import(/* webpackChunkName: 'editQq' */ "./form/editQq"),
    editWeixin: () =>
      import(/* webpackChunkName: 'editWeixin' */ "./form/editWeixin"),
    editLine: () =>
      import(/* webpackChunkName: 'editLine' */ "./form/editLine"),
    editFacebook: () =>
      import(/* webpackChunkName: 'editFacebook' */ "./form/editFacebook"),
    editZalo: () =>
      import(/* webpackChunkName: 'editZalo' */ "./form/editZalo"),
    editWithdrawPwd: () =>
      import(
        /* webpackChunkName: 'editWithdrawPwd' */ "./form/editWithdrawPwd"
      ),
    editSkype: () =>
      import(/* webpackChunkName: 'editSkype' */ "./form/editSkype"),
    editTelegram: () =>
      import(/* webpackChunkName: 'editTelegram' */ "./form/editTelegram"),
    editKakaotalk: () =>
      import(/* webpackChunkName: 'editKakaotalk' */ "./form/editKakaotalk"),
    DatePicker
  },
  data() {
    return {
      currentTab: 0,
      currentEdit: "",
      showSuccess: false,
      birthdayValue: "",
      showGenderEdit: false,
      showHometownEdit: false,
      selectGenderValue: "",
      paopaoMemberCardInfo: {},
      selectedCity: "",
      selectedDistrict: "",
      cityList: [
        {
          title: "天津市"
        },
        {
          title: "上海市"
        },
        {
          title: "重慶市"
        },
        {
          title: "河北省"
        },
        {
          title: "山西省"
        },
        {
          title: "湖南省"
        },
        {
          title: "安徽省"
        }
      ],
      districtList: [
        {
          title: "合川区"
        },
        {
          title: "江津区"
        },
        {
          title: "永川区"
        },
        {
          title: "长寿区"
        },
        {
          title: "涪陵区"
        },
        {
          title: "xx区"
        },
        {
          title: "oo区"
        }
      ],
      addressInfo: {
        id: "",
        is_default: false,
        name: "",
        phone: "",
        address: ""
      }
    };
  },
  created() {
    this.getAddress();
    this.getPaopaoMemberData();
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      systemTime: "getSystemTime"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  mounted() {
    this.actionSetSystemTime();
    if (localStorage.getItem("set-account-success")) {
      this.editedSuccess();
      this.$router.push({ query: { success: true } });
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetSystemTime",
      "actionSetGlobalMessage",
      "actionGetExtRedirect"
    ]),
    getPaopaoMemberData() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/personal-info",
        method: "get"
      }).then(data => {
        this.paopaoMemberCardInfo = data.result || null;
      });
    },
    cancelGenderEdit() {
      this.selectGenderValue = "";
      this.showGenderEdit = false;
    },
    getSelectedCity(item) {
      this.selectedCity = item.title;
    },
    getSelectedDistrict(item) {
      this.selectedDistrict = item.title;
    },
    submitHometown() {
      if (this.selectedCity && this.selectedDistrict) {
        this.actionGetExtRedirect({
          api_uri: "/api/platform/v1/user/update-hometown",
          method: "put",
          data: { hometown: `${this.selectedCity} ${this.selectedDistrict}` }
        }).then(res => {
          if (res.result === "success") {
            this.editedSuccess();
            this.getPaopaoMemberData();
            this.showHometownEdit = false;
          } else {
            this.actionSetGlobalMessage({ msg: `${res.error_text}` });
          }
        });
      } else {
        return;
      }
    },
    handleGenderSubmit() {
      // 空值驗證
      if (this.selectGenderValue === "") {
        this.$emit("msg", this.$text("S_CR_NUT_NULL"));
        return Promise.resolve("error");
      }

      return mcenter.accountDataSet({
        params: {
          gender: this.selectGenderValue
        },
        success: () => {
          this.editedSuccess();
          this.showGenderEdit = false;
        },
        fail: res => {
          if (res && res.data && res.data.msg) {
            this.actionSetGlobalMessage({ msg: `${res.data.msg}` });
          }
        }
      });
    },

    handleClick(field) {
      if (field.key === "phone" || field.key === "email") {
        //   手機未驗證能設定
        if (field.btnShow) {
          this.$router.push({
            path: `/mobile/mcenter/accountData/${field.key}`
          });
        }
        // 只能設定一次
        // if (this.memInfo.user.phone && !this.memInfo.config.user_edit_phone) {
        //   return;
        // }
      }

      if (field.key === "birthday") {
        return;
      }

      if (!field.btnShow) {
        return;
      }

      if (
        [
          "alias",
          "name",
          "phone",
          "qq",
          "weixin",
          "line",
          "withdrawPwd",
          "skype",
          "telegram",
          "kakaotalk"
        ].includes(field.key)
      ) {
        this.$router.push({
          path: `/mobile/mcenter/accountData/${field.key}`
        });
        return;
      } else if (field.key === "receiptAddress") {
        // if (this.addressInfo.id === '') {
        //   this.$router.push({
        //     path: `/mobile/mcenter/accountData/addAddress`
        //   });
        // } else {
        //   localStorage.setItem('set-address-data-empty', this.addressInfo.id === '');
        //   this.$router.push({
        //     path: `/mobile/mcenter/accountData/${field.key}`
        //   });
        // }
        localStorage.setItem(
          "set-address-data-empty",
          this.addressInfo.id === ""
        );
        this.$router.push({
          path: `/mobile/mcenter/accountData/${field.key}`
        });

        return;
      }
      this.currentEdit = field.key;
    },
    editedSuccess(msg) {
      this.actionSetUserdata(true);
      this.currentEdit = "";
      this.showSuccess = true;
      localStorage.removeItem("set-account-success");
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    },
    getAddress() {
      axios({
        method: "get",
        url: "/api/v1/c/player/address"
      })
        .then(res => {
          if (res && res.data && res.data.result === "ok") {
            if (res.data.ret.length > 0) {
              this.addressInfo = res.data.ret.find(data => data.is_default);
              if (localStorage.getItem("set-address-default")) {
                if (
                  this.addressInfo.is_default !=
                  res.data.ret[
                    parseInt(localStorage.getItem("set-address-default"))
                  ].is_default
                ) {
                  this.getAddress();
                } else {
                  localStorage.removeItem("set-address-default");
                }
              }
            }
          }
        })
        .catch(error => {});
    },
    onInputBirthday(e) {
      this.tipMsg = "";
      this.birthdayValue = e;
      if (this.value === "") {
        this.tipMsg = this.$text("S_CR_NUT_NULL");
      }

      const valueDate = new Date(this.birthdayValue);
      const limit = new Date(Vue.moment(this.systemTime).add(-18, "year"));
      if (valueDate > limit) {
        this.actionSetGlobalMessage({ msg: "年龄未满十八岁,无法游戏" });
        this.birthdayValue = "";
      } else {
        mcenter.accountDataSet({
          params: {
            birthday: Vue.moment(this.birthdayValue).format()
          },
          success: () => {
            this.editedSuccess();

            // setTimeout(() => {
            //   window.location.reload();
            // }, 3000);
          },
          fail: res => {
            if (res && res.data && res.data.msg) {
              this.actionSetGlobalMessage({ msg: `${res.data.msg}` });
            }
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" src="../../css/index.module.scss" module></style>
