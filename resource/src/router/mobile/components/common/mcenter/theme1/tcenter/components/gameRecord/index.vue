<template>
  <div>
    <game-record
      :inq-game.sync="inqGame"
      :inq-start.sync="inqStart"
      :inq-end.sync="inqEnd"
      :set-header-title="setHeaderTitle"
      :set-tab-state="setTabState"
    >
      <template
        scope="{
                    inq1st,
                    inq2nd,
                    hasSearch,
                    searchTabs,
                    currentCondition,
                    gameList,
                    currentPage,
                    changeSearchCondition,
                    onSearch,
                    onSearchBet,
                    showInfinite,
                    infiniteHandler,
                    control1stData,
                    control2ndData,
                    mainNoData
                }"
      >
        <div v-if="currentPage === 'main'" :class="$style['top-wrap']">
          <div
            v-for="info in searchTabs"
            :key="info.key"
            :class="[
              $style['search-tab'],
              { [$style.active]: currentCondition === info.key }
            ]"
            @click="changeSearchCondition(info.key)"
          >
            <span>{{ info.name }}</span>
          </div>
        </div>

        <div
          v-show="currentPage === 'main' && hasSearch"
          :class="[$style['form-search'], 'clearfix']"
        >
          <div :class="$style['field-game-wrap']">
            <div :class="$style.title">
              {{ $text("S_PLEASE_SELECT_TYPE") }}
            </div>
            <select v-model="inqGame" :class="$style.select">
              <option
                v-for="info in allvendor"
                :key="`list-${info.value}`"
                :value="info.value"
              >
                {{ info.text }}
              </option>
            </select>
          </div>
          <div :class="[$style['field-date-wrap'], $style['start-date']]">
            <div :class="$style.title">
              {{ $text("S_STARTED_DAY") }}
            </div>
            <input
              v-model="inqStart"
              :class="$style.date"
              :min="fromDate"
              :max="inqEnd"
              :id="`start`"
              type="date"
              @input="limitDate('start', $event.target.value)"
            />
            <span>{{ inqStart | dateFormat }}</span>
          </div>
          <div :class="[$style['field-date-wrap'], $style['end-date']]">
            <div :class="$style.title">
              {{ $text("S_END_DAY") }}
            </div>
            <input
              v-model="inqEnd"
              :class="$style.date"
              :min="inqStart"
              :max="endDate"
              :id="`end`"
              type="date"
              @input="limitDate('end', $event.target.value)"
            />
            <span>{{ inqEnd | dateFormat }}</span>
          </div>
          <div :class="$style['field-search-wrap']">
            <div
              :class="[
                $style['btn-search'],
                { [$style['disable']]: !checkDate }
              ]"
              @click="
                () => {
                  if (!checkDate) {
                    return;
                  } else if (inqStart !== inqEnd) {
                    onSearch();
                  }
                }
              "
            >
              {{ $text("S_INQUIRE") }}
            </div>
          </div>
        </div>

        <template v-if="currentPage === 'main'">
          <table-1st
            :list="control1stData"
            :total="inq1st.total"
            :counts="inq1st.counts"
            :inqStart="inqStart"
            :inqEnd="inqEnd"
            :hasSearch="hasSearch"
            @onInquire="onSearchBet"
          />
          <infinite-loading
            v-if="showInfinite"
            ref="infiniteLoading"
            @infinite="infiniteHandler"
          >
            <span slot="no-more" />
            <span slot="no-results" />
          </infinite-loading>
        </template>

        <template v-if="currentPage === 'bet' && inq2nd.list.length">
          <table-2nd
            :list="control2ndData"
            :total="inq2nd.total"
            :counts="inq2nd.counts"
          />

          <infinite-loading
            v-if="showInfinite"
            ref="infiniteLoading"
            @infinite="infiniteHandler"
          >
            <span slot="no-more" />
            <span slot="no-results" />
          </infinite-loading>
        </template>

        <div
          v-if="currentPage === 'main' && mainNoData && !hasSearch"
          :class="$style['no-data']"
        >
          <img src="/static/image/_new/mcenter/ic_nodata.png" />
          <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
        </div>
      </template>
    </game-record>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import { format } from "date-fns";
import EST from "@/lib/EST";
import gameRecord from "@/components/common/mcenter/gameRecord";
import table1st from "./table1st";
import table2nd from "./table2nd";
import bbosRequest from "@/api/bbosRequest";
import axios from "axios";

export default {
  components: {
    InfiniteLoading,
    gameRecord,
    table1st,
    table2nd,
  },
  props: {
    setTabState: {
      type: Function,
      required: true,
    },
    setHeaderTitle: {
      type: Function,
      required: true,
    },
  },
  data() {
    const now = EST(new Date(), "", true);

    return {
      fromDate: Vue.moment(now).add(-29, "days").format("YYYY-MM-DD"),
      endDate: Vue.moment(now).format("YYYY-MM-DD"),
      inqGame: "",
      inqStart: Vue.moment(now).format("YYYY-MM-DD"),
      inqEnd: Vue.moment(now).format("YYYY-MM-DD"),
      checkDate: true,
      allvendor: [{ text: "全部", value: "" }]
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
  },
  created() {
    this.gameVendor();
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    limitDate(key, val) {
      let _value = Vue.moment(val).format("YYYY/MM/DD");
      let _today = Vue.moment(new Date()).add(-29, "days").format("YYYY/MM/DD");

      if (_value < _today) {
        this.checkDate = false;
        this.actionSetGlobalMessage({ msg: "查询纪录不能超过30天" });
        this.inqStart = this.endDate;
      } else if (this.inqStart > this.inqEnd) {
        this.checkDate = false;
        this.inqStart = this.endDate;
      } else if (this.inqEnd > this.endDate) {
        this.checkDate = false;
        this.inqEnd = this.endDate;
      }
      else {
        this.checkDate = true;
      }

    },
    gameVendor() {
      // bbosRequest({
      //   method: "get",
      //   url: this.siteConfig.BBOS_DOMIAN +
      //     "/Vender/List",
      //   reqHeaders: {
      //     Vendor: this.memInfo.user.domain
      //   },
      //   params: {
      //     lang: "zh-cn"
      //   }
      // }).then(res => {
      //   this.allvendor = res.data;
      // })

      axios({
        method: 'get',
        url: '/api/v1/c/vendors'
      }).then((res) => {
        var bbin = { text: "BBIN", value: "bbin" };
        for (var i = 0; i < res.data.ret.length; i++) {
          if (res.data.ret[i].vendor === "bbin") {
            this.allvendor.push(bbin);
          }
          let obj = { text: `${res.data.ret[i].alias}`, value: `${res.data.ret[i].vendor}` };
          this.allvendor.push(obj);
        };
      })
    }
  },
  filters: {
    dateFormat(value) {
      if (value) {
        return Vue.moment(value).format("YYYY/MM/DD");
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
