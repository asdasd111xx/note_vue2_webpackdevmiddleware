<template>
    <div class="header">
        <div>
            <!-- 左:返回上一頁 -->
            <div
                v-if="headerSetting.left.show"
                class="left"
                @click="onSelect('left_on_back', headerSetting.left.text)"
            >
                <div class="arrow_icon">
                    <img :src="$getCdnPath('/static/image/mobile/tpl/brilliant/header/btn_nav_back_h.png?v=75023915.1')" />
                </div>
                <p v-if="!headerSetting.left.typeOnlyArrow">{{ headerSetting.left.text }}</p>
            </div>
            <!-- 中間:純文字 or 下拉選單 or 遊戲清單 -->
            <div v-if="headerSetting.center.show" class="center">
                <p v-if="headerSetting.center.typeText">{{ headerSetting.center.text }}</p>
                <div v-else-if="headerSetting.center.typeDropdown" class="dropdown">
                    <multiselect
                        id="center_dropdown"
                        v-model="headerSetting.center.list.value"
                        :options="headerSetting.center.list.options"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        @select="onSelect('center_dropdown' ,$event)"
                    />
                </div>
                <div
                    v-else-if="headerSetting.center.typeGameList"
                    class="game-list"
                    @click="() => { setMenuState('gameList'); }"
                >
                    <p>{{ headerSetting.center.text }}</p>
                    <img :src="$getCdnPath('/static/image/mobile/tpl/brilliant/header/btn_header_n.png?v=75511617.1')" />
                </div>
            </div>
            <!-- 中間:遊戲選單 -->
            <div
                v-if="headerSetting.center.typeGameList"
                v-show="currentMenu === 'gameList'"
                ref="game-list-wrap"
                class="game-list-box"
            >
                <top-game-list :is-list-visible.sync="currentMenu" />
            </div>
            <!-- 右:前往next page or 下拉選單 or 啟動xx事件-->
            <div v-if="headerSetting.right.show" class="right">
                <div
                    v-if="headerSetting.right.typeGoNext"
                    class="right-go-next"
                    @click="onSelect('right_go_next', headerSetting.right.text)"
                >
                    <p>{{ headerSetting.right.text }}}</p>
                </div>
                <div v-else-if="headerSetting.right.typeDropdown" class="dropdown">
                    <multiselect
                        id="right_dropdown"
                        v-model="headerSetting.right.list.value"
                        :options="headerSetting.right.list.options"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        @select="onSelect('right_dropdown' ,$event)"
                    />
                </div>
                <div
                    v-else-if="headerSetting.right.typeDoSomething"
                    class="right-do-something"
                    @click="onSelect('right_do_something', headerSetting.right.text)"
                >
                    <p>{{ headerSetting.right.text }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    components: {
        Multiselect,
        topGameList: () => import(/* webpackChunkName: 'topGameList' */'./topGameList')
    },
    props: {
        headerSetting: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            currentMenu: '',
            top: this.hasAppDownload ? 50 : 0
        };
    },
    computed: {
        distance: {
            get() {
                if (this.hasAppDownload) {
                    return this.top;
                }

                window.off('scroll', this.onScroll);
                return 0;
            },
            set(value) {
                this.top = value;
            }
        },
        dotClass() {
            return [
                this.$style['btn-dot'],
                {
                    'is-active': this.currentMenu === 'gameList'
                }
            ];
        },
        pathName() {
            return this.$route.name.split('-');
        }
    },
    mounted() {
        if (!this.hasAppDownload) {
            return;
        }

        window.scroll(this.onScroll);
    },
    beforeDestroy() {
        if (!this.hasAppDownload) {
            return;
        }

        window.off('scroll', this.onScroll);
    },
    methods: {
        onSelect(type) {
            if (type === 'left_on_back') {
                if (this.headerSetting.left.backFuc) {
                    this.headerSetting.left.backFuc();
                    return;
                }

                this.$router.go(-1);
            }
        },
        onScroll() {
            this.distance = 50 - window.scrollTop() > 0 ? 50 - window.scrollTop() : 0;
        },
        // 設定選單狀態
        setMenuState(value) {
            this.currentMenu = (this.currentMenu === value) ? '' : value;
        }
    }
};
</script>
<style lang="scss">
.multiselect__content-wrapper {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255,255,255,.5);
    color: #000;
    width: 150px;
}
.multiselect__content-wrapper li {
    list-style: none;
    padding: 5px 0;
}
.multiselect__content {
    padding: 5px;
    margin: 0;
}
.multiselect.multiselect--active {
    .multiselect__select {
        transform: translateY(-50%) rotate(-90deg);
    }
}
.multiselect__select {
    position: absolute;
    top: 50%;
    right: -18px;
    transform: translateY(-50%) rotate(-90deg);
    width: 15px;
    height: 15px;
    transition: .5s;
    background-image: url('/static/image/mobile/tpl/brilliant/header/btn_nav_back_h.png?v=75023915.1');
    background-repeat: no-repeat;
    background-size: cover;
}
</style>

<style lang="scss" scoped>
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 920;
    background-position: center;
    background-size: cover;
    background-color: #272727;
    &>div {
        font-size: 16px;
        padding: 10px 5%;
        color: #F8F1EB;
        position: relative;
        min-height: 43px;
    }
    .left,.right,.center {
        cursor: pointer;
    }
    .left {
        display: flex;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 5%;
        transform: translateY(-50%);
    }
    .center {
        width: 50%;
        margin: 0 auto;
        text-align: center;
    }
    .right {
        position: absolute;
        top: 50%;
        right: 5%;
        transform: translateY(-50%);
    }
    .left .arrow_icon img{
        width: 24px;
    }
    .dropdown {
        position: relative;
        text-align: center;
    }
    .arrow-icon {
        width: 23px;
        height: 23px;
        transition: .5s;
        img {
            width: 100%;
        }
    }
    .game-list {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 23px;
            height: auto;
        }
        p {
            margin: 0 5px 0 0;
        }
    }
    .game-list-box {
        position: fixed;
        top: 43px;
        left: 0;
        height: 100vh;
        width: 100vw;
        overflow-y: auto;
        background: rgba(0,0,0,.8);
        &>div {
            padding: 30px 0;
            margin-bottom: 30px;
        }
    }
}
</style>
