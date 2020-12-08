<template>
  <div v-if="isReady">
    <slot :filtered-data-list="filteredDataList" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import exceptionList from '@/config/exceptionList';
import ajax from '@/lib/ajax';

export default {
  data() {
    return {
      mcenterUserField: {},
      isReady: false,
      lang: this.$i18n.locale,
      verification: {
        email: true,
        phone: true
      },
      dataList: [
        {
          title: 'realName',
          text: 'S_REAL_NAME_CONFIRM',
          isShow: true,
          field: {
            name: {
              key: 'name',
              text: 'S_REAL_NAME',
              status: '',
              value: '',
              btnShow: true,
              isShow: true,
              placeholder: '姓名需与银行持卡人姓名一致，否则无法提现'
            },
            alias: {
              key: 'alias',
              text: 'S_NICKNAME',
              status: '',
              value: '',
              btnShow: true,
              type: 'alias',
              isShow: true,
              popTitle: 'S_MODIFY_NICKNAME'
            },
            gender: {
              key: 'gender',
              text: 'S_GENDER',
              status: '',
              value: '',
              btnShow: true,
              isShow: true,
              placeholder: '未选择'
            },
            birthday: {
              key: 'birthday',
              text: 'S_BIRTHDAY_DATE',
              status: '',
              value: '',
              btnShow: true,
              isShow: true,
              placeholder: '添加日期，确保您已满18岁'
            },
            phone: {
              key: 'phone',
              text: 'S_TEL',
              status: '',
              value: '',
              btnShow: true,
              type: 'bind',
              verification: true,
              isShow: true,
              placeholder: '绑定手机保护帐号安全'
            },
            email: {
              key: 'email',
              text: 'SS_E_MAIL',
              status: '',
              value: '',
              btnShow: true,
              type: 'bind',
              verification: true,
              isShow: false,
              placeholder: '绑定邮箱保护帐号安全'
            },
            qq_num: {
              key: 'qq',
              text: 'S_QQ',
              status: '',
              value: '',
              btnShow: true,
              isShow: false,
              placeholder: '尚未设定'
            },
            weixin: {
              key: 'weixin',
              text: 'WECHAT',
              status: '',
              value: '',
              btnShow: true,
              isShow: false,
              placeholder: '尚未设定'
            },
            line: {
              key: 'line',
              text: 'S_LINE',
              status: '',
              value: '',
              btnShow: true,
              isShow: false,
              placeholder: '尚未设定'
            },
            facebook: {
              key: 'facebook',
              text: 'S_FACEBOOK',
              status: '',
              value: '',
              btnShow: true,
              isShow: false,
              popTitle: ''
            },
            skype: {
              key: 'skype',
              text: 'S_SKYPE',
              status: '',
              value: '',
              btnShow: true,
              isShow: false,
              popTitle: ''
            },
            zalo: {
              key: 'zalo',
              text: 'S_ZALO',
              status: '',
              value: '',
              btnShow: true,
              isShow: false,
              popTitle: ''
            },
            withdrawPwd: {
              key: 'withdrawPwd',
              text: 'S_DAW_DRWAL_PASSWORD',
              status: '',
              value: '',
              btnShow: true,
              isShow: true,
              popTitle: ''
            }
          }
        },
        {
          title: 'personalData',
          text: 'S_PERSONAL_DATA',
          isShow: true,
          field: {
          }
        },
        {
          title: 'receiptAddress',
          text: 'S_RECEIPT_ADDRESS',
          key: 'receiptAddress',
          isShow: true,
          btnShow: true,
          field: {}
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      webInfo: 'getWebInfo',
      siteConfig: "getSiteConfig"
    }),
    // 過濾特例的資料
    filteredDataList() {
      return this.dataList
        .filter((data) => data.isShow)
        .map((item) => ({
          ...item,
          field: Object.keys(item.field)
            .filter((subItem) => item.field[subItem].isShow)
            .reduce((obj, key) => ({
              ...obj,
              [key]: item.field[key]
            }), {})
        }));
    },
    // 特例判斷
    isException() {
      const { wonderCasino, knightCasino } = exceptionList;
      return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
    }
  },
  watch: {
    memInfo: {
      immediate: true,
      handler() {
        this.getData();
      }
    },
    lang() {
      this.setData(this.mcenterUserField);
    }
  },
  beforeUpdate() {
    this.lang = this.$i18n.locale;
  },
  methods: {
    ...mapActions([
      'actionSetPop'
    ]),
    getData() {
      ajax({
        method: 'get',
        url: '/api/v1/c/player/user_info_config/with_verify',
        // url: API_MCENTER_USER_CONFIG,
        errorAlert: false
      }).then((response) => {
        if (response && response.result === 'ok') {
          // 手機/信箱是否驗證過
          Object.keys(this.verification).forEach((key) => {
            this.verification[key] = response.ret.user[key];
          });
          Object.keys(this.dataList).forEach((item) => {
            if (this.dataList[item].title === 'receiptAddress') {
              this.dataList[item].isShow = response.ret.config.address.display;
            }
          });
          this.mcenterUserField = response.ret;
          this.setData(response.ret);
        }

        this.isReady = true;
      });
    },
    setData(userConfig = {}) {
      if (Object.keys(userConfig).length === 0) {
        return;
      }

      Object.keys(this.dataList).forEach((item) => {
        Object.keys(this.dataList[item].field).forEach((key) => {
          let itemNow = this.dataList[item].field[key];
          if (key === 'email' || key === 'phone') {
            const keyValue = this.memInfo[key][key];
            let val = keyValue ? keyValue : itemNow.placeholder;
            let confirmSt = 'yet';

            if (keyValue) {
              val = keyValue;
              confirmSt = 'ok';
              if (!this.verification[key] || userConfig.user[key]) {
                confirmSt = 'already';
              }
            }
            itemNow = {
              ...itemNow,
              status: confirmSt,
              value: val,
              // btnShow: !keyValue || !this.verification[key] ||
              //   (key === 'phone' && this.memInfo.config.user_edit_phone) ||
              //   (key === 'phone' && this.mcenterUserField.config.phone.code) ||
              //   (key === 'email' && userConfig.user[key]) ||
              //   (key === 'email' && this.mcenterUserField.config.email.code)
              // ,
              btnShow: !keyValue || !userConfig.user[key],  // 未驗證 或者 未填 可修改
              verification: this.verification[key],
              isShow: userConfig.config[key].display
            };
          } else if (key === 'alias' && userConfig.config[key]) {
            itemNow = {
              ...itemNow,
              status: this.memInfo.user[key] ? 'already' : 'yet',
              value: this.memInfo.user[key] || this.$t('S_YET_SET'),
              btnShow: true,
              isShow: userConfig.config[key].display
            };
          } else if (key === 'withdrawPwd') {
            const wdStatus = this.memInfo.user.has_withdraw_password;
            itemNow = {
              ...itemNow,
              status: wdStatus ? 'already' : 'yet',
              value: wdStatus ? this.$t('S_SET_CL_ALREADY') : this.$t('S_YET_SET'),
              btnShow: true,//提現密碼可修改btnShow: !wdStatus,
              isShow: userConfig.config.withdraw_password.display && this.siteConfig.MOBILE_WEB_TPL !== 'porn1'
            }
          } else {
            const keyValue = this.memInfo.user[key];
            let checkValue = keyValue;

            if (keyValue) {
              if (key === 'gender') {
                checkValue = this.$t('S_MALE');
                if (+keyValue === 2) {
                  checkValue = this.$t('S_FEMALE');
                }
              }
            }
            itemNow = {
              ...itemNow,
              status: keyValue ? 'already' : 'yet',
              value: keyValue ? checkValue : itemNow.placeholder,
              btnShow: !keyValue,
              isShow: userConfig.config[key] ? userConfig.config[key].display : false
            };
          }
          this.dataList[item].field[key] = itemNow;
        });
      });
    }
  }
};
</script>
