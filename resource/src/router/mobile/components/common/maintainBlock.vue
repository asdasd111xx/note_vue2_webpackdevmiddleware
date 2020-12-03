<template>
  <transition name="fade">
    <template v-if="type === 1">
      <div v-show="isShow && content && content.length > 0" class="dialog">
        <div class="wrap">
          <div class="maintain-title">SWAG 维护中</div>
          <div v-for="item in content" class="cell">
            <div class="time-title">
              {{ item.title }}
            </div>
            <div class="content">
              <div class="date">
                {{ getDate(item.startAt) }} <br />
                {{ getTime(item.startAt) }}
              </div>
              <div class="to-img">
                <img
                  :src="$getCdnPath('/static/image/casino/ic_transfergo.png')"
                />
              </div>

              <div class="times">
                {{ getDate(item.endAt) }} <br />
                {{ getTime(item.endAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';

export default {
  props: {
    type: {
      type: Number,
      default: 1 // 1. 一般彈窗維護 2. 遊戲小卡維護
    },
    callback: {
      type: Function,
      default: null
    },
    content: {
      type: Array | null,
      default: null
    }
  },
  data() {
    return {
      isShow: false,
      timer: null,

      list: [
        {
          title: '-美东时间-',
          startAt: '',
          endAt: ''
        }
      ]
    };
  },
  computed: {

  },
  created() {
    this.isShow = true;
    this.timer = setTimeout(() => {
      this.isShow = false;
      setTimeout(() => {
        this.clearMsg();
      }, 300);
    }, 3000);
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
    }),
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.actionSetGlobalMessage(null);
    this.$emit('close');
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    getDate(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    getTime(date) {
      return moment(date).format("HH:mm:ss");
    },
    clearMsg() {
      this.$emit('close');
    }
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.dialog {
  position: fixed;
  left: 0;
  top: 0;
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}

.dialog > div:first-child {
  background-color: rgba($color: #5e626d, $alpha: 0.9);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  //   min-width: 200px;
  padding: 5px 11px;
  color: white;
}

.wrap {
  font-size: 12px;
  font-family: Arial, Arial-Bold;
  font-weight: 700;
  text-align: center;
  color: #ffffff;
}

.maintain-title {
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.time-title {
  min-width: 180px;
}

.content {
  display: flex;
  align-content: center;
  justify-content: center;
}

.date,
.times {
  flex: 2;
  padding: 2px 0;
}

.to-img {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  img {
    width: 12px;
    height: 9px;
  }
}
</style>
