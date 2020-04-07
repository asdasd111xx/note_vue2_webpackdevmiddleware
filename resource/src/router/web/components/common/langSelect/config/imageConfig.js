/* 取得圖片設定檔 */
// eslint-disable-next-line
export const getImageConfig = (cssId) => {
    const imageInfo = {
        common: [
            // 圓形語系圖片
            {
                className: `.lang-item.cycle.style-a.zh-tw[${cssId}]`,
                path: '/static/image/lang/flag/cycle/a/tw.png'
            },
            {
                className: `.lang-item.cycle.style-a.zh-cn[${cssId}]`,
                path: '/static/image/lang/flag/cycle/a/cn.png'
            },
            {
                className: `.lang-item.cycle.style-a.en[${cssId}]`,
                path: '/static/image/lang/flag/cycle/a/en.png'
            },
            {
                className: `.lang-item.cycle.style-a.ja[${cssId}]`,
                path: '/static/image/lang/flag/cycle/a/ja.png'
            },
            {
                className: `.lang-item.cycle.style-a.vi[${cssId}]`,
                path: '/static/image/lang/flag/cycle/a/vi.png'
            },
            {
                className: `.lang-item.cycle.style-b.zh-tw[${cssId}]`,
                path: '/static/image/lang/flag/cycle/b/tw.png'
            },
            {
                className: `.lang-item.cycle.style-b.zh-cn[${cssId}]`,
                path: '/static/image/lang/flag/cycle/b/cn.png'
            },
            {
                className: `.lang-item.cycle.style-b.en[${cssId}]`,
                path: '/static/image/lang/flag/cycle/b/en.png'
            },
            {
                className: `.lang-item.cycle.style-b.ja[${cssId}]`,
                path: '/static/image/lang/flag/cycle/b/ja.png'
            },
            {
                className: `.lang-item.cycle.style-b.vi[${cssId}]`,
                path: '/static/image/lang/flag/cycle/b/vi.png'
            },
            {
                className: `.lang-item.cycle.style-c.zh-tw[${cssId}]`,
                path: '/static/image/lang/flag/cycle/c/tw.png'
            },
            {
                className: `.lang-item.cycle.style-c.zh-cn[${cssId}]`,
                path: '/static/image/lang/flag/cycle/c/cn.png'
            },
            {
                className: `.lang-item.cycle.style-c.en[${cssId}]`,
                path: '/static/image/lang/flag/cycle/c/en.png'
            },
            {
                className: `.lang-item.cycle.style-c.ja[${cssId}]`,
                path: '/static/image/lang/flag/cycle/c/ja.png'
            },
            {
                className: `.lang-item.cycle.style-c.vi[${cssId}]`,
                path: '/static/image/lang/flag/cycle/c/vi.png'
            },
            {
                className: `.lang-item.cycle.style-d.zh-tw[${cssId}]`,
                path: '/static/image/lang/flag/cycle/d/tw.png'
            },
            {
                className: `.lang-item.cycle.style-d.zh-cn[${cssId}]`,
                path: '/static/image/lang/flag/cycle/d/cn.png'
            },
            {
                className: `.lang-item.cycle.style-d.en[${cssId}]`,
                path: '/static/image/lang/flag/cycle/d/en.png'
            },
            {
                className: `.lang-item.cycle.style-d.ja[${cssId}]`,
                path: '/static/image/lang/flag/cycle/d/ja.png'
            },
            {
                className: `.lang-item.cycle.style-d.vi[${cssId}]`,
                path: '/static/image/lang/flag/cycle/d/vi.png'
            },
            // 方形語系圖片
            {
                className: `.lang-item.square.style-a.zh-tw[${cssId}]`,
                path: '/static/image/lang/flag/square/a/tw.png'
            },
            {
                className: `.lang-item.square.style-a.zh-cn[${cssId}]`,
                path: '/static/image/lang/flag/square/a/cn.png'
            },
            {
                className: `.lang-item.square.style-a.en[${cssId}]`,
                path: '/static/image/lang/flag/square/a/en.png'
            },
            {
                className: `.lang-item.square.style-a.ja[${cssId}]`,
                path: '/static/image/lang/flag/square/a/ja.png'
            },
            {
                className: `.lang-item.square.style-a.vi[${cssId}]`,
                path: '/static/image/lang/flag/square/a/vi.png'
            },
            {
                className: `.lang-item.square.style-b.zh-tw[${cssId}]`,
                path: '/static/image/lang/flag/square/b/tw.png'
            },
            {
                className: `.lang-item.square.style-b.zh-cn[${cssId}]`,
                path: '/static/image/lang/flag/square/b/cn.png'
            },
            {
                className: `.lang-item.square.style-b.en[${cssId}]`,
                path: '/static/image/lang/flag/square/b/en.png'
            },
            {
                className: `.lang-item.square.style-b.ja[${cssId}]`,
                path: '/static/image/lang/flag/square/b/ja.png'
            },
            {
                className: `.lang-item.square.style-b.vi[${cssId}]`,
                path: '/static/image/lang/flag/square/b/vi.png'
            },
            {
                className: `.lang-item.square.style-c.zh-tw[${cssId}]`,
                path: '/static/image/lang/flag/square/c/tw.png'
            },
            {
                className: `.lang-item.square.style-c.zh-cn[${cssId}]`,
                path: '/static/image/lang/flag/square/c/cn.png'
            },
            {
                className: `.lang-item.square.style-c.en[${cssId}]`,
                path: '/static/image/lang/flag/square/c/en.png'
            },
            {
                className: `.lang-item.square.style-c.ja[${cssId}]`,
                path: '/static/image/lang/flag/square/c/ja.png'
            },
            {
                className: `.lang-item.square.style-c.vi[${cssId}]`,
                path: '/static/image/lang/flag/square/c/vi.png'
            },
            {
                className: `.lang-item.square.style-d.zh-tw[${cssId}]`,
                path: '/static/image/lang/flag/square/d/tw.png'
            },
            {
                className: `.lang-item.square.style-d.zh-cn[${cssId}]`,
                path: '/static/image/lang/flag/square/d/cn.png'
            },
            {
                className: `.lang-item.square.style-d.en[${cssId}]`,
                path: '/static/image/lang/flag/square/d/en.png'
            },
            {
                className: `.lang-item.square.style-d.ja[${cssId}]`,
                path: '/static/image/lang/flag/square/d/ja.png'
            },
            {
                className: `.lang-item.square.style-d.vi[${cssId}]`,
                path: '/static/image/lang/flag/square/d/vi.png'
            }
        ]
    };

    return imageInfo;
};
