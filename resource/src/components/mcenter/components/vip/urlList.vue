<template>
    <div :class="$style['url-list-wrap']" @click.self="$emit('close', false)">
        <div :class="$style.wrap">
            <div :class="$style.content">
                <div :class="$style.title">
                    <span :class="$style['title-text']">{{ $text('S_HONOR_CHANNEL','尊榮通道') }}</span>
                    <span :class="$style['icon-close']" @click.stop="$emit('close', false)">
                        <icon
                            name="times"
                            width="18"
                            height="18"
                        />
                    </span>
                </div>
                <div :class="$style['url-list-table']">
                    <table>
                        <thead>
                            <tr>
                                <th>{{ $text('S_DEDICATED_URL','专属网址') }}</th>
                                <th>{{ $text('S_COPY','复制') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(url, index) in urlList" :key="index">
                                <td :class="$style['text-field']">{{ index + 1 }}&nbsp;{{ url }}</td>
                                <td :class="$style['icon-field']" @click="onCopy(url)">
                                    <icon
                                        :class="$style['icon-copy']"
                                        name="file"
                                        width="15"
                                        height="20"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div :class="$style['btn-copy']" @click="onCopyAll">{{ $text('S_COPY_ALL','全部复制') }}</div>
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
        onCopy(url) {
            this.$copyText(url);
            alert(this.$text('S_COPY_SUCCESSFUL', '复制成功'));
        },
        onCopyAll() {
            const allUrl = this.urlList.reduce((init, url) => {
                if (!init) {
                    return url;
                }

                return `${init}\n${url}`;
            }, '');

            this.$copyText(allUrl);
            alert(this.$text('S_COPY_SUCCESSFUL', '复制成功'));
        }
    }
};
</script>

<style lang="scss" module>
.url-list-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 51;
    background-color: rgba(0, 0, 0, 0.8);
}

.wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 480px;
    height: 548px;
    margin: auto;
    background-color: #FFF;
}

.content {
    position: relative;
    height: 100%;
}

.title {
    position: relative;
    height: 55px;
    line-height: 55px;
    padding: 0 50px;
    background-color: #69A1E8;
    text-align: center;
}

.title-text {
    color: #FFF;
    font-weight: bold;
    font-size: 20px;
}

.icon-close {
    position: absolute;
    top: 19px;
    right: 30px;
    width: 18px;
    height: 18px;
    color: #FFF;
    cursor: pointer;

    > svg {
        display: block;
    }
}

.url-list-table {
    overflow-y: auto;
    height: 408px;
    margin-top: 20px;

    > table {
        width: 420px;
        margin: 0 auto;
        border-spacing: 2px;

        > thead {
            th {
                height: 40px;
                color: #2A2A2A;
                font-size: 12px;
            }
        }
    }
}

.text-field {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border-radius: 5px 0 0 5px;
    background-color: #FAFAFA;
    color: #666;
    font-size: 13px;

    &:hover {
        background-color: #EEE;
    }
}

.icon-field {
    width: 40px;
    height: 40px;
    padding: 10px 0;
    border-radius: 0 5px 5px 0;
    background-color: #D4D4D4;
    cursor: pointer;

    &:hover {
        background-color: #69A1E8;
    }

    .icon-copy {
        display: block;
        margin: 0 auto;
        color: #FFF;
    }
}

.btn-copy {
    width: 115px;
    height: 35px;
    line-height: 35px;
    margin: 15px auto;
    border-radius: 5px;
    background-color: #A1A1A1;
    color: #FFF;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
}
</style>
