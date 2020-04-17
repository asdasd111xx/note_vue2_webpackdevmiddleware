<template>
    <div :class="[$style['vip-info-wrap']]">
        <div :class="[$style['title']]">{{userVipInfo.now_level_alias}}</div>

        <div :class="[$style['cells-block']]">
            <div :class="[$style['cell']]" v-for="(item, index) in list">
                <div :class="[$style['cell-icon']]">
                    <img :src="$getCdnPath(item.icon)" alt="icon" />
                </div>
                <div :class="[$style['cell-text']]">
                    <div>{{ item.count }}</div>
                    <div>{{ item.content }}</div>
                </div>
            </div>
        </div>

        <div :class="[$style['vip-detail']]">查看VIP详请 》</div>
    </div>
</template>

<script>
export default {
    props: {
        userVipInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            list: [
                {
                    icon: "/static/image/_new/mcenter/vip/pic_vip_1.png",
                    count: "--",
                    content: "每日提现次数"
                },
                {
                    icon: "/static/image/_new/mcenter/vip/pic_vip_2.png",
                    count: "--",
                    content: "每日提现额度"
                },
                {
                    icon: "/static/image/_new/mcenter/vip/pic_vip_3.png",
                    count: this.userVipInfo.now_birth_amount,
                    content: "晋级礼金(晋级自动派发)"
                },
                {
                    icon: "/static/image/_new/mcenter/vip/pic_vip_4.png",
                    count: "--",
                    content: "每日红包(月初自动派发)"
                },
                {
                    icon: "/static/image/_new/mcenter/vip/pic_vip_5.png",
                    count: this.userVipInfo.now_gift_amount,
                    content: "生日礼金"
                }
            ]
        };
    }
};
</script>

<style lang="scss" module>
.vip-info-wrap {
    position: relative;
    width: 100%;
    height: 240px;
    top: 15px;
    padding: 0 17px;
    background: white;
}

.title {
    font-size: 18px;
    padding: 10px 0 15px 0;
    font-weight: 700;
    color: #424654;

    &::before {
        content: "";
        position: relative;
        display: inline-block;
        width: 3px;
        height: 20px;
        top: 2.5px;
        margin-right: 12px;
        background: linear-gradient(#d2bba4, #f1e5db);
    }
}

.cells-block {
    position: relative;
    display: flex;
    width: 103%;
    height: 160px;
    flex-wrap: wrap;

    .cell {
        width: 50%;
        display: flex;
        align-items: center;
    }

    .cell-icon {
        width: 35px;
        height: 35px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .cell-text {
        padding-left: 5px;
        color: #b4b9cf;
        font-size: 12px;
        font-weight: 700;

        div:first-of-type {
            font-size: 16px;
            color: #424654;
        }
    }
}

.vip-detail {
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: #bbab98;
}
</style>
