<template>
  <bank-card />
</template>

<script>
export default {
  components: {
    bankCard: () =>
      import(
        /* webpackChunkName: 'bankCard' */ "@/router/mobile/components/common/mcenter/theme1/cardManagement"
      )
  }
};
</script>
