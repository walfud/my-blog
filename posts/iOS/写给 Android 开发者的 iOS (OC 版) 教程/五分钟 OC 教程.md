OC 语法在现在看来很怪异. 是因为它主要语法结构来自 Smalltalk, 而其底层又是将其编译成 C. 五分钟来总结一下 OC 的常见语法.

# 基础类型 & 常用类

### 基础类型
* id: 指向任何指针类型
* nil: 类似于 Java 中的 null. 不过 OC 会对任何定义后没赋值的变量赋初值 nil. 

### 变量弱引用 (__weak)
对于指针, 在使用的时候需要注意一点, 就是避免 *循环强引用 (strong reference cycles)*. 因为 OC 是基于引用计数实现的内存管理, 所以循环引用会导致相关的对象都无法被 gc 回收. 我们来举个例子:
```Objective-C
// 循环引用, 导致 gc 无法回收任何对象而发生内存泄漏
NSDate *originalDate = self.lastModificationDate;
self.lastModificationDate = [NSDate date];
```

正确的做法是在循环引用中使用弱引用:
```Objective-C
// 正确处理
NSDate * __weak originalDate = self.lastModificationDate;
self.lastModificationDate = [NSDate date];
```

### 常用类和方法
* NSObject
  - isEqual: 用于对象之间判断内容相等性. 对象不能用 `==` 直接判断是否相等, `==` 会简单的比较对象的指针, 因此只有两个对象地址相同才会认为相等.
    ```Objective-C
    if ([obj isEqual:anotherObj]) {
        // 如果 obj == anotherObj
        ...
    }
    ```
  - compare: 用于对象之间比较内容大小. 对象也不能用 `>` 或 `<` 判断大小, `<` 或 `>` 直接对比对象指针的大小.
    ```Objective-C
    if ([someDate compare:anotherDate] == NSOrderedAscending) {
        // NSOrderedAscending(-1), NSOrderedSame(0), NSOrderedDescending(1)
    }
    ```

# Function

### 函数定义
先来看个例子:

```java
// Java
public class JavaClass {

    public int foo(int i, String s) {
        ...
    }

}
```

对应到 OC 的代码:
```Objective-C
// OC .m File
- (int)bar:(int)i str:(String s) {
    ...
}
```

主要看函数声明部分. 对于 OC 而言, 可以拆分为如下几个部分:

![](./assets/oc%20function%20signature.png)

与 Java 的函数不同, OC 语言并不支持函数重载 (overload), 函数签名仅仅由函数名决定. 而 OC 的函数名比较复杂, 是由多个 `foo:(int)i` 与 `bar:(NSString *)str` 这种 '部分函数名 : 参数描述' 的 Key-Value 结构组成的. 

OC 的函数签名, 就是把多个分组的函数名拼在一起, 比如上面的函数签名对应为: `foo:bar:`. 

可见, OC 函数只包含函数名部分, 无论是 *返回值* 还是 *函数参数类型* 都不是决定函数签名的因素.

### 函数调用
在 OC 中, 没有 *函数调用* 这个概念. 如果想调用另一个函数的某个方法, 在 OC 世界中叫做给某个对象 *发消息*. 语法对比如下:

```java
// Java
obj.someMethod(123, "blabla");
```

对比 OC
```Objective-C
// OC
[obj someMethod:123 otherParam:"blabla"];
```

上面的 OC 代码翻译为: *向 obj 对象发送 'someMethod 参数为 123' 且 'otherParam 参数为 "blabla"' 的消息*. 

函数也支持嵌套调用, 比如我们常见的创建对象的方法:
```Objective-C
// OC
MyClass *my = [[MyClass alloc] init];   // 相当于 Java: MyClass my = new MyClass();
```

首先是 `[MyClass alloc]` 分配内存, 其返回值就是 MyClass 对象. 然后在该对象上继续调用 `init` 方法初始化.

