import config from '@/config/fisharea';
import game from '@/api/game';

/* 組捕魚大廳資料 */
export default (callback) => {
    const params = {
        game_vendors: [],
        game_kinds: [],
        game_codes: [],
        enable: true
    };

    Object.keys(config.list).forEach((index) => {
        params.game_vendors.push(config.list[index][0]);
        params.game_kinds.push(config.list[index][1]);
        params.game_codes.push(config.list[index][2]);
    });

    game.gameListByAssign({
        params,
        success: (response) => {
            const fishList = [];
            const tmp = {};

            Object.keys(response.ret).forEach((index) => {
                tmp[`${response.ret[index].vendor}_${response.ret[index].code}`] = response.ret[index];
            });
            Object.keys(config.list).forEach((index) => {
                const key = `${config.list[index][0]}_${config.list[index][2]}`;
                if (tmp[key]) {
                    fishList.push(tmp[key]);
                }
            });
            callback(fishList);
        }
    });
};
