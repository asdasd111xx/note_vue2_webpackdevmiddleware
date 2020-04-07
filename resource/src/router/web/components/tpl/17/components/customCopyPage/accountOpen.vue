<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>怎么注册账号？</h3>
            <p>点击网站右上角“注册”的功能键</p>
            <p>（1）请注意用户名由4-12个字符任意以字母或数字组成，密码长度至少为6-12个字符（A-Z,a-z,0-9）并请将密码严格保密。</p>
            <p>
                （2）注册前请确保您已满18周岁并已阅读过我们
                <a
                    :class="$style['link']"
                    href="#"
                    @click.prevent="$router.push(`/page/${ webInfo.alias === '500000' ? '30795' : webInfo.alias === '48' ? '10477' : '10509' }`)"
                >
                    规则与条款
                </a>
                。
            </p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>忘记用户名怎么办？</h3>
            <p>
                忘记会员账户名您可以及时联系我们的在线客服，7x24小时为您提供必要的协助。
                <a
                    :class="$style['link2']"
                    href="#"
                    @click.prevent="onService"
                >
                    在线客服
                </a>
            </p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>忘记密码怎么办？</h3>
            <p>在登陆页面点击“忘记密码”按键。填写账户名，身份验证，设置新密码，完成。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>如何更改个人资料信息？</h3>
            <p>客户成功注册后，可以在个人中心基本资料里面修改个人资料。有何疑问可以点击咨询在线客服。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>允许我在威尼斯人贵宾厅投注吗？</h3>
            <p>
                在浏览和体验本站前，请确保您已年满18岁并同意我们的
                <a
                    :class="$style['link']"
                    href="#"
                    @click.prevent="$router.push(`/page/${ webInfo.alias === '500000' ? '30795' : webInfo.alias === '48' ? '10477' : '10509' }`)"
                >
                    规则与条款
                </a>
                。不同的国家有不同的监管条例，投注前请遵循当地法规与法律。若因上述原因造成的任何损失，威尼斯人贵宾厅官方概不负责。
            </p>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            onlineService: 'getOnlineService',
            webInfo: 'getWebInfo'
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

    .link {
        text-decoration: underline;
        color: #5A9BB3;
    }

    .link2 {
        text-decoration: underline;
        color: #0000FF;
    }
}
</style>
