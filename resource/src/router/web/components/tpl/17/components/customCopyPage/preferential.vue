<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>一：优惠活动如何申请？</h3>
            <p>登陆账号后点击优惠活动页面，选择相应的优惠活动。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>二：返水何时派发？</h3>
            <p>
                返水最迟次日下午(北京时间18:00 pm)前系统自动派发、无需申请，只需一倍流水即可提款（不限游戏平台）。 详情请点击
                <a :class="$style['link2']" href="https://www.yabovip19.com/app/preferentialActivity/0">返水活动详情页</a>
            </p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>三：优惠申请成功后一直没有收到红利或礼品怎么办？</h3>
            <p>如果您的优惠申请成功后没有在指定时间收到礼品，请您可以随时联系在线客服。</p>
        </div>
    </div>
</template>

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

    .link2 {
        color: #0000FF;
    }
}
</style>
