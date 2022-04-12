//=======================
// proxy
// 白話說起來其實就是指我們不會直接操作目標物件，而是會建立一個代理（proxy）負責對目標物件的操作，這麼做的好處除了可以避免
// code duplication 以外，更大的好處是我們可以在 proxy
// 做一些額外的操作，卻不用怕更改到目標物件，而原則上 proxy 會 implement
// 跟目標物件一樣的 interface，因此預計接收原目標物件的 client 同樣是可以接受
// proxy 物件的。proxy 會在收到 client 的請求後做一些特定的操作（optional），再
// delegates works 給真實的目標物件，這就是 design pattern 中 Proxy
// pattern的概念。
//=======================

//
1;devserver 一定要配合HtmlWebpackPlugin產生html檔案，不然沒有回應，a.js裡面 console是不會風應在瀏覽器上的（express同理）
