<template>
  <div v-if="cardItemList !== undefined && cardItemList.length > 0">
    <div :class="[$style['card-date-wrap']]">
      <div>
        {{ level }}
      </div>
      <div v-if="!searchResult" :class="[$style['card-date']]">
        {{ time }}
        <div :class="[$style['card-all-open']]">
          全展开
          <div :class="[$style['open-button']]" @click.stop="clickAdd('all')">
            <img
              :src="$getCdnPath(`/static/image/common/${bigImage}.png`)"
              alt="arrow-next"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="(info, index) in newCardItemList"
      :key="`key-${index}`"
      :class="[
        $style['info-item'],
        [{ [$style['search-item-wrap']]: searchResult }]
      ]"
    >
      <div :class="$style['item-header']">
        <div :class="$style['friend-name']">
          <div :class="$style['title-wrap']">
            <div :class="[$style['open-button']]" @click.stop="clickAdd(index)">
              <img
                v-if="!info.show"
                :src="$getCdnPath(`/static/image/common/ic_bankcard_add.png`)"
                alt="arrow-next"
              />
              <img
                v-if="info.show"
                :src="
                  $getCdnPath(`/static/image/common/ic_bankcard_delete.png`)
                "
                alt="arrow-next"
              />
            </div>
            <span :class="$style['friend-name']">
              {{ info.title }}
            </span>
          </div>
        </div>

        <div
          v-if="!searchResult"
          :class="$style['friend-money']"
          @click.stop="clickCard(info.paramsValue, info.isClick)"
        >
          <span>{{ info.childTitle }}</span>
          <div :class="$style['arrow-next']" v-if="info.img">
            <img
              :src="$getCdnPath('/static/image/common/arrow_next.png')"
              alt="arrow-next"
            />
          </div>
        </div>
      </div>

      <div :class="$style['item-content']">
        <div v-for="(childItem, index) in info.list" :key="index">
          <div
            v-if="
              childItem.item != undefined && (childItem.upShow || info.show)
            "
            :class="$style['item-detail']"
          >
            <span>{{ childItem.name }}</span>
            <div :class="$style['friend-money-child']">
              <div v-if="Array.isArray(childItem.item)">
                <span
                  v-for="(item, index) in childItem.item"
                  :key="index"
                  :class="[
                    $style['value-item'],
                    {
                      [$style['red']]:
                        item === '停用' || item === '冻结' || item === '停权'
                    },
                    {
                      [$style['blue']]: item === '启用'
                    }
                  ]"
                >
                  {{ item }}
                </span>
              </div>
              <div v-else>{{ childItem.item }}</div>
              <div
                :class="$style['arrow-next']"
                v-if="childItem.button"
                @click="goGameRecord(info.paramsValue, info.isClick)"
              >
                <img
                  :src="$getCdnPath('/static/image/common/arrow_next.png')"
                  alt="arrow-next"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    cardItemList: {
      type: Array,
      default: undefined
    },
    level: {
      type: String,
      defalut: ""
    },
    timeTitle: {
      type: String,
      defalut: ""
    },
    searchResult: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showOpen: false,
      newCardItemList: [],
      bigImage: "btn_details_expand",
      showAllButton: false
    };
  },
  created() {
    this.showAllButton = false;
    this.getNew();
  },
  watch: {
    cardItemList() {
      this.getNew();
    }
  },

  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return this[`$style_${this.themeTPL}`] || this.$style_porn1;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    tabCurrent() {
      let tab = this.childItem.findIndex(item =>
        this.$route.path.includes(item.key)
      );
      return tab === -1 ? 0 : tab;
    },
    time: {
      get() {
        return this.timeTitle;
      },
      set(value) {
        return value;
      }
    }
  },
  methods: {
    clickCard(value, isClick = false) {
      if (!isClick) return;

      this.$emit("click-card", value);
    },
    clickAdd(val) {
      this.showAllButton = !this.showAllButton;

      if (val === "all") {
        if (this.showAllButton) {
          this.bigImage = "btn_details_collapse";
        } else {
          this.bigImage = "btn_details_expand";
        }
        return this.newCardItemList.map(
          item => (item.show = this.showAllButton)
        );
      }

      return (this.newCardItemList[val].show = !this.newCardItemList[val].show);
    },
    getNew() {
      this.newCardItemList = this.cardItemList.map(item => {
        return {
          ...item,
          show: false
        };
      });
    },
    goGameRecord(value, isClick = false) {
      if (!isClick) return;
      this.$emit("go-game-record", value);
    }
  }
};
</script>

<style
  lang="scss"
  src="./css/porn1.teamManageCardItem.scss"
  module="$style_porn1"
></style>
