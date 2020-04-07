<template>
    <div class="footer-wrap">
        <!-- 玩過 -->
        <popup-collection
            v-if="collectionStatus && popup === 'collection'"
            :popup="popup"
            :recent-list="recentList"
            @togglePopup="togglePopup"
        />
        <!-- 更多 -->
        <transition name="more">
            <popup-more
                v-if="collectionStatus && popup === 'more'"
                :popup="popup"
                @togglePopup="togglePopup"
            />
        </transition>
        <!-- 優惠 -->
        <transition name="more">
            <popup-promotion
                v-if="collectionStatus && popup === 'promotion'"
                :popup="popup"
                @togglePopup="togglePopup"
            />
        </transition>
        <!-- 置底連結 -->
        <div :class="['footer', { 'is-left': isKnightCasino }]">
            <template v-for="item in sort">
                <!-- 存款連結 -->
                <span
                    v-if="item === 'deposit'"
                    :key="`footer-${item}`"
                    @click="$depositLink"
                >
                    <img :src="$getCdnPath('/static/image/mobile/footer/online_deposit_icon_n.png')" />
                    {{ $t('S_ACCOUNT_DEPOSITE') }}
                </span><!--
                    玩過
                --><span
                    v-if="!isException && item === 'collection'"
                    :key="`footer-${item}`"
                    :class="{ 'is-active': popup === 'collection' }"
                    @click="togglePopup('collection')"
                >
                    <img v-show="popup === 'collection'" :src="$getCdnPath('/static/image/mobile/footer/played_icon_h.png')" />
                    <img v-show="popup !== 'collection'" :src="$getCdnPath('/static/image/mobile/footer/played_icon_n.png')" />
                    {{ $t('S_PLAYED') }}
                </span><!--
                    首頁
                --><router-link
                    v-if="!isWonderCasino && item === 'home'"
                    :key="`footer-${item}`"
                    tag="span"
                    to="/mobile"
                    active-class="is-active"
                    exact
                >
                    <img v-show="pageName === 'home'" :src="$getCdnPath('/static/image/mobile/footer/home_icon_h.png')" />
                    <img v-show="pageName !== 'home'" :src="$getCdnPath('/static/image/mobile/footer/home_icon_n.png')" />
                    {{ $t('S_HOME') }}
                </router-link><!--
                    優惠連結
                --><promotion
                    v-if="item === 'promotion'"
                    :key="`footer-${item}`"
                    :toggle-popup="togglePopup"
                    :popup="popup"
                    :is-exception="japanException"
                /><!--
                    更多連結
                --><span
                    v-if="item === 'more'"
                    :key="`footer-${item}`"
                    :class="{ 'is-active': popup === 'more' }"
                    @click="togglePopup('more')"
                >
                    <img v-show="popup === 'more'" :src="$getCdnPath('/static/image/mobile/footer/more_icon_h.png')" />
                    <img v-show="popup !== 'more'" :src="$getCdnPath('/static/image/mobile/footer/more_icon_n.png')" />
                    {{ $t('S_MORE') }}
                </span>
            </template>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import * as api from '@/config/api';
import exceptionList from '@/config/exceptionList';
import popupCollection from './popupCollection';
import popupMore from './popupMore';

export default {
    components: {
        popupCollection,
        popupMore,
        promotion: () => import(/* webpackChunkName: 'promotion' */'./promotion'),
        popupPromotion: () => import(/* webpackChunkName: 'popupPromotion' */'./popupPromotion')
    },
    data() {
        return {
            popup: '',
            recentList: [],
            sort: ['deposit', 'collection', 'home', 'promotion', 'more']
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            collectionStatus: 'getCollectionStatus',
            mobileInfo: 'getMobileInfo',
            webInfo: 'getWebInfo'
        }),
        pageName() {
            return this.$route.name;
        },
        mOfferData() {
            if (!this.mobileInfo.mOffer) {
                return [];
            }

            return this.mobileInfo.mOffer.data.filter((obj) => obj.isOpen === '1');
        },
        // 特例判斷
        isException() {
            const { wonderCasino, knightCasino } = exceptionList;
            return wonderCasino.concat(knightCasino).includes(this.webInfo.alias);
        },
        // 是否為日本站特例且無優惠活動連結
        japanException() {
            return this.mOfferData.length === 0 && exceptionList.wonderCasino.includes(this.webInfo.alias);
        },
        isWonderCasino() {
            const { wonderCasino } = exceptionList;
            return wonderCasino.includes(this.webInfo.alias);
        },
        isKnightCasino() {
            const { knightCasino } = exceptionList;
            return knightCasino.includes(this.webInfo.alias);
        }
    },
    watch: {
        $route() {
            this.popup = '';
            this.actionSetCollectionStatus(false);
        }
    },
    created() {
        if (this.isKnightCasino) {
            this.sort = ['deposit', 'collection', 'promotion', 'home', 'more'];
        }
    },
    methods: {
        ...mapActions([
            'actionSetFavoriteGame',
            'actionSetCollectionStatus'
        ]),
        togglePopup(type = '') {
            this.popup = type;

            if (type === 'collection') {
                if (this.loginStatus) {
                    ajax({
                        method: 'get',
                        url: `${api.API_GET_RECENT_GAME}`
                    }).then((response) => {
                        this.recentList = response.ret;
                        this.actionSetCollectionStatus(true);
                    });
                    return;
                }
            }
            this.actionSetCollectionStatus(true);
        }
    }
};
</script>

<style src="../../css/footer/mFooter.scss" lang="scss" scoped></style>
