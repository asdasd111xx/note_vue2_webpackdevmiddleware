<template>
    <div :class="$style['promotion-cotainer']">
        <div :class="$style['promotion-banner']" />
        <div :class="$style['promotion-content']">
            <ul :class="[$style['promotion-list'], 'clearfix']">
                <li
                    v-for="(item, index) in eventList"
                    :key="index"
                    :class="$style['promotion-item']"
                >
                    <div :class="$style['promotion-item-main']">
                        <div :class="$style['promotion-item-wrap']" @click="clickHandler(item)">
                            <img :src="item.image" />
                            <p :class="$style['promotion-item-text']">
                                {{ item.name }}
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import ajax from '@/lib/ajax';
import { API_PROMOTION_LIST } from '@/config/api';

export default {
    data() {
        return {
            eventList: []
        };
    },
    created() {
        ajax({
            method: 'get',
            url: API_PROMOTION_LIST,
            params: {
                api_uri: '/api/promotion/list'
            },
            errorAlert: false
        }).then((response) => {
            this.eventList = response.ret;
        });
    },
    methods: {
        clickHandler(data) {
            const url = `/api/v1/c/link/customize?code=promotion&client_uri=${data.link}`;
            ajax({
                method: 'get',
                url,
                errorAlert: false,
                success: (response) => {
                    window.open(response.ret.uri);
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.promotion-list,
.promotion-item {
    padding: 0;
    margin: 0;
    list-style: none;
}

.promotion-cotainer {
    position: relative;
    overflow: hidden;
    background: #FFF;
    padding: 300px 0 100px;
}

.promotion-banner {
    position: absolute;
    width: 1920px;
    height: 300px;
    top: 0;
    left: 50%;
    margin-left: -960px;
    background: url('/static/image/tpl/18/promotion/banner.png') 0 0 no-repeat;
    background-size: cover;
}

.promotion-content {
    position: relative;
    width: 1280px;
    margin: -30px auto 0;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
    background: #fff;
    padding: 20px 10px 0;
}

.promotion-list {
    animation: fadeInLeft linear 1s;
}

@-webkit-keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-4%, 0, 0);
    transform: translate3d(-4%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    -webkit-transform: translate3d(-4%, 0, 0);
    transform: translate3d(-4%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

.promotion-item {
    float: left;
    width: calc(100% / 3);
    padding: 0 10px 20px;
}

.promotion-item-main {
    border: 1px solid #E0E2E7;
    text-align: center;
    transition: all ease-in .2s;

    .promotion-item-wrap {
        display: block;
        padding: 0 0 10px;
    }

    img {
        width: 100%;
        height: 220px;
    }

    &:hover {
        box-shadow: 0 9px 10px 0 rgba(0, 0, 0, 0.15);
    }
}

.promotion-item-text {
    color: #333;
}

</style>
