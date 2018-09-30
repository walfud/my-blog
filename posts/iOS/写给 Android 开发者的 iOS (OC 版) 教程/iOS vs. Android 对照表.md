| iOS | Android | 描述 |
| :-: | :-: | :------ |
| ipa | apk | 安装包 |
| Info.plist | AndroidManifest.xml | 清单文件 |

### APP 会被立刻 Kill 的行为
| 分类 | iOS | Android | 描述 |
| :-: | :- | :- | :- |
| UI | APP 处于后台执行 OpenGL ES 绘制操作 | - | - |
| 网络 | - | UI 线程发起原生网络同步请求 | - |
| - | Suspended 时还持有 shared resources (比如 Address Book, Calendar Database 等) | - | - |
| ANR | <ul><li>启动: 5s 限制, 超时系统会杀进程</li> <li>切后台(applicationDidEnterBackground:): 5s 内必须返回</li></ul> | <ul><li>启动: 10s</li> <li>Touch Dispatch: 5s 超时</li> <li>Foreground/Background Broadcast Receiver: 10s/60s 超时</li> <li>Foreground/Background Service: 20s/200s 超时</li></ul> | Android 参考: http://androidxref.com/9.0.0_r3/xref/frameworks/base/services/core/java/com/android/server/am/ActivityManagerService.java#579 以及 http://androidxref.com/9.0.0_r3/xref/frameworks/base/services/core/java/com/android/server/am/ActiveServices.java#115 |