import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'image03',
    mainPanel: {
        ...commonConfig.mainPanel,
        setting: false, // 設置
        theme: false // 佈局
    },
    fields: {
        common: ['image', 'imageHover', 'linkType', 'linkTo', 'linkItem'],
        0: ['largImg', 'largImgHover', 'smallImg']
    },
    popupEdit: {
        common: [
            {
                type: 'imageHoverUpload',
                objKey: 'image',
                names: {
                    normal: 'image',
                    hover: 'imageHover'
                },
                size: [480, 320]
            },
            {
                type: 'link',
                objKey: 'link',
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            }
        ],
        0: [
            {
                title: 'S_LARG_IMG_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'image',
                names: {
                    normal: 'largImg',
                    hover: 'largImgHover'
                },
                size: [960, 640]
            },
            {
                title: 'S_SMALL_IMG_UPLOAD',
                type: 'imageUpload',
                name: 'smallImg',
                size: [395, 195]
            }
        ]
    },
    validate: {
        image: {
            required: {
                msg: 'S_IMG_NOT_UPLOAD'
            }
        },
        largImg: {
            required: {
                msg: 'S_IMG_NOT_UPLOAD'
            }
        }
    }
};

export default config;
