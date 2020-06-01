<template>
  <!-- pc版 mg遊戲嵌iframe -->
  <div>
    <message v-if="msg" @close="msg = ''" :callback="clearMsg">
      <div slot="msg">
        {{ msg }}
      </div>
    </message>
    <div v-if="!isMobile && vendor === 'mg'" class="game-window">
      <iframe :src="urlData.url" class="game-iframe" />
      <div class="bet-record-btn" @click="onClick" />
    </div>
    <!-- pc版 sp -->
    <div v-else-if="!isMobile && vendor === 'sp'" class="game-window sunplus">
      <div class="rule-wrap">
        <span class="rule-link" @click="onClick">
          <icon name="question-circle" />{{
            rulesTitle[curLang] || rulesTitle["zh-cn"]
          }}
        </span>
      </div>
      <iframe :src="urlData.url" class="game-iframe" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import game from '@/api/game';
import isMobileFuc from '@/lib/is_mobile';
import message from "@/router/mobile/components/tpl/porn1/components/common/new/message"

export default {
  components: {
    message,
  },
  data() {
    const isMobile = isMobileFuc();

    return {
      isMobile,
      vendor: '',
      urlData: {},
      rulesTitle: this.$i18n.t('S_RULES'),
      msg: ''
    };
  },
  computed: {
    ...mapGetters({
      curLang: 'getCurLang'
    })
  },
  created() {
    const { vendor, kind, code } = this.$route.params;
    const temp = { kind };
    this.vendor = vendor;

    if (code) {
      temp.code = code;
    }

    game.gameLink({
      params: temp,
      errorAlert: false,
      success: (response) => {
        const { result, ret } = response;
        if (result !== 'ok') {
          return;
        }

        if (!this.isMobile && vendor === 'sp') {
          this.urlData = ret;
          return;
        }

        if (!this.isMobile && vendor === 'mg') {
          this.urlData = ret;
          return;
        }

        window.location.href = ret.url;
      },
      fail: (res) => {
        this.msg = res.data && res.data.msg ? res.data.msg : '';
        setTimeout(() => {
          this.$nextTick(() => {
            window.close();
          });
        }, 2500)
      }
    }, vendor);
  },
  methods: {
    onClick() {
      // MG => 另開投注明細, SP => 另開規則說明
      window.open(this.urlData.url2, 'bet record', 'width=900, height=900');
    },
    clearMsg() {
      this.msg = ""
    }
  },
};
</script>

<style lang="scss" src="@/css/router/game.scss"></style>
