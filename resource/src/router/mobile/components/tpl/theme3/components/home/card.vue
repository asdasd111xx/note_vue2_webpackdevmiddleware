<template>
    <div :class="[$style[size], $style[even], info.vendor === 'tgp' ? $style.tgp : '']" @click="$emit('play', info)">
        <div :class="$style.wrap">
            <!-- 活動中 -->
            <div v-if="info.activity" :class="{ [$style.activity]: info.activity }" />
            <!-- 熱門 -->
            <div v-else-if="info.hot" :class="{ [$style.hot]: info.hot }" />
            <!-- 最新 -->
            <div v-else-if="info.new" :class="{ [$style.new]: info.new }" />
            <!-- 平台圖 -->
            <img :src="$getCdnPath(`/static/image/mobile/tpl/theme3/home/${model}/${type}/${info.vendor}.png`)" />
            <!-- 平台名稱 -->
            <span>{{ info.alias }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        info: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        length: {
            type: Number,
            required: true
        }
    },
    computed: {
        /**
         * 取得圖片尺寸
         * @method size
         * @returns {string} 尺寸
         */
        size() {
            if (this.length < 3) {
                return 'long';
            }

            if (this.index === 0 && this.length % 2 === 1) {
                return 'long';
            }

            return 'short';
        },
        even() {
            let sort = this.index + 1;

            if (this.length % 2 !== 0) {
                sort = this.index;
            }
            if (this.index !== 0 && sort % 2 === 0 && this.length > 3) {
                return 'even';
            }
            return null;
        }
    }
};
</script>

<style lang="scss" module>
.vendor {
    overflow: hidden;
    float: left;
    border: 2px solid #282828;
    border-radius: 4px;
}

.long {
    composes: vendor;
    width: 100%;
    margin-bottom: 4px;

    .wrap {
        padding-top: 39%;

        > img {
            width: 100%;
        }
    }
}

.short {
    composes: vendor;
    width: 49%;
    margin-bottom: 4px;

    .wrap {
        padding-top: 79%;

        > img {
            width: 185%;
        }
    }
}

.tgp {
    composes: vendor;
    width: 100%;
    margin-bottom: 4px;

    .wrap {
        padding-top: 123%;

        > img {
            width: 100%;
        }
    }
}

.wrap {
    position: relative;

    > img {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
    }

    > span {
        position: absolute;
        top: 7px;
        left: 7px;
        display: block;
        color: #FFF;
        font-size: 13px;
    }
}

.status {
    position: absolute;
    bottom: -2px;
    left: -2px;
    width: 30px;
    height: 30px;
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 100%;
}

.activity {
    composes: status;
    background-image: url('/static/image/mobile/tpl/brilliant/home/icon_activity.png');
}

.hot {
    composes: status;
    background-image: url('/static/image/mobile/tpl/brilliant/home/icon_hot.png');
}

.new {
    composes: status;
    background-image: url('/static/image/mobile/tpl/brilliant/home/icon_new.png');
}
.even {
    margin-left: 4px;
}
</style>
