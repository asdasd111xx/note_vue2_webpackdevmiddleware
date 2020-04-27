<template>
    <mobile-container
        :header-config="headerConfig"
        :has-footer="false"
        :class="$style.container"
    >
        <div slot="content" class="content-wrap">
            <depsoit />
        </div>
    </mobile-container>
</template>

<script>
import depsoit from '@/router/mobile/components/common/mcenter/theme1/deposit';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
    components: {
        depsoit,
        mobileContainer
    },
    computed: {
        headerConfig() {
            return {
                prev: true,
                title: '充值',
                depositHelp: true,
                onClick: () => {
                    this.$router.back();
                },
                customEvent: () => { // 暫時阻擋的彈窗
                    if (document.getElementById('deposit-pop')) {
                        return;
                    }

                    const pop = document.createElement('div');
                    pop.innerHTML = '正在上线 敬请期待';
                    pop.setAttribute('class', `${this.$style['pop-message']}`);
                    pop.setAttribute('id', 'deposit-pop');
                    document.querySelector('body').appendChild(pop);

                    setTimeout(() => {
                        document.querySelector('body').removeChild(pop);
                    }, 3000);
                }
            };
        }
    }
};
</script>

<style lang="scss" module>
.container {
    position: relative;
    background-color: #F8F8F7;

    .content-wrap {
        border-top: 1px solid #EEE;
    }
}

.pop-message {
    width: 140px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
    font-size: 12px;
    color: #FFF;
    background: #5E626D;
    border-radius: 3px;
}
</style>
