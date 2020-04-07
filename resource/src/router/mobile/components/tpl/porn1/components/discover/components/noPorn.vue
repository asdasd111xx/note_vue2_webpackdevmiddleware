<template>
    <div :class="$style['no-porn-wrap']">
        <img :class="$style['no-porn-img']" src="/static/image/mobile/tpl/porn1/noporn/no_porn.png" />
        <span :class="$style['no-porn-title']">{{ $text('S_PORN_CLOSE_TIP', '目前关闭中，预开启色站请点击按钮') }}</span>
        <template v-if="memInfo.config.content_rating">
            <div :class="$style['porn-open-btn']" @click="openPorn">{{ $text('S_OPEN_PORN', '开启色站') }}</div>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        ...mapActions([
            'actionSetUserdata'
        ]),
        openPorn() {
            mcenter.accountDataSet({
                params: {
                    content_rating: 1
                },
                success: () => {
                    this.actionSetUserdata();
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.no-porn-wrap {
    text-align: center;
}

.no-porn-img {
    display: block;
    width: 192px;
    margin: 68px auto 26px;
}

.no-porn-title {
    color: #FFF;
}

.porn-open-btn {
    display: block;
    width: 226px;
    height: 38px;
    line-height: 38px;
    margin: 32px auto 0;
    border-radius: 6px;
    background: #f9e859;
}

@media screen and (min-width: $phone) {
    .no-porn-title {
        font-size: 16px;
    }

    .porn-open-btn {
        font-size: 15px;
    }
}

@media screen and (min-width: $pad) {
    .no-porn-title {
        font-size: 18px;
    }

    .porn-open-btn {
        font-size: 16px;
    }
}
</style>
