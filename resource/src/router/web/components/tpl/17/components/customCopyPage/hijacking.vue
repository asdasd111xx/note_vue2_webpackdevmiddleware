<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>电脑端防劫持教程</h3>
            <p>
                连接到WI-FI网络，才能更改设备的DNS设置。<br />
                电脑端推荐：首选DNS服务器 114.114.114.114，备用DNS服务器8.8.8.8
            </p>
            <p><img :src="$getCdnPath('/static/image/tpl/17/copywriting/anti01.png')" /></p>
            <p><img :src="$getCdnPath('/static/image/tpl/17/copywriting/anti02.png')" /></p>
            <p><img :src="$getCdnPath('/static/image/tpl/17/copywriting/anti03.png')" /></p>
            <p><img :src="$getCdnPath('/static/image/tpl/17/copywriting/anti04.png')" /></p>
            <p><img :src="$getCdnPath('/static/image/tpl/17/copywriting/anti05.png')" /></p>
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
        padding-bottom: 30px;
        margin: 8px 0 0;
        line-height: 22px;
        text-align: center;
        font-size: 12px;
        color: #647C85;

        &:nth-child(2) {
            text-align: justify;
        }
    }

    img {
        max-width: 400px;
    }
}
</style>
