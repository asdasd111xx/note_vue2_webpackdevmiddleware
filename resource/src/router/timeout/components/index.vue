<template>
  <div class="no-service">
    <div>
      <img
        :src="$getCdnPath('/static/image/connection_failed_new.png')"
        class="image-failed"
      />
    </div>
    <div>
      <img
        :src="$getCdnPath('/static/image/reload_update.png')"
        class="image-reload"
        @click="reloadPage()"
      />
    </div>
  </div>
</template>

<script>
import * as axios from 'axios';
import member from '@/api/member';
import store from '@/store';

export default {
  metaInfo: {
    meta: [{
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
    }]
  },
  beforeRouteEnter(to, from, next) {
    member.data({
      timeout: 10000,
      success: () => {
        // 測試模式
        if (to.params.mode && to.params.mode === 'test') {
          axios.all([(async () => {
            await store.dispatch('actionMemInit');
            next();
          })()]);
          next();
        } else {
          next({ path: '/' });
        }
      },
      fail: (response) => {
        if (typeof response === 'string') {
          axios.all([(async () => {
            await store.dispatch('actionMemInit');
            next();
          })()]);
          console.log(response);
          next();
        } else {
          next({ path: '/' });
        }
      }
    });
  },
  methods: {
    reloadPage() {
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" src="@/css/router/timeout.scss"></style>
