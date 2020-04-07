import store from '@/store';
import navFilterPage from '@/lib/nav_filter_page';

/* 取 page 過濾後組 nav資料 */
export default (max) => {
    const navData = {
        navArr: [],
        navMoreArr: []
    };
    let navIndex = -1;

    store.state.webInfo.page.forEach((data) => {
        /* 前後台資料問題,暫時寫防呆 */
        const pageId = data.pid || data.page_id; // 父層 pid
        const subPage = data.sub_page || ''; // 子層資料

        // 過濾父層頁面, true 才存入陣列
        if (navFilterPage(store.state.webInfo.pageData[pageId])) {
            // 組 nav 所需資料
            navIndex += 1;
            const navItem = {
                pid: pageId,
                name: data.name,
                navPage: data.page_key || data.linkTo || pageId,
                navType: data.page_key ? '' : data.page_type || '',
                linkItem: (typeof (data.linkItem) !== 'undefined') ? data.linkItem : '',
                flashing: data.flashing || 'N',
                content_color: data.content_color || '',
                flashing_color: data.flashing_color || '',
                use_ico: data.use_ico || 'N',
                use_ico_img: data.use_ico_img || ''
            };

            if (max && max <= navIndex) {
                navData.navMoreArr.push(navItem);
            } else {
                navData.navArr.push(navItem);
            }

            // 判斷是否有子層
            if (subPage && subPage.length > 0) {
                const navSub = []; // 暫存已過濾子層資料
                subPage.forEach((subData) => {
                    /* 前後台資料問題,暫時寫防呆 */
                    const subPageId = subData.pid || subData.page_id; // 子層 pid
                    const navSubItem = {
                        pid: subPageId,
                        name: subData.name,
                        navPage: subData.page_key || subData.linkTo || subPageId,
                        navType: subData.page_key ? '' : subData.page_type || '',
                        linkItem: (typeof (subData.linkItem) !== 'undefined') ? subData.linkItem : '',
                        flashing: subData.flashing || 'N',
                        content_color: subData.content_color || '',
                        flashing_color: subData.flashing_color || '',
                        use_ico: subData.use_ico || 'N',
                        use_ico_img: subData.use_ico_img || ''
                    };

                    // 過濾子層頁面, true 才存入陣列
                    if (navFilterPage(store.state.webInfo.pageData[subPageId])) {
                        navSub.push(navSubItem);
                    }
                });

                if ((!max || max > navIndex) && navSub.length > 0) {
                    navData.navArr[navIndex].sub_page = navSub;
                }

                if (max <= navIndex && navSub.length > 0) {
                    navData.navMoreArr[navIndex - max].sub_page = navSub;
                }
            }
        }
    });
    return navData;
};
