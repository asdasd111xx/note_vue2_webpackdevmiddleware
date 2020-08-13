<template>
  <component :is="$route.params.page" :type-list="typeList" />
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
  created() {
    ajax({
      method: 'get',
      url: API_FEEDBACK_TYPE_LIST,
      errorAlert: false
    }).then((res) => {
      this.typeList = res.ret.map((item, index) => {
        return {
          id: item.id,
          content: item.content,
          imageId: index + 1 < 8 ? index + 1 : 8
        }
      })
    });
  },
};
</script>
