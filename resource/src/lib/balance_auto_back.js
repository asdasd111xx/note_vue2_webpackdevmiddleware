import { API_BALANCE_AUTO_BACK } from '../config/api';

/* 額度自動回收機制 */
export default (type) => {
    const request = new XMLHttpRequest();
    const data = JSON.stringify({ type });

    if (!request) {
        return;
    }

    request.open('PUT', API_BALANCE_AUTO_BACK, type === 'in');
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send(data);
};
