<template>
    <div class="sponsor">
        <div class="sponsor-container">
            <div class="sponsor-logo clearfix">
                <div class="sponsor-logo-img1">
                    <img :src="$getCdnPath('/static/image/tpl/16/sponsor/south-logo1.png')" />
                </div>
                <div class="sponsor-logo-img2">
                    <img :src="$getCdnPath('/static/image/tpl/16/sponsor/south-logo2.png')" />
                </div>
            </div>
            <div class="sponsor-main clearfix">
                <div class="sponsor-photo">
                    <img :src="$getCdnPath('/static/image/tpl/16/sponsor/south-photo1.png')" />
                    <img :src="$getCdnPath('/static/image/tpl/16/sponsor/south-photo2.png')" />
                    <img :src="$getCdnPath('/static/image/tpl/16/sponsor/south-photo3.png')" />
                </div>
                <div class="sponsor-introduction">
                    <video
                        class="sponsor-video"
                        src="/static/image/tpl/16/sponsor/south-video.mp4"
                        poster="/static/image/tpl/16/sponsor/south-video-img.jpg"
                        controls
                    >
                        您的浏览器不支持 video 标签。
                    </video>
                    <div class="sponsor-text">
                        2019年5月，乐动体育成为南安普顿未来三年一线队及各级梯队球衣胸前广告赞助商。这是俱乐部134年历史上金额最高，规模最大的赞助合同。
                        <br /> <br />
                        乐动体育是一个全新的集体育内容、营销和娱乐为一体的专业体育媒体与球迷平台，今夏我们将面对中国市场全面开放。在未来三个赛季，
                        乐动体育会出现在球队主客场球衣胸前陪球队征战各项赛事。除了为乐动体育提供胸前广告位外，南安还将与我们在中国一同建立和发展品牌形象。
                        <br /> <br />
                        南安普顿足球俱乐部和南安中国将与乐动体育展开全方位的合作，为中国球迷带来更多丰富的资讯、活动与福利。乐动体育坚信将与南安一起各
                        自攀上领域巅峰，这将是一段美好的旅程。
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
    background: url('/static/image/tpl/16/sponsor/south-bg.png') #FFF no-repeat center top;
}

.sponsor-container {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 50px;
    border-bottom: 3px solid #D0021B;
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
