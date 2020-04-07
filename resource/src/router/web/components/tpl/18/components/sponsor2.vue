<template>
    <div class="sponsor">
        <div class="sponsor-container">
            <div class="sponsor-logo clearfix" />
            <div class="sponsor-main clearfix">
                <div class="sponsor-photo">
                    <img :src="$getCdnPath('/static/image/tpl/16/sponsor/spain-photo1.png')" />
                    <img :src="$getCdnPath('/static/image/tpl/16/sponsor/spain-photo2.png')" />
                    <img :src="$getCdnPath('/static/image/tpl/16/sponsor/spain-photo3.png')" />
                </div>
                <div class="sponsor-introduction">
                    <video
                        class="sponsor-video"
                        src="/static/image/tpl/16/sponsor/spain-video.mp4"
                        poster="/static/image/tpl/16/sponsor/spain-video-img.png"
                        controls
                    >
                        您的浏览器不支持 video 标签。
                    </video>
                    <div class="sponsor-text">
                        2019年8月，乐动体育（LD Sports）正式成为巴塞罗那皇家西班牙人足球俱乐部（RCD Español）的新合作伙伴，并作为主赞助商合作至2023年！
                        <br />
                        皇家西班牙人体育俱乐部成立于1900年，是西班牙足球甲级联赛的球队之一，成立以来西班牙人曾赢得四届西班牙国王杯冠军，也曾两次晋级欧洲联
                        盟杯决赛。而乐动体育是专注于体育产业的传播集团，旨在向用户提供专业的体育内容与服务，并已成为最大的亚洲体育内容中心之一。
                        除了签约西班牙人，同年5月，乐动体育也与英超联赛的南安普顿足球俱乐部签约，成为其未来三个赛季的球衣赞助商。
                        <br />
                        作为新合作伙伴，西班牙人俱乐部的球衣也已得到更新,乐动体育的LOGO将出现在西班牙人一线队球衣胸前和训练服的袖子上。同时，在RCDE球场以及
                        俱乐部设施上也会出现乐动体育的标志，并且中国球王武磊将在新赛季身穿7号新球衣为西班牙人征战各项赛事。
                        乐动体育亦在旗下的网络平台开设了西班牙人的独家频道，为中国球迷跟随报道武磊和球队的最新动态。
                        <br />
                        此次合作，乐动体育将接触到全新的观众群体，并建立起与优秀足球群体之间的沟通桥梁。至此，乐动体育将打造一个全新的集体育内容、营销和娱乐于
                        一体的专业体育媒体与球迷平台，并将持续为广大球迷朋友打造高端、一流的投注产品！
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.sponsor {
    display: block;
    min-width: 1400px;
    padding-top: 230px;
    background: url('/static/image/tpl/16/sponsor/spain-banner.png') #FFF no-repeat center top;
}

.sponsor-container {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 90px;
    position: relative;
    &:after {
        display: block;
        width: 100%;
        height: 3px;
        position: absolute;
        bottom: 40px;
        background: #D0021B;
        content: '';
    }
}

.sponsor-logo {
    padding-bottom: 20px;
}

.sponsor-logo-img1 {
    float: left;
    width: 372px;
    margin-right: 30px;
    text-align: right;
}

.sponsor-logo-img2 {
    float: left;

    img {
        margin-top: 123px;
    }
}

.sponsor-photo {
    float: left;
    width: 372px;
    margin-right: 30px;

    img {
        display: block;
        max-width: 100%;
        margin-bottom: 20px;
    }
}

.sponsor-introduction {
    float: left;
    width: 795px;
}

.sponsor-video {
    width: 100%;
}

.sponsor-text {
    font-size: 14px;
    line-height: 28px;
    color: #333;

    &:before {
        display: block;
        width: 50px;
        height: 5px;
        background: #D0021B;
        margin: 10px 0;
        content: '';
    }
}
</style>
