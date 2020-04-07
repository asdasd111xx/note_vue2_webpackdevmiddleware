<template>
    <div :class="$style.tutorial">
        <div :class="$style['main-title']">体育投注教程</div>
        <div :class="$style.content">
            <div :class="$style['sub-title']">体育投注教程</div>
            <div :class="$style.wrap">
                <p :class="$style.note">单场投注</p>
                <div :class="$style['wrap-item']">
                    <div :class="$style['wrap-item-content']">
                        <p>1.打开APP登录.可选择滚球、今日、早盘</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport1-01.png') " />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>2.可点击快速盘口区，或点击赛事选择投注项</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport1-02.png') " />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>3.赛事详情投注页，可点击赔率直接投注</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport1-03.png') " />
                    </div>
                </div>
                <div :class="$style['wrap-item']">
                    <div :class="$style['wrap-item-content']">
                        <p>4.输入金额，点击投注即可成功下注</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport1-04.png') " />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>5.投注成功提示</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport1-05.png') " />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>6.可利用追投功能快速加注</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport1-06.png') " />
                    </div>
                </div>
            </div>
            <div :class="$style.wrap">
                <p :class="$style.note">串关投注</p>
                <div :class="$style['wrap-item']">
                    <div :class="$style['wrap-item-content']">
                        <p>1.可在首页点击串关</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport2-01.png') " />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>2.选择不同场赛事赔率+串</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport2-02.png') " />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>3.可点击展开更多串关方式</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport2-03.png') " />
                    </div>
                </div>
                <div :class="$style['wrap-item']">
                    <div :class="$style['wrap-item-content']">
                        <p>4.选择不同串关模式下注</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport2-04.png') " />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>5.输入金额，点击投注即可成功下注串关</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport2-05.png') " />
                    </div>
                    <div :class="$style['wrap-item-content']">
                        <p>6.点击投注，即可完成投注</p>
                        <img :src="$getCdnPath('/static/image/tpl/18/about/sport2-06.png') " />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.tutorial {
    width: 100%;
    background-color: #FFF;
}
.main-title {
    line-height: 36px;
    padding: 13px 40px;
    background: url('/static/image/tpl/18/about/bg01.png') 0 0 no-repeat;
    background-size: 100%;
    color: #000;
    font-size: 25px;
    font-weight: 400;
}
.sub-title {
    line-height: 30px;
    color: #000;
    font-size: 24px;
}
.content {
    padding: 12px 40px 80px;
}

.wrap {
    line-height: 20px;
    margin-top: 23px;
    > p {
        color: #969696;
        font-size: 14px;
        font-weight: 400;
        margin: 20px 0px;
    }
    .note {
        color: rgb(207, 42, 42);
    }
    .wrap-item {
        display: flex;
        margin-bottom: 45px;
        align-items: flex-end;
    }
    .wrap-item-content {
        display: flex;
        flex-direction: column;
        margin-right: 36px;
        > p {
            width: 232px;
        }
    }
}
</style>