### 匿名函数 (Block)
匿名函数是 language-level 的一个扩展. 在 OC 中, 匿名函数也是一个对象, 因此你可以将它作为参数传递给别的函数, 或者存储在 NSArray 中.

# Class
OC 是 C 语言的超集, 因此也区分 *头文件(Header File, 文件名为 Xxx.h)* 和 *实现文件(Implementation File, 文件名为 Xxx.m)*. 前者是用于声明某个模块或者类 *具备哪些公共属性和方法*, 后者用于具体的实现. 因此, 类的公共属性和方法应该放在头文件中, 私有属性和方法以及所有的具体实现应该放在实现文件中. 

我们来对比看一下语法:
```java
// Java
public class JavaClass {
    public int mSomeValue;
    private String mAnotherValue;

    public void foo() {
        // ...
    }

    private void bar() {
        // ...
    }
}
```

```Objective-C
// OC 头文件
#import <Foundation/Foundation.h>

@interface OCClass : NSObject {
    NSString *anotherValue;
}

@property int someValue;

- (void)foo;

@end
```
```Objective-C
// OC 实现文件
@implementation

- (void)foo {
    // ...
}

- (void)bar {
    // ...
}
@end
```

`: NSObject` 是指继承自 'NSObject' 这个类, 因为 OC 必须要写基类, 所以必须要加上这段. 后面 [继承](# TODO: ) 中会讲.

'antoerhValue' 即可以写在 interface 中也可以写在 implementation 中, 我个人感觉两者是等价的. 此外, 还可以写在 [扩展类](#类增强%20(Category%20&%20Extension)) 里面, 后面会提到.

### @property
在 OC 头文件中, 通过 `@property` 指定类的属性. 编译期遇到 `@property` 默认会做两件事:
1. 生成类的真实属性, 并加以 `_` 前缀, 例如: `@property int someValue` 会给类生成 '_someValue' 的属性.
2. 生成上述属性的 getter/setter 方法(如果没有的话). getter: `- (int) someValue();` 以及 setter: `- (void)setSomeValue:(int)i;`

例如:
```Objective-C
// OCClass.h
#import <Foundation/Foundation.h>

@interface OCClass : NSObject

@property int someValue;
@property int anotherValue;

@end
```

今后就可以这样使用:
```Objective-C
OCClass *ocClass = ...;

[ocClass setSomeValue:1234];
NSLog(@"%d", [ocClass getSomeValue]);
```

也正是上述原因, 在 OC 中类的属性一般都是 xxxYyy 直接命名, 而不带 Java 中常见的 'm' 前缀.

有很多描述符可以改变编译器对于 @property 的行为, 我们来看一下 @property 的完全态:

```Objective-C
@property   (方法名, 读写权限, 内存管理语义, 原子性)   变量类型   变量名;
```
默认情况下:
```Objective-C
@property (readwrite, assign, atomic) 变量类型 变量名;
```

各个标记的作用参见下表:

<table>
  <tr>
    <th>分类</th>
    <th>标记</td>
    <th>作用</td>
  </tr>

  <tr>
    <th rowspan="2">方法名</th>
    <td>getter = xxx</td>
    <td>重命名 getter 方法</td>
  </tr>
  <tr>
    <td>setter = xxx</td>
    <td>重命名 setter 方法</td>
  </tr>

  <tr>
    <th rowspan="2">读写权限</th>
    <td>readwrite</td>
    <td>默认值. 编译器自动生成 getter/setter 方法</td>
  </tr>
  <tr>
    <td>readonly</td>
    <td>编译器仅生成 getter 方法</td>
  </tr>

  <tr>
    <th rowspan="2">内存管理语义</th>
    <td>strong</td>
    <td>默认值</td>
  </tr>
  <tr>
    <td>weak</td>
    <td>由于 OC 的 GC 基于引用计数, 因此需要手动管理引用避免 Strong Reference Cycles. 参见: https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/EncapsulatingData/EncapsulatingData.html 中 'Avoid Strong Reference Cycles' 小节</td>
  </tr>
  <tr>
    <td>copy</td>
    <td>自动调用参数的 copy 方法, 因此该属性必须支持 NSCopying 协议</td>
  </tr>

  <tr>
    <th rowspan="2">原子性</th>
    <td>atomic</td>
    <td>默认值. 编译器内部实现, 保证读写属性的原子性. 这个属性比较消耗性能, 因此一般都会使用 nonatomic</td>
  </tr>
  <tr>
    <td>nonatomic</td>
    <td>一旦自己提供了该属性的 setter 方法, 则编译器无法为该属性自动实现原子性的 getter 方法. 因此需要这个标记消除编译器警告, 同时也用于提示该属性并不保证原子性</td>
  </tr>

</table>

### @synthesize
此外, 我们还可以通过在实现文件中的 `@synthesize` 关键字修改编译器生成的类属性的名字. 例如:

```Objective-C
// OCClass.m
#import "OCClass.h"

@implementation

@synthesize someValue;              // 不加任何赋值的情况下, 编译器直接生成同名属性而不会添加 '_' 前缀
@synthesize anotherValue = fooBar;     // 编译器将生成 'fooBar' 的属性, 并将 'anotherValue' 的 getter/setter 方法对应到这个属性

@end
```

'@synthesize' 仅仅影响类真实属性的名字(即 '@property' 第一步的行为), 而不影响 getter/setter 的名字.

最佳实践是: 除了在 initialization, deallocation 或者 自定义的 getter/setter 方法中, 尽可能的使用点号操作符和 getter/setter 方法, 即便是在当前类的实现中.

其他怪异行为: 一般情况下 '@property' 都会生成类的真实属性. 然而 *如果 readwrite 的属性, 同时自定义了 getter/setter* 或者 *readonly 属性却自定义了 getter 方法*, 则编译器就不会自动为我们创建类的真实属性. 如果你仍然需要这个真实属性的存在, 可以在实现文件中使用 '@synthesize property = _property;' 强制编译器生成. 

### .(点号) 运算符
OC 中增加一种语法糖, 即 *.(点号) 运算符*, 如下:
```Objective-C
NSLog(somePerson.firstName);        // 等价于 NSLog([somePerson getFirstName]);
somePerson.firstName = @"Johnny";   // 等价于 [somePerson setFirstName:@"Johnny];
```

其实点号运算符就是 getter/setter 的 wrapper. 

### 初始化 (构造函数)
准去的说, 在 OC 中没有构造函数这个概念, 所有对象的初始化由一个 `- (id)init:` 函数完成. 以下是一个标准模板:
```Objective-C
- (id)init { 
    if (self = [super init]) {
        // initialize instance variables here
    }
 
    return self;
}
```

也可以自己定义初始化函数. 但是多个初始化函数之间应该有一个 '主要初始化函数' 负责所有类属性的初始化, 而其他初始化函数都应该委托主要初始化函数完成初始化工作. 

```Objective-C
@implementation

- (id)init {
    return [self initWithSomeValue:123 anotherValue:456];
}

- (id)initWithSomeValue:(int)i anotherValue:(int)i2 {
    if (self = [super init]) {
        // initialize instance variables here
        _someValue = i;
        _anotherValue = i2;
    }

    return self;
}

@end
```

### 继承
TODO: 

# 类增强 (Category & Extension)
### 分类 (Category)
'分类' 用于给某个已存在的类添加方法, 无论是 Framework 的类(比如 NSString) 还是我们自己写的类. 但要注意的是, Category 只能用于增加方法, 而不能增加属性. 用法如下:
```Objective-C
// NSString+Xxx.h
@interface NSString (Xxx) 

- (void)newMethod;

@end
```
```Objective-C
// NSString+Xxx.m
@implementation NSString (Xxx)

- (void)newMethod {
    //
}

@end
```

一般来说, 分类都是以 '原有类名+分类类名' 命名的. 其实分类类名并没有什么卵用, 只是为了语义比较清楚.

使用的时候, 凡是需要使用到分类提供的方法时, 都需要 import 分类的头文件, 例如:
```Objective-C
// 
#import "NSString+Xxx.h"

...

NSString *str = @"blabla";
[str newMethod];

...
```

##### 避免方法名冲突
根据官方文档描述, 如果 Category 与原有类方法重名(无论是原有方法还是继承来的方法), 或者与其他 Category 方法名冲突, 则在 Runtime 期间的行为是不可预知的. 

有时我们引入了 A 类库, 它为 NSString 增加了某个方法. 后来你又引入了 B 库, 而 B 库恰好也为 NSString 引入了同名的方法. 这时最容易引发未知的问题. 因此我们要避免发生方法名冲突.

官方建议新方法都加前缀, 如 'xyz_newMethod'. 

### 扩展 (Extension)
'扩展' 用于给既有类增加私有属性. 但是只能给 *已有源码的类* 增加属性. 因为 '扩展' 的原理是最终与原有类一起进行编译, 因此我们只能扩展可以看到源码并进行编译的类.

扩展的代码要写在类的实现文件中:
```Objective-C
// OCClass.m
@interface OCClass () 

// 这里扩展新的属性
@property int z;

@end

@implementaion OCClass 

...

@end
```

当然, 你也可以把扩展的代码写在单独的一个 .h 文件中, 然后再 .m 文件中 import 即可. 在 OC 中一种很常见的模式就是一个类有两个头文件:  'Xxx.h' 和 'XxxPrivate.h'.

在 Extension 中增加的属性在其他类中是无法引用的, 因此 Extension 的作用就是给类增加私有属性.

由于 Extension 和 Category 语法结构一致, 除了没有名字. 因此也被称为 '匿名分类(Anonymous Categories)'.

# 接口 (Protocol)
OC 中用 `@protocol` 定义接口, 例如:
```Objective-C
@protocol MyProtocol

- (void)foo;

+ (void)bar;

@end
```

然后我们通过特定的语法实现接口:
```Objective-C
// MyClass.h
@interface MyClass : NSObject <MyProtocol, MyProtocol2, ...>

...

@end
```

接口的使用语法上也比较特殊, 任何 '接口对象' 都必须是 `id` 类型, 同时表明该对象所实现的接口:
```Objective-C
id <MyProtocol> my = ...;
[my foo];
```

### 可选方法 (@optional)
默认情况下接口中的方法都是必选的(@required), 不过接口中的方法也可以是可选实现的. 例如:
```Objective-C
@protocol OptProtocol <NSObject>

- (void)foo;

@optional
- (void)optFunc1;
- (void)anotherOptFunc2;

@required
- (void)bar;
- (void)baz;

@end
```
'@optional' 后面的方法都是可选的(例子中的 `optFunc1:` 和 `optFunc2:`), 除非显示使用 '@required' 重新定义为必选的.

这个例子中多了 `<NSObject>`. 意思是让 `OptProtocol` 继承自 `NSObject`. 不过这里的 'NSObject' 是 `@protocol NSObject` 而不是我们之前见到的 `@interface NSObject` 类. 

让我们的 OptProtocol 继承自 NSObject 的目的就是在使用可选方法时, 提供检查可选方法是否存在的能力:
```Objective-C
MyClass *myClass = ...;
if ([myClass respondsToSelector:@selector(optFunc1:)]) {
    ...
}
```

# Error Handling

# 代码规范


# Refs
[官方 Programming with Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html#//apple_ref/doc/uid/TP40011210)

[官方 Objective-C Runtime Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40008048-CH1-SW1)

[官方 Objective-C Runtime](https://developer.apple.com/documentation/objectivec/objective-c_runtime)

[官方 Transitioning to ARC Release Notes](https://developer.apple.com/library/archive/releasenotes/ObjectiveC/RN-TransitioningToARC/Introduction/Introduction.html#//apple_ref/doc/uid/TP40011226)