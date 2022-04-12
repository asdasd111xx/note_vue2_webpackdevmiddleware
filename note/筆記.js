history Api
// https://www.796t.com/article.php?id=234791

// History
// .back()上一頁
// .forward()下一頁
// .go(x)到第x頁

// pushState() 僅新增url，頁面保持當前。
// replaceState() 僅修改url，頁面保持當前。

// popState事件
// 每當同一個文件的瀏覽歷史（即history物件）出現變化時，就會觸發popstate事件。簡單可以理解為，每次我們需要修改url 那麼必定是先出發了popState事件，瀏覽器的位址列隨後才會發生改變。

// 注意，僅僅呼叫pushState()方法或replaceState()方法 ，並不會觸發該事件，**只有使用者點選瀏覽器倒退按鈕和前進按鈕，或者使用 JavaScript 呼叫History.back()、History.forward()、History.go()方法時才會觸發。**另外，該事件只針對同一個文件，如果瀏覽歷史的切換，導致載入不同的文件，該事件也不會觸發。

// $router.back(); 代表返回上一個網址path，用這個path 找到對應的component 重新render元件

//============================

$emit
1.
// 父元件
// <my-button @a="parentClicked"></my-button>
// methods:{
//   parentClicked(num){
//     console.log(num);
//   }
// }

// 子元件
// <button @click="myClick">button</button>
// methods:{
//   myClick(){
//   this.$emit("a")
// }

// 在父元件為子元件註冊a事件，其實際為父元件的parentClicked
// 在子元件 myClick() 來呼叫$emit('a') 來呼叫父元件的parentClicked
2.
// $emit(update(子元件內建“更新”事件): prop(子元件接收到的prop), "newPropVulue") 
// 这个模式，使子组件向父组件传达：更新属性，并抛出新的属性值
// 代表在子元件發送$emit(update...)去更新父元件的該屬性，達到父子元件間的雙向綁定

