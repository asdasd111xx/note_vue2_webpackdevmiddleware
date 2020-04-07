import commonConfig from '../../common/new/commonConfig';

const config = {
    ...commonConfig,
    name: 'jackpot02',
    max: 80,
    theme: ['A'],
    fields: {
        common: [
            'navImage',
            'navImageHover',
            'itemImage01',
            'itemImageHover01',
            'linkType01',
            'linkTo01',
            'linkItem01',
            'itemImage02',
            'itemImageHover02',
            'linkType02',
            'linkTo02',
            'linkItem02',
            'itemImage03',
            'itemImageHover03',
            'linkType03',
            'linkTo03',
            'linkItem03',
            'itemImage04',
            'itemImageHover04',
            'linkType04',
            'linkTo04',
            'linkItem04',
            'itemImage05',
            'itemImageHover05',
            'linkType05',
            'linkTo05',
            'linkItem05',
            'itemImage06',
            'itemImageHover06',
            'linkType06',
            'linkTo06',
            'linkItem06',
            'itemImage07',
            'itemImageHover07',
            'linkType07',
            'linkTo07',
            'linkItem07',
            'itemImage08',
            'itemImageHover08',
            'linkType08',
            'linkTo08',
            'linkItem08'
        ],
        0: ['jackpotImage']
    },
    popupEdit: {
        common: [
            {
                title: 'S_NAV_ITEM_PIC_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'navImage',
                names: {
                    normal: 'navImage',
                    hover: 'navImageHover'
                },
                size: [90, 80]
            },
            {
                title: 'S_GAME_PIC01_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'itemImage01',
                names: {
                    normal: 'itemImage01',
                    hover: 'itemImageHover01'
                },
                size: [150, 132]
            },
            {
                type: 'link',
                objKey: 'link01',
                names: {
                    type: 'linkType01',
                    to: 'linkTo01',
                    item: 'linkItem01'
                }
            },
            {
                title: 'S_GAME_PIC02_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'itemImage02',
                names: {
                    normal: 'itemImage02',
                    hover: 'itemImageHover02'
                },
                size: [150, 132]
            },
            {
                type: 'link',
                objKey: 'link02',
                names: {
                    type: 'linkType02',
                    to: 'linkTo02',
                    item: 'linkItem02'
                }
            },
            {
                title: 'S_GAME_PIC03_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'itemImage03',
                names: {
                    normal: 'itemImage03',
                    hover: 'itemImageHover03'
                },
                size: [150, 132]
            },
            {
                type: 'link',
                objKey: 'link03',
                names: {
                    type: 'linkType03',
                    to: 'linkTo03',
                    item: 'linkItem03'
                }
            },
            {
                title: 'S_GAME_PIC04_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'itemImage04',
                names: {
                    normal: 'itemImage04',
                    hover: 'itemImageHover04'
                },
                size: [150, 132]
            },
            {
                type: 'link',
                objKey: 'link04',
                names: {
                    type: 'linkType04',
                    to: 'linkTo04',
                    item: 'linkItem04'
                }
            },
            {
                title: 'S_GAME_PIC05_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'itemImage05',
                names: {
                    normal: 'itemImage05',
                    hover: 'itemImageHover05'
                },
                size: [150, 132]
            },
            {
                type: 'link',
                objKey: 'link05',
                names: {
                    type: 'linkType05',
                    to: 'linkTo05',
                    item: 'linkItem05'
                }
            },
            {
                title: 'S_GAME_PIC06_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'itemImage06',
                names: {
                    normal: 'itemImage06',
                    hover: 'itemImageHover06'
                },
                size: [150, 132]
            },
            {
                type: 'link',
                objKey: 'link06',
                names: {
                    type: 'linkType06',
                    to: 'linkTo06',
                    item: 'linkItem06'
                }
            },
            {
                title: 'S_GAME_PIC07_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'itemImage07',
                names: {
                    normal: 'itemImage07',
                    hover: 'itemImageHover07'
                },
                size: [150, 132]
            },
            {
                type: 'link',
                objKey: 'link07',
                names: {
                    type: 'linkType07',
                    to: 'linkTo07',
                    item: 'linkItem07'
                }
            },
            {
                title: 'S_GAME_PIC08_UPLOAD',
                type: 'imageHoverUpload',
                objKey: 'itemImage08',
                names: {
                    normal: 'itemImage08',
                    hover: 'itemImageHover08'
                },
                size: [150, 132]
            },
            {
                type: 'link',
                objKey: 'link08',
                names: {
                    type: 'linkType08',
                    to: 'linkTo08',
                    item: 'linkItem08'
                }
            }
        ],
        0: [
            {
                title: 'S_IMG_UPLOAD',
                type: 'imageUpload',
                name: 'jackpotImage',
                size: [300, 260],
                validate: {
                    required: 'S_IMG_NOT_UPLOAD'
                }
            }
        ]
    },
    validate: {
        image: {
            required: {
                msg: 'S_IMG_NOT_UPLOAD'
            }
        }
    }
};

export default config;
