<template>
    <transition name="pop">
        <div v-show="isReady" class="pop-wrap">
            <div class="mask" @click="togglePopup(false)" />
            <div v-if="open" class="pop-promotion-wrap pop-class">
                <div :title="selectData.title" class="title">
                    {{ selectData.title }}
                </div>
                <div class="close-btn" @click="togglePopup(false)">
                    ×
                </div>
                <div class="content">
                    <img
                        v-if="imageData"
                        :src="imageData"
                        class="img"
                    />
                    <div class="text">
                        <div class="countdown-wrap clearfix">
                            <div :class="['countdown', 'clearfix', { 'no-reciprocal': selectData.end_at === '' }]">
                                <div class="time-block">
                                    <p class="time-digit">{{ days }}</p>
                                    <p class="time-text">{{ $t('S_DAY') }}</p>
                                </div>
                                <div class="time-block">
                                    <p class="time-digit">{{ hours }}</p>
                                    <p class="time-text">{{ $t('S_HOUR') }}</p>
                                </div>
                                <div class="time-block">
                                    <p class="time-digit">{{ minutes }}</p>
                                    <p class="time-text">{{ $t('S_MINUTE') }}</p>
                                </div>
                                <div class="time-block">
                                    <p class="time-digit">{{ seconds }}</p>
                                    <p class="time-text">{{ $t('S_SECOND') }}</p>
                                </div>
                                <div
                                    v-if="!loginStatus"
                                    :title="$t('S_JOIN_MEMBER')"
                                    class="time-join"
                                    @click="joinMember"
                                >
                                    {{ $t('S_JOIN_MEMBER') }}
                                </div>
                                <div
                                    v-else-if="selectData.register && !alreadyJoin"
                                    :title="$t('S_JOIN_PROMOTION')"
                                    class="time-join"
                                    @click="joinPromotion(id)"
                                >
                                    {{ $t('S_JOIN_PROMOTION') }}
                                </div>
                            </div>
                        </div>
                        <!-- eslint-disable vue/no-v-html -->
                        <div v-html="selectData.content" />
                        <!-- eslint-enable vue/no-v-html -->
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import promotion from '@/api/promotion';

export default {
    props: {
        id: {
            type: String,
            default: ''
        },
        togglePopup: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            open: false,
            nowtime: new Date(),
            imageData: '',
            selectData: {},
            alreadyJoin: false,
            interval: setInterval(() => {
                this.nowtime = new Date();
            }, 1000),
            isReady: false
        };
    },
    computed: {
        ...mapGetters({
            promotion: 'getPromotion',
            loginStatus: 'getLoginStatus'
        }),
        nowtimestamp() {
            return Math.trunc(this.nowtime.getTime() / 1000);
        },
        seconds() {
            return (this.selectData.end_at - this.nowtimestamp) % 60;
        },
        minutes() {
            return Math.trunc((this.selectData.end_at - this.nowtimestamp) / 60) % 60;
        },
        hours() {
            return Math.trunc((this.selectData.end_at - this.nowtimestamp) / 60 / 60) % 24;
        },
        days() {
            return Math.trunc((this.selectData.end_at - this.nowtimestamp) / 60 / 60 / 24);
        }
    },
    watch: {
        nowtimestamp() {
            if (this.selectData.end_at - this.nowtimestamp <= 0) {
                clearInterval(this.interval);
            }
        }
    },
    created() {
        const param = [this.checkJoin()];

        param.push(promotion.pop({
            success: (response) => {
                if (Date.parse(Vue.moment(response.ret.end_at).format()) - Date.parse(this.nowtime) <= 0) {
                    alert(this.$t('S_PROMOTION_END'));
                    this.togglePopup();
                    return false;
                }

                this.open = true;
                this.selectData = {
                    ...response.ret,
                    end_at: Math.trunc(Date.parse(Vue.moment(response.ret.end_at).format()) / 1000)
                };

                // 取內容圖
                if (response.ret.banner_image_id) {
                    promotion.image({
                        success: (data) => {
                            this.imageData = data.ret;
                        }
                    }, response.ret.banner_image_id);
                }

                return true;
            }
        }, this.id));

        // 當所有 api 完成後再渲染
        Promise.all(param).then(() => {
            this.isReady = true;
        });
    },
    methods: {
        checkJoin() {
            if (!this.loginStatus) {
                return false;
            }

            return promotion.member({
                success: (response) => {
                    if (response.ret.length !== 0) {
                        for (let i = 0; i < response.ret.length; i += 1) {
                            if (response.ret[i].id === this.id) {
                                this.alreadyJoin = true;
                            }
                        }
                    }
                    return true;
                }
            });
        },
        joinPromotion() {
            promotion.join({
                success: () => {
                    alert(this.$t('S_CR_SUCCESS'));
                    this.checkJoin();
                }
            }, this.id);
        },
        joinMember() {
            let isMobile;

            try {
                isMobile = this.$route.matched[0].meta.isMobile;
            } catch (e) {
                isMobile = false;
            }

            if (isMobile) {
                this.$router.push('/mobile/joinmember');
                return;
            }
            this.actionChangePage({ page: 'join', type: '' });
        },
        ...mapActions([
            'actionChangePage'
        ])
    }
};
</script>

<style lang="scss" src="../css/popupContent.scss" scoped></style>
