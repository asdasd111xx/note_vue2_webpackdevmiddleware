<template>
    <div :class="[$style['device-wrap'], colorClass]">
        <mcenter-header :header-setting="headerSetting" />
        <bindingDevice>
            <template scope="{ deviceList, enterEdit, setNewName, deviceNameEdit, deviceBindDelete }">
                <div :class="$style['title-wrap']">
                    <span v-if="deviceList.length" :class="$style.title">{{ $text('S_IS_BINDING_GESTURE') }}</span>
                    <span v-else :class="$style.title">{{ $text('S_IS_NOT_BINDING') }}</span>
                </div>
                <table
                    v-for="(item, index) in deviceList"
                    :key="`device-${index}`"
                    :class="$style['device-table']"
                >
                    <tr :class="{ [$style['isEdit']]:item.isModify }">
                        <td :class="$style['td-title']">
                            {{ $text('S_DEVICE_NAME') }}
                        </td>
                        <td :class="$style['td-value']">
                            <template v-if="!item.isModify">
                                <span :class="$style['text-name']">{{ item.name }}</span>
                                <span :class="$style['btn-edit']" @click="enterEdit(index)">
                                    <icon
                                        name="edit"
                                        width="10"
                                        height="10"
                                    />
                                </span>
                            </template>
                            <template v-else>
                                <input
                                    :class="$style['input-name']"
                                    :value="item.name"
                                    type="text"
                                    maxlength="24"
                                    @input="e => setNewName(index, e.target.value)"
                                />
                                <div :class="$style['btn-wrap']">
                                    <span :class="$style['btn-cancel']" @click="enterEdit(index)" />
                                    <span :class="$style['btn-confirm']" @click="deviceNameEdit(index)" />
                                </div>
                            </template>
                        </td>
                        <td
                            :class="$style['td-delete']"
                            rowspan="3"
                            @click="onRemove(index, deviceBindDelete)"
                        >
                            <div :class="$style['btn-delete']">
                                <icon
                                    name="regular/trash-alt"
                                    width="25"
                                    height="25"
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td :class="$style['td-title']">{{ $text('S_SYSTEM') }}</td>
                        <td :class="$style['td-value']">{{ item.os }}</td>
                    </tr>
                    <tr>
                        <td :class="$style['td-title']">{{ $text('S_BRAND') }}</td>
                        <td :class="$style['td-value']">{{ item.brand }}</td>
                    </tr>
                </table>
            </template>
        </bindingDevice>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mcenterHeader from '@/router/mobile/components/common/mcenter/theme1/header';
import bindingDevice from '@/components/common/mcenter/bindingDevice';

export default {
    components: {
        mcenterHeader,
        bindingDevice
    },
    data() {
        return {
            headerSetting: {
                title: this.$text('S_BINDING_DEVICE', '绑定装置管理'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile/mcenter')
                },
                balance: true
            }
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo'
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    methods: {
        onRemove(index, onDelete) {
            if (window.confirm(this.$text('S_CONFIRM_DELETE', '确认删除'))) {
                onDelete(index);
            }
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module></style>
