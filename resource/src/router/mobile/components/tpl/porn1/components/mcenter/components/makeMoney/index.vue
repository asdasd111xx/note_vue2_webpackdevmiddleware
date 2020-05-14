<template>
    <mobile-container
        :header-config="headerConfig"
        :has-footer="false"
        :class="$style.container"
    >
        <div slot="content">
            <div
                v-for="item in 6"
                :key="`img${item}`"
                :class="$style['img-wrap']"
            >
                <img :src="`/static/image/_new/mcenter/makeMoney/promotion_${item}.png`" />
                <template v-if="item === 2">
                    <span>{{ agentCode }}</span>
                    <div :class="$style['copy-btn']" @click="copyCode">
                        复制
                    </div>
                </template>
            </div>
            <message v-if="msg" @close="msg = ''">
                <div slot="msg">
                    {{ msg }}
                </div>
            </message>
        </div>
    </mobile-container>
</template>

<script>
import mobileContainer from '../../../common/new/mobileContainer';
import { API_PROMOTION_INFO } from '@/config/api';
import ajax from '@/lib/ajax';
import message from '../../../common/new/message';

export default {
    components: {
        mobileContainer,
        message
    },
    data() {
        return {
            agentCode: '',
            msg: ''
        };
    },
    computed: {
        headerConfig() {
            return {
                prev: true,
                title: '推广赚钱',
                recommendGift: true,
                onClick: () => {
                    this.$router.back();
                }
            };
        }
    },
    created() {
        ajax({
            method: 'get',
            url: API_PROMOTION_INFO,
            success: ({ result, ret }) => {
                if (result !== 'ok') {
                    return;
                }

                this.agentCode = ret.code;
            }
        });
    },
    methods: {
        copyCode() {
            this.$copyText(this.agentCode).then(() => {
                this.msg = '复制成功';
            });
        }
    }
};
</script>

<style lang="scss" module>
.container {
    position: relative;
    background-color: #F8F8F7;
}

.img-wrap {
    position: relative;

    img {
        display: block;
        max-width: 100%;
    }

    span {
        position: absolute;
        bottom: 6vw;
        left: 46%;
        font-weight: 700;
        color: #424654;
    }

    .copy-btn {
        padding: 3px 10px;
        position: absolute;
        bottom: calc(6vw - 3px);
        right: 5%;
        font-weight: 700;
        color: #FFF;
        background: #BD9D7D;
        background-image: -webkit-linear-gradient(top ,#BD9D7D, #F9DDBD);
        background-image: linear-gradient(top ,#BD9D7D, #F9DDBD);
        border-radius: 20px;
    }
}
</style>
