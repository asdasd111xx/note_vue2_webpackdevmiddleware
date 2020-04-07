<template>
    <div class="header-nav-left clearfix">
        <div
            v-for="(item, index) in navlist"
            :key="`nav-item-${index}`"
            class="nav-left-item"
        >
            <span class="nav-left-text">{{ item.title }}</span>
            <div class="content-wrap">
                <div class="content-down">
                    <div class="animate-component">
                        <div class="container-view clearfix">
                            <slot :name="item.value" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            gameData: 'getGameData'
        }),
        navlist() {
            const data = [
                {
                    title: this.$text('S_MILLER_SPORTS_SHORT', '必博体育'),
                    value: 'sport'
                },
                {
                    title: this.$text('S_ESPORTS_SHORT', '电竞'),
                    value: 'E-sports'
                },
                {
                    title: this.$text('S_LIVE', '真人娱乐'),
                    value: 'live'
                },
                // {
                //     title: this.$text('S_CARD', '棋牌游戏'),
                //     value: 'chess'
                // },
                {
                    title: this.$text('S_LOTTERY_SHORT', '彩票'),
                    value: 'lottery'
                },
                {
                    title: this.$text('S_ELECTRONICS_FISHING', '电子·捕鱼'),
                    value: 'slots'
                }
            ];

            return data.filter(
                (nav) => Object.keys(this.gameData).some(
                    (vendor) => this.gameData[vendor].switch === 'Y' && this.gameData[vendor].category === nav.value
                )
            );
        }
    }
};
</script>

<style lang="scss" scoped>
.header-nav-left {
    float: left;
    width: 610px;
    height: 95px;

    @media (max-width: 1600px) {
        width: 500px;
    }
}

.nav-left-item {
    float: left;
    width: 100px;

    &:hover {
        .content-wrap {
            height: 320px;
            box-shadow: 0 6px 8px 4px rgba(0,0,0,.2);
        }

        .animate-component {
            height: 100%;
            animation-fill-mode: both;
            animation-name: fadeInUp;
            animation-duration: 0.3s;
        }
    }

    &:first-child {
        .nav-right-text{
            &:after {
                display: none;
            }
        }
    }
}

.nav-left-text  {
    display: inline-block;
    width: 100%;
    height: 95px;
    line-height: 95px;
    text-align: center;
    position: relative;
    color: #000;
    font-size: 15px;
    cursor: pointer;
    transition: 0.3s;

    &:after, &:before {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        position: absolute;
        left: 50%;
        margin-left: -7px;
        -webkit-transition: all .3s;
        -o-transition: all .3s;
        transition: all .3s;
        opacity: 0;
    }

    &:after {
        border-width: 10px 7px 0;
        border-color: #fff transparent transparent;
        top: 0;
    }

    &:before {
        bottom: 0;
        border-width: 0 7px 10px;
        border-color: transparent transparent #fff;
    }

    &:hover {
        &:after, &:before {
            opacity: 1;
        }
    }
}

.content-wrap {
    width: 100%;
    height: 0;
    background: url('/static/image/tpl/customizeHome/53/drop-bg03.png') #1A1C2A;
    position: absolute;
    z-index: 55;
    left: 0;
    transition: 0.3s;
    overflow: hidden;
    margin: 5px 0 0 0;
}

.content-container {
    width: 1160px;
    height: 100%;
    margin: 0 auto;
}

.container-view {
    width: 100%;
    height: 100%;

    img {
        display: block;
        max-width: 100%;
    }
}

.content-down {
    width: 1220px;
    height: 100%;
    margin: 0 auto;
}
</style>
