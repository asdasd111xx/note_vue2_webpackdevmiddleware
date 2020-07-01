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
      <!-- 第一行文字 -->
      <div :class="$style['title']">
        <template v-if="type.includes('full-open')">
          请推广好友充值<br />
          领取更多礼金&nbsp;享受每月分红
        </template>
        <template v-else-if="type.includes('poor')">
          {{ $text("S_ACTIVITY_SHORT", "余额不足 请先充值") }}
        </template>
        <div
          v-else-if="missionDesc && type.includes('wait')"
          v-html="getDesc(missionDesc)"
        ></div>
        <template v-else-if="isUnloginMode">
          加入娱乐会员<br />
          享有观影送钱
        </template>
        <template v-else>
          <span style="margin-top: 10%;display: block;">
            {{ $text("S_ACTIVITY_SLOGAN", "看视频送现金 天天看天天送") }}
          </span>
        </template>
      </div>
      <!-- 第二行文字或按鈕 -->
      <template
        v-if="
          type == 'tips' ||
            type.includes('poor') ||
            type.includes('wait') ||
            type.includes('full-open')
        "
      >
        <div :class="$style['bouns-func']">
          <!-- 左邊第一個按鈕 -->
          <div v-if="isUnloginMode" @click="handleClose">
            继续观影
          </div>
          <div
            v-else-if="
              (missionDesc && type.includes('wait')) ||
                earnCellNum === hadEarnNum
            "
            @click="handleClose"
          >
            {{ "继续看" }}
          </div>

          <div v-else @click="$router.push('/mobile')">
            {{ $text("S_FIRST_LOOK", "先去逛逛") }}
          </div>

          <!-- 右邊第一個按鈕 -->
          <div
            v-if="isUnloginMode"
            @click="$router.push('/mobile/login')"
            :class="$style['active-btn']"
          >
            {{ $text("S_JOIN_MEMBER", "加入会员") }}
          </div>
          <div
            v-else-if="type.includes('poor')"
            @click="$router.push('/mobile/mcenter/deposit')"
            :class="$style['active-btn']"
          >
            {{ $text("S_GO_DEPOSIT", "去充值") }}
          </div>
          <div
            v-else-if="type.includes('wait') && missionActionType"
            @click="handleAcionType"
            :class="$style['active-btn']"
          >
            {{ getActionName(missionActionType) }}
          </div>
          <div
            v-else-if="earnCellNum === hadEarnNum && hadEarnNum !== 0"
            @click="$router.push('/mobile/mcenter/makeMoney')"
            :class="$style['active-btn']"
          >
            去推广
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
            <template v-if="earnCellNum === hadEarnNum && hadEarnNum !== 0">
              <span>
                恭喜获得今日最高彩金
              </span>
              <span>&nbsp;¥&nbsp;{{ limitAmount }} </span>
            </template>
            <template v-else>
              <span>
                恭喜获得彩金
              </span>
              <span>&nbsp;¥&nbsp;{{ earnCurrentNum }} </span>
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
import { getCookie } from '@/lib/cookie';
import yaboRequest from '@/api/yaboRequest';
import { mapGetters } from 'vuex';

export default {
  props: {
    type: {
      type: String,
      default: "tips"
    },
    videoid: {
      type: Number,
      default: ""
    },
    isUnloginMode: {
      type: Boolean
    }
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
      earnSingleNum: 0, //每次獲得彩金
      earnCurrentNum: 0, //獲得彩金
      limitAmount: 0, //最高彩金
      missionDesc: "", //任務標題
      missionActionType: 0, //任務動作 去充值 去綁定 去推廣
      isFinishMissio: false,//是否完成今年任務,
      tagId: 0
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      siteConfig: 'getSiteConfig',
    }),
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

      if (this.isFinishMission) {
        if (split && split.length > 0 && split[1]) {
          let max = split[1];
          return `恭喜您今年已获得最高奖励${Number(max) ? max : "999元"}<br />下一年会重新开始发放观影${Number(max) ? max : "999元"}奖励`
        }
        return `恭喜您已获得最高奖励999元<br />下一年会重新开始发放观影奖励999元`;
      }

      if (this.type.includes('wait') && this.missionActionType === 7) {
        let split = desc.split(' ');
        if (split && split.length > 0 && split[1]) {
          let max = split[1];
          return `恭喜您已获得最高奖励${Number(max) ? max : "999元"}`
        }
        return `恭喜您已获得最高奖励999元`;
      }

      let split = desc.split(' ');
      if (split && split.length > 0) {
        return `${split[split.length - 1]}<br />即可继续享有观影送钱！`;
      }
    },
    getActionName() {
      switch (this.missionActionType) {
        case 1:
          return "去绑定";
        case 2:
          return "去充值";
        case 3:
        case 4:
          return "去推广";
        case 5:
          return "去查看";
        case 6:
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
          this.$router.push(`/mobile/mcenter/makeMoney`);
          return;
        case 4:
          this.$router.push(`/mobile/mcenter/tcenter/management/member`);
          return;
        case 5:
          this.unlockTag();
          return;
        case 6:
        default:
          return;
      }
    },
    unlockTag() {
      let cid = getCookie('cid');
      yaboRequest({
        method: 'put',
        url: `${this.siteConfig.YABO_API_DOMAIN}/Account/UnlockTagId?`,
        headers: {
          'x-domain': this.memInfo.user.domain,
        },
        params: {
          cid: cid,
          userid: this.memInfo.user.id,
          tagId: this.tagId,
          domain: this.memInfo.user.domain
        },
      }).then((res) => {
        setTimeout(() => {
          this.$router.push(`/mobile/mcenter/makeMoney?&refresh=1`);
        }, 200)
      }).catch(e => {
        console.log(e)
      });
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
        this.$emit('close', this.type.includes('wait') ? true : false)
        this.isShow = false;
        this.isClose = false;
      }, 300)
    }
  },
};
</script>
<style src="../index.scss" lang="scss" module></style>

