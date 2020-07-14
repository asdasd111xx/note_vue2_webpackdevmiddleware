<template>
  <div slot="content" :class="[$style['content-wrap'], 'clearfix']">
    1
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
  },
  created() {

  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      'actionSetGlobalMessage'
    ]),
    setCurrentTab(index) {

    },
  }
};
</script>
<style lang="scss" src="../css/index.module.scss" module></style>
