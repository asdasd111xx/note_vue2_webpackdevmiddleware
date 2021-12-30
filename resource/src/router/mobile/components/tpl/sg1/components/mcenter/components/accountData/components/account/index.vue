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
            <span :class="$style['field-title']">帐号</span>
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
                    format="YYYY/MM/DD"
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
          <div
            :class="[$style['account-data-field'], 'clearfix']"
            @click="memInfo.user.gender ? '' : (showGenderEdit = true)"
          >
            <span :class="$style['field-title']">性别</span>
            <div :class="$style['field-value']" v-if="!showGenderEdit">
              <span v-if="memInfo.user.gender" :class="$style['field-text']">
                {{ memInfo.user.gender == 1 ? "男" : "女" }}</span
              >
              <template v-else>
                <span :class="[$style['field-text'], $style['yet']]"
                  >未选择</span
                >
                <div :class="$style['feature-btn']">
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
                    @click.stop="cancelGenderEdit"
                  >
                    {{ $text("S_CANCEL", "取消") }}
                  </span>
                  <span
                    :class="$style['btn-confirm']"
                    @click="handleGenderSubmit"
                  >
                    {{ $text("S_CONFIRM", "确认") }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <!-- 直播資料  -->
          <div
            :class="[$style['account-data-field'], 'clearfix']"
            @click="checkAliasEdit"
          >
            <span :class="$style['field-title']">直播昵称</span>
            <div :class="$style['field-value']">
              <span
                v-if="paopaoMemberCardInfo.alias"
                :class="$style['field-text']"
              >
                {{ paopaoMemberCardInfo.alias }}</span
              >
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >尚未设定</span
              >
              <div :class="$style['feature-btn']">
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 暱稱變更阻擋提示 -->
          <transition name="fade">
            <div v-show="cantEditAlias" :class="$style['alert-dialog-masker']">
              <div :class="$style['alert-dialog-wrap']">
                <h3>提示</h3>
                <p>修改次数不足，请购买更名卡后 再重新操作</p>
                <div :class="$style['btn-wrap']">
                  <span @click="cantEditAlias = false">取消</span>
                  <span
                    @click="
                      $router.push('/mobile/live/iframe/mall?hasFooter=false')
                    "
                    >去购买</span
                  >
                </div>
              </div>
            </div>
          </transition>
          <div
            :class="[$style['account-data-field'], 'clearfix']"
            @click="$router.push('/mobile/mcenter/accountData/intro')"
          >
            <span :class="$style['field-title']">签名</span>
            <div :class="$style['field-value']">
              <span
                v-if="paopaoMemberCardInfo.intro"
                :class="$style['field-text']"
                >{{ paopaoMemberCardInfo.intro }}</span
              >
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >TA好像忘记签名了</span
              >
              <div :class="$style['feature-btn']">
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            :class="[$style['account-data-field'], 'clearfix']"
            @click="showHometownEdit = true"
          >
            <span :class="$style['field-title']">地区</span>
            <div :class="$style['field-value']" v-if="!showHometownEdit">
              <span
                v-if="paopaoMemberCardInfo.hometown"
                :class="$style['field-text']"
                >{{ paopaoMemberCardInfo.hometown }}
              </span>
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >请选择所在地区
              </span>
              <div :class="$style['feature-btn']">
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>

            <!-- 修改地區 -->
            <template>
              <div
                v-if="showHometownEdit"
                :class="$style['hometown-input-wrap']"
              >
                <select
                  :class="$style['city']"
                  v-model="thecity"
                  id="selectcity"
                  autofocus
                >
                  <option
                    v-for="(item, index) in theCityList"
                    :key="index"
                    :class="$style['cell']"
                  >
                    {{ item }}
                  </option>
                </select>
                <select
                  :class="$style['district']"
                  v-model="thedistrict"
                  id="selectdistrict"
                  :disabled="
                    thecity == '这是TA的秘密' || thecity == '火星'
                      ? true
                      : false
                  "
                >
                  <option
                    v-for="(item, index) in filtertheDistrictList"
                    :key="index"
                    :class="$style['cell']"
                  >
                    {{ item }}
                  </option>
                </select>

                <div :class="$style['btn-wrap']">
                  <span
                    :class="$style['btn-cancel']"
                    @click.stop="cancelHometownEdit"
                  >
                    {{ $text("S_CANCEL", "取消") }}
                  </span>
                  <span
                    :class="$style['btn-confirm']"
                    @click="handleHometownSubmit"
                  >
                    {{ $text("S_CONFIRM", "确认") }}
                  </span>
                </div>
              </div>
            </template>
            <!-- 地區選取備用套件pdselect -->
            <!-- <template v-if="showHometownEdit">
              <div :class="$style['more-method-wrap']">
                <div :class="$style['more-method-container']">
                  <div
                    :class="$style['more-method-header']"
                    style="position: fixed;bottom: 220px;width: 100%; left:0; borderRadius: 20px 20px 0 0;"
                  >
                    <div
                      :class="$style['prev']"
                      @click.stop="showHometownEdit = false"
                    >
                      {{ $text("S_CANCEL", "取消") }}
                    </div>
                    <div :class="$style['confirm']" @click="submitHometown">
                      {{ $text("S_CONFIRM_2", "确定") }}
                    </div>
                    <div :class="$style['title']">
                      地區
                    </div>
                  </div>
                  <div :class="$style['more-method-content']">
                    <pd-select-box
                      style="position: fixed;bottom: 0;width: 100%;"
                    >
                      <pd-select-item
                        ref="thecity"
                        :listData="theCityList"
                        v-model="thecity"
                      ></pd-select-item>
                      <pd-select-item
                        ref="thedistrict"
                        :listData="filtertheDistrictList"
                        type="cycle"
                        v-model="thedistrict"
                      ></pd-select-item>
                    </pd-select-box>
                  </div>
                </div>
              </div>
            </template> -->
          </div>
          <div
            :class="[$style['account-data-field'], 'clearfix']"
            @click="showRelationshipEdit = true"
          >
            <span :class="$style['field-title']">感情</span>
            <div :class="$style['field-value']" v-if="!showRelationshipEdit">
              <span
                v-if="paopaoMemberCardInfo.relationship"
                :class="$style['field-text']"
                >{{ paopaoMemberCardInfo.relationship }}</span
              >
              <span v-else :class="[$style['field-text'], $style['yet']]"
                >尚未设定</span
              >
              <div :class="$style['feature-btn']">
                <div :class="$style['btn-next']">
                  <img
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                </div>
              </div>
            </div>

            <!-- 感情編輯/修改 -->
            <template>
              <div
                v-if="showRelationshipEdit"
                :class="$style['relationship-input-wrap']"
              >
                <select v-model="selectRelationshipValue">
                  <option
                    :key="index"
                    v-for="(item, index) in relationshipList"
                    :value="item.id"
                    >{{ item.status }}</option
                  >
                </select>
                <div :class="$style['btn-wrap']">
                  <span
                    :class="$style['btn-cancel']"
                    @click.stop="cancelRelationshipEdit"
                  >
                    {{ $text("S_CANCEL", "取消") }}
                  </span>
                  <span
                    :class="$style['btn-confirm']"
                    @click="handleRelationshipSubmit"
                  >
                    {{ $text("S_CONFIRM", "确认") }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <!-- 平台資料  -->
          <div :class="[$style['account-data-field'], 'clearfix']">
            <span :class="$style['field-title']">真实姓名</span>
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
          <div
            :class="[$style['account-data-field'], 'clearfix']"
            @click="
              memInfo.user.phone
                ? ''
                : $router.push('/mobile/mcenter/accountData/phone')
            "
          >
            <span :class="$style['field-title']">{{
              $text("S_TEL", "手机号码")
            }}</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.phone" :class="$style['field-text']">{{
                memInfo.user.phone
              }}</span>
              <template v-else>
                <span :class="[$style['field-text'], $style['yet']]"
                  >绑定手机保护帐号安全</span
                >
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
          <div
            :class="[$style['account-data-field'], 'clearfix']"
            @click="
              memInfo.user.email
                ? ''
                : $router.push('/mobile/mcenter/accountData/email')
            "
          >
            <span :class="$style['field-title']">{{
              $text("S_E_MAIL", "电子邮箱")
            }}</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.email" :class="$style['field-text']">
                {{ memInfo.user.email }}</span
              >
              <template v-else>
                <span :class="[$style['field-text'], $style['yet']]"
                  >绑定邮箱保护帐号安全</span
                >
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
          <div
            :class="[$style['account-data-field'], 'clearfix']"
            @click="
              memInfo.user.qq_num
                ? ''
                : $router.push('/mobile/mcenter/accountData/qq')
            "
          >
            <span :class="$style['field-title']">QQ</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.qq_num" :class="$style['field-text']">{{
                memInfo.user.qq_num
              }}</span>
              <template v-else>
                <span :class="[$style['field-text'], $style['yet']]"
                  >尚未设定</span
                >
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
          <div
            :class="[$style['account-data-field'], 'clearfix']"
            @click="
              memInfo.user.weixin
                ? ''
                : $router.push('/mobile/mcenter/accountData/weixin')
            "
          >
            <span :class="$style['field-title']">微信</span>
            <div :class="$style['field-value']">
              <span v-if="memInfo.user.weixin" :class="$style['field-text']">{{
                memInfo.user.weixin
              }}</span>
              <template v-else>
                <span :class="[$style['field-text'], $style['yet']]"
                  >尚未设定</span
                >
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
        </template>
      </template>
    </account-wrap>

    <div v-if="isShowPop" :class="$style['pop-wrap']">
      <div :class="$style['pop-mask']" />
      <div :class="$style['pop-block']">
        <div :class="$style['content']">
          <div :class="$style['title']">
            {{ $text("S_TIPS", "温馨提示") }}
          </div>

          <span>确认生日绑定 {{ birthdayValue }} 吗？</span>
        </div>

        <div :class="$style['button-block']">
          <span @click="cancelsubmitBirthday">
            {{ $text("S_CANCEL", "取消") }}
          </span>

          <span @click="sendBirthday">
            {{ $text("S_CONFIRM_2", "确定") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import DatePicker from "vue2-datepicker";
import Vue from "vue";
import mcenter from "@/api/mcenter";
//https://github.com/k186/pd-select/
// import pdSelect from "pd-select";
// Vue.use(pdSelect);

export default {
  components: {
    // pdSelect,
    accountWrap: () =>
      import(/* webpackChunkName: 'accountWrap' */ "./accountWrap"),
    editName: () =>
      import(/* webpackChunkName: 'editName' */ "./form/editName"),
    editAlias: () =>
      import(/* webpackChunkName: 'editAlias' */ "./form/editAlias"),
    editIntro: () =>
      import(/* webpackChunkName: 'editIntro' */ "./form/editIntro"),
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
      thecity: "",
      thedistrict: "",
      theCityList: [],
      theDistrictList: [],
      hometownList: [],
      paopaoMemberCardInfo: {},
      currentTab: 0,
      currentEdit: "",
      showSuccess: false,
      birthdayValue: "",
      showGenderEdit: false,
      selectGenderValue: "",
      showRelationshipEdit: false,
      selectRelationshipValue: "",
      showHometownEdit: false,
      cantEditAlias: false,
      relationshipList: [],
      addressInfo: {
        id: "",
        is_default: false,
        name: "",
        phone: "",
        address: ""
      },
      isShowPop: false
    };
  },
  created() {
    this.getPaopaoMemberData();
    this.getHometownListData();
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      systemTime: "getSystemTime"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    filtertheDistrictList() {
      this.hometownList.map(item => {
        if (this.thecity == item.city) {
          this.theDistrictList = item.district || [];
        }
      });

      return this.theDistrictList;
    }
  },
  mounted() {
    this.getRelationshipData();
    this.gettheDistrictList();
    this.actionSetSystemTime();
    if (localStorage.getItem("set-account-success")) {
      this.editedSuccess();
      this.$router.push({ query: { success: true } });
    }
    // setTimeout(() => {
    //   //pdselect验证 model 联动
    //   this.after();
    // }, 800);
  },

  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetSystemTime",
      "actionSetGlobalMessage",
      "actionGetExtRedirect"
    ]),
    // after() {
    //   this.thecity = "这是TA的秘密";
    //   this.thedistrict = "";
    //   this.$refs.thecity.init();
    //   this.$refs.thedistrict.init();
    // },
    checkAliasEdit() {
      return this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/alias-update-status",
        method: "get"
      }).then(data => {
        if (data && data.result && data.result.allow_update === false) {
          this.cantEditAlias = true;
        } else {
          this.$router.push("/mobile/mcenter/accountData/alias");
        }
      });
    },
    gettheDistrictList() {
      this.hometownList.map(item => {
        if (this.thecity == item.city) {
          this.theDistrictList = item.district || [];
        }
      });
    },
    getPaopaoMemberData() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/personal-info",
        method: "get"
      }).then(data => {
        this.paopaoMemberCardInfo = data.result || null;
      });
    },
    getHometownListData() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/info/hometown-list",
        method: "get"
      }).then(data => {
        this.hometownList = data.result;
        this.theCityList = data.result.map(item => {
          return item.city || [];
        });
      });
    },
    getRelationshipData() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/info/relationship-list",
        method: "get"
      }).then(data => {
        this.relationshipList = data.result || [];
      });
    },
    cancelRelationshipEdit() {
      this.selectRelationshipValue = "";
      this.showRelationshipEdit = false;
    },
    handleHometownSubmit() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/update-hometown",
        method: "put",
        data: {
          hometown:
            this.thecity == "这是TA的秘密" || this.thecity == "火星"
              ? `${this.thecity}`
              : `${this.thecity}-${this.thedistrict}`
        }
      }).then(res => {
        if (res.result === "success") {
          this.editedSuccess();
          this.getPaopaoMemberData();
          this.showHometownEdit = false;
        } else {
          this.actionSetGlobalMessage({ msg: `${res.error_text}` });
        }
      });
    },
    handleRelationshipSubmit() {
      // 空值驗證
      if (this.selectRelationshipValue === "") {
        this.$emit("msg", this.$text("S_CR_NUT_NULL"));
        return Promise.resolve("error");
      }

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/update-relationship",
        method: "put",
        data: { relationship: `${this.selectRelationshipValue}` }
      }).then(res => {
        if (res.result === "success") {
          this.editedSuccess();
          this.getPaopaoMemberData();
          this.showRelationshipEdit = false;
        } else {
          this.actionSetGlobalMessage({ msg: `${res.error_text}` });
        }
      });
    },
    cancelHometownEdit() {
      this.showHometownEdit = false;
    },
    cancelGenderEdit() {
      this.selectGenderValue = "";
      this.showGenderEdit = false;
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
    editedSuccess(msg) {
      this.actionSetUserdata(true);
      this.currentEdit = "";
      this.showSuccess = true;
      localStorage.removeItem("set-account-success");
      setTimeout(() => {
        this.showSuccess = false;
      }, 3000);
    },
    onInputBirthday(e) {
      this.tipMsg = "";
      this.birthdayValue = e;
      if (this.value === "") {
        this.tipMsg = this.$text("S_CR_NUT_NULL");
      }
      this.isShowPop = true;
    },
    cancelsubmitBirthday() {
      this.isShowPop = false;
      this.birthdayValue = "";
    },
    sendBirthday() {
      const valueDate = new Date(this.birthdayValue);
      const limit = new Date(Vue.moment(this.systemTime).add(-18, "year"));
      if (valueDate > limit) {
        this.actionSetGlobalMessage({ msg: "年龄未满十八岁,无法游戏" });
        this.isShowPop = false;
        this.birthdayValue = "";
      } else {
        this.isShowPop = false;
        mcenter.accountDataSet({
          params: {
            birthday: Vue.moment(this.birthdayValue).format()
          },
          success: () => {
            this.editedSuccess();
            setTimeout(() => {
              window.location.reload();
            }, 3000);
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

<style>
/* .pd-select-line::before {
  background: #ddd !important;
}
.pd-select-line::after {
  background: #ddd !important;
}

.pd-select-wheel .pd-select-wheel-item {
  -webkit-backface-visibility: hidden !important;
} */
</style>
