<template>
    <div class="popup-wrap">
        <div class="popup-tab">
            <div class="tab recent">
                <span
                    :class="[{ 'is-active': curTab === 'recent' }]"
                    @click="onTabClick('recent')"
                >
                    <img v-show="curTab === 'recent'" :src="$getCdnPath('/static/image/mobile/footer/icon_played_h.png')" />
                    <img v-show="curTab !== 'recent'" :src="$getCdnPath('/static/image/mobile/footer/icon_played_n.png')" />
                    &nbsp;{{ $t('S_PLAYED') }}
                </span>
            </div>
            <div class="tab favorite">
                <span
                    :class="[{ 'is-active': curTab === 'favorite' }]"
                    @click="onTabClick('favorite')"
                >
                    <img v-show="curTab === 'favorite'" :src="$getCdnPath('/static/image/mobile/footer/icon_love_h.png')" />
                    <img v-show="curTab !== 'favorite'" :src="$getCdnPath('/static/image/mobile/footer/icon_love_n.png')" />
                    &nbsp;{{ $t('S_FAVORITE') }}
                </span>
            </div>
            <img
                :src="$getCdnPath('/static/image/mobile/footer/btn_close.png')"
                class="popup-close"
                @click="$emit('togglePopup')"
            />
        </div>
        <div class="popup-content">
            <div v-if="!loginStatus" class="tip">
                {{ getTip }}
                <div class="tip-link">
                    <router-link tag="a" to="/mobile/joinmember">{{ $t('S_JOIN_NOW') }}</router-link>
                </div>
            </div>
            <collection-content
                v-if="loginStatus && hasCollectionContent"
                :recent-list="recentList"
                :cur-tab="curTab"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import collectionContent from './collectionContent';

export default {
    components: {
        collectionContent
    },
    props: {
        popup: {
            type: String,
            required: true
        },
        recentList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            curTab: 'recent'
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            collectionStatus: 'getCollectionStatus'
        }),
        getTip() {
            return this.curTab === 'recent' ? this.$t('S_SEE_RECENT_TIP') : this.$t('S_SEE_FAVORITE_TIP');
        },
        hasCollectionContent() {
            return this.collectionStatus && this.curTab !== '';
        }
    },
    methods: {
        ...mapActions([
            'actionSetFavoriteGame'
        ]),
        onTabClick(tabName) {
            if (this.loginStatus && tabName === 'favorite') {
                this.actionSetFavoriteGame().then(() => {
                    this.curTab = tabName;
                });
                return;
            }
            this.curTab = tabName;
        }
    }
};
</script>

<style src="../../css/footer/popupCollection.scss" lang="scss" scoped></style>
