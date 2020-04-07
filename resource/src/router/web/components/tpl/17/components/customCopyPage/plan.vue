<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>合营计划</h3>
            <p>威尼斯人贵宾厅与全球顶尖博彩提供商合作，为大家带来了全新颠覆性博彩产品和极致的用户体验。</p>
            <div :class="$style['plan-img']">
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/plan.png')" />
            </div>
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
}

.plan-img {
    margin-top: 50px;
    text-align: center;
}
</style>
