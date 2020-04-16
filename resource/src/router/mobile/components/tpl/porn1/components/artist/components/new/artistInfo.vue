<template>
  <div :class="$style['artist-info-wrap']">
    <div :class="$style['main-info-wrap']">
      <div :class="$style['profile-photo']">
        <img :src="image" />
        <div>
          {{
            $text("S_VIDEO_AMOUNT", {
              replace: [{ target: "%s", value: amount }]
            })
          }}
        </div>
      </div>

      <div :class="$style['info']">
        <div>
          <span :class="$style['title']">
            生日：
          </span>
          <span>{{ birthday }}</span>
        </div>
        <div>
          <span :class="$style['title']">
            {{ $text("S_HEIGHT", "身高") }}：
          </span>
          <span>{{ height }}cm</span>
        </div>
        <div>
          <span :class="$style['title']">
            {{ $text("S_MEASUREMENT", "三围") }}：
          </span>
          <span>{{ measurement }}</span>
        </div>
        <div :class="$style['intro']">
          <span :class="$style['title']">{{ $text("S_DESC", "简介") }}：</span>
          <span :class="[$style['desc'], { [$style['open']]: isOpenDesc }]">
            {{ desc }}
          </span>
          <div :class="$style['more-btn']" @click="onToggleDesc">
            {{ $text("S_MORE", "更多") }}
            <img
              :src="$getCdnPath('/static/image/_new/common/btn_back_w.png')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpenDesc: false
    };
  },
  created() {
    this.$emit('setTitle', this.artist)
  },
  methods: {
    onToggleDesc() {
      this.isOpenDesc = !this.isOpenDesc;
    }
  },
  props: {
    artist: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    birthday: {
      type: String,
      required: true
    },
    measurement: {
      type: String,
      required: true
    },
    cup: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.artist-info-wrap {
  font-size: 12px;
  padding: 0 14px;
}

.main-info-wrap {
  height: auto;
  display: flex;

  .profile-photo {
    height: 90px;
    width: 90px;
    position: relative;
    > img {
      border: 1px #9ca3bf solid;
      height: 100%;
      border-radius: 50%;
    }

    > div {
      color: white;
      background-color: #9ca3bf;
      width: 64px;
      border-radius: 7px;
      line-height: 17px;
      height: 17px;
      position: absolute;
      top: 90%;
      font-size: 10px;
      text-align: center;
      left: calc(50% - 32px);
    }
  }

  .info {
    margin-left: 12px;
    width: calc(100% - 90px);
    > div:not(:last-child) {
      width: 100%;
      height: 16px;
      line-height: 16px;
      margin: 1.5px;
      color: #9ca3bf;
    }

    .title {
      color: #5e626d;
    }

    .intro {
      display: block;
      margin: 1.5px;
      color: #9ca3bf;
      width: 100%;

      span {
        display: block;
      }

      .desc {
        height: 34px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;

        &.open {
          height: auto;
          overflow: unset;
          text-overflow: unset;
          display: unset;
          -webkit-line-clamp: unset;
          -webkit-box-orient: unset;
        }
      }
    }
  }
}

.more-btn {
  width: 53px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: white;
  margin: 0 auto;
  margin-top: 4px;
  border-radius: 3px;
  background: -webkit-linear-gradient(right, #bd9d7d, #f9ddbd);
  background: -o-linear-gradient(left, #bd9d7d, #f9ddbd);
  background: -moz-linear-gradient(left, #bd9d7d, #f9ddbd);
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);

  > img {
    height: 10px;
    width: 10px;
  }
}
</style>
