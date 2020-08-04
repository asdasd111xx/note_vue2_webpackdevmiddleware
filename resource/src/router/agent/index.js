// import accountData from './components/accountData';
// import accountBankCard from './components/accountBankCard';
// import financeWithdraw from './components/financeWithdraw';
// import financeReward from './components/financeReward';
// import reportGameRecord from './components/reportGameRecord';
// import reportMember from './components/reportMember';
// import infoMessage from './components/infoMessage';
// import infoPost from './components/infoPost';
// import feedBack from './components/feedBack';

export default {
    path: '/agent',
    component: (resolve) => {
        require.ensure(['./components'], () => {
            resolve(require('./components'));
        });
    },
    children: [
        // accountData,
        // accountBankCard,
        // financeWithdraw,
        // financeReward,
        // reportGameRecord,
        // reportMember,
        // infoMessage,
        // infoPost,
        // feedBack
    ]
};
