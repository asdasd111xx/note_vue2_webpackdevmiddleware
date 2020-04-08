<template>
  <div class="news-wrap">
    <div>
      <img :src="$getCdnPath('/static/image/_new/common/icon_news.png')" />
    </div>
    <marquee
      :direction="direction"
      :scrolldelay="speed"
      :onmouseover="viewFullContent ? 'this.stop()' : ''"
      :onmouseout="viewFullContent ? 'this.start()' : ''"
      class="news-content"
      @click="togglePopup"
    >
      <span> {{ title }} &nbsp;&nbsp;&nbsp;&nbsp; </span>
    </marquee>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import common from '@/api/common';

export default {
  components: {
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    speed: {
      type: Number,
      default: 85
    },
    direction: {
      type: String,
      default: 'left'
    },
    viewFullContent: {
      type: Boolean,
      default: true
    },
    togglePopup: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      isShow: false,
      title: '最新消息最新消息最新消息最新消息',
      content: '',
      image: '',
      isText: true,
      imgSrc: '' // 圖片src路徑
    };
  },
  computed: {
    ...mapGetters({
      postData: 'getPost',
      loginStatus: 'getLoginStatus',
      memNewsData: 'getNews',
      agentNewsData: 'getAgentNews',
      curLang: 'getCurLang'
    }),
  },
  beforeMount() {
    this.getPostData();
  },
  methods: {
    ...mapActions([
      'actionSetPost'
    ]),
    showDialog() {
      this.isShow = !this.isShow;
    },
    getPostData() {
      this.actionSetPost().then((value) => {

        if (value.result !== 'ok') {
          return;
        }

        const data = value.ret;
        const lang = this.curLang.replace('-', '_');
        const title = data[0][`${lang}_title`];
        const content = data[0][`${lang}_content`];
        const image = data[0][`${lang}_image`];
        const isText = data[0].is_text;

        this.title = title ? `${title}` : null;
        this.isText = isText;

        if (isText) {
          this.content = content ? `${content}` : null;
          return;
        }

        if (image) {
          common.image({
            success: (res) => {
              this.imgSrc = res.ret;
            }
          }, image);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.news-wrap {
  display: flex;
  align-content: center;
  padding: 10px 17px;

  > div {
    height: 100%;
    width: 15px;
  }

  > div > img {
    width: 15px;
    height: 12px;
  }
}
.news-content {
  display: block;
  cursor: pointer;
  white-space: nowrap;
}
</style>
