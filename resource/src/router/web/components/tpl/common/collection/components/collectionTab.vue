<template>
    <div class="tab-wrap">
        <div v-if="loginStatus" :class="['tab recent', { 'is-active': collectionStatus && curTab === 'recent' }]">
            <span @click="onTabClick('recent')">
                {{ $t('S_RECENT_GAME') }}
            </span>
            <div v-show="isFetching === 'recent'" class="loading" />
        </div>
        <div v-if="loginStatus" :class="['tab favorite', { 'is-active': collectionStatus && curTab === 'favorite' }]">
            <span @click="onTabClick('favorite')">
                {{ $t('S_FAVORITE') }}
            </span>
            <div v-show="isFetching === 'favorite'" class="loading" />
        </div>
        <div :class="['tab hot', { 'is-active': collectionStatus && curTab === 'hot' }]">
            <span @click="onTabClick('hot')">
                {{ $t('S_HOT') }}
            </span>
            <div v-show="isFetching === 'hot'" class="loading" />
        </div>
        <div class="collapse" @click="onTabClick('collapse')">
            <div :class="['collapse-btn', { 'is-show': collectionStatus }]" />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    props: {
        selfStore: {
            type: Object,
            required: true
        },
        storeMethods: {
            type: Object,
            required: true
        }
    },
    subscriptions() {
        return {
            isFetching: this.selfStore.isFetching$,
            curTab: this.selfStore.curTab$
        };
    },
    computed: {
        ...mapGetters({
            collectionStatus: 'getCollectionStatus',
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        if (!this.loginStatus) {
            this.storeMethods.setCollection('curTab$', 'hot');
        }
    },
    methods: {
        ...mapActions([
            'actionSetFavoriteGame',
            'actionSetCollectionStatus'
        ]),
        onTabClick(type) {
            if (type === 'collapse' && this.collectionStatus) {
                this.actionSetCollectionStatus(false);
                return;
            }

            const targetTab = type === 'collapse' ? this.curTab : type;
            const cb = () => {
                this.actionSetCollectionStatus(true);
                this.storeMethods.setCollection('curTab$', targetTab);
                this.storeMethods.setCollection('isFetching$', '');
                this.storeMethods.setCollection('curVendor$', '');
                this.storeMethods.setCollection('searchText$', '');
            };

            this.storeMethods.setCollection('isFetching$', targetTab);

            if (targetTab === 'recent') {
                this.storeMethods.getRecentList().then(cb);
            }

            if (targetTab === 'favorite') {
                this.actionSetFavoriteGame().then(cb);
            }

            if (targetTab === 'hot') {
                this.storeMethods.getHotGame(800).then(cb);
            }
        }
    }
};
</script>

<style lang="scss" src="../css/collectionTab.scss" scoped></style>
