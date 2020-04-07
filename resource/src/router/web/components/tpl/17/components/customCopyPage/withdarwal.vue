<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>如何提款</h3>
            <p>登录威尼斯人贵宾厅账号——资金管理——提款</p>
            <img :src="$getCdnPath('/static/image/tpl/17/copywriting/withdarwal01.png')" />>
            <p>1. 第一次提款请先绑定提款卡，绑定提款卡步骤：登录威尼斯人贵宾厅账号——资金管理——银行卡——添加提款银行卡</p>
            <p>2. 绑定完成后在提款处申请提款；</p>
        </div>
        <div :class="$style['paragraph-item2']">
            <h3>提款常见问题</h3>
            <p>1.提款密码忘记了怎么办？</p>
            <p>
                如忘记提款密码，请及时联系
                <a
                    :class="$style['link2']"
                    href="#"
                    @click.prevent="onService"
                >
                    在线客服
                </a>
                团队寻求协助
            </p>
            <p>2.可以使用别人的银行卡进行提款吗？</p>
            <p>为了确保客户的账户资金安全，提款需要使用游戏账号本人的银行卡才可以进行提款哦，且提款银行卡姓名必须与注册姓名一致。</p>
        </div>
        <div :class="$style['paragraph-item2']">
            <h3>申请提款需要注意些什么？</h3>
            <p>1. 提款绑定的银行卡姓名需与游戏账户的注册姓名一致。</p>
            <p>2. 提款绑定的银行卡信息需要正确。</p>
            <p>3. 若您未申请任何红利优惠，投注满一倍流水即可申请提款。</p>
            <p>4. 若申请首存红利，则需要满足优惠活动写明的有效投注额要求。</p>
            <p>5. 全天24小时都可进行提款申请。</p>
        </div>
        <div :class="$style['paragraph-item2']">
            <h3>游戏账户里有钱为什么无法提款？</h3>
            <p>您需要先将资金从游戏平台转至中心账户后才能进行提款操作。</p>
        </div>
        <div :class="$style['paragraph-item2']">
            <h3>可以绑定多张银行卡吗？</h3>
            <p>会员账户可以绑定多张银行卡进行提款操作，在账户中心选择“银行卡管理”，进行新增添加即可。</p>
        </div>
        <div :class="$style['paragraph-item2']">
            <h3>提款为什么还需要审核？</h3>
            <p>提款审核是相关部门在给您办理出款之前的一个简单的核实步骤，是为了确保客户资金安全，所以需要核实相关信息。</p>
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
.paragraph-item,
.paragraph-item2 {
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

    .link2 {
        text-decoration: underline;
        color: #0000FF;
    }
}

.paragraph-item2 {
    margin-top: 60px;
}
</style>
