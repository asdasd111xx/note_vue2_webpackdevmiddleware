<template>
    <div
        v-if="isShow"
        :class="className"
        @click="onClick"
    >
        <div :class="$style['image-wrap']">
            <img :src="imageSrc" />
        </div>
        <div v-if="info.kind === 4 && info.vendor === 'allwin' && info.is_game" :class="$style['vendor-title']">
            {{ info.name }}
        </div>
        <div v-else :class="$style['vendor-title']">{{ info.alias }}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import openGame from '@/lib/open_game';

export default {
    props: {
        isOdd: {
            type: Boolean,
            required: true
        },
        isSingle: {
            type: Boolean,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        info: {
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
            isShow: true
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        }),
        className() {
            if (this.isSingle) {
                return this.$style.single;
            }

            // 在雙列模式下若平台數量為奇數則第一張圖100%
            if (this.index === 0 && this.isOdd) {
                return this.$style.single;
            }

            // 雙列模式下判斷當前平台位置是否靠右
            const right = (this.isOdd && this.index % 2 === 0) || (!this.isOdd && this.index % 2 === 1);

            return [this.$style.multiple, { [this.$style.right]: right }];
        },
        imageSrc() {
            const { kind, vendor } = this.info;
            const trans = {
                1: 'sports', 2: 'live', 3: 'casino', 4: 'lottery', 5: 'card', 6: 'mahjong'
            };
            const size = this.className === this.$style.single ? 'long' : 'short';

            if (trans[kind] === 'lottery' && vendor === 'allwin' && this.info.is_game) {
                return this.$getCdnPath(`/static/image/mobile/platform/card/${trans[kind]}/${size}/Game_${this.info.code}.png`);
            }

            if (trans[kind] === 'sports' && (vendor === 'boe' || vendor === 'tgp')) {
                return this.$getCdnPath(`/static/image/mobile/tpl/porn1/home/card/${trans[kind]}/${size}/im_${vendor}.png`);
            }

            return this.$getCdnPath(`/static/image/mobile/platform/card/${trans[kind]}/${size}/${vendor}.png`);
        }
    },
    watch: {
        info() {
            this.isShow = false;
            this.$nextTick(() => {
                this.isShow = true;
            });
        }
    },
    methods: {
        onClick() {
            const { kind, vendor, code } = this.info;

            // 有遊戲大廳的遊戲
            if ([3, 5, 6].includes(kind)) {
                switch (kind) {
                    case 3:
                        this.$router.push(`/mobile/casino/${vendor}`);
                        break;
                    case 5:
                        this.$router.push(`/mobile/card/${vendor}`);
                        break;
                    case 6:
                        this.$router.push(`/mobile/mahjong/${vendor}`);
                        break;
                    default:
                }
                return;
            }

            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            if (kind === 4 && vendor === 'allwin' && this.info.is_game) {
                openGame({ vendor, kind, code });
                return;
            }

            openGame({ vendor, kind });
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.hall-view-item {
    margin-top: 10px;
}

.multiple {
    composes: hall-view-item;
    float: left;
    width: 49%;

    .image-wrap {
        height: 110px;

        > img {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            min-height: 100%;
        }
    }
}

.right {
    margin-left: 2%;
}

.single {
    composes: hall-view-item;
    width: 100%;
}

.image-wrap {
    overflow: hidden;
    position: relative;

    > img {
        display: block;
        width: 100%;
        margin: auto;
    }
}

.vendor-title {
    overflow: hidden;
    height: 20px;
    line-height: 20px;
    padding: 0 8px;
    color: #FFF;
    font-size: 14px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media screen and (min-width: $phone) {
    .vendor-title  {
        font-size: 16px;
    }
}

@media screen and (min-width: $pad) {
    .vendor-title {
        font-size: 18px;
    }
}
</style>
