<template>
    <div class="bonus-account">
        <h1>{{ $t('S_BONUS_ACCOUNT') }}</h1>
        <div class="bonus-total">
            <div>
                <span class="title">{{ $t('S_BONUS_CUMULATIVE_TOTAL') }}：</span>
                <span class="info">{{ total.amount }}</span>
            </div>
            <div>
                <span class="title">{{ $t('S_BONUS_NOT_CASHED_TOTAL') }}：</span>
                <span class="info">{{ total.balance }}</span>
            </div>
        </div>
        <template v-if="hasReceive">
            <table>
                <thead class="mcenter-pc">
                    <tr>
                        <th>{{ $t('S_BONUS_ACCOUNT') }}</th>
                        <th>{{ $t('S_BONUS_CUMULATIVE') }}</th>
                        <th>{{ $t('S_SERIAL_NUMBER') }}</th>
                        <th>{{ $t('S_SERIAL_NUMBER_CUMULATIVE') }}</th>
                        <th>{{ $t('S_PLATFORM_BALANCE') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="info in bonusData">
                        <tr :key="info.id">
                            <td class="account">
                                {{ info.name }}
                            </td>
                            <td>
                                <div class="title">{{ $t('S_BONUS_CUMULATIVE') }}</div>
                                {{ info.amount }}
                            </td>
                            <td>
                                <div class="title">{{ $t('S_SERIAL_NUMBER') }}</div>
                                {{ info.total }}
                            </td>
                            <td>
                                <div class="title">{{ $t('S_SERIAL_NUMBER_CUMULATIVE') }}</div>
                                {{ info.aggregation }}
                            </td>
                            <td>
                                <div class="title">{{ $t('S_PLATFORM_BALANCE') }}</div>
                                {{ info.balance }}
                            </td>
                        </tr>
                    </template>
                    <template v-if="bonusData.length === 0">
                        <tr>
                            <td colspan="5" class="no-data">{{ $t('S_NO_DATA_YET') }}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </template>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
    data() {
        return {
            hasReceive: false,
            bonusData: [],
            total: {}
        };
    },
    created() {
        this.actionSetIsLoading(true);
        mcenter.bonusAccount({
            success: ({ result, ret, total }) => {
                this.hasReceive = true;

                if (result !== 'ok') {
                    return;
                }

                this.bonusData = ret;
                this.total = total;
            }
        })
            .then(() => {
                this.actionSetIsLoading(false);
            });
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ])
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
