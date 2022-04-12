重新連結與否
觸發ws.onclose 會觸發reconnectYaboWS() 重連
1.設定一個定時器判斷 YABO_SOCKET_RECONNECT_ACTIVE===true 時重連
2.<videoPlayer> destroy的時候actionSetVideoBounsPageStatus  為false YABO_SOCKET_RECONNECT_ACTIVE 為false
3.清除定時器
4.