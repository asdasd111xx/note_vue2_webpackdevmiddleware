<template>
  <div>
    <div v-if="list" v-for="item in list" :class="$style['content']">
      <div :class="$style['title']">
        <div :class="$style['block']" />
        {{ item.categoryName }}
      </div>
      <div v-for="cell in item.itemData" :class="$style['cell']">
        <div>
          <img :src="cell.iconUrl" />
        </div>
        <div>
          <div>
            <div>{{ cell.name }}</div>
            <div>{{ cell.value }}</div>
          </div>
        </div>
        <div :class="$style['copy-btn']">
          <div @click="copy(cell.value)">{{ $text("S_COPY", "复制") }}</div>
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
    copy(value) {
      this.$copyText(value);
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
