<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>关于我们</h3>
            <p :class="$style['paragraph-item-indent']">威尼斯人贵宾厅，是与亚洲最大的博彩软件供应商“BBIN”合作，共同打造高质量游戏平台，目前拥有哥斯达黎加合法注册之博彩公司，菲律宾政府博彩委员会（PAGCOR）颁发的合法执照，是受国际博彩协会认可的合法博彩公司。我们一切博彩营业行为皆遵政府博彩条约，一直以来我们秉承用户至上的原则，务实经营的理念，聚集优秀的高素质人才资源与业界高质量精英团队合作，致力于打造体育精品，竭诚为每一位用户奉献全方位的极致体验和高端的游戏享受。</p>
            <p :class="$style['paragraph-item-indent']">体育博彩拥有顶级的盘房操盘，提高完整赛事，丰富玩法给热爱体育的玩家。真人视讯游戏拥有经国际赌场专业训练的荷官，以高科技的网络直播技术，带给玩家身历赌场的刺激经验! 各式彩票游戏，是依官方赛果产生游戏结果，让玩家在活泼的投注界面，享受最公正的娱乐，并不断的开发高质量的娱乐新品。</p>
            <p :class="$style['paragraph-item-indent']">全年365天，威尼斯人贵宾厅每一天与您同在，为您提供7x24小时全天候咨询服务。同时我们拥有经验丰富，水平一流的科技团队，为网站的安全稳定保驾护航，为产品与服务的创新提供源源不断的动力。</p>
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
