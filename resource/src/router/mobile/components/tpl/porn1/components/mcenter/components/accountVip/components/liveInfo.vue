<template>
  <div :class="[$style['live-info-wrap']]">
    <div :class="[$style['title']]">活动的一般条款与规则</div>

    <div :class="[$style['content']]">
      <div
        :class="[$style['cell']]"
        v-for="(item, index) in content"
        :key="index"
      >
        <span>{{ item.number }}</span>
        <span>{{ item.title }}</span>
        <div>{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: [
        {
          number: "❶",
          title: "如何查看免费直播?",
          content:
            "若您主帐户余额低于100元，将会有相应直播VIP等级的免费观看次数，若达直播VIP4将可以无限观看。"
        },
        {
          number: "❷",
          title: "晋级顺序",
          content:
            "VIP等级达到相应的推广人数，可在次日跳到相对应的等级。"
        },
        {
          number: "❸",
          title: "保级要求/降级标准",
          content: "直播VIP将不会有保级、降级的部份。。"
        },
        {
          number: "❹",
          title: "有效推广会员计算",
          content: "推广会员账号达充值100元，将成为有效会员。"
        },
        {
          number: "❺",
          title: "鸭脖直播保留对活动的修改，停止及最终解释"
        }
      ]
    };
  }
};
</script>

<style lang="scss" module>
.live-info-wrap {
  position: relative;
  width: 100%;
  height: 385px;
  top: 15px;
  padding: 0 17px;
  background: white;
}

.title {
  font-size: 20px;
  padding: 20px 0;

  &::before {
    content: "";
    position: relative;
    display: inline-block;
    width: 3px;
    height: 16px;
    margin-right: 12px;
    background: linear-gradient(#d2bba4, #f1e5db);
  }
}

.content {
  position: relative;
  width: 100%;
  height: auto;

  .cell {
    font-size: 12px;
    padding-bottom: 20px;
    color: #a2a8c2;

    // 編號順序
    span:first-of-type {
      color: #cdb599;
    }

    // 編號text
    span:last-of-type {
      color: #656565;
    }
  }
}
</style>
