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
        <td>鸭博娱乐測試站</td>
        <td><a href="https://yb01.66boxing.com/">客端</a></td>
        <td><a href="https://yb01.66polo.com/">廳主端</a></td>
        <td>500015</td>
        <td>@yb01</td>
        <td></td>
        <td></td>
        <td>只有手機網頁版</td>
    </tr>
    <tr>
        <td>鸭博娱乐正式站（測試環境）</td>
        <td><a href="https://yb0t.66relish.com/">客端</a></td>
        <td><a href="yb0t.88lard.com">廳主端</a></td>
        <td>69</td>
        <td>@yb01</td>
        <td></td>
        <td></td>
        <td>只有手機網頁版</td>
    </tr>
    <tr>
        <td>鸭博娱乐正式站</td>
        <td><a href="https://yaboxxxapp01.com/">客端</a></td>
        <td><a href="https://yb01.88lard.com/">廳主端</a></td>
        <td>67</td>
        <td>@yb01</td>
        <td></td>
        <td></td>
        <td>只有手機網頁版</td>
    </tr>
</table>

## 四端同時佈署方式

- 佈署到 QA & Beta 站，觸發條件：下 tag，tag 名稱前綴需為 【 allQA- 】（大小寫需一致）
  - git tag -a "allQA-v1.3.57" -m "allQA-v1.3.57"
  - git push origin master --tags

- 佈署到 Prod & Demo 站，觸發條件：下 tag，tag 名稱前綴需為 【 allProd- 】（大小寫需一致）
  - git tag -a "allProd-v1.3.57" -m "allProd-v1.3.57"
  - git push origin master --tags

## yabo 佈署方式

### 已測試列表


- 佈署到 QA & Beta 站，觸發條件：下 tag，tag 名稱前綴需為 【 ybQA- 】（大小寫需一致）
  - git tag -a "ybQA-v1.3.57" -m "ybQA-v1.3.57"
  - git push origin master --tags
<!-- - 佈署到 Beta 站，觸發條件：下 tag，tag 名稱前綴需為 【 yaboBeta- 】（大小寫需一致）
  - git tag -a "yaboBeta-v1.3.57" -m "yaboBeta-v1.3.57"
  - git push origin master --tags -->
- 佈署到 Prod && Demo, 觸發條件：下 tag，tag 名稱前綴需為 【 ybProd- 】（大小寫需一致）
  - git tag -a "ybProd-v0.1" -m "ybProd-v0.0.1"
  - git push origin master --tags

## yiyuan 佈署方式


- 佈署到 QA & Beta 站，觸發條件：下 tag，tag 名稱前綴需為 【 eyQA- 】（大小寫需一致）
  - git tag -a "eyQA-v1.3.57" -m "eyQA-v1.3.57"
  - git push origin master --tags
<!-- - 佈署到 Beta 站，觸發條件：下 tag，tag 名稱前綴需為 【 yiyuanBeta- 】（大小寫需一致）
  - git tag -a "yiyuanBeta-v1.3.57" -m "yiyuanBeta-v1.3.57"
  - git push origin master --tags -->
- 佈署到 Prod && Demo, 觸發條件：下 tag，tag 名稱前綴需為 【 eyProd- 】（大小寫需一致）
  - git tag -a "eyProd-v0.1" -m "eyProd-v0.0.1"
  - git push origin master --tags

## sigua 佈署方式

### 已測試列表

- [ ] sigua-prod
- [ ] sigua-demo
- [ ] sigua-beta
- [ ] sigua-qa

- 佈署到 QA & Beta 站，觸發條件：下 tag，tag 名稱前綴需為 【 sgQA- 】（大小寫需一致）
  - git tag -a "sgQA-v1.3.57" -m "sgQA-v1.3.57"
  - git push origin master --tags
<!-- - 佈署到 Beta 站，觸發條件：下 tag，tag 名稱前綴需為 【 siguaBeta- 】（大小寫需一致）
  - git tag -a "siguaBeta-v1.3.57" -m "siguaBeta-v1.3.57"
  - git push origin master --tags -->
- 佈署到 Prod && Demo, 觸發條件：下 tag，tag 名稱前綴需為 【 sgProd- 】（大小寫需一致）
  - git tag -a "sgProd-v0.1" -m "sgProd-v0.0.1"
  - git push origin master --tags

## aubo 佈署方式


- 佈署到 QA & Beta 站，觸發條件：下 tag，tag 名稱前綴需為 【 abQA- 】（大小寫需一致）
  - git tag -a "abQA-v1.3.57" -m "abQA-v1.3.57"
  - git push origin master --tags
<!-- - 佈署到 Beta 站，觸發條件：下 tag，tag 名稱前綴需為 【 yaboBeta- 】（大小寫需一致）
  - git tag -a "yaboBeta-v1.3.57" -m "yaboBeta-v1.3.57"
  - git push origin master --tags -->
- 佈署到 Prod && Demo, 觸發條件：下 tag，tag 名稱前綴需為 【 abProd- 】（大小寫需一致）
  - git tag -a "abProd-v0.1" -m "abProd-v0.0.1"
  - git push origin master --tags