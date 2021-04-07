<template>
  <history-card />
</template>

<script>
export default {
  components: {
    historyCard: () =>
      import(
        /* webpackChunkName: 'historyCard' */ "@/router/mobile/components/common/mcenter/theme1/cardManagement"
      )
  }
};
</script>
