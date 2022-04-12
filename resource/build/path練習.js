//在resource開terminal
var path = require("path");

console.log(path.resolve(".", "..", __dirname)); // #/Users/jason_tsai/project/筆記/resource/build
//依序執行 cd x ->cd y ->cd z 返回的絕對路徑 x='.'得node工作絕對路徑  y='..' 得node工作絕對路徑的上一層 z=__dirname得目標js檔的絕對路徑
//比如 path.resolve('/foo/bar', './baz') 可以看成下面命令的結果 #cd /foo/bar; cd ./baz

//- __dirname：     總是回傳被執行 js 檔所在資料夾的絕對路徑
// - __filename：    總是回傳被執行 js 檔的絕對路徑
// - process.cwd()： 總是回傳執行 node 指令時所在的資料夾之絕對路徑
// - ./:             和 process.cwd() 一樣

console.log(path.join(__dirname)); //#/Users/jason_tsai/project/筆記/resource/build
console.log(path.join(__dirname + "..")); // #/Users/jason_tsai/project/筆記/resource (+'..')的效果是把最後一個 “/路徑“消掉
