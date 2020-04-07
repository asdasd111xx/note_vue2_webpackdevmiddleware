<template>
    <div :class="[{ [$style['tab-fixed']]: hallTab !== 'home' }, 'clearfix']">
        <div
            v-for="info in hallList"
            :key="info.kind"
            :class="$style.tab"
            @click="setTab(info.vendor)"
        >
            <div :class="[$style.wrap, { [$style.active]: info.vendor === hallTab }]">
                <span>{{ $text(info.name) }}</span>
                <div />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        hallList: {
            type: Array,
            required: true
        },
        hallTab: {
            type: String,
            required: true
        }
    },
    methods: {
        setTab(vendor) {
            this.$emit('update:hallTab', vendor);
            this.$router.push({ query: { type: vendor } });
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.tab {
    float: left;
    width: 16.666%;
    text-align: center;
}

.tab-fixed {
    width: 100%;
    height: 44px;
    position: fixed;
    top: 43px;
    left: 0;
    z-index: 2;
    background: #0E1213;
}

.wrap {
    position: relative;
    display: inline-block;
    line-height: 44px;
    color: #BCBDC1;
    font-size: 15px;
    text-align: center;

    &.active {
        color: #FACE15;

        > div {
            display: block;
        }
    }

    > div {
        display: none;
        position: absolute;
        bottom: 4px;
        left: 0;
        width: 100%;
        height: 2px;
        border-radius: 1px;
        background-color: #FACE15;
    }
}

@media screen and (min-width: $phone) {
    .wrap {
        font-size: 16px;
    }
}

@media screen and (min-width: $pad) {
    .wrap {
        font-size: 18px;
    }
}
</style>
