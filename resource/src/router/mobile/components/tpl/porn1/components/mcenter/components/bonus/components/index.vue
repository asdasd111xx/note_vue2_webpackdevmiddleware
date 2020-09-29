<template>
  <div>
    <div :class="$style['menu-wrap-left']">
      <p :class="$style['small']">累计红利总计</p>
      <p :class="$style['big']">{{(info.ret!==null)? info.total.amount:"0.00" }} </p>
    </div>
    <div :class="$style['menu-wrap-right']">
      <p :class="$style['small']">未兑现红利总计</p>
      <p :class="$style['big']">{{(info.ret!==null)? info.total.balance:"0.00" }} </p>
    </div>

    <!-- v-if="!mainNoData"-->
    <template v-if="info.ret.length>0">
      <div :class="$style['template']">
        <div :class="$style['amount']">
          <div :class="$style['list']" v-if="info.ret!==null">
                笔数：{{info.ret.length}}
          </div>
        </div>
        <hr>
        <div v-for="ret in info.ret"
            :key="ret.id"
        >  <!--v-for -->
          <div :class="$style['data-wrap']">
            <div>
              <div :class="$style['title']">
                <p>{{ret.name}}</p>
              </div>
            </div>
            <div :class="$style['content']">
              <div :class="$style['content-left']">
                <p>累积红利</p>
                <p>流水要求</p>
                <p>累积流水</p>
                <p>未兑现红利</p>
              </div>
              <div :class="$style['content-right']">
                <p>{{ret.amount}}</p>
                <p>{{ret.total}}</p>
                <p>{{ret.aggregation}}</p>
                <p>{{ret.balance}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- v-if="mainNoData" -->
    <template v-if="info.ret.length==0">
      <div v-if="info.ret.length==0" :class="$style['no-data']">
        <img
          :src="$getCdnPath(`/static/image/${themeTPL}/mcenter/img_default_no_data.png`)"
        />
        <p>{{ $text("S_NO_BONUS", "暂时没有新的红利彩金") }}</p>
      </div>
    </template>
    <infinite-loading
      v-if="showInfinite"
      ref="infiniteLoading"
      @infinite="infiniteHandler"
    >
      <span slot="no-more" />
      <span slot="no-results" />
    </infinite-loading>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Vue from "vue";
import InfiniteLoading from "vue-infinite-loading";
import EST from "@/lib/EST";
import ajax from "@/lib/ajax";
import axios from 'axios';

export default {
  components: {
    InfiniteLoading
  },
  data() {
    return {
      mainNoData: true,
      isLoading: false,
      isReceive: false,
      showInfinite: false,
      info:{
        ret:{},
        total:{amount:{}}
      }
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
  },
  created() {
    
    this.isLoading = true;

    axios.get('/api/v1/c/gift-card').then(response=>this.info=response.data);
    if(this.info.ret.length>0){
      this.mainNoData=false;
    }
    

  },
  methods :{
    
    getInfo(value){
      if(value==="length"){
        return info.ret.length
      }
    },
    
    
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state) {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;
      this.getGameDetail().then(({ result }) => {   /*  method 要換成新的 API*/
        this.isLoading = false;
        this.isReceive = false;
        if (result !== "ok") {
          return;
        }

        if (
          !this.pagination.total ||
          this.mainListData.length === +this.pagination.total
        ) {
          $state.complete();
          return;
        }

        this.showPage += 1;

        $state.loaded();
      });
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.index.scss" module="$style_ey1"></style>
