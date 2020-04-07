<template>
    <div>
        <!-- 會員中心 -->
        <template v-for="(itemData, itemKey) in mcenterItemList">
            <span
                :key="`link-item-${itemKey}`"
                class="link-item mcenter"
                @click="getMcenterPage(itemKey)"
            >
                {{ $t(itemData.text) }}
            </span>
            <span
                v-if="itemData.hasLine"
                :key="`link-item-${itemKey}`"
                class="link-line"
            >|
            </span>
        </template>
        <!-- 登出 -->
        <span class="link-item logout" @click="logout()">
            {{ $text('S_LOGOUT', '登出') }}
        </span>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import member from '@/api/member';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';

export default {
    props: {
        mcenterItemList: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        logout() {
            member.logout({
                success: () => {
                    window.location.reload();
                }
            });
        },
        getMcenterPage(page, firstEnter = false) {
            this.navClicked = true;
            if (page === 'bankRebate') {
                this.actionEnterMCenterThirdPartyLink({ type: 'member', page }).then((pageName) => {
                    if (pageName) {
                        mcenterPageAuthControl(pageName).then((response) => {
                            if (response && response.status) {
                                this.$router.push({ path: `/page/mcenter/${pageName}` });
                                return;
                            }

                            if (firstEnter) {
                                this.$router.push({ path: '/page/mcenter/accountData' });
                            }
                        });
                    }
                });
                return;
            }

            if (page === 'deposit') {
                this.$depositLink(false);
                return;
            }

            if (page === 'withdraw') {
                this.$router.push({ path: `/page/mcenter/${page}` });
                return;
            }

            mcenterPageAuthControl(page).then((response) => {
                if (response && response.status) {
                    this.$router.push({ path: `/page/mcenter/${page}` });
                    return;
                }

                if (firstEnter) {
                    this.$router.push({ path: '/page/mcenter/accountData' });
                }
            });
        }
    }
};
</script>
