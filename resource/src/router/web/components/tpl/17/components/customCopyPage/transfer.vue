<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>如何转帐</h3>
            <p>登录威尼斯人贵宾厅账号——财务中心——转账</p>
            <img :src="$getCdnPath('/static/image/tpl/17/copywriting/transfer01.png')" />
        </div>
        <div :class="$style['paragraph-item']">
            <h3>转账常见问题</h3>
            <p>1. 为什么游戏账户里有钱，却提不了款？您需要先将资金从游戏钱包转至中心钱包后才能进行提款操作。</p>
            <p>
                2. 转账没有成功，但是钱却没了怎么办？转账时请先退出游戏平台再操作。如转账掉单，请联系
                <a
                    :class="$style['link2']"
                    href="#"
                    @click.prevent="onService"
                >
                    在线客服
                </a>
                查询补单。
            </p>
            <p>3. 免转钱包说明</p>
            <p>转账页面新增免转钱包开关：</p>
            <img :src="$getCdnPath('/static/image/tpl/17/copywriting/transfer02.jpg')" />
            <p>当您打开【普通模式】按钮后，手动选择场馆，输入转入金额，即可转账成功。</p>
            <p>当您打开【免转模式】按钮后，进入某场馆时，中心钱包的金额自动带入到对应的游戏场馆中。</p>
            <p>开启免转模式后，当您进入取款页面时，会自动回收所有场馆的余额，直接进行取款申请的操作即可，若因网络原因造成场馆的余额没有及时回收到中心钱包，点击页面上方【一键回收】按钮即可进行二次回收场馆余额。</p>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            onlineService: 'getOnlineService'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        onService() {
            if (!this.onlineService.url) {
                return;
            }

            this.actionChangePage({ page: 'service', type: 'static' });
        }
    }
};
</script>

<style lang="scss" module>
.paragraph-item {
    margin: 33px 0 60px;

    h3 {
        line-height: 1;
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        color: #C39E51;
    }

    p {
        margin: 8px 0 0;
        line-height: 22px;
        text-align: justify;
        font-size: 12px;
        color: #647C85;
    }

    img {
        display: block;
    }
}
</style>
