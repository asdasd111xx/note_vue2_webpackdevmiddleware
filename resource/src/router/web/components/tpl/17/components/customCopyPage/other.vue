<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>娱乐场包含哪些游戏类型</h3>
            <p :class="$style['paragraph-item-indent']">娱乐场内容丰富齐全，包括有经典老虎机、3D老虎机、桌面游戏、视频扑克和其它游戏。</p>
            <p :class="$style['paragraph-item-indent']">3D老虎机以无限的创意和完整的故事情节为依据，将玩家的游戏过程以故事的形式将其完美呈现，在十足逼真的3D动画效果的配合下，每一个游戏都显得动感华丽。</p>
            <p :class="$style['paragraph-item-indent']">经典老虎机是依据真实赌场里的老虎机而设计，游戏图案经典、极具代表性，尤其是3轴老虎机绝对是每个赌场里最受欢迎的老虎机。</p>
            <p :class="$style['paragraph-item-indent']">桌面游戏更贴近真实赌场中的真人游戏，其中包括花样繁多的二十一点、百家乐、德州扑克等各式扑克游戏。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>游戏出错或有纠纷的情况下我该怎么办</h3>
            <p>
                请您通过
                <a
                    :class="$style['link2']"
                    href="#"
                    @click.prevent="onService"
                >
                    在线客服
                </a>
                或者发送邮件到 help@yabotiyu.net , 联系我们的客服人员，并提供以下信息：
            </p>
            <p>1.您的威尼斯人贵宾厅账号。</p>
            <p>2.游戏详情，包括：游戏名称、投注编号、金额、时间。</p>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            onlineService: 'getOnlineService'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        onService() {
            if (!this.onlineService.url) {
                return;
            }

            this.actionChangePage({ page: 'service', type: 'static' });
        }
    }
};
</script>

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
        text-decoration: underline;
        color: #0000FF;
    }
}
</style>
