<template>
    <vip>
        <template scope="{ vipLevelList, vipConfig, userVipInfo, previewLevel, isNextLevel, nowTypeLevel, badgeList, isDisplay }">
            <div class="vip-title-wrap">
                <h1>{{ $text('S_VIP_STATUS_BROWSE', 'VIP身份一览') }}</h1>
                <div
                    v-if="isGoUrl"
                    class="honor-channel-btn"
                    @click="switchUrlList(true)"
                >
                    {{ $text('S_USE_HONOR_CHANNEL', '使用尊荣通道') }}
                </div>
                <div class="title-right">
                    <div
                        :title="$text('S_GO_RECEIVE_RECORD', '查看领取纪录')"
                        class="receive-btn record"
                        @click="actionChangePage({ page: 'mcenter', type: '', subPage: 'bankMoneyDetail' })"
                    >
                        {{ $text('S_GO_RECEIVE_RECORD', '查看领取纪录') }}
                    </div>
                    <!-- 前往領取優惠暫不執行 先隱藏 -->
                    <!-- <div class="receive-btn">{{ $text('S_GO_RECEIVE', '前往领取') }}</div> -->
                </div>
            </div>
            <div v-if="isDisplay" class="vip-content-wrap">
                <vip-style
                    v-for="(info, index) in userVipInfo"
                    :key="`vip-type-${index}}`"
                    :preview-level="previewLevel"
                    :is-next-btn="isNextLevel[info.config_id]"
                    :now-level-list="vipLevelList[info.config_id]"
                    :badge-img="badgeList[info.config_id][nowTypeLevel[info.config_id]]"
                    :now-cur-index="nowTypeLevel[info.config_id]"
                    :now-user-level="info"
                />
            </div>
            <url-list
                v-if="isShowUrl"
                :url-list="allUrlList"
                @close="switchUrlList"
            />
        </template>
    </vip>
</template>

<script>
import { mapActions } from 'vuex';
import vip from '@/components/common/mcenter/vip';
import ajax from '@/lib/ajax';
import vipStyle from './vipStyle';

export default {
    components: {
        vip,
        vipStyle,
        urlList: () => import(/* webpackChunkName: 'urlList' */ './urlList')
    },
    data() {
        return {
            isShowUrl: false,
            isGoUrl: false,
            allUrlList: []
        };
    },
    created() {
        this.actionSetIsLoading(true);
        ajax({
            method: 'get',
            url: '/api/v1/c/vip/hostnames',
            errorAlert: false,
            success: ({ result, ret }) => {
                if (result === 'ok' && ret.length > 0) {
                    this.isGoUrl = true;
                    this.allUrlList = ret;
                }
            }
        })
            .then(() => {
                this.actionSetIsLoading(false);
            });
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetIsLoading'
        ]),
        switchUrlList(isDisplay) {
            this.isShowUrl = isDisplay;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
