

# URL 
类似于 Android 的 schema. iOS 应用也通过 URL 进行进程内和进程间通讯.

OC 中有专门的类 `NSURL`, 它代表一个 "资源". 对于本地文件, NSURL 可以直接修改文件的 modify time. 对于远程资源, 则有 `NSURLSession`, `NSURLDownload` 等类对应. 

### 发送 URL
发送 URL 需要先构造 NSURL 对象, 然后调用 UIApplication 对象的 openURL 方法:
```oc
NSURL *myURL = [NSURL URLWithString:@"todolist://www.acme.com?Quarterly%20Report#200806231300"];
[[UIApplication sharedApplication] openURL:myURL];
```

如果 URL 成功跳转, 则控制权交给接手 URL 的应用. 

如果有多个 APP 都能够处理该 URL, 则系统会弹出对话框让你选择. 

### 注册自定义 URL 处理器

首先要在 Info.plist 中注册:

TODO: 老文档方法过时, 不可用了. 参考图形界面.

你所注册的所有 URL 请求都会被发给 delegate. 接收 URL 的应用当时所处的不同状态会走不同的生命周期, 见下图:

<div style="display: flex; flex-direction: row; ">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
        <img src="./assets/url%20lifecycle.png" />
        <label>URL 冷启动</label>
    </div>
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin-left: 30px">
        <img src="./assets/url%20lifecycle%20background.png" />
        <label>URL 拉起后台应用</label>
    </div>
</div>

TODO: 代码