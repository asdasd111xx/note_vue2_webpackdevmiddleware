## 開發設置

#### cookie 相關設定
##### 非開發環境下使用的，用 TEST 開頭，只有開發階段可以用的，用 DEV 開頭

<table border="1">
    <tr>
        <th>cookie name</th>
        <th>example</th>
        <th>說明</th>
    </tr>
    <tr>
        <td>TEST_HOME</td>
        <td>13(alias)</td>
        <td>測試客製化首頁</td>
    </tr>
    <tr>
        <td>TEST_TEMPLATE</td>
        <td>5,dark-grey(模版代碼,色系代碼)</td>
        <td>套版用，測試版面</td>
    </tr>
    <tr>
        <td>TEST_MOBILE_TPL</td>
        <td>519(模版代碼，預設在 basic)</td>
        <td>測試手網頁版多模版</td>
    </tr>
    <tr>
        <td>IS_BB_APP</td>
        <td>Y</td>
        <td>測試 webview (此為與 RD7 設定嵌 webview 參數，不可異動)</td>
    </tr>
</table>

## 網站列表

<table border="1">
    <tr>
        <th width="14%">網站名稱</th>
        <th width="4%">客端</th>
        <th width="5%">廳主端</th>
        <th width="4%">alias</th>
        <th width="5%">後置碼</th>
        <th width="5%">客製版</th>
        <th width="7%">客製首頁</th>
        <th width="56%">備註</th>
    </tr>
    <tr>
        <td>開發機</td>
        <td>客端</td>
        <td><a href="http://mangosteen-dev.net/web/pineapple/#/edit">廳主端</a></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>目前程式無持續更新，無法連接 RD5 API</td>
    </tr>
    <tr>
        <td>測試站(RD)</td>
        <td><a href="https://rd1.bbin-asia.com/">客端</a></td>
        <td><a href="https://adm-rd1.bbin-asia.com/">廳主端</a></td>
        <td>129</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>測試站(QA 傳統廳)</td>
        <td><a href="http://vir999.bbin-asia.com/">客端</a></td>
        <td><a href="http://adm-vir999.bbin-asia.com/">廳主端</a></td>
        <td>43</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>測試站(QA 無限層)</td>
        <td><a href="https://inf.bbin-asia.com/">客端</a></td>
        <td><a href="https://adm-inf.bbin-asia.com/">廳主端</a></td>
        <td>177</td>
        <td></td>
        <td></td>
        <td></td>
        <td>客端帳號：level1 ~ level5、廳主端帳號：rd1test2</td>
    </tr>
    <tr>
        <td>測試站(GM 傳統廳)</td>
        <td><a href="https://gm.bbin-asia.com/">客端</a></td>
        <td><a href="http://adm-gm.bbin-asia.com/">廳主端</a></td>
        <td>47</td>
        <td></td>
        <td></td>
        <td></td>
        <td>客端帳號：rd1test01，後台帳號：rd1test</td>
    </tr>
    <tr>
        <td>測試站(GM 無限層)</td>
        <td><a href="https://dinf.66boxing.com">客端</a></td>
        <td><a href="https://dinf.66polo.com/">廳主端</a></td>
        <td>197</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>測試站(日本站)</td>
        <td><a href="https://hh.bbin-asia.com">客端</a></td>
        <td><a href="">廳主端</a></td>
        <td>110</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>測試站(日本站)</td>
        <td><a href="https://ii.bbin-asia.com">客端</a></td>
        <td><a href="">廳主端</a></td>
        <td>123</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>正式站(前哨)</td>
        <td><a href="https://staging.bbin-fun.com/">客端</a></td>
        <td><a href="https://adm-staging.bbin-fun.com/login">廳主端</a></td>
        <td>9</td>
        <td></td>
        <td></td>
        <td></td>
        <td>測試體系</td>
    </tr>
    <tr>
        <td>正式站(GM 傳統廳)</td>
        <td><a href="http://gm.bsvvip.com/">客端</a></td>
        <td><a href="http://adm-gm.bsvvip.com/">廳主端</a></td>
        <td>10</td>
        <td></td>
        <td></td>
        <td></td>
        <td>測試體系，客端帳號：rd1test、rd1test01 ~ rd1test03，後台帳號：testrd1</td>
    </tr>
    <tr>
        <td>正式站(GM 無限層廳)</td>
        <td><a href="https://gmin.77boxing.com">客端</a></td>
        <td><a href="https://gmin.77polo.com/">廳主端</a></td>
        <td>31</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Eslot</td>
        <td><a href="http://20179889.com/">客端</a></td>
        <td><a href="http://esl0t.com/">廳主端</a></td>
        <td>8</td>
        <td></td>
        <td>v</td>
        <td></td>
        <td>(客製版) 模版編號：B18060601</td>
    </tr>
    <tr>
        <td>Eslot(測試環境)</td>
        <td><a href="https://play17.bbin-asia.com/">客端</a></td>
        <td><a href="https://adm-play17.bbin-asia.com/login">廳主端</a></td>
        <td>96</td>
        <td></td>
        <td>v</td>
        <td></td>
        <td>(客製版) 模版編號：B18060601</td>
    </tr>
    <tr>
        <td>已停站-輝煌</td>
        <td><a href="https://hhcs8888.com/">客端</a></td>
        <td><a href="https://8888.hhcs8888.com/login">廳主端</a></td>
        <td>13</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>傳統廳，已停站，(客製版、客製首頁) 模版編號：B18110602</td>
    </tr>
    <tr>
        <td>已停站-輝煌(測試環境) - demo用</td>
        <td><a href="https://t.6bw7.com/">客端</a></td>
        <td><a href="https://a.6bw7.com/">廳主端</a></td>
        <td>11</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>傳統廳，(客製版、客製首頁) 模版編號：B18110602</td>
    </tr>
    <tr>
        <td>輝煌</td>
        <td><a href="https://hhcs8888.com/">客端</a></td>
        <td><a href="https://8888.hhcs8888.com/">廳主端</a></td>
        <td>32</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>無限層廳，(客製版、客製首頁) 模版編號：B18110602</td>
    </tr>
    <tr>
        <td>輝煌(測試環境)</td>
        <td><a href="https://vwu.99rice.com/">客端</a></td>
        <td><a href="https://vwu.99pudding.com">廳主端</a></td>
        <td>30</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>無限層廳，(客製版、客製首頁) 模版編號：B18110602</td>
    </tr>
    <tr>
        <td>Wonder Casino</td>
        <td><a href="https://wonder-casino.net/">客端</a></td>
        <td><a href="">廳主端</a></td>
        <td>29</td>
        <td></td>
        <td></td>
        <td></td>
        <td>備用網址：https://won.789oil.com/</td>
    </tr>
    <tr>
        <td>Wonder Casino(demo用)</td>
        <td><a href="https://521milk.com">客端</a></td>
        <td><a href="">廳主端</a></td>
        <td>21</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Knight Casino</td>
        <td><a href="https://knight-casino.com/">客端</a></td>
        <td><a href="">廳主端</a></td>
        <td>37</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>威尼斯人貴賓會-測試站</td>
        <td><a href="https://wsws.66boxing.com/">客端</a></td>
        <td><a href="https://wsws.66polo.com/login">廳主端</a></td>
        <td>500000</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B19120201</td>
    </tr>
    <tr>
        <td>威尼斯人貴賓會正式站（測試環境）</td>
        <td><a href="https://wstt.66chile.com/">客端</a></td>
        <td><a href="https://wstt.88relish.com/login">廳主端</a></td>
        <td>50</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B19120201</td>
    </tr>
    <tr>
        <td>威尼斯人貴賓會正式站</td>
        <td><a href="https://ws.77boxing.com/">客端</a></td>
        <td><a href="https://ws629.com/login">廳主端</a></td>
        <td>48</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B19120201</td>
    </tr>
    <tr>
        <td>必博-測試站</td>
        <td><a href="https://bb7.66boxing.com/">客端</a></td>
        <td><a href="https://bb7.66polo.com/login">廳主端</a></td>
        <td>500011</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B19121301</td>
    </tr>
    <tr>
        <td>必博正式站（測試環境）</td>
        <td><a href="https://77ts.77boxing.com/">客端</a></td>
        <td><a href="https://77ts.77polo.com/login">廳主端</a></td>
        <td>53</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B19121301</td>
    </tr>
    <tr>
        <td>必博正式站</td>
        <td><a href="https://bb77.77boxing.com/">客端</a></td>
        <td><a href="https://bb77.77polo.com/login">廳主端</a></td>
        <td>52</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B19121301</td>
    </tr>
    <tr>
        <td>亞博直播測試站</td>
        <td><a href="https://yb01.66boxing.com/">客端</a></td>
        <td><a href="https://yb01.66polo.com/">廳主端</a></td>
        <td>500015</td>
        <td>@yb01</td>
        <td></td>
        <td></td>
        <td>只有手機網頁版</td>
    </tr>
    <tr>
        <td>亞博直播正式站（測試環境）</td>
        <td><a href="https://yb0t.66relish.com/">客端</a></td>
        <td><a href="yb0t.88lard.com">廳主端</a></td>
        <td>69</td>
        <td>@yb01</td>
        <td></td>
        <td></td>
        <td>只有手機網頁版</td>
    </tr>
    <tr>
        <td>亞博直播正式站</td>
        <td><a href="https://yaboxxx01.com/">客端</a></td>
        <td><a href="https://yb01.88lard.com/">廳主端</a></td>
        <td>67</td>
        <td>@yb01</td>
        <td></td>
        <td></td>
        <td>只有手機網頁版</td>
    </tr>
    <tr>
        <td>Phatplay@phat正式站</td>
        <td><a href="https://phat.chile666.com/">客端</a></td>
        <td><a href="https://phat.888caviar.com/login">廳主端</a></td>
        <td>47</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B20013101</td>
    </tr>
    <tr>
        <td>Phatplay@phat測試站</td>
        <td><a href="https://ph02.66boxing.com/">客端</a></td>
        <td><a href="https://ph02.66polo.com/login">廳主端</a></td>
        <td>500013</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B20013101</td>
    </tr>
    <tr>
        <td>VX88@vx88正式站</td>
        <td><a href="https://vx88.688lg.com/">客端</a></td>
        <td><a href="https://vx88.6888lg.com/login">廳主端</a></td>
        <td>70</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B20013101</td>
    </tr>
    <tr>
        <td>VX88@vx88正式Demo站</td>
        <td><a href="https://vx8t.688lg.com/">客端</a></td>
        <td><a href="https://vx8t.6888lg.com/login">廳主端</a></td>
        <td>71</td>
        <td></td>
        <td>v</td>
        <td>v</td>
        <td>(客製版、客製首頁) 模版編號：B20013101</td>
    </tr>
</table>
