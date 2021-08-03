<template>
  <div>
    <template v-if="totalDepthList">
      <div v-if="$route.query.layer === undefined">
        <tcenter-label :child-item="allTotalData" :change-tab="getTimeRecord" />
        <div :class="$style['friend-list-wrap']">
          <div :class="$style['friend-list-container']">
            <div
              v-for="(data, index) in totalDepthList"
              :key="`key-${index}`"
              :class="$style['friend-list-item']"
            >
              <span>{{ data.title }}({{ data.item }})</span>

              <div
                v-if="data.img"
                :class="$style['next-button']"
                @click="nextButton(data)"
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
      <div v-if="$route.query.layer" :class="$style['next-layer-wrap']">
        <div :class="$style['next-layer-title']">
          <card-total :data="[{ name: '笔数：', item: pagination.total }]" />
        </div>
        <span>{{ $text(levelTrans[depth]) }}</span>
        <div :class="$style['next-layer-item']">
          <card-item :card-item-list="friendesAccountList" />
        </div>
      </div>
    </template>
    <template v-if="totalDepthList.length == 0">
      <div :class="$style['no-data']">
        <img
          :src="
            $getCdnPath(
              `/static/image/${themeTPL}/mcenter/img_default_no_data.png`
            )
          "
        />
        <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import friendsNextLevelCount from "@/mixins/mcenter/management/friendsNextLevelCount";
import tcenterLabel from "../../../../../tcenterSame/tcenterLabel";
import cardItem from "../../../../../tcenterSame/cardItem";
import cardTotal from "../../../../../tcenterSame/cardAllTotal";
export default {
  components: {
    tcenterLabel,
    cardItem,
    cardTotal
  },
  mixins: [friendsNextLevelCount],
  props: {
    setTabState: {
      type: Function,
      required: true
    },
    setHeaderTitle: {
      type: Function,
      required: true
    },
    tabState: {
      type: Boolean,
      default: true
    },
    setBackFunc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      pathDay: this.$route.params.item ?? "",
      path: this.$route.params.title ?? "",
      title: "nextLevelCount",
      currentDate: "" //選取當下子功能的項目,
    };
  },
  created() {
    this.setHeaderTitle(this.$text("S_TEAM_MANAGEMENT", "团队管理"));
    this.setTabState(true);
    this.getTimeRecord(this.currentDate);
    if (this.path != "today-register") {
      this.$router.replace({
        params: {
          title: this.title,
          item: "today-register"
        }
      });
    }
  },
  watch: {
    "$route.query.layer"(value) {
      if (value === undefined) {
        this.setTabState(true);
        this.setHeaderTitle(this.$text("S_TEAM_MANAGEMENT", "团队管理"));
      } else {
        this.setTabState(false);
      }
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    totalDepthList() {
      //page1
      let depthKey = Object.keys(this.totalDepth);
      let data = depthKey.map(info => {
        return {
          title: this.$text(this.levelTrans[info]),
          item: this.totalDepth[info],
          depth: info,
          img: this.totalDepth[info] > 0
        };
      });
      return data;
    },

    friendesAccountList() {
      //page2
      let data = this.friendList?.map(info => {
        return {
          title: info.username,
          list: [
            { name: "上级好友", item: info.upper_name, show: true },
            {
              name: "主帐户余额",
              item: this.amountFormat(info.cash.balance),
              show: true
            },
            {
              name: "状态",
              item: this.getStatus([
                info.enable,
                info.locked,
                info.tied,
                info.bankrupt
              ]),
              color: this.getStatus(
                [info.enable, info.locked, info.tied, info.bankrupt],
                "y"
              ),
              show: true
            },
            {
              name: "最后离线时间",
              item: info.last_online ? this.filterDate(info.last_online) : "",
              show: info.last_online ? true : false
            },
            {
              name: "注册时间",
              item: this.filterDate(info.created_at),
              show: true
            },
            {
              name: "注册方式",
              item: this.createdBy(info.created_by),
              show: true
            }
          ].filter(item => item.show)
        };
      });
      return data;
    }
  },

  methods: {
    amountFormat(amount) {
      return `${Number(amount)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    filterDate(date) {
      return Vue.moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    getTimeRecord(data) {
      //切換上方子功能列

      if (data == "") {
        this.currentDate = this.allTotalData[0];
      } else {
        this.currentDate = data;
      }

      this.startTime = Vue.moment(this.estToday)
        .add(-data.value, "days")
        .format("YYYY-MM-DD 00:00:00");

      this.endTime = Vue.moment(this.estToday)
        .add(-data.value, "days")
        .format("YYYY-MM-DD 23:59:59");

      if (data.name === "month-register") {
        this.startTime = Vue.moment(this.estToday)
          .add(-data.value, "days")
          .format("YYYY-MM-01 00:00:00");
      }

      if (data.name === "no-login") {
        this.endTime = Vue.moment(this.estToday).format("YYYY-MM-DD 23:59:59");
      }

      if (this.path && this.pathDay != data.name) {
        this.$router.replace({
          params: {
            title: this.title,
            item: `${data.name}`
          }
        });
        this.pathDay = data.name;
        this.getNextLevelList();
      }
    },
    getStatus(info, color) {
      //狀態
      let status = info.indexOf(true);
      if (status == "0") {
        return color ? "blue" : "启用";
      }
      if (status == "1") {
        return color ? "red" : "冻结";
      }
      if (status == "2") {
        return color ? "red" : "锁定";
      }
      if (status == "3") {
        return color ? "red" : "停权";
      }

      return color ? "blue" : "启用";
    },
    createdBy(value) {
      switch (value) {
        //注册方式
        case 1:
          return "会员注册";
        case 2:
          return "直属新增";
        case 3:
          return "厅主新增";
        case 4:
          return "厅主批量";
        case 5:
          return "代理新增";
      }
    },
    nextButton(data) {
      //進到下一頁
      this.depth = data.depth;
      this.getNextLevelList();
      this.setTabState(false);
      this.setHeaderTitle(this.currentDate.text);
      this.$router.push({
        params: {
          title: this.title,
          item: `${data.name}`
        },
        query: {
          layer: this.depth
        }
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
