import merge from 'lodash/merge';
// import tpl519 from './519';
import tplBasic from './basic';
import tplPorn1 from './porn1';
import tplTheme3 from './theme3';

export default merge(
    {
        root: {
            rootBasic: () => import(/* webpackChunkName: 'rootBasic' */'../../tpl/basic/components/'),
            // root519: () => import(/* webpackChunkName: 'root519' */'../../tpl/519/components/'),
            // rootBrilliant: () => import(/* webpackChunkName: 'rootBrilliant' */'../../tpl/brilliant2'),
            // rootTheme3: () => import(/* webpackChunkName: 'rootTheme3' */'../../tpl/theme3/'),
            // rootMiller: () => import(/* webpackChunkName: 'rootMillter' */'../../tpl/miller/'),
            rootPorn1: () => import(/* webpackChunkName: 'rootPorn1' */'../../tpl/porn1/')
        }
    },
    // tpl519, // 九鼎
    tplBasic, // 預設
    // tplBrilliant, // 輝煌
    // tplTheme3, // 版3
    // tplMiller, // 米樂
    tplPorn1 // 色情網站版1
);
