<template>
  <div :class="$style['discover-home-wrap']">
    <div
      v-for="info in list"
      :key="info.key"
      :class="$style.list"
      @click="onClick(info.key)"
    >
      <div :class="$style.wrap">
        <img
          :class="$style['discover-icon']"
          :src="
            $getCdnPath(`/static/image/_new/discover/icon_${info.icon}.png`)
          "
        />
        <span>{{ info.name }}</span>
        <!-- <icon name="chevron-right" /> -->
        <img :src="$getCdnPath(`/static/image/_new/common/btn_next.png`)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    isAdult() {
      let rating = localStorage.getItem('content_rating');
      if (localStorage.getItem('content_rating')) {
        return localStorage.getItem('content_rating') === "1" ? true : false;
      } else {
        return this.memInfo.config.content_rating && this.memInfo.user.content_rating;
      }
    },
    list() {
      let list =
        [
          {
            key: 'sponsor',
            name: '联盟',
            icon: 'sponsor'
          },
          {
            key: 'rank',
            name: this.$text('S_RANK', '排行'),
            icon: 'rank',
            isAdult: true
          },
          {
            key: 'artist',
            name: this.$text('S_ARTIST', '女优'),
            icon: 'girl',
            isAdult: true

          },
          {
            key: 'tag',
            name: this.$text('S_TAG', '标签'),
            icon: 'tag',
            isAdult: true
          },
          {
            key: 'agent',
            name: this.$text('S_AGENT_GROUP_DOMESTIC', '国内代理群'),
            icon: 'potatochat'
          },
          {
            key: 'cooperation',
            name: this.$text('S_COOPERATION_GROUP_FOREIGN', '国外合作群'),
            icon: 'telegram'
          }
        ];

      return this.isAdult ? list : list.filter(i => !i.isAdult)
    }
  },
  methods: {
    onClick(key) {
      if (key === 'agent') {
        window.open('https://lynnconway.me/yaboxxx', '_blank');
        return;
      }

      if (key === 'cooperation') {
        window.open('https://t.me/yaboxxxxx', '_blank');
        return;
      }

      this.$router.push({ name: 'discover', params: { page: key } });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.discover-home-wrap {
  background-color: white;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("/static/image/_new/common/bg.png");
  height: calc(100vh - 103px);
}
.list {
  padding-left: 17px;
  background-color: #e2ecff;

  &:first-child {
    margin-bottom: 10px;
  }

  &:nth-child(4) {
    margin-bottom: 10px;
  }

  &:nth-child(2),
  &:nth-child(3),
  &:nth-child(5) {
    margin-bottom: 1px;
  }

  &:active {
    background: #2c3247;

    span,
    svg {
      color: #e4c6a6;
    }
  }
}

.wrap {
  position: relative;
  height: 45px;
  line-height: 59px;
  color: $main_text_color4;
  display: inline-flex;
  align-items: center;
  width: 100%;
  .discover-icon {
    position: relative;
    margin-right: 15px;
    width: 24px;
    height: 24px;
  }

  > svg {
    display: block;
    position: absolute;
    top: 22px;
    right: 15px;
  }

  > img:last-child {
    width: 14px;
    height: 14px;
    position: absolute;
    right: 18px;
  }

  > span {
    font-size: 17px;
  }
}

@media screen and (min-width: $pad) {
  .wrap {
    > span {
      font-size: 20px;
    }
  }
}
</style>
