<template>
  <div>
    <div v-for="(item, key) in list" :class="$style['content']" :key="key">
      <div :class="$style['title']">
        <div :class="$style['block']" />
        {{ item.categoryName }}
      </div>
      <div
        v-for="(cell, key) in item.itemData"
        :class="$style['cell']"
        :key="key"
      >
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
      <div @click="$router.push('/mobile/service')">7*24在线客服</div>
    </div>
  </div>
</template>

<script>
import yaboRequest from "@/api/yaboRequest";
import goLangApiRequest from "@/api/goLangApiRequest";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      msg: "",
      list: []
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    })
  },
  created() {
    goLangApiRequest({
      method: "get",
      url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/System/contactus`
    }).then(res => {
      if (res && res.data && res.data.length > 0) {
        this.list = res.data;
      }
    });
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    copy(value) {
      this.$copyText(value);
      this.actionSetGlobalMessage({ msg: "复制成功" });
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
  width: 100%;

  display: inline-flex;
  align-items: center;
  background: #ffffff;
  .block {
    width: 2.5px;
    height: 17px;
    background: linear-gradient(to top, #dccab8, #d2b496);
    border-radius: 1px;
    margin-left: 10px;
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
      margin: 0 20px;
      border-right: #f8f8f7 solid 1px;
      img {
        width: 28px;
      }
    }

    > div:nth-child(2) {
      margin-left: 20px;
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

    background: -webkit-linear-gradient(right, #dccab8, #d2b496);
    background: -o-linear-gradient(left, #9c856e, #d2b496);
    background: -moz-linear-gradient(left, #9c856e, #d2b496);
    background: linear-gradient(to left, #9c856e, #d2b496);
  }
}
</style>
