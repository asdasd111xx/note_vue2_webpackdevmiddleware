<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" :class="$style['setting-wrap']">
      <div v-if="list" :class="$style['content']">
        <div :class="$style['title']">
          <div :class="$style['block']" />
          反馈或建议
        </div>
        <div :class="$style['cell']">
          <div>
            <img :src="(list[4] && list[4].value) || defaultImgSrc" />
          </div>
          <div>
            <div>
              <div>{{ list[0].name }}</div>
              <div>{{ list[0].value }}</div>
            </div>
          </div>
          <div :class="$style['copy-btn']">
            <div @click="copy(0)">{{ $text("S_COPY", "复制") }}</div>
          </div>
        </div>

        <div :class="$style['cell']">
          <div>
            <img :src="(list[5] && list[5].value) || defaultImgSrc" />
          </div>
          <div>
            <div>
              <div>{{ list[1].name }}</div>
              <div>{{ list[1].value }}</div>
            </div>
          </div>
          <div :class="$style['copy-btn']">
            <div @click="copy(1)">{{ $text("S_COPY", "复制") }}</div>
          </div>
        </div>
      </div>
      <div v-if="list" :class="$style['content']">
        <div :class="$style['title']">
          <div :class="$style['block']" />
          成为合营伙伴
        </div>
        <div :class="$style['cell']">
          <div>
            <img :src="(list[6] && list[6].value) || defaultImgSrc" />
          </div>
          <div>
            <div>
              <div>{{ list[2].name }}</div>
              <div>{{ list[2].value }}</div>
            </div>
          </div>
          <div :class="$style['copy-btn']">
            <div @click="copy(2)">{{ $text("S_COPY", "复制") }}</div>
          </div>
        </div>

        <div :class="$style['cell']">
          <div>
            <img :src="(list[7] && list[7].value) || defaultImgSrc" />
          </div>
          <div>
            <div>
              <div>{{ list[3].name }}</div>
              <div>{{ list[3].value }}</div>
            </div>
          </div>
          <div :class="$style['copy-btn']">
            <div @click="copy(3)">{{ $text("S_COPY", "复制") }}</div>
          </div>
        </div>
      </div>
      <message v-if="msg" @close="msg = ''"
        ><div slot="msg">{{ msg }}</div>
      </message>

      <div :class="$style['online-btn']">
        <div @click="$router.push('/mobile/service')">
          7*24在线客服
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import mobileContainer from '../../../common/new/mobileContainer';
import message from '../../../../../porn1/components/common/new/message'
import ajax from '@/lib/ajax';

export default {
  components: {
    mobileContainer,
    message
  },
  //   {
  //         id: 1,
  //         type: "cu",
  //         name: "投诉建义",
  //         value: "cs@yaboxxx.net"
  //    }
  data() {
    return {
      msg: '',
      list: null,
      defaultImgSrc: this.$getCdnPath(`/static/image/_new/mcenter/help/email.png`)
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig',
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_CONTACT_US', '联系我们'),
      };
    },
  },
  created() {
    ajax({
      method: 'get',
      url: this.siteConfig.YABO_API_DOMAIN + '/system/contactus',
    }).then((res) => {
      this.list = res.data;
    })
  },
  methods: {
    copy(key) {
      let string = this.list[key].value;
      if (!string) return;

      var textArea = document.createElement("textarea");
      textArea.value = string;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        let successful = document.execCommand('copy');
        if (successful) {
          this.msg = this.$text("S_COPY_SUCCESSFUL", "複製成功");
        }
      } catch (err) {
        alert(err)
      }

      document.body.removeChild(textArea);

    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.container {
  background-color: $main_background_white1;
}

.title {
  height: 40px;
  margin: 5px 8px;
  display: inline-flex;
  align-items: center;
  .block {
    width: 2.5px;
    height: 17px;
    background: linear-gradient(to top, #dccab8, #d2b496);
    border-radius: 1px;
    margin-right: 10px;
  }
}
.content {
  padding: 5px;
  .cell {
    background-color: $main_white_color1;
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 70px;

    > div:first-child {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px;
      img {
        width: 24px;
      }
    }

    > div:nth-child(2) {
      width: 100%;
    }

    > .copy-btn {
      color: #d3b498;
      width: 120px;
      text-align: center;
      > div {
        border-radius: 5px;
        border: 1px solid #d3b498;
        color: #d3b498;
        padding: 2.5px 5px;
      }
    }
  }
}
.online-btn {
  height: 45px;
  margin-top: 30px;
  margin-left: 12px;
  margin-right: 12px;

  text-align: center;
  > div {
    color: white;
    height: 45px;
    border-radius: 5px;
    font-size: 16px;
    line-height: 45px;

    background: -webkit-linear-gradient(right, #dccab8, #d2b496);
    background: -o-linear-gradient(left, #9c856e, #d2b496);
    background: -moz-linear-gradient(left, #9c856e, #d2b496);
    background: linear-gradient(to left, #9c856e, #d2b496);
  }
}
</style>
