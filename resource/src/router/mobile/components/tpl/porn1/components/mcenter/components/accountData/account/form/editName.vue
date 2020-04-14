<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <edit-name>
        <template scope="{ onSubmit }">
          <!-- 暫時解scope 無法使用在header computed -->
          <div :class="$style['save-btn']" @click="handleSubmit(onSubmit)">
            {{ $text("S_COMPLETE", "完成") }}
          </div>

          <div :class="[$style.wrap, 'clearfix']">
            <div :class="$style.block">
              <div :class="$style.title">{{ $text("S_REAL_NAME") }}</div>
              <div :class="$style['input-wrap']">
                <input
                  ref="input"
                  :value="value"
                  :placeholder="
                    $text('S_ENTER_REAL_NAME', '请输入您的真实姓名')
                  "
                  :class="$style.input"
                  type="text"
                  @input="onInput"
                />
              </div>
            </div>
          </div>
          <service-tips />
        </template>
      </edit-name>
    </div>
  </mobile-container>
</template>

<script>
import { API_MCENTER_USER_CONFIG } from '@/config/api';
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import member from '@/api/member';
import mobileContainer from '../../../../../common/new/mobileContainer';
import serviceTips from '../../serviceTips'
import editName from '@/components/common/editName';

export default {
  components: {
    editName,
    mobileContainer,
    serviceTips
  },
  // props: {
  //     info: {
  //         type: Object,
  //         required: true
  //     }
  // },
  data() {
    return {
      value: '',
      info: {
        key: 'name',
        text: 'S_REAL_NAME',
        status: '',
        value: '',
        btnText: '',
        btnShow: true,
        type: 'edit',
        isShow: true,
        popTitle: ''
      }
    };
  },
  created() {
    ajax({
      method: 'get',
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then((response) => {
      if (response && response.result === 'ok') {
        this.info.verification = response.ret.config['name'].code;
        this.setData(response.ret);
      }
    });
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      webInfo: 'getWebInfo'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text("S_REAL_NAME", "真实姓名"),
      };
    },
  },
  methods: {
    ...mapActions(['actionSetUserdata']),
    onInput(e) {
      this.value = e.target.value;

      // 個人姓名限制輸入上限30字元
      if (this.value.length > 30) {
        this.value = this.value.substring(0, 30);
      }
    },
    handleSubmit(submit) {
      if (!this.value || !this.value.length > 0) return;
      submit(this.value).then((response) => {
        if (response.status) {
          this.$emit('cancel');
        }
      });
    },
    setData(userConfig = {}) {
      if (Object.keys(userConfig).length === 0) {
        return;
      }

      const keyValue = this.memInfo.user.name;

      let val = this.$t('S_YET_SET');
      let text = this.$t('S_SET_CL');
      let confirmSt = 'yet';

      if (keyValue) {
        val = `${this.$t('S_YET_VERIFIED')}(${keyValue})`;
        text = this.$t('S_VERIFY');
        confirmSt = 'ok';
        if (userConfig.user['name']) {
          val = keyValue;
          text = this.$t('S_CS_EDIT');
          confirmSt = 'already';
        }
      }
      this.info = {
        ...this.info,
        status: confirmSt,
        value: val,
        btnText: text,
        btnShow: true,
        verification: true,
        isShow: userConfig.config['name'].display
      };
      this.oldValue = val
    }
  }
};
</script>
<style src="../../css/index.module.scss" lang="scss" module>
