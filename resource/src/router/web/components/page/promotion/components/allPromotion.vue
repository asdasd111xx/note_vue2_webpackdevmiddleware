<template>
    <div v-if="total" class="content">
        <waterfall
            :watch="promotion"
            align="center"
            min-line-gap="320"
            max-line-gap="500"
            line-gap="500"
        >
            <waterfall-slot
                v-for="(item, index) in promotion"
                v-show="!lock"
                :key="item.id"
                :width="item.autoWidth || 500"
                :height="item.autoHeight"
                :order="index"
            >
                <div
                    :id="`event${item.id}`"
                    :ref="item.id"
                    class="promotion-box-frame"
                >
                    <div class="promotion-box">
                        <img
                            v-if="item.ad_img"
                            :src="item.ad_img"
                            class="promotion-img"
                            @load="load"
                        />
                        <div class="promotion-title">{{ item.title }}</div>
                        <div class="promotion-time">
                            <div class="promotion-time-title">
                                {{ $t('S_ACTIVITY_TIME') }}({{ $t('S_DAW_EST') }})
                            </div>
                            <div class="promotion-time-period">
                                {{ (item.end_at === '') ? `${item.start_at} ${$t('S_START')}` : `${item.start_at} ~ ${item.end_at}` }}
                            </div>
                        </div>
                        <div
                            v-if="loginStatus && !item.alreadyJoin && item.register"
                            :title="$t('S_JOIN_PROMOTION')"
                            class="promotion-join"
                            @click="joinPromotion(item.id)"
                        >
                            {{ $t('S_JOIN_PROMOTION') }}
                        </div>
                        <div class="promotion-more" @click="openPromotion({ type: 'promotion', id: item.id })">
                            {{ $t('S_MORE_INFO') }}
                        </div>
                    </div>
                </div>
            </waterfall-slot>
        </waterfall>
        <ele-loading v-if="lock" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import waterfall from 'vue-waterfall/lib/waterfall';
import waterfallSlot from 'vue-waterfall/lib/waterfall-slot';
import promotion from '@/api/promotion';
import EST from '@/lib/EST';
import eleLoading from '../../../tpl/common/element/loading/circle';

/**
 * 固定頁 - 優惠活動 (全部優惠)
 * @module promotion/components/allPromotion
 */
export default {
    components: {
        waterfall,
        waterfallSlot,
        eleLoading
    },
    props: {
        togglePopup: {
            type: Function,
            required: true
        },
        setPopup: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            promotion: {},
            total: 0,
            imgTotal: 0,
            imgCount: 0,
            lock: true,
            alreadyJoinArray: []
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        this.checkJoin();

        promotion.all({
            success: (response) => {
                const joinArray = this.alreadyJoinArray;
                const temp = {};
                this.total = response.ret.length;
                for (let i = 0; i < response.ret.length; i += 1) {
                    const { id } = response.ret[i];
                    temp[id] = {
                        id,
                        register: response.ret[i].register,
                        start_at: EST(response.ret[i].start_at),
                        end_at: (response.ret[i].end_at === '') ? '' : EST(response.ret[i].end_at),
                        title: response.ret[i].title,
                        ad_img: '',
                        autoWidth: 0,
                        autoHeight: 0,
                        banner_img: '',
                        alreadyJoin: joinArray.includes(id)
                    };
                    // 取封面圖
                    if (response.ret[i].ad_image_id) {
                        this.imgTotal += 1;
                        promotion.image({
                            success: (data) => {
                                temp[id].ad_img = data.ret;
                            }
                        }, response.ret[i].ad_image_id);
                    }
                }
                this.promotion = temp;
                this.actionSetPromotion(temp);
                if (this.imgTotal === 0) {
                    setTimeout(() => {
                        this.getHeight();
                    }, 1000);
                }
            },
            fail: () => {
                this.checkJoin();
            }
        });
        window.addEventListener('resize', this.getHeight);
    },
    destroyed() {
        window.removeEventListener('resize', this.getHeight);
    },
    methods: {
        ...mapActions([
            'actionSetPromotion'
        ]),
        load() {
            this.imgCount += 1;
            if (this.imgCount === this.imgTotal) {
                setTimeout(() => {
                    this.getHeight();
                }, 1000);
            }
        },
        getHeight() {
            Object.keys(this.promotion).forEach((id, index) => {
                const target = document.querySelector(`#event${id}.promotion-box-frame`);
                const width = target.clientWidth;
                const height = target.clientHeight;
                this.promotion[id].autoWidth = width;
                this.promotion[id].autoHeight = height;
                if (index + 1 === this.total) {
                    this.lock = false;
                }
            });
        },
        checkJoin() {
            this.alreadyJoinArray = [];
            // 登入後取會員已加入過的優惠
            if (this.loginStatus) {
                promotion.member({
                    success: (response) => {
                        response.ret.forEach((value) => {
                            this.alreadyJoinArray.push(value.id);
                        });
                        Object.keys(this.promotion).forEach((value) => {
                            if (this.promotion[value].id && this.alreadyJoinArray.indexOf(this.promotion[value].id) !== -1) {
                                this.promotion[value].alreadyJoin = true;
                            }
                        });
                    }
                });
            }
        },
        joinPromotion(thisId) {
            promotion.join({
                success: () => {
                    alert(this.$t('S_CR_SUCCESS'));
                    this.checkJoin();
                }
            }, thisId);
        },
        openPromotion(data) {
            promotion.pop({
                success: (response) => {
                    if (response.ret.link && response.ret.link !== '') {
                        window.open(response.ret.link);
                        return;
                    }
                    this.setPopup(data.id);
                    this.togglePopup(true);
                }
            }, data.id);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.content {
    .promotion-box-frame {
        position: relative;
        padding: 3.2%;
    }
    .promotion-box {
        padding: 1.3%;
        background: #FFF;
        width: 100%;
        line-height: normal;
        box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
        .promotion-img {
            width: 100%;
            height: auto;
        }
        .promotion-title {
            margin: 10px 0;
            word-break: break-all;
            font-weight: bold;
        }
        .promotion-time {
            margin-bottom: 18px;
            background: #FAFAFA;
            line-height: 30px;
        }
        .promotion-time-title {
            padding: 0 3%;
            text-align: left;
            font-size: 15px;
            font-weight: bold;
        }
        .promotion-time-period {
            font-size: 14px;
            white-space: nowrap;
        }
        .promotion-more,
        .promotion-join {
            display: inline-block;
            width: 49%;
            padding: 7px 3%;
            font-weight: bold;
            border: 1px solid #CCC;
            border-radius: 8px;
            background: #FFF;
            transition: 0.3s ease;
            cursor: pointer;
        }
        .promotion-more {
            color: #5E5E5E;
        }
        .promotion-join {
            color: #0070C0;
        }
    }

    @media screen and (min-width: $pc + $sidebar) {
        .promotion-box {
            .promotion-more,
            .promotion-join {
                &:hover {
                    border: 1px solid #ADADAD;
                    background: #E6E6E6;
                }
            }
        }
    }
}
</style>
