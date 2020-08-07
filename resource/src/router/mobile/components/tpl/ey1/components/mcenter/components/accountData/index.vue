<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap"></div>
  </mobile-container>
</template>

<script>
import mobileContainer from '../../../common/mobileContainer';

export default {
  components: {
    mobileContainer,
  },
  data() {
    return {
    }
  },
  methods: {
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.push('/mobile/mcenter');
        },
        title: '',
      };
    }
  }
};
</script>

<style lang="scss" module>
.container {
  background-color: #f8f8f8;
}
</style>
