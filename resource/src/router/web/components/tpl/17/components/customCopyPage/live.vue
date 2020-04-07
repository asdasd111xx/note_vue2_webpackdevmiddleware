<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>百家乐介绍</h3>
            <p>百家乐是一种简单的纸牌游戏，庄闲各首发两张手牌。双方最多三张牌，玩家可押注于【庄】或【闲】，点数最接近9点的一方即获胜，也可押注【和】局（即庄家和闲家的牌总点数相同）。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>百家乐牌面</h3>
            <p>公仔牌（J、Q、K）和10计算为0点，A是1点，其他牌按面值计算点数，每手牌的点值按照牌面总和的最后一位数字计算，比如，一手牌为K、9、9，点值为8（0+9+9=18）。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>投注类型及赔付</h3>
            <p>1. 庄家赢: 1赔0.95</p>
            <p>2. 闲家赢: 1赔1</p>
            <p>3. 和局: 1赔8</p>
            <p>百家乐第三张牌规则</p>
            <p>百家乐的第三张牌规则是用来决定庄家和闲家什么时候补第三张牌，规则如下：</p>
            <table
                :class="$style['table-data']"
                cellpadding="0"
                cellspacing="0"
            >
                <tbody>
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
        <div :class="$style['paragraph-item']">
            <h3>2：什么是轮盘？</h3>
            <p>轮盘游戏是由一个小球在轮盘上面旋转，共有37个数字小方格，从0至36。在投注时间结束后，小球会停在其中一个小方格内。轮盘的目的是预测小球会停留在哪一个小方格，猜对了您就赢了。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>3：什么是骰宝？</h3>
            <p>这个游戏是将三颗骰子置于骰盅里。当所有投注确定之后，由荷官摇动骰盅。玩家需要做的是预测这个游戏的结果。这个游戏有许多不同的投注类型，最大投注类型的赔率为1:180。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>4:什么是21点？</h3>
            <p>1.黑杰克，又称为二十一点，是世界上最受欢迎的一种桌面游戏。黑杰克是一个庄家和玩家共同参与竞技的纸牌游戏，是指玩家和庄家对比点数，而玩家和其他玩家将不会做任何的对比。黑杰克使用除大小王之外的52张牌（一副或更多副）。游戏的目标是使用手中的牌点数之和不超过21点且尽量最大。</p>
            <p>2.黑杰克前身就是二十一点，游戏的起源地并没有统一说法。起初二十一点在美国并不流行，因此赌场试着提供各种额外的奖金吸引玩家参与牌局。其中之一的额外奖金是当玩家手中同时拥有黑桃A和黑色J（黑桃J或梅花J都可以）时，奖金将会变成10倍。这样的牌被称为“黑杰克”，而这个名字就渐渐称为二十一点游戏的名称，即使后来这项额外奖金规则停止，“黑杰克”名称还是继续存在。规则发展到今日，黑杰克指的是任何一个A加上一个十或者公仔牌组成的组合。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>5:在轮盘中，当出现的结果是0是怎么计算？</h3>
            <p>0不是黑色红色、大小，也不是单双；一旦结果出现0，所有的投注都为输，只有投注在0或包括0才为赢。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>6:骰宝中游戏结果出现围骰怎么计算？</h3>
            <p>当游戏结果出现围骰，投注（大／小 ）或（单／双）项目均作为输计算。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>7:视讯百家乐游戏会用多少副牌？</h3>
            <p>视讯百家乐都是由8副牌组成的。</p>
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

.paragraph-item-indent {
    padding-left: 15px;
}

.table-data {
    width: 70%;
    border: 1px;

    td {
            height: 40px;
            line-height: 40px;
            text-align: center;
            border: 1px solid #DCDCDC;
            white-space: nowrap;
    }
}
</style>
