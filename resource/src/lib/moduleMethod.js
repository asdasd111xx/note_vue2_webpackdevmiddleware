import cloneDeep from 'lodash/cloneDeep';
import { getElementInfo } from '@/lib/element_default';

// eslint-disable-next-line
export const moduleMethod = (self, moduleConfig) => {
    const selfComponent = self;
    selfComponent.updateField = (data) => {
        self.actionCaseSave({
            case_id: self.element.i,
            content: [{}],
            field: [...self.element.case.data],
            setting: { ...self.element.case.setting },
            ...data
        });
    };
    const method = {
        // 新增
        addData() {
            if (!self.isBackEnd) {
                return;
            }
            if (!moduleConfig.maxItem.state || self.element.case.data.length >= self.maxItem) {
                return;
            }
            const fieldData = [];
            const eleData = getElementInfo(moduleConfig.name, self.webInfo.model, self.webInfo.style_color);
            if (self.element.case.data.length === 0) {
                // Module init data
                eleData.data.forEach((data, index) => {
                    const fields = cloneDeep(moduleConfig.defaultData);
                    Object.keys(self.lang).forEach((lang) => {
                        Object.keys(fields).forEach((objKey) => {
                            fields[objKey][lang] = data[objKey] ? data[objKey] : '';
                        });
                    });
                    fieldData[index] = fields;
                });
            } else {
                // Module add data
                const fields = cloneDeep(moduleConfig.defaultData);
                Object.keys(self.lang).forEach((lang) => {
                    const data = eleData.data[0];
                    Object.keys(fields).forEach((objKey) => {
                        fields[objKey][lang] = data[objKey] ? data[objKey] : '';
                    });
                });
                fieldData.push(fields);
            }
            self.updateField({
                field: [
                    ...self.element.case.data,
                    ...fieldData
                ],
                setting: {
                    ...self.element.case.setting,
                    'background-color': eleData.bgData.color,
                    'background-position': eleData.bgData.position,
                    'background-repeat': eleData.bgData.repeat,
                    'background-image': eleData.bgData.image
                }
            });
        },
        // 修改
        editData(editItem) {
            const postData = {};
            postData.field = [...editItem.case.data];
            self.updateField(postData);
        },
        // 排序
        sortData(postData) {
            self.updateField(postData);
        },
        // 移除
        deleteData(index) {
            self.updateField({
                field: [...self.element.case.data.filter((item, i) => index !== i)]
            });
        },
        // 換頁
        changePage(item) {
            if (!self.isBackEnd) {
                self.actionChangePage({
                    page: item.linkTo[self.curLang],
                    type: item.linkType[self.curLang],
                    config: {
                        linkItem: item.linkItem[self.curLang]
                    }
                });
            }
        },
        // 客制Edit Dialog開關
        customDialog(index) {
            const config = moduleConfig;
            config.customDialog.customEditIndex = index;
            config.customDialog.cunstomEditState = !config.customDialog.cunstomEditState;
        }
    };
    return method;
};
