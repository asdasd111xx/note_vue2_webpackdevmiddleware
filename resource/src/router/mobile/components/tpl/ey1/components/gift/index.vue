<template>
  <mobile-container :class="$style.container" :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <page-loading :is-show="isLoading" />
      <div v-for="list in currentMenu">
        <div v-if="isMounted" :class="$style['item-header']">
          <div :class="$style['item-icon']">
            <img :src="$getCdnPath(list.icon)" />
          </div>
          <div :class="$style.title">
            {{ list.title }}
          </div>
        </div>
        <div
          v-for="item in list.items"
          :class="$style['cell']"
          @click="linkTo(item)"
        >
          <div>
            {{ item.name }}
          </div>
          <div
            v-if="
              item && (item.url || item.thirdUrl || item.items || item.params)
            "
            :class="$style['icon-next']"
          >
            <img src="/static/image/ey1/common/btn_next.png" />
          </div>
          <div v-else :class="$style['incoming']">
            即将开业 敬请期待
          </div>
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from '../common/mobileContainer';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      isLoading: false,
      currentMenu: [],
      isMounted: true,
      giftMenuList: [
        {
          title: "福利",
          icon: '/static/image/ey1/gift/icon_gift_bonus.png',
          items: [
            { name: "每日签到", login: true, thirdUrl: "https://fengniao131.com/member.php?mod=logging&action=login&mobile=2" },
            { name: "好运转盘", login: true, thirdUrl: "https://fengniao131.com/plugin.php?id=lezhi99_lottery" },
            { name: "积分商城", login: true, thirdUrl: "https://fengniao131.com/keke_integralmall-index.html" }
          ]
        },
        {
          title: "娱乐",
          icon: '/static/image/ey1/gift/icon_gift_video.png',
          items: [
            { name: "日本有码", login: true, url: "https://tinyurl.com/y9lyf3he" },
            { name: "中文有码", login: true, url: "https://tinyurl.com/yb9wuhqj" },
            { name: "日本无码", login: true, url: "https://tinyurl.com/ybtpfyxv" },
            { name: "免费偷看", login: true, url: "https://tinyurl.com/y8aoghzj" }
          ]
        },
        {
          title: "服务",
          icon: '/static/image/ey1/gift/icon_gift_service.png',
          items: [
            {
              title: "服务",
              name: "天推",
              icon: '/static/image/ey1/gift/icon_gift_service.png',
              items: [
                {
                  title: "天推",
                  icon: '/static/image/ey1/gift/icon_gift_service.png',
                  items: [
                    { name: "天气广告", url: "" },
                    { name: "体育广告", url: "" },
                    { name: "贴吧广告", url: "" },
                  ]
                },
              ]
            },
            {
              title: "服务",
              name: "通讯软体",
              icon: '/static/image/ey1/gift/icon_gift_service.png',
              items: [
                {
                  title: "通讯软体",
                  icon: '/static/image/ey1/gift/icon_gift_service.png',
                  items: [
                    { name: "微信推广", params: 'wechat' },
                    { name: "QQ推广", url: "" },
                    { name: "苹果推", url: "" },
                  ]
                },
              ]
            },
            {
              title: "服务",
              name: "新媒体",
              icon: '/static/image/ey1/gift/icon_gift_service.png',
              items: [
                {
                  title: "新媒体",
                  icon: '/static/image/ey1/gift/icon_gift_service.png',
                  items: [
                    { name: "YY推广", url: "" },
                    { name: "抖音推广", url: "" },
                    { name: "斗鱼推广", url: "" },
                  ]
                },
              ]
            },
            {
              title: "服务",
              name: "资源引流",
              icon: '/static/image/ey1/gift/icon_gift_service.png',
              items: [
                {
                  title: "资源引流",
                  icon: '/static/image/ey1/gift/icon_gift_service.png',
                  items: [
                    { name: "名单购买", url: "" },
                    { name: "短信投放", url: "" },
                    { name: "EDM投放", url: "" },
                  ]
                },
              ]
            },
          ]
        }
      ]
    }
  },
  components: {
    mobileContainer,
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/common/pageLoading'),
  },
  mounted() {
    if (this.$route.query.q === '通讯软体') {
      //  to do
      //   let cur = this.giftMenuList.find(i => i.items.find(y => y.name === this.$route.query.q));
      this.linkTo({
        title: "服务",
        name: "通讯软体",
        icon: '/static/image/ey1/gift/icon_gift_service.png',
        items: [
          {
            title: "通讯软体",
            icon: '/static/image/ey1/gift/icon_gift_service.png',
            items: [
              { name: "微信推广", params: 'wechat' },
              { name: "QQ推广", url: "" },
              { name: "苹果推", url: "" },
            ]
          },
        ]
      })
    } else {
      this.currentMenu = this.giftMenuList;
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
    }),
    headerConfig() {
      return {
        prev: !!this.$route.query.q,
        title: this.$route.query.q ? this.$route.query.q : "礼包",
        onClick: () => {
          if (this.$route.query.q) {
            this.currentMenu = this.giftMenuList;
            this.isMounted = true;
            this.$router.push('/mobile/gift');
            return;
          }
          this.$router.back();
        }
      };
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    getThridUrl(url, target) {
      this.isLoading = true;
      let newWindow = window.open('');

      axios({
        method: 'get',
        url: '/api/v1/c/link/customize',
        params: {
          code: 'fengniao',
          client_uri: url
        }
      }).then(res => {
        this.isLoading = false;
        if (res && res.data && res.data.ret && res.data.ret.uri) {
          newWindow.location = res.data.ret.uri;
        } else {
          newWindow.close();
        }
      }).catch(error => {
        this.isLoading = false;
        newWindow.close();
        if (error && error.data && error.date.msg) {
          this.actionSetGlobalMessage({ msg: error.data.msg });
        }
      })
    },
    linkTo(item) {
      console.log(item)
      if (item.login && !this.loginStatus) {
        this.$router.push('/mobile/login');
        return;
      }
      if (item.items && item.items.length > 0) {
        this.$router.push({ query: { q: item.name } })
        this.currentMenu = item.items;
        this.isMounted = false;
        return;
      }

      if (item.url) {
        window.open(item.url);
      }
      else if (item.params) {
        this.$router.push(`/mobile/gift/detail/${item.params}`);
      }
      else if (item.thirdUrl) {
        this.getThridUrl(item.thirdUrl);
      }
      else {
        // this.actionSetGlobalMessage({ msg: '即将开业 敬请期待' });
      }
    }
  },
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.item-header {
  display: flex;
  align-items: center;
  padding: 1px 14px;
  font-size: 18px;
  font-weight: 700;
  text-align: left;
  color: #4e5159;
  height: 35px;
  line-height: 35px;
  margin-top: 17px;
  margin-bottom: 5px;
}

.content-wrap {
  > .item-header:first-of-type {
    margin-top: unset;
  }
}

.item-icon {
  width: 21px;
  height: 21px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    height: 100%;
  }
}

.cell {
  align-items: center;
  background-color: white;
  color: #4e5159;
  display: flex;
  font-size: 17px;
  height: 45px;
  line-height: 45px;
  margin-bottom: 1px;
  padding-left: 48px;
  text-align: left;
  position: relative;

  > .icon-next {
    width: 18px;
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    right: 18px;
    > img {
      width: 100%;
      height: 18px;
    }
  }
}

.incoming {
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  right: 18px;
  color: #a6a9b2;
}
</style>
