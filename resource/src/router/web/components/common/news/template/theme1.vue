<template>
    <div :class="{ 'bibet-wrap':isBibetMobile }">
        <marquee
            :direction="direction"
            :scrolldelay="speed"
            :onmouseover="viewFullContent ? 'this.stop()' : ''"
            :onmouseout="viewFullContent ? 'this.start()' : ''"
            class="news-content"
            @click="togglePopup"
        >
            <span v-for="(item, index) in data" :key="index">
                {{ item.content }} &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
        </marquee>
        <div
            v-if="isBibetMobile"
            class="btn-close"
            @click="updateNews('N')"
        >
            <icon name="times" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        data: {
            type: Array,
            required: true
        },
        speed: {
            type: Number,
            required: true
        },
        direction: {
            type: String,
            required: true
        },
        viewFullContent: {
            type: Boolean,
            default: true
        },
        togglePopup: {
            type: Function,
            default: () => {}
        },
        updateNews: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        }),
        isBibetMobile() {
            return window.location.pathname.split('/')[1] === 'mobile' && ['52', '53', '500011'].includes(this.webInfo.alias);
        }
    }
};
</script>

<style lang="scss" scoped>
.news-content {
    display: block;
    cursor: pointer;
    white-space: nowrap;
}

.bibet-wrap {
    position: relative;
    padding-right: 20px;
}

.btn-close {
    position: absolute;
    top: 9px;
    right: -7px;
    width: 12px;
    height: 12px;
    color: #FFF;

    > svg {
        display: block;
    }
}
</style>
