<template>
    <div :class="$style['hall-view-wrap']">
        <div v-if="hallTab === 'home'" :class="$style['hall-title-wrap']">
            <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/home/icon_play.png')" />
            <div :class="$style.title">{{ $text(hallInfo.name) }}</div>
        </div>
        <div :class="[$style['hall-list-wrap'], 'clearfix']">
            <hall-view-item
                v-for="(info, index) in list"
                :key="index"
                :is-odd="isOdd"
                :is-single="isSingle"
                :index="index"
                :info="info"
                :hall-tab="hallTab"
            />
        </div>
        <template v-if="hasMore">
            <div
                v-if="hallTab === 'home'"
                :class="$style['btn-more']"
                @click="isMore = !isMore"
            >
                {{ isMore ? $text('S_CLOSE02', '收合') : $text('S_MORE', '更多') }}
            </div>
        </template>
    </div>
</template>

<script>
import hallViewItem from './hallViewItem';

export default {
    components: {
        hallViewItem
    },
    props: {
        hallInfo: {
            type: Object,
            required: true
        },
        hallTab: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isSingle: false,
            isMore: false
        };
    },
    computed: {
        // 顯示的平台列表
        list() {
            if (this.hasMore && !this.isMore && this.hallTab === 'home') {
                return this.hallInfo.list.slice(0, 4);
            }

            return this.hallInfo.list;
        },
        // 遊戲平台數量是否為奇數
        isOdd() {
            return this.list.length % 2 === 1;
        },
        // 是否顯示更多按鈕
        hasMore() {
            return this.hallInfo.list.length > 4;
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.hall-view-wrap {
    margin-bottom: 20px;
    padding-top: 10px;
}

.hall-title-wrap {
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

.hall-list-wrap {
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
