<template>
    <div :class="$style.wrap">
        <div :class="$style.logo" @click="$router.push('/mobile')" />
        <div :class="$style.content">
            <p>威尼斯人贵宾厅，是与亚洲最大的博彩软件供应商“BBIN”合作，共同打造高质量游戏平台，目前拥有哥斯达黎加合法注册之博彩公司，菲律宾政府博彩委员会（PAGCOR）颁发的合法执照，是受国际博彩协会认可的合法博彩公司。我们一切博彩营业行为皆遵政府博彩条约，一直以来我们秉承用户至上的原则，务实经营的理念，聚集优秀的高素质人才资源与业界高质量精英团队合作，致力于打造体育精品，竭诚为每一位用户奉献全方位的极致体验和高端的游戏享受。</p>
            <p>体育博彩拥有顶级的盘房操盘，提高完整赛事，丰富玩法给热爱体育的玩家。真人视讯游戏拥有经国际赌场专业训练的荷官，以高科技的网络直播技术，带给玩家身历赌场的刺激经验! 各式彩票游戏，是依官方赛果产生游戏结果，让玩家在活泼的投注界面，享受最公正的娱乐，并不断的开发高质量的娱乐新品。</p>
            <p>全年365天，威尼斯人贵宾厅每一天与您同在，为您提供7x24小时全天候咨询服务。同时我们拥有经验丰富，水平一流的科技团队，为网站的安全稳定保驾护航，为产品与服务的创新提供源源不断的动力。</p>
        </div>
    </div>
</template>

<style lang="scss" module>
.wrap {
    height: 100%;
    padding-top: 50px;
    background-image: url('/static/image/mobile/tpl/theme3/login/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
}

.logo {
    text-align: center;
    width: 200px;
    height: 61px;
    margin: 0 auto 25px;
    background-image: url('/static/image/mobile/tpl/theme3/login/logo.png');
    background-size: cover;
}

.content {
    background-color: rgba(0, 0, 0, 0.4);
    margin: 0 auto;
    padding: 1em .5em;
    width: 96%;
    color: #FFF;
    font-size: 16px;
}
</style>
