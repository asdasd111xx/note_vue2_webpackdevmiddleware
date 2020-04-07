import mcenter from '@/api/mcenter';

export default {
    data() {
        return {
            hasReceive: false,
            bonusData: [],
            total: {}
        };
    },
    methods: {
        getBouns() {
            mcenter.bonusAccount({
                success: ({ result, ret, total }) => {
                    this.hasReceive = true;

                    if (result !== 'ok') {
                        return;
                    }

                    this.bonusData = ret;
                    this.total = total;
                }
            });
        }
    }
};
