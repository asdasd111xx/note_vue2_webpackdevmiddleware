<template>
  <div :class="$style['first-friends-table']">
    <div :class="$style.thead">
      <div :class="[$style.row, 'clearfix']">
        <!-- 序 -->
        <div :class="[$style.column, $style.number]">
          {{ $text("S_NUMBER_NO") }}
        </div>
        <!-- 在線 -->
        <div :class="[$style.column, $style.online]">
          {{ $text("S_ONLINE") }}
        </div>
        <!-- 會員帳號 -->
        <div :class="[$style.column, $style.username]">
          {{ $text("S_NAME") }}
        </div>
        <!-- 狀態 -->
        <div :class="[$style.column, $style.status]">
          {{ $text("S_STATUS") }}
        </div>
        <!-- 主帳戶餘額 -->
        <div :class="[$style.column, $style.balance]">
          {{ $text("S_MAIN_BALANCE") }}
        </div>
      </div>
    </div>
    <div v-if="firstFriends.length" :class="$style.tbody">
      <template v-for="(info, index) in firstFriends">
        <div
          :key="index"
          :class="[$style.row, 'clearfix']"
          @click="pushing(index)"
        >
          <!-- 序 -->
          <div :class="[$style.column, $style.number]">
            <span>{{ index + 1 }}</span>
          </div>
          <!-- 在線 -->
          <div :class="[$style.column, $style.online]">
            <span
              :class="[
                $style['icon-online'],
                { [$style.active]: isOnline(info) },
              ]"
            />
          </div>
          <!-- 會員帳號 -->
          <div :class="[$style.column, $style.username]">
            <span>{{ info.username }}</span>
          </div>
          <!-- 狀態 -->
          <div :class="[$style.column, $style.status]">
            <!-- 啟用 -->
            <template v-if="info.enable">
              <!-- 凍結 -->
              <span
                v-if="info.locked"
                :class="{ [$style.locked]: info.locked }"
                >{{ $text("S_LOCKED") }}</span
              >
              <!-- 停權 -->
              <span
                v-else-if="info.bankrupt"
                :class="{ [$style.bankrupt]: info.bankrupt }"
                >{{ $text("S_BANKRUPT") }}</span
              >
              <!-- 啟用 -->
              <span v-else :class="{ [$style.enable]: info.enable }">{{
                $text("S_ENABLE")
              }}</span>
            </template>

            <!-- 停用 -->
            <template v-if="!info.enable">
              <span :class="{ [$style.disable]: !info.enable }">{{
                $text("S_DISABLE")
              }}</span>
            </template>
          </div>
          <!-- 主帳戶餘額 -->
          <div :class="[$style.column, $style.balance]">
            <span :class="$style.money">{{
              info.cash.balance.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }}</span>
            <span
              :class="[$style['icon-info'], { [$style.expend]: isShow(index) }]"
            />
          </div>
          <!-- 詳細資料 -->
          <div v-show="isShow(index)" :class="$style['info-wrap']">
            <!-- 註冊方式 -->
            <div :class="[$style['info-row'], 'clearfix']">
              <div :class="$style.title">{{ $text("S_REGISTER_WAY") }}</div>
              <div :class="$style.info">
                {{ $text(friendsTrans[info.created_by]) }}
              </div>
            </div>
            <!-- 註冊時間 -->
            <div :class="[$style['info-row'], 'clearfix']">
              <div :class="$style.title">{{ $text("S_REGISTER_TIME") }}</div>
              <div :class="$style.info">{{ info.created_at | dateFormat }}</div>
            </div>
            <!-- 最後離線時間 -->
            <div :class="[$style['info-row'], 'clearfix']">
              <div :class="$style.title">{{ $text("S_LAST_ONLINE_TIME") }}</div>
              <div :class="$style['info-online']">
                <template v-if="!info.last_login"><span>--</span></template>
                <template v-else-if="!info.last_online || isOnline(info)"
                  ><span :class="{ [$style.active]: isOnline(info) }">{{
                    $text("S_ONLINE")
                  }}</span></template
                >
                <template v-else
                  ><span>{{ info.last_online | dateFormat }}</span></template
                >
              </div>
            </div>
            <!-- 狀態 -->
            <div :class="[$style['info-row'], 'clearfix']">
              <div :class="$style.title">{{ $text("S_STATUS") }}</div>
              <div :class="$style['info-status']">
                <!-- 啟用 -->
                <template v-if="info.enable">
                  <span :class="{ [$style.enable]: info.enable }">{{
                    $text("S_ENABLE")
                  }}</span>
                </template>
                <!-- 停用 -->
                <template v-else>
                  <span :class="{ [$style.disable]: !info.enable }">{{
                    $text("S_DISABLE")
                  }}</span>
                </template>
                <!-- 凍結 -->
                <template v-if="info.locked">
                  <span>&nbsp;/&nbsp;</span>
                  <span :class="{ [$style.locked]: info.locked }">{{
                    $text("S_LOCKED")
                  }}</span>
                </template>
                <!-- 停權 -->
                <template v-if="info.bankrupt">
                  <span>&nbsp;/&nbsp;</span>
                  <span :class="{ [$style.bankrupt]: info.bankrupt }">{{
                    $text("S_BANKRUPT")
                  }}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="!firstFriends.length" :class="$style['no-data']">
      <img src="/static/image/_new/mcenter/ic_nodata.png" />
      <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
    </div>
    <infinite-loading
      v-if="showInfinite"
      ref="infiniteLoading"
      @infinite="infiniteHandler"
    >
      <span slot="no-more" />
      <span slot="no-results" />
    </infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import firstLevelStatistics from '@/mixins/mcenter/management/firstLevelStatistics';

export default {
  components: {
    InfiniteLoading,
  },
  mixins: [firstLevelStatistics]
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
