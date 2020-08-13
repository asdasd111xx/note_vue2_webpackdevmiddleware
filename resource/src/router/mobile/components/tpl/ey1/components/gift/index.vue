<template>
  <mobile-container :class="$style.container" :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <div v-for="list in currentMenu">
        <div :class="$style['item-header']">
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
          <div v-if="item.url" :class="$style['icon-next']">
            <img src="/static/image/ey1/common/btn_next.png" />
          </div>
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from '../common/mobileContainer';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      currentMenu: [],
      giftMenuList: [
        {
          title: "福利",
          icon: '/static/image/ey1/gift/icon_gift_bonus.png',
          items: [
            { name: "每日签到", url: "https://tinyurl.com/y7o9cq8q" },
            { name: "好运转盘", url: "https://tinyurl.com/ydgbbp9r" },
            { name: "积分商城", url: "https://tinyurl.com/y7umnchy" }
          ]
        },
        {
          title: "娱乐",
          icon: '/static/image/ey1/gift/icon_gift_video.png',
          items: [
            { name: "日本有码", url: " https://tinyurl.com/y9lyf3he" },
            { name: "中文有码", url: "https://tinyurl.com/yb9wuhqj" },
            { name: "日本无码", url: "https://tinyurl.com/ybtpfyxv" },
            { name: "免费偷看", url: "https://tinyurl.com/y8aoghzj" }
          ]
        },
        {
          title: "服务",
          icon: '/static/image/ey1/gift/icon_gift_service.png',
          items: [
            { name: "天推", url: "" },
            { name: "通讯软体", url: "" },
            { name: "新媒体", url: "" },
            { name: "资源引流", url: "" }
          ]
        }
      ]
    }
  },
  components: {
    mobileContainer,
  },
  mounted() {
    this.currentMenu = this.giftMenuList;
  },
  computed: {
    ...mapGetters({
    }),
    headerConfig() {
      return {
        prev: true,
        title: "礼包",
        onClick: () => {
          this.$router.back();
        }
      };
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    linkTo(item) {
      if (item.url) {
        window.open(item.url);
      } else {
        this.actionSetGlobalMessage({ type: 'incoming' });

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
</style>
