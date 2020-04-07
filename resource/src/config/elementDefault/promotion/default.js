export default {
    layout: {
        theme: 'A'
    },
    setting: {
        'background-color': '#DDD',
        'background-position': 'ct',
        'background-repeat': 'no-repeat',
        'background-image': '',
        'timer-style': '0',
        'promotion-category': [
            {
                key: 0,
                text: '全部优惠',
                deletable: false
            }
        ],
        card: {
            'background-style': 0,
            'button-style': 0,
            color: '#FFF',
            button: {
                more: {
                    color: '#74CCFB',
                    hover: '#A8A8B7'
                },
                join: {
                    color: '#F99',
                    hover: '#A8A8B7'
                }
            },
            text: {
                more: {
                    color: '#FFF',
                    hover: '#FFF'
                },
                join: {
                    color: '#FFF',
                    hover: '#FFF'
                }
            }
        },
        category: {
            'button-style': 0,
            button: {
                color: '#FFF',
                active: '#74CCFB'
            },
            text: {
                color: '#000',
                active: '#FFF'
            }
        },
        article: {
            'background-style': 0,
            'button-style': 0,
            color: '#FFF',
            button: {
                close: {
                    color: '#CCC'
                }
            }
        }
    },
    data: [
        {
            join: '0',
            connect: '',
            pc: '1',
            mobile: '1',
            category: '0',
            date: '',
            image: '/image/element/other/promotion/default/image.png',
            card: '/image/element/other/promotion/default/card.png',
            link: '',
            text: '<table cellpadding="8" style="width:100%;max-width:580px;margin:48px auto;"><tbody><tr><td><span style="font-size:13px;"><span style="color:#3D525F;">活动对象：全体会员。</span></span></td></tr><tr><td><span style="font-size:13px;"><span style="color:#3D525F;">活動規則：</span></span></td></tr><tr><td><span style="font-size:13px;"><span style="color:#3D525F;">1. 任何團體或個人，以不誠實方式套取紅利、圖利的行為，帳號及帳戶餘額將被取消。</span></span></td></tr><tr><td><span style="font-size:13px;"><span style="color:#3D525F;">2. 此活動只適用於同一位會員，同一個IP位置，任何無風險投注將視為無效。</span></span></td></tr><tr><td><span style="font-size:13px;"><span style="color:#3D525F;">3. 若有非法套利投注會員或無風險投注者，將取消本活動得獎資格。</span></span></td></tr><tr><td><span style="font-size:13px;"><span style="color:#3D525F;">4. 本站保有本活動執行、修正、解釋及終止等權力。</span></span></td></tr></tbody></table>'
        }
    ]
};
