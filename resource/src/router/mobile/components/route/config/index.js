import merge from 'lodash/merge';
import tplPorn1 from './porn1';

export default merge(
    {
        root: {
            rootPorn1: () => import(/* webpackChunkName: 'rootPorn1' */'../../tpl/porn1/')
        }
    },
    tplPorn1 // 鸭博娱乐
);
