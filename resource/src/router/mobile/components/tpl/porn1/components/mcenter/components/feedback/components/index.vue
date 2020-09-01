<template>
  <component :is="$route.params.page" />
</template>

<script>
import { API_FEEDBACK_TYPE_LIST, API_FEEDBACK_CREATED } from '@/config/api';
import ajax from '@/lib/ajax';

export default {
  data() {
    return {
      typeList: [{
        id: '',
        content: '',
        imageId: ''
      }]
    }
  },
  components: {
    sendFeedback: () => import(/* webpackChunkName: 'sendFeedback' */ './sendFeedback'),
    feedbackList: () => import(/* webpackChunkName: 'feedbackList' */ './feedbackList')
  },
};
</script>
