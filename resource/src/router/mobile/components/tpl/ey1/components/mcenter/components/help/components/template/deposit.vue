<template>
  <div :class="$style['content-wrap']">
    <div :class="$style['section']">
      <div
        v-for="(item, index) in data"
        :id="`q-${index}`"
        :class="[$style['cell'], { [$style['active']]: item.isOpen }]"
        :key="index"
      >
        <template v-if="item.title && item.content">
          <div
            :class="$style['title']"
            @click="item.content && handleToggleContent(index)"
          >
            {{ item.title }}
          </div>

          <div
            :class="[$style['content'], { [$style['active']]: item.isOpen }]"
          >
            <div :class="$style['text-block']" v-html="item.content" />
          </div>

          <div
            :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
            @click="item.content && handleToggleContent(index)"
          >
            <img
              :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
            />
          </div>
        </template>
      </div>
      <div :class="$style['tips']" @click="$router.push('/mobile/service')">
        如有任何问题，请洽24小时<a>在线客服</a>，将有专人亲切的为您服务。
      </div>
    </div>
  </div>
</template>

<script>
import info from '../../json/deposit.json';
import mixin from '@/mixins/mcenter/help/help';

export default {
  mixins: [mixin],
  created() {
    this.source = info;
  },
};
</script>
<style lang="scss" module>
@import "../../css/index.module.scss";
</style>

