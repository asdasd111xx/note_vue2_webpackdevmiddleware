<template>
  <div
    v-if="list"
    :class="[$style['card-item'], $style['custom-' + customStyle]]"
  >
    <div v-for="(info, index) in list" :key="index" :class="[$style['info']]">
      <span :class="[$style['alias'], { [$style['title']]: index === 0 }]">
        {{ info.alias }}
      </span>

      <div>
        <!-- 目前僅針對狀態 -->
        <template v-if="Array.isArray(info.value)">
          <span
            v-for="(item, index) in info.value"
            :key="index"
            :class="[
              $style['value-item'],
              {
                [$style['red']]:
                  item === '停用' || item === '冻结' || item === '停权'
              },
              {
                [$style['blue']]: item === '启用'
              }
            ]"
          >
            {{ item }}
          </span>
        </template>

        <!-- 一般情況(非陣列) -->
        <template v-else>
          <span
            :class="[$style['value-item']]"
            @click="clickCard(info.paramsValue, info.isClick)"
          >
            {{ info.value }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    customStyle: {
      type: String
    },
    list: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    })
  },
  methods: {
    clickCard(value, isClick = false) {
      if (!isClick) return;
      this.$emit("click", value);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

// 一般預設的樣式
.card-item {
  background: $main_white_color1;
  color: $main_text_color3;
  margin-top: 10px;
  padding-bottom: 7px;
}

.info {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 14px;

  &:first-child {
    margin-bottom: 6px;

    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      left: 0;
      bottom: 0;
      background: #eee;
    }
  }
}

.alias {
  &.title {
    font-size: 15px;
    font-weight: 700;
  }
}

.value-item {
  &.red {
    color: #ff3d3d;
  }

  &.blue {
    color: #2693fc;
  }
}

// 客製化
// 一級好友，推薦禮金似乎亦同
.card-item.custom-firstFriend {
  .info {
    &:first-child {
      margin-bottom: 4px;
    }

    &:not(:first-child) {
      padding: 1px 14px;
    }
  }

  .alias {
    &.title {
      font-size: 14px;
    }

    &:not(.title) {
      font-size: 12px;
      color: #979797;
    }
  }

  .value-item {
    font-size: 12px;
  }
}
</style>
