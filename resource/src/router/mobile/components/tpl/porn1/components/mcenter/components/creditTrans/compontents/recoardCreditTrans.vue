<template>
  <div :class="[$style['recoard-credit-trans'], ['clearfix']]">
    <div></div>
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

<style lang="scss" module>
@import "../css/index.module.scss";
.recoard-credit-trans {
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  width: 100%;
}
</style>
