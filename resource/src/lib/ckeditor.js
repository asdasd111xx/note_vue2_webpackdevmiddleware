/* global CKEDITOR */
import { toolbar, fontSize, lineheight } from '@/config/ckeditor';

// eslint-disable-next-line
export const ckeditor = (settings) => {

    const config = {
        target: '', // 目標 id
        configType: toolbar[settings.type] ? settings.type : 'default', // 編輯器工具列類型
        width: '',
        height: '',
        onReady: null,
        onFocus: null,
        onBlur: null,
        onChange: null,
        onDrop: () => false,
        ...settings
    };
    const {
        target, configType, onFocus, onBlur, onChange, onDrop, onReady
    } = config;

    if (!target) {
        return null;
    }

    CKEDITOR.disableAutoInline = true;

    // CKEDITOR.on('dialogDefinition', (ev) => {
    //     const result = { ...ev };
    //     const dialogName = result.data.name;
    //     const infoTab = result.data.definition.getContents('info');

    //     console.log(ev);

    //     // console.log(result, dialogName, infoTab);
    // });

    let element = null;

    switch (configType) {
        case 'inline':
            element = CKEDITOR.inline(target, {
                toolbar: toolbar[configType],
                fontSize_sizes: fontSize[configType],
                language: 'zh-cn'
            });
            break;
        case 'widget':
            element = CKEDITOR.inline(target, {
                toolbar: toolbar[configType],
                fontSize_sizes: fontSize[configType],
                line_height: lineheight[configType],
                language: 'zh-cn'
            });
            break;
        default:
            element = CKEDITOR.replace(target, {
                toolbar: toolbar[configType],
                language: 'zh-cn'
            });
            break;
    }

    // ckeditor 初始化完成
    if (onReady) {
        element.on('instanceReady', onReady);
    }

    if (onFocus) {
        element.on('focus', onFocus);
    }

    if (onBlur) {
        element.on('blur', onBlur);
    }

    if (onChange) {
        element.on('change', onChange);
        element.on('key', onChange);
    }

    // 預設防止拖曳內容到輸入框
    element.on('drop', onDrop);

    // 自定義連結內容
    // element.on('dialogShow', (event) => {
    //     const result = { ...event };
    //     const dialogName = event.data._.name;
    //     const infoTab = result.data.definition.getContents('target');
    //     const dialogDefinition = event.data.definition;

    //     console.log(dialogDefinition.getContents('info'));
    //     dialogDefinition.getContents('info').get('protocol').label = 'test';
    //     // console.log(result, dialogName, infoTab);
    // });

    return element;
};
