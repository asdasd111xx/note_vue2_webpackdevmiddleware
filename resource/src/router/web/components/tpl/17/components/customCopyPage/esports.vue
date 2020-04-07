<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>赛事没有完成怎么办？</h3>
            <p>如果比赛没有完成（例如：队员退赛、取消资格或游戏服务器的问题）所有该赛事的投注将被视为无效</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>队伍/选手名字出现错误怎么办？</h3>
            <p>如果填写运动队/选手名字时出现拼写错误，所有投注仍会有效</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>并非使用本队人员进行比赛怎么办？</h3>
            <p>如一个队伍或者两个队伍有较少队员进行比赛，所有的投注视为有效。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>赛事提前开赛怎么办？</h3>
            <p>如赛事在原定比赛前提前开始，在赛事开始后的所有注单视为无效</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>投注类型</h3>
            <p>如赛事在原定比赛前提前开始，在赛事开始后的所有注单视为无效</p>
            <p :class="$style['paragraph-item-indent']">独赢盘： 预测谁将会赢得这场比赛，任何形式的加时或补时将予以计算在内。</p>
            <p :class="$style['paragraph-item-indent']">让分盘： 电子竞技比赛的让分可以是轮/赛局或根据比赛不同选择其他的计量方式。</p>
            <p>例如：</p>
            <table
                :class="$style['table-data']"
                cellpadding="0"
                cellspacing="0"
            >
                <tbody>
                    <tr>
                        <td>选手A</td>
                        <td>-1.5</td>
                        <td>2.00</td>
                    </tr>
                    <tr>
                        <td>选手B</td>
                        <td>+1.5</td>
                        <td>1.85</td>
                    </tr>
                </tbody>
            </table>
            <p>如果选手A赢比赛两赛局或以上，则投注选手A的玩家胜出，投注选手B的玩家落败。如果选手A只多赢了一局或选手B获胜，则投注选手B的玩家胜出，投注选手A的玩家落败。</p>
            <p>大/小盘：</p>
            <p :class="$style['paragraph-item-indent']">预测在比赛中的总地图数/回合数是否大于或小于盘口数，任何形式的额外时间或加时赛均计算在内。</p>
            <p>特别投注类型</p>
            <p :class="$style['paragraph-item-indent']">第一座防御塔：第一个被毁掉一座防御塔的队伍在该投注中落败</p>
            <p :class="$style['paragraph-item-indent']">第一滴血：宣布在游戏中获得“第一滴血”的队伍是该项投注中的胜出者。</p>
            <p :class="$style['paragraph-item-indent']">第一个获得10杀：在游戏中的计分板中首先得到10杀的队伍是该项投注中的胜出者。</p>
            <p :class="$style['paragraph-item-indent']">第一轮：赢得第一轮的队伍是该项投注中的胜出者。</p>
            <p :class="$style['paragraph-item-indent']">第一个赢得前5轮：赢得前5轮的队伍是该项投注中的胜出者。</p>
            <p :class="$style['paragraph-item-indent']">持续时间：地图比赛总持续时间，根据游戏内的计时器</p>
            <p :class="$style['paragraph-item-indent']">配对最高死亡数/击杀数：获得死亡次数/击杀数最高的玩家</p>
            <p :class="$style['paragraph-item-indent']">GODLIKE会出现：任何队员的杀人数达到9个</p>
            <p :class="$style['paragraph-item-indent']">信使被击杀：任何信使被其中一个队伍击杀</p>
            <p :class="$style['paragraph-item-indent']">第一回合赢家（手枪局）：一个地图中第一回合赢家（手枪局）</p>
            <p :class="$style['paragraph-item-indent']">第十六回合赢家（手枪局）：一个地图中第十六回合赢家（手枪局</p>
            <p :class="$style['paragraph-item-indent']">首个男爵击杀：最先杀死第一个男爵的队伍</p>
            <p :class="$style['paragraph-item-indent']">首个小龙击杀：最先杀死第一个小龙的队伍</p>
            <p :class="$style['paragraph-item-indent']">首个罗山击杀：最先杀死第一个罗山的队伍</p>
            <p :class="$style['paragraph-item-indent']">摧毁首个防御塔：最先摧毁对方防御塔的队伍，包括对方队伍自毁防御塔</p>
            <p :class="$style['paragraph-item-indent']">摧毁首个炮塔：最先摧毁对方炮塔的队伍</p>
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
    }
}
</style>
