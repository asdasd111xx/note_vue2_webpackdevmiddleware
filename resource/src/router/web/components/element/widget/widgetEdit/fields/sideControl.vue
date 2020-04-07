<template>
    <div :class="$style['side-control']">
        <div
            :class="`hint--right hint--info hint--rounded ${isLocked ? $style.lock : $style.unlock}`"
            :aria-label="$t('S_LOCK', memInfo.config.lang || 'zh-cn')"
            @click="onLockClick"
        />
        <div
            :class="`hint--right hint--info hint--rounded ${$style.delete}`"
            :aria-label="$t('S_DELETE', memInfo.config.lang || 'zh-cn')"
            @click="onDeleteClick"
        />
        <div
            v-if="presentShow"
            :class="$style['present-status']"
            @click="changePresentStatus"
        >
            <div
                v-if="presentStatus === 'all'"
                :class="`hint--right hint--info hint--rounded ${$style['present-all']}`"
                :aria-label="$t('S_BEFORE_AFTER_LOGIN_PRESENT', memInfo.config.lang || 'zh-cn')"
            />
            <div
                v-else-if="presentStatus === 'logout'"
                :class="`hint--right hint--info hint--rounded ${$style['present-logout']}`"
                :aria-label="$t('S_BEFORE_LOGIN_PRESENT', memInfo.config.lang || 'zh-cn')"
            />
            <div
                v-else-if="presentStatus === 'login'"
                :class="`hint--right hint--info hint--rounded ${$style['present-login']}`"
                :aria-label="$t('S_AFTER_LOGIN_PRESENT', memInfo.config.lang || 'zh-cn')"
            />
        </div>
    </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';

export default {
    props: {
        caseData: {
            type: Array,
            default: () => []
        },
        status: {
            type: Object,
            required: true
        },
        updateIndex: {
            type: Function,
            required: true
        },
        updateCase: {
            type: Function,
            required: true
        },
        widgetRefs: {
            type: [Object, Array],
            required: true
        }
    },
    data() {
        return {
            present: ['all', 'login', 'logout'],
            presentShow: ![
                'formLoginAccount',
                'formLoginPassword',
                'formLoginCaptcha',
                'formLoginCode',
                'formLoginSubmit'
            ].includes(this.caseData[this.status.index].type)
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        isLocked() {
            return this.caseData[this.status.index].draggable === 'N'
                && this.caseData[this.status.index].resizable === 'N';
        },
        presentStatus() {
            return this.caseData[this.status.index].present || this.present[0];
        }
    },
    methods: {
        onLockClick() {
            const cloneData = cloneDeep(this.caseData);
            const bothLock = cloneData[this.status.index].draggable === 'N'
                && cloneData[this.status.index].resizable === 'N';

            // 若其中一個為關閉，則全關
            cloneData[this.status.index].draggable = bothLock ? 'Y' : 'N';
            cloneData[this.status.index].resizable = bothLock ? 'Y' : 'N';
            this.updateCase(cloneData);
        },
        onDeleteClick() {
            this.$swal({
                title: this.$t('S_DELETE_TIPS', this.memInfo.config.lang || 'zh-cn'),
                type: 'warning',
                showCancelButton: true
            }).then((result) => {
                if (result.value) {
                    this.widgetRefs.onDeactivated();
                    this.updateCase(
                        cloneDeep(this.caseData.filter((info, index) => index !== this.status.index))
                    );
                }
            });
        },
        changePresentStatus() {
            let presentIndex;
            const cloneData = cloneDeep(this.caseData);

            // 取得目前狀態 index
            this.present.forEach((value, key) => {
                if (value === this.presentStatus) {
                    if ((key + 1) >= this.present.length) {
                        presentIndex = 0;
                        return;
                    }

                    presentIndex = key + 1;
                }
            });

            // 更新資料
            cloneData[this.status.index].present = this.present[presentIndex];
            this.updateCase(cloneData);
        }
    }
};
</script>

<style lang="scss" module>
.side-control {
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 14px 2px;
    width: 38px;
    border: 1px solid #D5D5D5;
    border-radius: 4px;
}

.icon {
    margin-bottom: 14px;
    width: 100%;
    height: 14px;
    cursor: pointer;

    &:last-child {
        margin-bottom: 0;
    }
}

.unlock {
    composes: icon;
    background: url('/static/image/element/widget/ui/tool_lock.png') 50% 0 no-repeat;
}

.lock {
    composes: unlock;
    background-position: 50% 100%;
}

.delete {
    composes: icon;
    background: url('/static/image/element/widget/ui/tool_trash.png') 50% 0 no-repeat;
}

.present-login {
    composes: icon;
    background: url('/static/image/element/widget/ui/tool_login.png') 50% 0 no-repeat;
}
.present-logout {
    composes: icon;
    background: url('/static/image/element/widget/ui/tool_logout.png') 50% 100% no-repeat;
}
.present-all {
    composes: icon;
    background: url('/static/image/element/widget/ui/tool_both.png') 50% 0 no-repeat;
}
</style>
