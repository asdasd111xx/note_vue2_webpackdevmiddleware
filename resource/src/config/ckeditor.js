// 編輯器工具列
export const toolbar = {
    inline: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'styles', items: ['FontSize'] },
        { name: 'colors', items: ['TextColor'] }
    ],
    widget: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
        { name: 'lineheight', items: ['lineheight'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'styles', items: ['FontSize'] },
        { name: 'colors', items: ['TextColor'] }
    ],
    default: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', 'RemoveFormat'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
        { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
        '/',
        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        { name: 'insert', items: ['Image', 'Table'] },
        { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
        { name: 'clipboard', items: ['Undo', 'Redo'] }
    ]
};

// 字型大小設定
export const fontSize = {
    inline: '最小/12px;小/16px;普通/24px;大/36px;最大/48px;',
    widget: '12/12px;13/13px;14/14px;15/15px;16/16px;17/17px;18/18px;19/19px;20/20px;21/21px;22/22px;23/23px;24/24px;25/25px;26/26px;27/27px;28/28px;29/29px;30/30px;31/31px;32/32px;33/33px;34/34px;35/35px;36/36px;37/37px;38/38px;39/39px;40/40px;41/41px;42/42px;43/43px;44/44px;45/45px;46/46px;47/47px;48/48px;49/49px;50/50px;51/51px;52/52px;53/53px;54/54px;55/55px;56/56px;57/57px;58/58px;59/59px;60/60px;61/61px;62/62px;63/63px;64/64px;65/65px;66/66px;67/67px;68/68px;69/69px;70/70px;71/71px;72/72px;'
};

// 行高設定
export const lineheight = {
    widget: '1;1.25;1.5;1.75;2;2.25;2.5;2.75;3;3.5;4;4.5;5'
};
