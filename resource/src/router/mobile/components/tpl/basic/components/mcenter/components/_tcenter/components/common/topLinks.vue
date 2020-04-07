<template>
    <div class="top-link clearfix">
        <router-link
            v-for="(info, index) in links"
            :key="`top-link-${index}`"
            :to="info.path"
        >
            {{ $t(info.text) }}
        </router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            links: [
                { name: 'commission', text: 'S_MY_COMMISSION', path: '/mobile/mcenter/tcenter/commission' },
                { name: 'management', text: 'S_TEAM_MANAGEMENT', path: '/mobile/mcenter/tcenter/management' },
                { name: 'gameRecord', text: 'S_GAME_RECORD', path: '/mobile/mcenter/tcenter/gameRecord' }
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
@import '~@/css/variable.scss';

.top-link {
    a {
        float: left;
        width: 33.333%;
        line-height: 14px;
        padding: 1% 0;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #363C5D;
        background-color: #363C5D;
        color: #9EA5C5;
        font-size: 14px;
        text-align: center;

        &.router-link-active {
            color: #E2C8A0;
            border-bottom-color: #E2C8A0;
        }
    }
}

@media screen and (min-width: $phone) {
    .top-link {
        a {
            line-height: 16px;
            border-bottom-width: 4px;
            font-size: 16px;
        }
    }
}

@media screen and (min-width: $pad) {
    .top-link {
        a {
            line-height: 20px;
            border-bottom-width: 6px;
            font-size: 20px;
        }
    }
}
</style>
