<template>
    <div :class="$style['url-list-wrap']" @click.self="$emit('close', false)">
        <div :class="$style.wrap">
            <div :class="$style.content">
                <div :class="$style['title-wrap']">
                    <div :class="$style.title">{{ $text('S_HONOR_CHANNEL','尊榮通道') }}</div>
                    <div :class="$style['icon-close']" @click.stop="$emit('close', false)">
                        <icon name="times" />
                    </div>
                </div>
                <div :class="$style.tips">{{ $text('S_LONG_PRESS_URL_TO_COPY','长按网址即可复制') }}</div>
                <div :class="$style['url-list']">
                    <div :class="$style['url-title']">{{ $text('S_DEDICATED_URL','专属网址') }}</div>
                    <table>
                        <tbody>
                            <tr
                                v-for="(url, index) in urlList"
                                :key="index"
                                @click="onCopyAll(index)"
                            >
                                <td>
                                    <span>{{ index + 1 }}&nbsp;</span>
                                    <span>{{ url }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div :class="$style['btn-copy']" @click="onCopyAll(null)">{{ $text('S_COPY_ALL','全部复制') }}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        urlList: {
            type: Array,
            default: () => {}
        }
    },
    methods: {
        onCopyAll(singleIndex = null) {
            let allUrl = this.urlList.reduce((init, url) => {
                if (!init) {
                    return url;
                }

                return `${init}\n${url}`;
            }, '');

            if (singleIndex !== null) {
                allUrl = this.urlList[singleIndex];
            }

            this.$copyText(allUrl);
            alert(this.$text('S_COPY_SUCCESSFUL', '复制成功'));
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.url-list-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 200;
    background-color: #000;
}

.wrap {
    position: absolute;
    top: 0;
    right: 0;
    width: 85%;
    max-width: 480px;
    height: 100%;
    background-color: #FFF;
}

.content {
    position: relative;
    height: 100%;
}

.title-wrap {
    position: relative;
    height: 48px;
    line-height: 48px;
    padding: 0 37px 0 20px;
    background-color: #69A1E8;
}

.title {
    color: #FFF;
    font-weight: bold;
    font-size: 16px;
}

.icon-close {
    position: absolute;
    top: 17px;
    right: 20px;
    width: 14px;
    height: 14px;
    color: #FFF;

    > svg {
        display: block;
        width: 14px;
        height: 14px;
    }
}

.tips {
    line-height: 18px;
    margin: 11px 20px 0;
    color: #363D5D;
    font-weight: bold;
    font-size: 18px;
}

.url-list {
    overflow: auto;
    height: calc(100% - 48px - 18px - 11px - 34px - 30px);
    margin: 0 20px;

    > table {
        width: 100%;
        border-spacing: 5px;

        > tbody {
            td {
                height: 45px;
                padding: 0 11px;
                border-radius: 5px;
                background-color: #FAFAFA;
                color: #666;
                font-size: 12px;
                white-space: nowrap;
            }
        }
    }
}

.url-title {
    height: 45px;
    line-height: 45px;
    margin-bottom: 5px;
    color: #2A2A2A;
    font-weight: bold;
    font-size: 12px;
    text-align: center;
}

.btn-copy {
    width: 105px;
    height: 34px;
    line-height: 34px;
    margin: 15px auto;
    border-radius: 17px;
    background-color: #A1A1A1;
    color: #FFF;
    font-size: 12px;
    text-align: center;
}

@media screen and (min-width: $pad) {
    .title-wrap {
        height: 82px;
        line-height: 82px;
        padding: 0 60px 0 32px;
    }

    .title {
        font-size: 25px;
    }


    .icon-close {
        top: 30px;
        right: 32px;
        width: 23px;
        height: 23px;

        > svg {
            width: 23px;
            height: 23px;
        }
    }

    .tips {
        line-height: 26px;
        margin: 20px 32px 0;
        font-size: 26px;
    }

    .url-list {
        height: calc(100% - 82px - 26px - 20px - 56px - 30px);
        margin: 0 32px;

        > table {
            border-spacing: 10px;

            > tbody {
                td {
                    height: 70px;
                    padding: 0 20px;
                    font-size: 16px;
                }
            }
        }
    }

    .url-title {
        height: 70px;
        line-height: 70px;
        margin-bottom: 10px;
        font-size: 20px;
    }

    .btn-copy {
        width: 165px;
        height: 56px;
        line-height: 56px;
        border-radius: 28px;
        font-size: 16px;
    }
}
</style>
