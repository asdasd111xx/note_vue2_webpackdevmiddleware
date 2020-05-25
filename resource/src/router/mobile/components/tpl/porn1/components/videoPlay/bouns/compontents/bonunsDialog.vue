<template>
  <div
    v-if="isShow"
    :class="
      isClose ? [$style['dialog'], $style['dialog-close']] : $style['dialog']
    "
  >
    <div
      :class="{ [$style['earn-wrap']]: !type.includes('tips') }"
      id="earn-wrap"
      ref="wrap"
    >
      <div
        :class="$style['title-coin']"
        :style="
          dialogHeight && { top: `calc(100% - ${dialogHeight}px - 64px)` }
        "
      >
        <img
          :src="$getCdnPath('/static/image/_new/actives/bouns/coin_title.png')"
        />
      </div>
      <div :class="$style['title']">
        <template v-if="type.includes('poor')">
          {{ $text("S_ACTIVITY_SHORT", "余额不足 请先充值") }}
        </template>
        <div
          v-else-if="missionDesc && type.includes('wait')"
          v-html="getDesc(missionDesc)"
        ></div>
        <template v-else>
          {{ $text("S_ACTIVITY_SLOGAN", "看视频送现金 天天看天天送") }}
        </template>
      </div>
      <template
        v-if="type == 'tips' || type.includes('poor') || type.includes('wait')"
      >
        <div :class="$style['bouns-func']">
          <div v-if="missionDesc && type.includes('wait')" @click="handleClose">
            {{ "继续看" }}
          </div>
          <div v-else @click="$router.push('/mobile')">
            {{ $text("S_FIRST_LOOK", "先去逛逛") }}
          </div>

          <div
            v-if="type.includes('poor')"
            @click="$router.push('/mobile/mcenter/deposit')"
            :class="$style['active-btn']"
          >
            {{ $text("S_GO_DEPOSIT", "去充值") }}
          </div>
          <div
            v-else-if="missionActionType && type.includes('wait')"
            @click="handleAcionType"
            :class="$style['active-btn']"
          >
            {{ getActionName(missionActionType) }}
          </div>
          <div
            v-else
            @click="$router.push('/mobile/login')"
            :class="$style['active-btn']"
          >
            {{ $text("S_JOIN_MEMBER", "加入会员") }}
          </div>
        </div>
      </template>
      <template v-else>
        <div :class="$style['bouns-earn-wrap']">
          <div :class="$style['earn-title']">
            <template v-if="type.includes('full')">
              <span>
                恭喜获得今日最高彩金
              </span>
              <span> ¥&nbsp;{{ limitAmount }} </span>
            </template>
            <template v-else>
              <span>
                恭喜获得彩金
              </span>
              <span> ¥&nbsp;{{ earnCurrentNum }} </span>
            </template>
          </div>
          <div :class="$style['earn-cell-wrap']">
            <div
              v-for="index in earnCellNum"
              :key="index"
              :class="[
                $style['earn-cell'],
                { [$style['active']]: index <= hadEarnNum }
              ]"
            >
              <div>
                <div>
                  <img
                    :src="
                      $getCdnPath(
                        '/static/image/_new/actives/bouns/coin_solid.png'
                      )
                    "
                  />
                </div>
                <div :class="[$style['earn-single-num']]">
                  +{{ earnSingleNum }}
                </div>
                <img
                  v-if="index <= hadEarnNum"
                  :class="[$style['had-earned']]"
                  :src="
                    $getCdnPath('/static/image/_new/actives/bouns/get_icon.png')
                  "
                />
              </div>
            </div>
          </div>
        </div>
        <div
          @click="handleClose"
          :class="[$style['earn-keep-btn'], $style['active-btn']]"
        >
          {{ $text("S_ACTIVITY_KEEP", "继续看片") }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    type: {
      type: String,
      default: "tips"
    },
    videoid: {
      type: Number,
      default: ""
    }
  },
  components: {

  },
  watch: {
    earnCellNum() {
      if (this.earnCellNum < 0) {
        this.earnCellNum = 6; //暫時防呆
      }
    },
    isShow() {
      setTimeout(() => {
        this.$nextTick(() => this.getDialogHeight());
      });
    }
  },
  data() {
    return {
      isShow: false,
      dialogHeight: 0,
      isClose: false,
      earnCellNum: 0, // 可獲得彩金數
      hadEarnNum: 0, // 已經獲得彩金數
      earnSingleNum: "0.00", //每次獲得彩金
      earnCurrentNum: "0.00", //獲得彩金
      limitAmount: "", //最高彩金
      missionDesc: "", //任務標題
      missionActionType: "" //任務動作 去充值 去綁定 去推廣
    };
  },
  mounted() {
    window.addEventListener('resize', this.getDialogHeight);
    setTimeout(() => {
      this.$nextTick(() => this.getDialogHeight());
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getDialogHeight);
  },
  methods: {
    getDesc(desc) {
      //   暫時修改標題
      //   return desc;
      let split = desc.split(' ');
      if (split && split.length > 0) {
        return `${split[split.length - 1]}<br />即可繼續享有觀影送錢！`;
      }
    },
    getActionName() {
      switch (this.missionActionType) {
        case 1:
          return "去绑定"
        case 2:
          return "去充值"
        case 3:
        case 4:
          return "去推广"
        case 5:
        case 6:
          return "去下注"
        case 7:
        default:
          return;
      }
    },
    handleAcionType() {
      let redirect = `?redirect=videoPlay-${this.videoid}`;
      switch (this.missionActionType) {
        case 1:
          this.$router.push(`/mobile/mcenter/bankCard${redirect}`);
          return;
        case 2:
          this.$router.push(`/mobile/mcenter/deposit${redirect}`);
          return;
        case 3:
        case 4:
          this.$router.push(`/mobile/mcenter/makeMoney`);
          return;
        case 5:
        case 6:
          this.$router.push(`/mobile`);
          return;
        case 7:
        default:
          return;
      }
    },
    getDialogHeight() {
      let t = document.getElementById('earn-wrap');
      if (t && t.offsetHeight) {
        this.dialogHeight = t.offsetHeight;
      }
    },
    handleClose() {
      this.isClose = true;
      setTimeout(() => {
        this.$emit('close')
        this.isShow = false;
        this.isClose = false;
      }, 300)
    }
  },
};
</script>
<style src="../index.scss" lang="scss" module></style>

