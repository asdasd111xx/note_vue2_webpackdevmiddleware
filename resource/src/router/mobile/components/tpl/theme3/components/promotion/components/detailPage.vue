<template>
    <div class="lightbox">
        <div class="inner-nav">
            <div class="back-icon" @click="$emit('close')">
                <div class="arrow-icon">
                    <img :src="$getCdnPath('/static/image/mobile/tpl/brilliant/header/btn_nav_back_h.png?v=75023915.1')" />
                </div>
                <p>{{ this.$text('S_GO_BACK','返回') }}</p>
            </div>
            <p>{{ this.$text('S_OFFER_DETAILS','优惠详情') }}</p>
        </div>
        <div class="innerbox">
            <div>
                <div class="imgbox">
                    <img :src="$getCdnPath(infoData.src)" />
                </div>
                <div class="textbox">
                    <h5>{{ infoData.title }}</h5>
                    <div v-for="item in infoData.content" :key="item">
                        <label>{{ item.label }}:</label>
                        <div v-if="!item.isTable" class="pbox">
                            <p
                                v-for="ele in item.p"
                                :key="ele"
                            >
                                {{ ele }}
                            </p>
                        </div>
                        <div v-else class="table">
                            <table>
                                <thead>
                                    <th
                                        v-for="th in item.tableData.th"
                                        :key="th"
                                        :width="th.width"
                                    >
                                        {{ th.p }}
                                    </th>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="tr in item.tableData.tr"
                                        :key="tr"
                                    >
                                        <td
                                            v-for="td in tr.td"
                                            :key="td"
                                        >
                                            {{ td }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        infoData: {
            type: Object,
            default: () => ({})
        }
    }
};
</script>

<style lang="scss" scoped>
.lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: #F8F1EB;
    .inner-nav {
        text-align: center;
        font-size: 16px;
        padding: 10px 5%;
        color: #fff;
        background: #393939;
        position: relative;
        .back-icon {
            position: absolute;
            left: 5%;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
        }
        .arrow-icon {
            width: 23px;
            height: 23px;
            transition: .5s;
            img {
                width: 100%;
            }
        }
        p {
            display: inline-block;
        }
    }
    .innerbox {
        width: 100%;
        height: 100%;
        position: relative;
        &>div {
            width: 100%;
            height: calc(100% - 42px);
            overflow-y: auto;
            padding: 15px 20px;
            border-radius: 10px;
        }
    }
    .imgbox {
        margin-bottom: 10px;
        img {
            width: 100%;
        }
    }
    .textbox {
        margin-bottom: 20px;
        h5 {
            font-size: 17px;
            line-height: 23px;
            color: #272727;
        }
        .pbox {
            display: inline-block;
            p {
                margin-bottom: 5px;
            }
        }
        p,label {
            font-size: 13px;
            line-height: 21px;
            color: #5E5450;
            display: inline-block;
            margin: 0;
        }
    }
    // .downloadbox {
    //     display: flex;
    //     justify-content: space-between;
    //     img {
    //         width: 19px;
    //         height: 19px;
    //         margin-right: 5px;
    //     }
    //     a {
    //         background: #9C6E54;
    //         padding: 10px;
    //         display: flex;
    //         align-items: center;
    //         justify-content: center;
    //         width: calc(50% - 7px);
    //         color: #Fff;
    //         font-size: 14px;
    //         line-height: 22px;
    //         border-radius: 10px;
    //     }
    // }
    .table {
        overflow-x: scroll;
        font-size: 13px;
        line-height: 21px;
        table {
            width: 800px;
            border: 1px solid #666;
            text-align: center;
            td,th {
                padding: 5px;
            }
            th:not(:last-child) {
                border-right: 1px solid #666;
            }
            td {
                border-top: 1px solid #666;
                &:not(:last-child) {
                    border-right: 1px solid #666;
                }
            }
        }
    }
}
</style>
