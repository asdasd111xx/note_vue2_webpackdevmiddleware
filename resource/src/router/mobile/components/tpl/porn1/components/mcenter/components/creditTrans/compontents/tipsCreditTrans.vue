<template>
  <div :class="[$style['tips']]">
    温馨提示，如需帮助
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
