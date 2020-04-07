<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>联系我们</h3>
            <p>在线客服</p>
            <p>
                7*24 在线客服
                <a
                    :class="$style['link2']"
                    href="#"
                    @click.prevent="onService"
                >
                    在线客服
                </a>
            </p>
            <p>我们尽心尽责的客服人员将全天24小时为您提供咨询和帮助。</p>
            <p :class="$style['paragraph-item-subtitle']">Skype</p>
            <p>
                wsdailibu@gmail.com
            </p>
            <p :class="$style['paragraph-item-subtitle']">客服QQ</p>
            <p>
                951533777、
                951392777
            </p>
            <p :class="$style['paragraph-item-subtitle']">优惠邮箱</p>
            <p>
                ws617com@gmail.com
            </p>
            <p :class="$style['paragraph-item-subtitle']">帮助</p>
            <p>
                wsdailibu@gmail.com
            </p>
            <p :class="$style['paragraph-item-subtitle']">投诉建议</p>
            <p>
                wsdailibu@gmail.com
            </p>
            <!-- <p :class="$style['contact-methods']">合营计划联系方式</p>
            <p>QQ：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;515387777</p>
            <p>Skype：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wsdailibu@gmail.com</p>
            <p>Sugram：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wsdailibu@gmail.com</p> -->
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
        font-size: 24px;
        font-weight: 700;
        color: #647C85;
    }

    p {
        margin: 8px 0 0;
        line-height: 22px;
        text-align: justify;
        font-size: 12px;
        color: #647C85;
    }

    .paragraph-item-indent {
        text-indent: 28px;
    }

    .paragraph-item-subtitle {
        color: #C39E51;
    }

    .contact-methods {
        margin-top: 30px;
        color: #C39E51;
    }

    .link2 {
        text-decoration: underline;
        color: #0000FF;
    }
}
</style>
