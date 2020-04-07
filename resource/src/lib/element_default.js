import elementDefault from '@/config/elementDefault';
import positionTrans from './position_trans';

/* 取得板塊所有資料 */
export const getElementInfo = (name, model, styleColor) => {
    const resultElement = {};

    try {
        if (elementDefault[name][model][styleColor]) {
            resultElement.layout = elementDefault[name][model][styleColor].layout;
            resultElement.setting = elementDefault[name][model][styleColor].setting;
            resultElement.data = elementDefault[name][model][styleColor].data;
        } else if (elementDefault[name][model]) {
            resultElement.layout = elementDefault[name].default.layout;
            resultElement.setting = elementDefault[name].default.setting;
            resultElement.data = elementDefault[name].default.data;
        }
    } catch (err) {
        resultElement.layout = elementDefault[name].default.layout;
        resultElement.setting = elementDefault[name].default.setting;
        resultElement.data = elementDefault[name].default.data;
    }

    return resultElement;
};

/* 取得板塊基本資料 */
export const getElementData = (name, model, styleColor) => {
    let eleData = {};

    try {
        eleData = elementDefault[name][model][styleColor].data;
    } catch (err) {
        eleData = elementDefault[name].default.data;
    }

    return eleData;
};

/* 取得板塊版面資料 */
export const getElementLayout = (name, model, styleColor) => {
    let eleLayout = {};

    try {
        eleLayout = elementDefault[name][model][styleColor].layout;
    } catch (err) {
        eleLayout = elementDefault[name].default.layout;
    }

    return eleLayout;
};

/* 取得板塊設定資料 */
export const getElementSetting = (name, model, styleColor) => {
    let eleSetting = {};

    try {
        eleSetting = elementDefault[name][model][styleColor].setting;
    } catch (err) {
        eleSetting = elementDefault[name].default.setting;
    }

    /* 轉背景 */
    if (eleSetting['background-position']) {
        eleSetting['background-position'] = positionTrans(eleSetting['background-position']);
    }

    return eleSetting;
};
