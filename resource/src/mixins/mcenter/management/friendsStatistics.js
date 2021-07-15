import { API_MANAGEMENT_FRIENDS_STATISTICS } from '@/config/api';
import ajax from '@/lib/ajax';

export default {
    data() {
        return {
            friendsStatistics: null
        };
    },
    created() {
        this.getMemberStatistics();
    },
    methods: {
        /**
         * 取得會員統計資訊
         * @method getMemberStatistics
         */
        getMemberStatistics() {
            ajax({
                method: 'get',
                url: API_MANAGEMENT_FRIENDS_STATISTICS,
                success: ({ result, ret }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    this.friendsStatistics = ret;
                }
            });
        }
    }
};
