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
            <div
              v-for="(string, stringIndex) in item.content"
              :data-key="`${index}`"
              :class="[
                $style['text-block'],
                {
                  [$style['red']]:
                    (stringIndex === 5 && index === 0) ||
                    (stringIndex === 12 && index === 1)
                }
              ]"
              :key="`content-${stringIndex}`"
              v-html="string"
            />
          </div>

          <div v-if="index == 0 && item.isOpen" :class="$style['tips']">
            <div :class="$style['tips-title']">
              ※ 取款注意事项 ※
            </div>
            <div>
              ❶亲切提醒您～联系资料变更时，请您立即联系24小时在线客服人员，即时更新您的联络方式；
              如有任何问题，方便億元客服人员第一时间与您联系。
            </div>
          </div>
          <div v-else-if="index == 1 && item.isOpen" :class="$style['tips']">
            <div>
              如有任何问题，请洽24小时
              <a @click="linkTo('service')"> 在线客服 </a>，
              将有专人亲切的为您服务。
            </div>
            <div>
              ♠ 亿元相关优惠，欢迎参阅『
              <a @click="linkTo('promotion')">
                优惠活动
              </a>
              ，』♠
            </div>
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
    </div>
  </div>
</template>

<script>
import info from '../../json/withdraw.json';
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
