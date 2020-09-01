<template>
  <div :class="$style['content-wrap']">
    <div v-if="category_list && data" :class="$style['section']">
      <div
        v-if="category_list"
        :class="[$style['cell']]"
        :style="{ 'margin-bottom': '10px' }"
        @click="category_isShowPop = true"
      >
        <div :class="$style['title']">
          {{ categorys[category_currentIndex] }}
        </div>
        <div :class="[$style['arrow-btn']]">
          <img
            :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
          />
        </div>
      </div>
      <div
        v-for="(item, index) in data[category_currentIndex].list"
        :id="`q-${index}`"
        :class="$style['cell']"
        :key="`q-${index}`"
        @click="handleToggleContent(index, true)"
      >
        <div :class="$style['cell-header']">
          <div :class="$style['title-icon']">
            <img
              :src="$getCdnPath('/static/image/_new/mcenter/ic_help.png')"
              alt="help"
            />
          </div>

          <div :class="$style['title']">{{ item.title }}</div>
        </div>

        <div :class="[$style['content'], { [$style['active']]: item.isOpen }]">
          <div
            v-for="(item, index) in item.content"
            :class="$style['text-block']"
            v-html="item"
          />
        </div>

        <div
          :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
        >
          <img
            :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
          />
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="category_isShowPop" :class="$style['pop-wrap']">
        <div :class="$style['pop-mask']" @click="category_isShowPop = false" />
        <div :class="$style['pop-menu']">
          <div :class="$style['pop-title']">
            <span @click="category_isShowPop = false">{{
              $text("S_CANCEL", "取消")
            }}</span>
            选择游戏类别
          </div>
          <ul :class="$style['pop-list']">
            <li
              v-for="(item, index) in categorys"
              :key="index"
              @click="setType(index)"
            >
              {{ item }}
              <icon
                v-if="category_currentIndex === index"
                :class="$style['select-icon']"
                name="check"
              />
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import info from '../../json/privacy.json';
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
