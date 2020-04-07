<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>1. 选择什么样的浏览器才能获得威尼斯人贵宾厅最佳的投注体验？</h3>
            <p :class="$style['paragraph-browser']">
                <a
                    :class="$style['link']"
                    href="https://browser.360.cn/se/"
                    target="_blank"
                >
                    360极速浏览器
                </a>
                （使用Chrome内核，支持国内银行转账）<br />
                <a
                    :class="$style['link']"
                    href="https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads"
                    target="_blank"
                >
                    IE11或以上版本</a><br />
                <a
                    :class="$style['link']"
                    href="https://www.google.cn/intl/zh-CN/chrome/"
                    target="_blank"
                >
                    谷歌Chrome
                </a>
                <br />
                <a
                    :class="$style['link']"
                    href="https://www.firefox.com.cn/"
                    target="_blank"
                >
                    火狐Firefox
                </a>
            </p>
            <p>如果您使用的是手持移动设备，我们强烈建议您通过手机自带浏览器进行访问。</p>
            <p>
                如果您使用的并非以上浏览器且在访问威尼斯人贵宾厅遇到问题，我们建议您点击以上链接安装最新版本的浏览器。如果还由于浏览器访问出现问题，
                请您联系我们 24*7<a :class="$style['link2']" href="#"> 在线客服</a>获取帮助。
            </p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>2：为什么使用版本较低的浏览器会导致投注体验下降和账号不安全？</h3>
            <p>首先，IE6或其他低版本浏览器效率极低，很多比较新颖和动画效果都无法实现加载，导致用户阅读和游戏时效果极差；</p>
            <p>其次，低版本浏览器安全性较低，黑客很容易利用其进行病毒或木马植入，从而导致你的投注体验和资金受到极大威胁。</p>
            <p>因此，我们强烈建议您将浏览器升级到最新版本，以此来获得威尼斯人贵宾厅带来最好的游戏体验和优质服务。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>3. 我是否需要任何程式或浏览器插件来运行网站？</h3>
            <p>我们网站是不需要通过额外插件进行浏览。不过，一些互动的信息和帮助，例如我们的娱乐场和真人荷官可能需要Flash 播放器才能正常显示。点击这里安装Flash播放器 插件：浏览器插件是一个添加在浏览器中句有特定功能或服务的软件。一些常见的插件有Java、Flash播放器、Adobe Acrobat、QuickTime和Microsoft Silverlightt。</p>
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

    .paragraph-browser {
        line-height: 34px;
        margin-bottom: -8px;
    }

    .link {
        text-decoration: underline;
        color: #5A9BB3;
    }

    .link2 {
        text-decoration: underline;
        color: #0000FF;
    }
}
</style>
