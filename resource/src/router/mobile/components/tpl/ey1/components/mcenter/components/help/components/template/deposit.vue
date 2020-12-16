<template>
  <div :class="$style['content-wrap']">
    <div :class="$style['section']">
      <div
        v-if="hasCid"
        :class="[$style['cell']]"
        :style="{ 'margin-bottom': '10px' }"
        @click="
          $router.push(
            `/mobile/mcenter/help/detail?type=deposit${
              isApp ? '&app=true' : ''
            }`
          )
        "
      >
        <div :class="$style['title']">
          {{ $text("S_RECENTLY_DEPOSIT", "8日内充值记录") }}
        </div>
        <div :class="[$style['arrow-btn']]">
          <img
            :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
          />
        </div>
      </div>
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
            <div
              :class="$style['text-block']"
              v-html="item.content"
              @click="linkTo('service')"
            />
          </div>

          <div v-if="index == 1 && item.isOpen" :class="$style['tips']">
            <div>
              如有任何问题，请洽24小时
              <span @click="linkTo('service')">在线客服</span>
              ，将有专人亲切的为您服务。
            </div>
          </div>

          <div
            :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
            @click="item.content && handleToggleContent(index)"
          >
            <img
              :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import info from "../../json/deposit.json";
import mixin from "@/mixins/mcenter/help/help";

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

