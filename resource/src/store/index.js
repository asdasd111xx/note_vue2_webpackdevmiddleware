// eslint-disable-next-line import/no-cycle
import * as actions from './action';

import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import getters from './getters';
import middlewares from './middlewares';
import mutations from './mutations';
import state from './state';

const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);
Vue.config.debug = debug;

const plugins = process.env.NODE_ENV !== 'production' ? [createLogger({ collapsed: false })] : [];

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    middlewares,
    // plugins,
    strict: false // 嚴格模式，禁止直接修改 state
});
