<template>
    <div class="normal-page promotion-wrap">
        <div class="nav">
            <button
                :title="$t('S_ALL_PROMOTION')"
                :class="['all-btn', { current: pType === 'all' }]"
                @click="pType = 'all'"
            >
                {{ $t('S_ALL_PROMOTION') }}
            </button>
            <button
                v-if="loginStatus"
                :title="$t('S_SELF_PROMOTION')"
                :class="['all-btn', { current: pType === 'self' }]"
                @click="pType = 'self'"
            >
                {{ $t('S_SELF_PROMOTION') }}
            </button>
        </div>
        <all-promotion
            v-if="pType == 'all'"
            :toggle-popup="togglePopup"
            :set-popup="setPopup"
        />
        <self-promotion
            v-else-if="pType == 'self'"
            :toggle-popup="togglePopup"
            :set-popup="setPopup"
        />
        <popup-content
            v-if="hasPopup"
            :id="pData"
            :toggle-popup="togglePopup"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import allPromotion from './components/allPromotion';
import selfPromotion from './components/selfPromotion';
import popupContent from './components/popupContent';

/**
 * 固定頁 - 優惠活動
 * @module promotion/index
 */
export default {
    components: {
        allPromotion,
        selfPromotion,
        popupContent
    },
    data() {
        return {
            pType: 'all',
            pData: '',
            hasPopup: false
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        })
    },
    methods: {
        togglePopup(show = !this.hasPopup) {
            this.hasPopup = show;
        },
        setPopup(data) {
            this.pData = data;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
