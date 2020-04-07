<template>
    <div>
        <slot :has-old="hasOld" :on-submit="onSubmit" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
    props: {
        oldValue: {
            type: Array,
            required: true
        },
        newValue: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        hasOld() {
            return !!this.memInfo.user.has_withdraw_password;
        }
    },
    methods: {
        ...mapActions(['actionSetUserdata']),
        onSubmit() {
            const oldPw = this.oldValue.join('');
            const newPw = this.newValue.join('');
            const result = {
                status: false,
                msg: ''
            };

            if (this.hasOld && oldPw.length < 4) {
                result.msg = this.$text('S_OLD_PW_NOT_COMPLETE');
                return Promise.resolve(result);
            }

            if (newPw.length < 4) {
                result.msg = this.$text('S_NEW_PW_NOT_COMPLETE');
                return Promise.resolve(result);
            }

            return mcenter.accountWdPassword({
                params: {
                    old_password: oldPw,
                    new_password: newPw
                },
                success: () => {
                    this.actionSetUserdata(true);
                    result.status = true;
                    result.msg = this.$text('S_EDIT_SUCCESS');
                }
            }).then(() => result).catch(() => result);
        }
    }
};
</script>
