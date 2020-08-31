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
          <!-- 客制內容 -->
          <template v-if="item.extraContentKey">
            <div
              v-if="item.extraContentKey === 'limit'"
              :class="[$style['text-block'], $style['limit-block']]"
            >
              <table :class="$style['limit-table']" border="1">
                <thead>
                  <tr>
                    <th>单注最低</th>
                    <th>游戏平台</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in limitTable">
                    <td :class="$style['limit-value']">
                      {{ item.limit }}
                    </td>
                    <td :class="$style['limit-platform']">
                      {{ item.platform }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <div
              v-for="(item, index) in item.content"
              :class="$style['text-block']"
              v-html="item"
            />
          </template>
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
  </div>
</template>

<script>
import info from '../../json/faq.json';
import mixin from '@/mixins/mcenter/help/help';

export default {
  mixins: [mixin],
  data() {
    return {
      limitTable: [
        { limit: "0.01元", platform: "MG电子、PT电子、HB电子、开元棋牌、PG电子、FG电子、SW电子、KA电子" },
        { limit: "0.02元", platform: "AG电子、SG电子" },
        { limit: "0.05元", platform: "易游电子" },
        { limit: "0.1元", platform: "BB电子、JDB电子、PP电子、大满贯电子、AW电子、ACE电子、MT电子、WM电子、PS电子、TP电子、乐游棋牌" },
        { limit: "0.16元", platform: "CQ9电子" },
        { limit: "0.2元", platform: "GNS电子" },
        { limit: "0.5元", platform: "ISB电子、BNG电子、Gti电子" },
        { limit: "1元", platform: "BB彩票、XBB电子、易游棋牌、XBB彩票、XBB棋牌、JDB棋牌、FG棋牌、VR彩票" },
        { limit: "2元", platform: "皇冠体育、XBB棋牌" },
        { limit: "5元", platform: "IM体育" },
        { limit: "10元", platform: "BB视讯、GD视讯、BB体育、沙巴体育、EVO视讯、MG视讯、eBET视讯、性感百家乐、XBB视讯-轮盘/骰宝" },
        { limit: "20元", platform: "AG视讯、AB视讯、BG视讯、XBB视讯-百家乐/龙虎斗" },
      ]
    }
  },
  created() {
    this.isCategoryMode = true;
    this.source = info;
  },
};
</script>

<style lang="scss" module>
@import "../../css/index.module.scss";

.limit-block {
}

.limit-table {
  font-size: 12px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #555555;
  border: 0.6px solid #dddddd;
  border-collapse: collapse;

  th {
    background-color: #e42a30;
    color: #ffffff;
    height: 32px;
  }

  th:first-of-type {
    border-radius: 7px 0 0 0;
  }

  th:last-of-type {
    border-radius: 0 7px 0 0;
  }

  td {
    min-height: 50px;
    line-height: 20px;
  }

  tbody tr:first-child td {
    border-top: 0;
  }

  tbody tr td:first-child {
    border-left: 0;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody tr td:last-child {
    border-right: 0;
  }

  .limit-value {
    width: 65px;
  }

  .limit-platform {
    text-align: left;
  }
}
</style>
