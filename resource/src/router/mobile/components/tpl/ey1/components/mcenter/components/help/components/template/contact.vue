<template>
  <div>
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
    <div :class="$style['online-btn']">
      <div @click="$router.push('/mobile/service')">
        7*24在线客服
      </div>
    </div>
  </div>
</template>

<script>
import yaboRequest from '@/api/yaboRequest';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      msg: '',
      list: null,
      defaultImgSrc: this.$getCdnPath('/static/image/_new/mcenter/help/email.png')
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
      siteConfig: 'getSiteConfig'
    }),
  },
  created() {
    yaboRequest({
      method: 'get',
      url: `${this.siteConfig.YABO_API_DOMAIN}/system/contactus`,
      headers: { 'x-domain': this.memInfo.user.domain, }
    }).then((res) => {
      if (res && res.data && res.data.length > 0) {
        this.list = res.data;
      }
    });
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    copy(key) {
      const string = this.list[key].value;
      if (!string) return;
      this.$copyText(string);
      this.actionSetGlobalMessage({ msg: '复制成功' });
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
    background: linear-gradient(to top, #b60303, #fe2a2a);
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
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 20px 10px 0;
      img {
        width: 28px;
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
    background: #e42a30;
  }
}
</style>
