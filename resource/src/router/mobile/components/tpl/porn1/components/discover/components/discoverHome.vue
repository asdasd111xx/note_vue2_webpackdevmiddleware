<template>
    <div class="discover-home-wrap">
        <div
            v-for="info in list"
            :key="info.key"
            :class="$style.list"
            @click="onClick(info.key)"
        >
            <div :class="$style.wrap">
                <img
                    :class="$style['discover-icon']"
                    :src="$getCdnPath(`/static/image/mobile/tpl/porn1/home/${info.icon}.png`)"
                />
                <span>{{ info.name }}</span>
                <icon name="chevron-right" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        list() {
            return [
                {
                    key: 'sponsor',
                    name: this.$text('S_SPONSOR', '赞助'),
                    icon: 'sponsor'
                },
                {
                    key: 'rank',
                    name: this.$text('S_RANK', '排行'),
                    icon: 'homepage'
                },
                {
                    key: 'artist',
                    name: this.$text('S_ARTIST', '女优'),
                    icon: 'homepage'
                },
                {
                    key: 'tag',
                    name: this.$text('S_TAG', '标签'),
                    icon: 'homepage'
                },
                {
                    key: 'agent',
                    name: this.$text('S_AGENT_GROUP_DOMESTIC', '国内代理群'),
                    icon: 'agent'
                },
                {
                    key: 'cooperation',
                    name: this.$text('S_COOPERATION_GROUP_FOREIGN', '国外合作群'),
                    icon: 'cooperation'
                }
            ];
        }
    },
    methods: {
        onClick(key) {
            if (key === 'agent') {
                window.open('https://lynnconway.me/yaboxxx', '_blank');
                return;
            }

            if (key === 'cooperation') {
                window.open('https://t.me/yaboxxxxx', '_blank');
                return;
            }

            this.$router.push({ name: 'discover', params: { page: key } });
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.list {
    padding-left: 13%;
    background-color: #232735;
    border-bottom: 1px solid #34353B;

    &:first-child {
        margin-bottom: 23px;
    }

    &:nth-child(4) {
        margin-bottom: 23px;
    }

    &:active {
        background: #2C3247;

        span,
        svg {
            color: #E4C6A6;
        }
    }
}

.wrap {
    position: relative;
    height: 60px;
    line-height: 59px;
    color: #FFF;

    .discover-icon {
        position: relative;
        top: 7px;
        margin-right: 15px;
        width: 24px;
        height: 24px;
    }

    > svg {
        display: block;
        position: absolute;
        top: 22px;
        right: 15px;
    }

    > span {
        font-size: 18px;
    }
}

@media screen and (min-width: $pad) {
    .wrap {
        > span {
            font-size: 20px;
        }
    }
}
</style>
