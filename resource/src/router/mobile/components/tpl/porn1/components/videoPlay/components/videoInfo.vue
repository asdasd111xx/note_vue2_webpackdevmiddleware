<template>
    <div :class="$style['video-info-wrap']">
        <div :class="[$style['video-tab-wrap'], 'clearfix']">
            <div
                v-for="tab in tabs"
                :key="`tab-${tab.key}`"
                :class="[$style.tab, { [$style.active]: tab.key === active }]"
            >
                <div :class="$style.wrap" @click="active = tab.key">
                    <div :class="$style['tab-name']">{{ tab.name }}</div>
                    <div :class="$style['tab-line']" />
                </div>
            </div>
        </div>
        <div :class="$style['title-wrap']">
            <div :class="[$style.title, { [$style.active]: isOneLine }]">
                {{ videoInfo.title }}
                <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/video/arrow.png')" @click="isOneLine = !isOneLine" />
            </div>
        </div>
        <div :class="[$style['info-wrap'], 'clearfix']">
            <div :class="$style['icon-play']" />
            <div :class="$style['info-text']">{{ videoInfo.views }}</div>
            <div :class="$style['info-text']">{{ videoInfo.created_at }}</div>
        </div>
        <div :class="$style['info-text']">{{ videoInfo.desc }}</div>
        <div :class="$style.line" />
        <video-tag :tag="videoInfo.tag" />
    </div>
</template>

<script>
import videoTag from './videoTag';

export default {
    components: {
        videoTag
    },
    props: {
        videoInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            active: 0,
            isOneLine: true
        };
    },
    computed: {
        tabs() {
            return [{ key: 0, name: '簡介' }];
        }
    }
};
</script>

<style lang="scss" module>
.video-info-wrap {
    padding: 15px 15px 0;
    overflow-x: hidden;
}

.video-tab-wrap {
    margin-bottom: 20px;
}

.tab {
    float: left;
    width: 25%;
    text-align: center;
}

.active {
    .tab-name {
        color: #FFF;
    }

    .tab-line {
        display: block;
    }
}

.wrap {
    display: inline-block;
    position: relative;
}

.tab-name {
    height: 30px;
    line-height: 30px;
    color: #8B8C91;
    font-weight: 500;
    font-size: 15px;
}

.tab-line {
    display: none;
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 100%;
    height: 2px;
    border-radius: 1px;
    background-color: #FACE15;
}

.title-wrap {
    margin-bottom: 6px;
}

.title {
    line-height: 20px;
    color: #FFF;
    font-weight: 500;
    font-size: 14px;
    padding-right: 20px;
    position: relative;

    img {
        display: block;
        width: 10px;
        height: 7px;
        position: absolute;
        right: 0;
        top: 10px;
    }

    &.active {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        img {
            transform: rotate(180deg);
        }
    }
}

.info-wrap {
    margin-bottom: 6px;

    > div {
        float: left;
        height: 15px;
    }

    .info-text {
        margin-right: 20px;
    }
}

.icon-play {
    width: 15px;
    margin-right: 3px;
    background: url('/static/image/mobile/tpl/porn1/video/icon_play.png') 0 0 no-repeat;
    background-size: 100%;
}

.info-text {
    line-height: 15px;
    color: #8B8C91;
    font-weight: 500;
    font-size: 12px;
}

.line {
    height: 2px;
    margin-top: 25px;
    background-color: #FFF;
}
</style>
