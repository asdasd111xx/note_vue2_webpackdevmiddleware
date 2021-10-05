<template>
  <marquee :list="newslist" :titleList="newsTitle" :origin="'home'" />
</template>

<script>
import Vue from "vue";
import { format } from "date-fns";
import { mapGetters, mapActions } from "vuex";
import marquee from "@/router/mobile/components/common/marquee/marquee";

export default {
  components: { marquee },
  props: {
    dataSource: {
      type: String,
      default: "mem"
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      memNewsData: "getNews",
      agentNewsData: "getAgentNews",
      siteConfig: "getSiteConfig",
      announcementList: "getAnnouncementList"
    }),
    newslist() {
      let data =
        this.dataSource === "mem" ? this.memNewsData : this.agentNewsData;

      data.forEach(item => {
        item.title = this.dateFormat(item.title);
      });
      return data;
    },
    newsTitle() {
      return this.newslist.map(item => {
        return {
          title: item.content
        };
      });
    }
  },

  methods: {
    dateFormat(value) {
      return Vue.moment(value).format("YYYY-MM-DD");
    }
  }
};
</script>

<style lang="scss" scoped></style>
