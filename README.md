#### 鸭博娱乐

<table border="1">
    <tr>
        <th></th>
        <th>廳號(Vendor)</th>
        <th>客端</th>
        <th>落地頁</th>
        <th>廳主端</th>
    </tr>
    <tr>
        <td>QA 測試站</td>
        <td>500015</td>
        <td>https://yb01.66boxing.com/</td>
        <td>https://landing500015.com/</td>
        <td>https://yb01.66polo.com/</td>
    </tr>
    <tr>
        <td>Beta</td>
        <td>100003</td>
        <td>https://ybbe1.qghco.com/ <br/> https://yb0t.66apples.com/</td>
        <td>https://7de4e33aa7a8f.com/</td>
        <td></td>
    </tr>
    <tr>
        <td>Demo</td>
        <td>69</td>
        <td>https://yb0t.66relish.com/</td>
        <td>https://yaboxxx.app/</td>
        <td></td>
    </tr>
    <tr>
        <td>Prod</td>
        <td>67</td>
        <td>https://yaboxxxapp01.com/ <br/> https://yaboxxxapp02.com/</td>
        <td></td>
        <td></td>
    </tr>
</table>

#### 亿元

<table border="1">
    <tr>
        <th></th>
        <th>廳號(Vendor)</th>
        <th>客端</th>
        <th>落地頁</th>
        <th>廳主端</th>
    </tr>
    <tr>
        <td>QA 測試站</td>
        <td>500023</td>
        <td>https://eyt.66boxing.com/</td>
        <td>https://landing500023.com/</td>
        <td>https://eyt.66polo.com/</td>
    </tr>
    <tr>
        <td>Beta</td>
        <td>100004</td>
        <td>https://eyd.66apples.com/</td>
        <td>https://landing74beta.com/</td>
        <td></td>
    </tr>
    <tr>
        <td>Demo</td>
        <td>74</td>
        <td>https://eyd.688lg.com/</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Prod</td>
        <td>41</td>
        <td>https://ey6999.com/ <br/> https://ey0099.com/</td>
        <td></td>
        <td></td>
    </tr>
</table>

#### 丝瓜直播

<table border="1">
    <tr>
        <th></th>
        <th>廳號(Vendor)</th>
        <th>客端</th>
        <th>落地頁</th>
        <th>廳主端</th>
    </tr>
    <tr>
        <td>QA 測試站</td>
        <td>500035</td>
        <td>https://sgqa1.yaslbox.com/</td>
        <td>https://siguatest.com/</td>
        <td>https://sgtt.66polo.com/</td>
    </tr>
    <tr>
        <td>Beta</td>
        <td>100009</td>
        <td>https://sgbe1.grtymart.com/</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Demo</td>
        <td>81</td>
        <td>https://sgt.66relish.com/</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Prod</td>
        <td>80</td>
        <td>https://sgpr1.yaslart.com/ <br/> https://siguaxxxapp01.com/ <br/> https://siguaxxxapp02.com/</td>
        <td></td>
        <td></td>
    </tr>
</table>

#### 澳博国际

<table border="1">
    <tr>
        <th></th>
        <th>廳號(Vendor)</th>
        <th>客端</th>
        <th>落地頁</th>
        <th>廳主端</th>
    </tr>
    <tr>
        <td>QA 測試站</td>
        <td>9999905</td>
        <td>https://auqa1.66boxing.com/</td>
        <td>https://auqa0.66boxing.com/</td>
        <td>https://952t.66polo.com/</td>
    </tr>
    <tr>
        <td>Beta</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Demo</td>
        <td>93</td>
        <td>https://aude1.688lg.com/</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Prod</td>
        <td>92</td>
        <td>https://aupr1.688lg.com/</td>
        <td>https://aupr6.688lg.com/</td>
        <td></td>
    </tr>
</table>

#### 51 国际

<table border="1">
    <tr>
        <th></th>
        <th>廳號(Vendor)</th>
        <th>客端</th>
        <th>落地頁</th>
        <th>廳主端</th>
    </tr>
    <tr>
        <td>QA 測試站</td>
        <td>9999905</td>
        <td>https://spqa1.66boxing.com/</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Beta</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Demo</td>
        <td>95</td>
        <td>https://spde1.688lg.com/</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Prod</td>
        <td>94</td>
        <td>https://sppr1.688lg.com/</td>
        <td></td>
        <td></td>
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
