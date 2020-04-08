<template>
  <mobile-container>
    <div slot="content" :class="$style['content-wrap']">
      <!-- login&register -->
      <div :class="$style['login-register-header']">
        <img src="" />
        <div>
          点击登录/注册
        </div>
      </div>

      <!-- vip&task -->
      <div :class="$style['vip-task-info']">
        <div>
          <img />

          <div>
            <span>VIP特权</span>
            <span>VIP PRIVILEGE</span>
          </div>
        </div>

        <div>
          <img />

          <div>
            <span>任务中心</span>
            <span>TASK CENTER</span>
          </div>
        </div>
      </div>
      <!-- func -->
      <div :class="$style['mine-func']">
        <div>
          <img />
          <div>我的钱包</div>
        </div>
        <div>
          <img />
          <div>投注记录</div>
        </div>

        <div>
          <img />
          <div>交易记录</div>
        </div>

        <div>
          <img />
          <div>卡片管理</div>
        </div>
      </div>
      <!-- memlist -->

      <div :class="$style['msg-icon']">
        <img
          :src="
            $getCdnPath('/static/image/mobile/tpl/porn1/home/message_icon.png')
          "
          @click="goMessage()"
        />
      </div>
      <vip-info />
      <mem-list />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../../../common/mobileContainer';
import vipInfo from './components/vipInfo';
import memList from './components/memList';

export default {
  components: {
    mobileContainer,
    vipInfo,
    memList
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    })
  },
  created() {

  },
  methods: {
    goMessage() {
      if (!this.loginStatus) {
        this.$router.push('/mobile/login');
        return;
      }
      this.$router.push('/mobile/mcenter/information/message');
    }
  }
};
</script>

<style lang="scss" module>
.content-wrap {
  overflow-y: scroll;
}

.mine-func {
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  align-items: center;
}
</style>
