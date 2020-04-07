<template>
    <div :class="$style.wrap">
        <div :class="$style.title">
            {{ currentDoc.title }}
        </div>
        <div :class="$style['sub-title']">
            {{ currentDoc.subTitle }}
        </div>
        <div :class="$style['tip-wrap']">
            <!-- eslint-disable vue/no-v-html -->
            <div v-html="currentDoc.sp1" />
            <div v-html="currentDoc.sp2" />
            <div v-html="currentDoc.sp3" />
            <div v-html="currentDoc.sp4" />
            <div v-html="currentDoc.sp5" />
            <div v-html="currentDoc.sp6" />
            <!-- eslint-enable vue/no-v-html -->
        </div>
        <v-style>
            <!-- eslint-disable vue/html-indent -->
            .{{ $style.title }} {
                background-image: url({{ $getCdnPath('/static/image/tpl/common/join/brilliant/m_welcome.png') }})
            }
            <!-- eslint-enable vue/html-indent -->
        </v-style>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            doc: {
                'zh-tw': {
                    title: '輝煌貴賓會 527.com 歡迎您的加入！',
                    subTitle: '★我們的優勢★',
                    sp1: `
                        ★新會員專屬<span class="${this.$style.important}">【三重禮包】</span>，
                        <span class="${this.$style['light-height']}"><span class="${this.$style.important}">首存 50 元</span>即送<span class="${this.$style.important}"> 50 元</span></span>
                        ，誠邀您的加入！`,
                    sp2: `
                        ★<span class="${this.$style.important}">【VIP 聚寶盆系統】</span>設注即生錢 永久享收益，
                        <span class="${this.$style.tip1}">普級禮金</span> + <span class="${this.$style.tip1}">週週收入</span> + <span class="${this.$style.tip1}">月月收入</span>！`,
                    sp3: `
                        ★<span class="${this.$style.important}">【最佳電子遊藝投注平台】</span>
                        <span class="${this.$style.tip2}">電"利"十足</span>，十大電子專題優惠同時進行，豐厚彩金等您來拿！`,
                    sp4: `★<span class="${this.$style.important}">【頂級萬人棋牌對戰中心】</span><span class="${this.$style.tip3}">"棋"逢對手</span>，激情五惠，無需申請，系統自動派送，邀您對戰！`,
                    sp5: `★<span class="${this.$style.important}">【全網獨家】</span><span class="${this.$style.tip4}">消除彩金 可申請 5 次</span>，額外加贈 4 次申請機會！`,
                    sp6: `★立即加入輝煌貴賓會 尊享<span class="${this.$style.important}">【月月大返利】</span>坐擁獨特會員帳號價值，更多優惠等著您！`
                },
                'zh-cn': {
                    title: '辉煌贵宾会 527.com 欢迎您的加入！',
                    subTitle: '★我们的优势★',
                    sp1: `
                        ★新会员专属<span class="${this.$style.important}">【三重礼包】</span>，
                        <span class="${this.$style['light-height']}"><span class="${this.$style.important}">首存 50 元</span>即送<span class="${this.$style.important}"> 50 元</span></span>
                        ，诚邀您的加入！`,
                    sp2: `
                        ★<span class="${this.$style.important}">【VIP 聚宝盆系统】</span>投注即生钱 永久享收益，
                        <span class="${this.$style.tip1}">普级礼金</span> + <span class="${this.$style.tip1}">周周收入</span> + <span class="${this.$style.tip1}">月月收入</span>！`,
                    sp3: `
                        ★<span class="${this.$style.important}">【最佳电子游艺投注平台】</span>
                        <span class="${this.$style.tip2}">电"利"十足</span>，十大电子专题优惠同时进行，丰厚彩金等您来拿！`,
                    sp4: `★<span class="${this.$style.important}">【顶级万人棋牌对战中心】</span><span class="${this.$style.tip3}">"棋"逢对手</span>，激情五惠，无需申请，系统自动派送，邀您对战！`,
                    sp5: `★<span class="${this.$style.important}">【全网独家】</span><span class="${this.$style.tip4}">消除彩金 可申请 5 次</span>，额外加赠 4 次申请机会！`,
                    sp6: `★立即加入辉煌贵宾会 尊享<span class="${this.$style.important}">【月月大返利】</span>坐拥独特会员帐号价值，更多优惠等着您！`
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        }),
        currentDoc() {
            if (this.curLang === 'zh-tw') {
                return this.doc[this.curLang];
            }
            return this.doc['zh-cn'];
        }
    }
};
</script>


<style lang="scss" module>
.title {
    position: relative;
    background-position: 0 0;
    background-repeat: no-repeat;
    margin-bottom: 10px;
    padding-left: 60px;
    line-height: 80px;
    max-height: 70px;
    font-size: 24px;
    font-weight: 700;
    overflow: hidden;
    text-indent: 1em;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sub-title {
    margin: 24px 0;
    color: #FFC;
    font-size: 18px;
}

.tip-wrap {
    margin-bottom: 42px;
    font-size: 13px;
    color: #D3D3D3;
}

.important {
    color: #F00;
}

.light-height {
    background-color: #FF0;
    color: #000;
}

.tip1 {
    color: #FFD700;
}

.tip2 {
    color: #0F0;
}

.tip3 {
    color: #0FF;
}

.tip4 {
    color: #F0C;
}
</style>
