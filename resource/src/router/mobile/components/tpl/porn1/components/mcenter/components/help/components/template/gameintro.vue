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
          <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
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
            :key="index"
          />
          <div v-if="category_currentkind === 'live' && index === 5">
            <table :class="$style['table-border']">
              <tr>
                <td>如果庄家总点数是</td>
                <td>如果闲家的第三张牌是以下点数,则拿牌</td>
                <td>如果闲家的第三张牌是以下点数,则不拿牌</td>
              </tr>
              <tr>
                <td>3</td>
                <td>1、2、3、4、5、6、7、9、0</td>
                <td>8</td>
              </tr>
              <tr>
                <td>4</td>
                <td>2、3、4、5、6、7</td>
                <td>1、8、9、0</td>
              </tr>
              <tr>
                <td>5</td>
                <td>4、5、6、7</td>
                <td>1、2、3、8、9、0</td>
              </tr>
              <tr>
                <td>6</td>
                <td>6、7</td>
                <td>1、2、3、4、5、8、9、0</td>
              </tr>
              <tr>
                <td>7</td>
                <td></td>
                <td>停牌</td>
              </tr>
              <tr>
                <td>8、9</td>
                <td></td>
                <td>天牌 （停牌）</td>
              </tr>
            </table>

            <div style="padding-top:5pt;">
              ※备注: 以上补牌规则适用于传统百家乐，实际请依照各平台游戏规则为主
            </div>
          </div>
        </div>

        <div
          :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
        >
          <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="category_isShowPop" :class="$style['pop-wrap']">
        <div :class="$style['pop-mask']" @click="category_isShowPop = false" />
        <div :class="$style['pop-menu']">
          <div :class="[$style['pop-title'], $style[routerTPL]]">
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
                :class="[$style['select-icon'], $style[routerTPL]]"
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
import { mapGetters } from "vuex";
import mixin from "@/mixins/mcenter/help/help";

export default {
  mixins: [mixin],
  created() {
    this.isCategoryMode = true;
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  mounted() {
    fetch(`/i18n/json/${this.routerTPL}/gameintro.json`)
      .then(res => res.json())
      .then(data => (this.source = data));
  }
};
</script>

<style lang="scss" module>
@import "../../css/index.module.scss";
</style>
