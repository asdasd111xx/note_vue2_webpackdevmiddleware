<template>
    <div :class="$style['real-rules']">
        <div :class="$style['main-title']">真人荷官规则</div>
        <div :class="$style.content">
            <div :class="$style.title">百家乐</div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">简介</div>
                <p>百家乐是一种简单的纸牌游戏，庄闲各首发两张手牌。 双方最多三张牌，玩家可押注于【庄】或【闲】，点数最接近9点的一方即获胜， 也可押注【和】局（即庄家和闲家的牌总点数相同）。</p>
                <p>百家乐牌面</p>
                <p>公仔牌（J、Q、K）和10计算为0点，A是1点，其他牌按面值计算点数， 每手牌的点值按照牌面总和的最后一位数字计算，比如，一手牌为K、9、9，点值为8（0+9+9=18）。</p>
                <div :class="$style['sub-title']">投注类型及赔付</div>
                <p>1. 庄家赢: 1赔0.95</p>
                <p>2. 闲家赢: 1赔1</p>
                <p>3. 和局: 1赔8</p>
                <div :class="$style['sub-title']">百家乐第三张牌规则</div>
                <p>百家乐的第三张牌规则是用来决定庄家和闲家什么时候补第三张牌，规则如下：</p>
                <table :class="$style['rules-table']">
                    <thead>
                        <tr>
                            <td colspan="2">闲家</td>
                            <td colspan="2">庄家</td>
                        </tr>
                        <tr>
                            <td>起手牌点数总和</td>
                            <td>补牌规则</td>
                            <td>起手牌点数总和</td>
                            <td>补牌规则</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>0</td>
                            <td>须补牌</td>
                            <td>0</td>
                            <td>须补牌</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>须补牌</td>
                            <td>1</td>
                            <td>须补牌</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>须补牌</td>
                            <td>2</td>
                            <td>须补牌</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>须补牌</td>
                            <td>3</td>
                            <td>当闲家补得第三张牌是8，不须补牌；其余则须补牌</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>须补牌</td>
                            <td>4</td>
                            <td>当闲家补得第三张牌是0.1.8.9，不须补牌；其余则须补牌</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>须补牌</td>
                            <td>5</td>
                            <td>当闲家补得第三张牌是0.1.2.3.8.9，不须补牌；其余则须补牌</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>不须补牌</td>
                            <td>6</td>
                            <td>当闲家补得第三张牌是0.1.2.3.4.5.8.9，不须补牌；其余则须补牌</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>不须补牌</td>
                            <td>7</td>
                            <td>不须补牌</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td>天生赢家</td>
                            <td>8</td>
                            <td>天生赢家</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td>天生赢家</td>
                            <td>9</td>
                            <td>天生赢家</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div :class="$style.content">
            <div :class="$style.title">轮盘</div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">简介</div>
                <p>轮盘不仅仅是一个简单的娱乐场游戏，它也是一款最有活力的游戏。 今天我们了解的第一种形式的轮盘是在18世纪法国，距今已经有很长的时间。 轮盘的投注方式多样，头头的真人荷官轮盘代表着顶尖的经典娱乐场游戏。 由于这些原因，使轮盘成为在线玩家首选的游戏之一，我们真人娱乐场目标是给玩家提供最好的在线轮盘体验。</p>
                <div :class="$style['sub-title']">如何投注轮盘</div>
                <p>轮盘以转轴为中心，转轴上有数字小方框，数字所组成的队列和组合有着不同的变化。 在适用的情况下，所有数字格也代表红和黑，不包括0的颜色为绿色。轮盘是放置在投注区域的旁边。</p>
                <p>玩家可以选择投注在他们感觉能赢的数字，数字组合或颜色。轮盘的桌面是由一个荷官 （有时跟传统的也可称之为"赌台主持人"）来负责旋转小球和处理投注。玩家可以操作投注直到荷官讲出"无法再投注"。 游戏开始时，荷官转动轮盘，小球会向逆时针方向旋转滚动，最终会停在其中一个小方格内。 然后公布获胜号码，荷官支付给获胜者以及收集所有输的投注。一个新的回合将会在所有注单处理完毕后马上开始。</p>
                <div :class="$style['sub-title']">欧洲轮盘规则</div>
                <p>欧洲轮盘是历史最悠久，最著名一个游戏版本。欧洲轮盘包含37个号码， 从数字1号至36号，颜色为红色和黑色，37个号码中包括绿色的0号。轮盘局部位置上的队列可能随机出现， 但是实际上是根据数学方式安排以确保每个数字都有相同的获胜机会。轮盘的桌面可以进行投注直到荷官宣布"无法再投注"为止。</p>
                <p>1、欧式轮盘上共有37个小方格（0至36）。</p>
                <p>2、轮盘会顺时针转动，在投注时间结束后，小球会向逆时针方向弹出并于轮盘上滚动，最后会停在其中一个小方格内。</p>
                <p>3、游戏目的是预测小球会停留在哪一个颜色，号码或投注号码组合上。</p>
                <p>4、轮盘压注方式有：直接押注号码、两码押注、 竖排三码押注、方形四码押注、二竖排六码押注、十二码押注、直线押注、 红色/黑色押注、奇数/偶数押注和大/小范围押注等。关于押注的方式并没有硬性规定，所以您可以自由选择多种押注。</p>
            </div>
        </div>
        <div :class="$style.content">
            <div :class="$style.title">免佣百家乐</div>
            <div :class="$style.wrap">
                <p>超6百家乐和传统百家乐的赔付方式有一些不同。就像一般的百家乐，也是选择筹码投注在庄家， 闲家或和局。真人荷官将会根据正常百家乐第三张的规则发牌。</p>
                <p>如果您的押中正确的庄家，闲家或和局，您就获胜。闲家1赔1或平局1赔8都是和正常的百家乐派彩一致， 但是庄家的派彩是不同的，一般的百家乐是1赔0.95，而超6百家乐庄家赔付是1赔1，除非庄家以牌面6点胜出，那么赔付的比率为1赔0.5。</p>
            </div>
        </div>
        <div :class="$style.content">
            <div :class="$style.title">骰宝</div>
            <div :class="$style.wrap">
                <p>骰宝，也成为幸运骰子或买大小，骰宝是一种古老的中国骰子游戏。字面意思骰宝是指“珍贵的骰子”， 买大小的意思是“大或小”。游戏是使用三个骰子和一个桌面上投注区域组成，每一个区域代表着不同的骰子结果或组合。</p>
                <p>下注玩法可分为：</p>
                <p>单一数字、两个数字组合、三个数字总和、大或小</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.real-rules {
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

.content {
    padding: 0px 40px 80px;
}

.wrap {
    line-height: 22px;
    font-size: 16px;
    margin-top: 23px;
    > p {
        line-height: 20px;
        color: #969696;
        font-size: 14px;
        font-weight: 400;
        margin: 20px 0px;
    }
}
.title {
    line-height: 30px;
    margin: 12px 0px 23px;
    color: #000;
    font-size: 24px;
    font-weight: 400;
}
.sub-title {
    line-height: 22px;
    color: #333;
    font-size: 16px;
    font-weight: 600;
}
.rules-table {
    width: 100%;
    border-top: 1px solid #9298A2;
    border-left: 1px solid #9298A2;
    border-spacing: 0;
    margin-top: 14px;
    td {
        border-bottom: 1px solid #9298A2;
        border-right: 1px solid #9298A2;
    }
}
</style>
