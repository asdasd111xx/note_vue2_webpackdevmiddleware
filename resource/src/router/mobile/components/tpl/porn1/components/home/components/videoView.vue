<template>
    <div :class="$style['video-view-wrap']">
        <div :class="[$style['video-title-wrap'], 'clearfix']">
            <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/home/icon_play.png')" />
            <div :class="$style.title">{{ videoInfo.name }}</div>
            <div
                :class="{ [$style['is-single']]: isSingle, [$style['is-multiple']]: !isSingle }"
                @click="isSingle = !isSingle"
            >
                <template v-if="isSingle">{{ $text('S_ONE_ROW', '单列') }}</template>
                <template v-else>{{ $text('S_DOUBLE_ROW', '双列') }}</template>
            </div>
        </div>
        <div :class="[$style['video-list-wrap'], 'clearfix']">
            <video-view-item
                v-for="info in videoInfo.list"
                :key="info.id"
                :is-single="isSingle"
                :info="info"
            />
        </div>
        <div :class="$style['btn-more']" @click="$router.push({ name: 'videoList', query: { tagId: videoTab.id, sortId: sortId } })">{{ $text('S_MORE', '更多') }}</div>
    </div>
</template>

<script>
import videoViewItem from './videoViewItem';

export default {
    components: {
        videoViewItem
    },
    props: {
        videoInfo: {
            type: Object,
            required: true
        },
        videoTab: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isSingle: false
        };
    },
    computed: {
        sortId() {
            return this.videoInfo.id || 0;
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.video-view-wrap {
    padding-top: 10px;
}

.video-title-wrap {
    position: relative;
    height: 18px;
    padding: 0 60px 0 40px;

    > img {
        display: block;
        position: absolute;
        top: 0;
        left: 15px;
        width: 18px;
        height: 18px;
    }
}

.title {
    line-height: 18px;
    color: #FFF;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 2px;
}

.btn-column {
    position: absolute;
    top: 0;
    right: 15px;
    width: 45px;
    height: 18px;
    line-height: 18px;
    padding-left: 18px;
    background-position: 0 50%;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    color: #FACE15;
    font-weight: 500;
    font-size: 12px;
}

.is-multiple {
    composes: btn-column;
    background-image: url('/static/image/mobile/tpl/porn1/home/icon_double.png');
}

.is-single {
    composes: btn-column;
    background-image: url('/static/image/mobile/tpl/porn1/home/icon_single.png');
}

.video-list-wrap {
    margin-top: 10px;
}

.btn-more {
    height: 40px;
    line-height: 40px;
    margin: 15px 5%;
    background-color: #161823;
    color: #FACE15;
    font-weight: 500;
    font-size: 13px;
    text-align: center;
}

@media screen and (min-width: $phone) {
    .btn-more {
        font-size: 14px;
    }
}

@media screen and (min-width: $pad) {
    .title {
        font-size: 18px;
    }

    .btn-more {
        font-size: 16px;
    }
}
</style>
