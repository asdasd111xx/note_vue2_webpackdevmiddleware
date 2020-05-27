
// export const YABO_API_DOMAIN = getDomain("YABO");
// export const ACTIVES_BOUNS_WEBSOCKET = getDomain("SOCKET");
// export const YABO_PORN_DOMAIN = getDomain("PORN");
// export const BBOS_DOMIAN = getDomain("BBOS");

// function getDomain(target) {
//     if (!window.domainlist) return ''
//     switch (target) {
//         case "YABO":
//             return window.domainlist.YABO_API_DOMAIN[0];
//         case "SOCKET":
//             return window.domainlist.ACTIVES_BOUNS_WEBSOCKET[0];
//         case "PORN":
//             return window.domainlist.YABO_PORN_DOMAIN[0];
//         case "BBOS":
//             return window.domainlist.BBOS_DOMIAN[0];
//         default:
//             return '';
//     }
// }

// // https://yaboapi.mwstation.com:9443/api/system/domain
// // https://yaboapi.aitaxcloud.com:9443/api/system/domain
// // https://yaboapi.shangtouwang.com:9443/api/system/domain
// // https://yaboapi.nmgsanren.com:9443/api/system/domain
// // https://yaboapi.qingzhuk.com:9443/api/system/domain
// // name: "XXX-DOMAIN-URL",
// // name: "XXX-DOMAIN-URL",

// // 測試環境  'https://yb01.66boxing.com/'
// const site_500015 = {
//     BBOS_DOMIAN: ['https://bbos.bbin-asia.com/elibomApi/WebService'],
//     YABO_API_DOMAIN: ['https://yaboapi.bbin-asia.com/api',
//         'https://yaboapi.bbin-asia.com/api',
//         'https://yaboapi.bbin-asia.com/api',
//         'https://yaboapi.bbin-asia.com/api',
//         'https://yaboapi.bbin-asia.com/api'],
//     ACTIVES_BOUNS_WEBSOCKET: ['wss://yaboapi.bbin-asia.com/xxx/promosocket'],
//     YABO_PORN_DOMAIN: ['https://baobingxue.com/api', 'https://ailaijiaxieye.com/api']
// };

// // Demo環境  'https://yb0t.66relish.com/'
// const site_69 = {
//     BBOS_DOMIAN: ['https://bbos.canarycherrytart.com/elibomApi/WebService'],
//     YABO_API_DOMAIN: ['https://yaboapi.canarycherrytart.com/api',
//         'https://yaboapi.canarycherrytart.com/api',
//         'https://yaboapi.canarycherrytart.com/api',
//         'https://yaboapi.canarycherrytart.com/api',
//         'https://yaboapi.canarycherrytart.com/api'],
//     ACTIVES_BOUNS_WEBSOCKET: ['wss://yaboapi.canarycherrytart.com/xxx/promosocket'],
//     YABO_PORN_DOMAIN: ['https://baobingxue.com/api', 'https://ailaijiaxieye.com/api']
// };

// // 正式  'https://yaboxxxapp01.com/'
// const site_67 = {
//     BBOS_DOMIAN: ['https://bbos.canarycherrytart.com/elibomApi/WebService'],
//     YABO_API_DOMAIN: [
//         'https://yaboapi.canarycherrytart.com/api',
//         'https://yaboapi.dormousepie.com/api',
//         'https://yaboapi.gophertart.com/api',
//         'https://yaboapi.slothwafer.com/api',
//         'https://yaboapi.armadillobrulee.com/api',
//         'https://yaboapi.chimpanzeescone.com/api',
//         'https://yaboapi.duckbillcaramel.com/api',
//         'https://yaboapi.quailtortillas.com/api',
//         'https://yaboapi.parrotbostonpie.com/api',
//         'https://yaboapi.canarycherrytart.com/api',
//         'https://yaboapi.iguanagingercake.com/api'],
//     ACTIVES_BOUNS_WEBSOCKET: ['wss://yaboapi.canarycherrytart.com/xxx/promosocket'],
//     YABO_PORN_DOMAIN: ['https://baobingxue.com/api', 'https://ailaijiaxieye.com/api']
// };

// export default ({
//     vendor
// }) => {
//     let config = {}
//     switch (vendor) {
//         case "50015":
//             config = site_500015;
//             break
//         case "69":
//             config = site_69;
//             break
//         case "67":
//             config = site_67;
//             break
//         default:
//             config = site_500015;
//             break;
//     }
//     window.domainlist = {
//         ...config
//     }
//     console.log(window.domainlist)
//     return config;
// };
