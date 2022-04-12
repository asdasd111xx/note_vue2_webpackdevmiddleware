===========

Location.href 属性与 window.open() 方法的区别
Location.href 属性一般用于页面的迭代，也就是重新定位当前页 window.open() 方法可以通过新开窗口或者说新开标签页打开一个网址，而 location.href 属性只能在当前页打开一个网址。

============

    1. 直接用 <a href="a.htm"> 連結的作法
瀏覽器會送出 Referer 這個 HTTP Header
瀏覽器會紀錄連結的歷史紀錄 ( 好讓瀏覽器的 上一頁 、 下一頁 按鈕可以運作 )

2. 透過 JavaScript 的 location.href 指派網址
瀏覽器不會送出 Referer 這個 HTTP Header
瀏覽器會紀錄連結的歷史紀錄 ( 好讓瀏覽器的 上一頁 、 下一頁 按鈕可以運作 )

3. 透過 JavaScript 的 location.replace 傳入網址
瀏覽器不會送出 Referer 這個 HTTP Header
瀏覽器不會紀錄連結的歷史紀錄! ( 瀏覽器將無瀏覽歷史紀錄 )


==============

    vue-router与location.href的用法区别

①vue-router使用pushState进行路由更新，静态跳转，页面不会重新加载；location.href会触发浏览器，页面重新加载一次

②vue-router使用diff算法，实现按需加载，减少dom操作

③vue-router是路由跳转或同一个页面跳转；location.href是不同页面间跳转；

④vue-router是异步加载this.$nextTick(()=>{获取url})；location.href是同步加载
————————————————
版权声明：本文为CSDN博主「小二，来了」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_43258500/article/details/106334515

//本來在http://localhost:8000/mobile/live/iframe/task_wall      
//this.$router.push(`/mobile/live/iframe/home?hasFooter=true`);
//路由會更新（多上一頁）
//watch $route 會觸發
//但由於是在同個元件下執行，並不會重新render(不會再created)