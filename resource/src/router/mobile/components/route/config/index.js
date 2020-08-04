import merge from 'lodash/merge';
import tplEy1 from './ey1';
import tplPorn1 from './porn1';

export default merge(
    {
        root: {
            rootPorn1: () => import(/* webpackChunkName: 'rootPorn1' */'../../tpl/porn1/'),
            rootEy1: () => import(/* webpackChunkName: 'rootEy1' */'../../tpl/ey1/')
        }
    },
    tplPorn1, // 鸭博娱乐
    tplEy1
);
