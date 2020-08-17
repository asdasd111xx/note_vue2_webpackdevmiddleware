<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
    :class="$style.container"
  >
    <div slot="content">
      <div :class="$style['section']" style="margin-top: 10px">
        <div
          v-for="(item, index) in data"
          :id="`q-${item.key}`"
          :class="$style['cell']"
          :key="item.key"
          @click="handleToggleContent(item.key)"
        >
          <div :class="$style['cell-header']">
            <div :class="$style['title-icon']">
              <img
                :src="$getCdnPath('/static/image/_new/mcenter/ic_help.png')"
                alt="help"
              />
            </div>

            <div :class="$style['title']">
              {{ item.title }}
            </div>
          </div>

          <!-- 內容 -->
          <div
            :class="[$style['content'], { [$style['active']]: item.isOpen }]"
            :style="{ 'max-height': item.isOpen ? `150vh` : 0 }"
          >
            <template v-if="item.content">
              <div
                v-if="item.key == 99"
                :class="[
                  $style['content'],
                  { [$style['active']]: item.isOpen }
                ]"
                :style="{ 'max-height': item.isOpen ? `100vh` : 0 }"
              >
                <div
                  :class="[$style['content-text']]"
                  v-html="item.content"
                ></div>
                <div :class="[$style['content-img']]">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/_new/mcenter/help/sample_01.png`
                      )
                    "
                  />
                </div>
              </div>

              <div
                v-else
                :class="[
                  $style['content'],
                  { [$style['active']]: item.isOpen }
                ]"
                :style="{ 'max-height': item.isOpen ? `100vh` : 0 }"
                v-html="item.content"
              ></div>
            </template>

            <template v-else-if="item.list">
              <div
                v-for="(item, index) in item.list"
                :class="[$style['text-block'], $style['full-block']]"
              >
                <div :class="[$style['cell-title']]">
                  {{ item.title }}
                </div>
                <div :class="[$style['cell-content']]">
                  {{ item.content }}
                </div>
              </div>
            </template>
          </div>

          <div
            :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
          >
            <img
              :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
            />
          </div>
        </div>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from "../../../../common/mobileContainer";
import support from "../json/support.json";
import faq from "../json/faq.json";
import gameintro from "../json/gameintro.json";
import withdraw from "../json/withdraw.json";
import deposit from "../json/deposit.json";

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      data: null,
      info: {
        source: null,
        title: ''
      },
    };
  },
  mounted() {

    switch (this.$route.params.key) {
      case 'faq':
        this.info = {
          title: '常見問題',
          source: faq
        };
        break;
      case 'deposit':
        this.info = {
          title: '充值',
          source: deposit
        };
        break;
      case 'gameintro':
        this.info = {
          title: '游戏介绍',
          source: gameintro
        };
        break;
      case 'support':
        this.info = {
          title: '技术支持',
          source: support
        };
        break;
      case 'withdraw':
        this.info = {
          title: '提现教程',
          source: withdraw
        };
        break;
      default:
        this.$router.back()
        return;
    }
    this.data =
      this.info.source.data.map(el => {
        let _o = Object.assign({}, el);
        _o.isOpen = false;
        return _o;
      })
  },
  computed: {
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );

      return isApp;
    },
    headerConfig() {
      document.title = this.info.title;

      if (!this.isApp)
        return {
          prev: true,
          onClick: () => {
            this.$router.back();
          },
          //   title: this.info.title
          title: '帮助中心'
        };
    }
  },
  methods: {
    handleToggleContent(key) {
      let target = document.getElementById(`q-${key}`);
      if (!target) return;

      this.data.forEach((element, index) => {
        if (Number(element.key) === Number(key)) {
          element.isOpen = !element.isOpen;
        }
      });
    }
  }
};
</script>

<style src="../css/index.module.scss" lang="scss" module />
