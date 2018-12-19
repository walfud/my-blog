# 基础类型
```Objective-C
NSNumber *i = @123;             // int i = 123;
NSNumber *d = @1.23;            // double d = 1.23;
NSString *s = @"I'm string";    // char *s = "I'm string";
```

### 空类型
OC 有 nil, null, NULL, NSNULL 四种空类型. 用法如下:
```Objective-C
// 所有指针对象的初值, 类似于 Java 的 null
NSString *str = nil;    

// 唯一的作用就是作为集合元素中, 代表空元素
// 因为在 OC 集合中 nil 代表结束符号
@[@123, @456, [NSNull null], @789];

// 仅用于 C 语言兼容部分
char *pStr = NULL;
```

### 枚举
```Ojbective-C
// 排他性, 一般用于表明某种 '状态'
typedef NS_ENUM(NSInteger, XYZStatus) {
    XYZStatusOK = 0,
    XYZStatusFail,
    XYZStatusCancel,
};

// 一般用于组合某些 '选项'
typedef NS_OPTIONS(NSUInteger, XYZLang) {
    XYZLangC   =      1,
    XYZLangCPP = 1 << 1,
    XYZLangJS  = 1 << 2,
};
```

# 函数
![](./assets/oc%20function%20signature.png)

上述函数的签名为: 'foo:bar:'

调用方法为: [someObj foo:@123 bar:@"text"]

### 匿名函数 (Block)
```Objective-C
int outterVar = @1;

NSString *(^foo)(int, int) = ^ NSString *(int i, int i2) {
    int sum = i + i2 + outterVar;   // outterVar 是常量, 且无法反应外部的修改
    return @"blabla";
}

foo(@1, @1);        // 1 + 1 + 1 == 3

outterVar++;        // outterVar == 2

foo(@1, @1);        // 依然是: 3. 捕获的变量在 Block 定义的时候, 其值就确定, 后续外部修改对 Block 内部不可见
```
Block 内部可以捕获外部变量, 但是:
1. 捕获的变量在 Block 定义的时候, 所有外部捕获的变量都会拷贝一份给 Block 使用, 因此后续外部修改对 Block 内部不可见
2. 捕获的变量在 Block 内部是常亮, 无法修改

若想共享外部捕获的变量, 可以使用 __block 修饰变量. 同时在 Block 内部也可以修改该变量:
```Objective-C
__block int sharedVar = @123;   // 使用 __block 修饰变量

NSString *(^foo)(int, int) = ^ NSString *(int i, int i2) {
    int sum = i + i2 + sharedVar;   // sharedVar 与外部是同一个变量, 可以修改
    return @"blabla";
}

foo(@1, @1);        // 1 + 1 + 1 == 3

sharedVar++;        // outterVar == 2

foo(@1, @1);        // 1 + 1 + 2 == 4. 共享外边的变量
```

此外, 还有作为参数和属性的 Block, 语法上略有差别:
```Objective-C
@interface XYZObject : NSObject

@property (copy) void (^blockProperty)(void);

- (void)foo:(NSString *(^)(int, int));

@end
```

# 集合 (Collection)
OC 的集合类型可以容纳任意类型的元素, 相当于 Java 中的 Array<Object>.
```Objective-C
// 数组
NSArray *array = @[@123, @456, @"text"];   // [NSArray arrayWithObject:@123, @456, @"text", nil]
[array count];
[array objectAtIndex:2];
for (id object in array) {
    NSLog(@"Object: %@", object);
}
// 可变数组
NSMutableArray *mutableArray = [@[@123, @456, @"text"] mutableCopy];
// 增
[mutableArray addObject:@"new item"];
// 删
[mutableArray removeObjectAtIndex:2];
// 改
[mutableArray replaceObjectAtIndex:0 withObject:@"0000"];

// 字典
// NSDictionary *dictionary = [NSDictionary dictionaryWithObjectsAndKeys:
//                     @"value0", @"key0",
//                           @42, @"key1", 
//                     @"value2", @'key2',
//                                nil];
// 注意语法糖版本和原始版本 KV 的顺序是相反的 😑
NSDictionary *dictionary = @{
                @"key0" : @"value0",
                @"key1" : @42,
                @"key2" : @"value2",
             };
[dictionary count];
[dictionary objectForKey:@"key1"];
for (NSString *key in dictionary) {
    id object = dictionary[key];
    NSLog(@"Object: %@ -> %@", key, object);
}
// 可变字典
NSMutableDictionary *mutableDictionary = [@{
                @"key0" : @"value0",
                @"key1" : @42,
                @"key2" : @"value2",
             } mutableCopy];
// 增/改
[mutableDictionary setObject:@"new value" forKey:"key999"];
// 删
[mutableDictionary removeObjectForKey:@"key2"];
```

# 类与继承 (Class & Inheritance)
```Objective-C
// OC 头文件
#import <Foundation/Foundation.h>

@interface OCClass : NSObject {
    NSString *anotherValue;             // 实例属性
}

@property int someValue;                // 实例属性, 同时编译器自动生成 getter/setter 方法

- (void)foo:(int)i bar:(NSString *)s;   // 实例方法

+ (void)baz;                            // 类的静态方法

@end
```
```Objective-C
// OC 实现文件
@implementation

- (void)foo:(int)i bar:(NSString *)s {
    // ...
}

+ (void)baz {
    // ...
}

@end
```

使用方法:
```Objective-C
OCClass *ocClass = [OCClass new];   // [[OCClass alloc] init]

// 读写实例属性
int i = ocClass.someValue;      // 调用 getter 方法语法糖, 相当于: [ocClass i]
ocClass.someValue = @456;       // [ocClass setSomeValue:@123]

// 调用实例方法
[ocClass foo:@123 bar:@"text"];

// 调用类方法
[OCClass baz];
```

'alloc' 与 'init' 一般成对使用, 一个分配内存一个初始化内存.

OC 中调用函数的方式为 '向某个对象发送消息', 例如 '[ocClass foo:@123 bar:@"text"]' 可以理解为向 ocClass 对象发送消息, foo 参数为 @123, bar 参数为 @"text".

# 协议 (Protocol)
OC 使用 @protocol 定义一个类必须实现的方法, 其实就是 Java 中接口的概念.
* OC `interface` -> Java `class`: OC 的 interface 用来定义类, 相当于是 Java 的 class
* OC `protocol` -> Java `interface`: OC 的 protocol 用来定义协议, 相当于是 Java 的 interface

不过 OC 的协议即可以约定实例方法也能约定类方法:
```Objective-C
// MyProtocol.h
@protocol MyProtocol

- (void)foo;

+ (void)bar;

@end
```
```Objective-C
// OCClass.h
#import <Foundation/Foundation.h>

@interface OCClass : NSObject <MyProtocol>

- (void)foo;

+ (void)bar;

@end
```

协议的使用:
```Objective-C
id <MyProtocol> myProtocol = [[OCClass alloc] init];
[myProtocol foo];
```

# 分类 (Category)
'分类' 用于扩展一个已有类, 可以增加方法, 但不能增加属性.
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
一般 '分类' 的文件都以 '原始类名+分类名' 命名. 

使用的时候, 凡是需要使用到分类提供的方法时, 都需要 import 分类的头文件, 例如:
```Objective-C
// 
#import "NSString+Xxx.h"

...

NSString *str = @"blabla";
[str newMethod];

...
```

# 扩展
'扩展' 是一种特殊的 '分类', 用于给 *已有源码的类* 增加私有属性.

'扩展' 的代码要写在类的实现文件中:
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

# 反射
OC 中也存在 Class 类, 与 Java 中的 Class 作用相同. 但是在 OC 中, 方法使用 SEL 类型变量. 反射最终通过对象的 ‘performSelector’ 执行.
```Objective-C
Class klass = NSClassFromString(@"UIView");
UIView *v = [[klass alloc] initWithFrame:CGRectMake(20, 20, 120, 120)];
[self.view addSubview:v];

SEL sel = @selector(setBackgroundColor:);
[v performSelector:sel withObject:[UIColor redColor]];
```
performSelector 仅支持 ‘无参’, ‘一个参数’, ‘俩个参数’ 形式. 如果方法无参或多余一个参数, 则需要使用更底层的 NSInvocation 形式:
```Objecive-C
// [foo withFirstArg:@1 second:@2 third:@3 fourth:@4]
Foo *foo = [[Foo alloc] init];
SEL sel = @selector(withFirstArg:second:third:fourth:);
NSMethodSignature *methodSignature = [Foo.class instanceMethodSignatureForSelector:sel];

// 带调用的方法
NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:methodSignature];
[invocation setTarget:foo];
[invocation setSelector:sel];

// 设置参数. index 从 2 开始
id arg1 = @1, arg2 = @2, arg3 = @3, arg4 = @4;
[invocation setArgument:&arg1 atIndex:2];
[invocation setArgument:&arg2 atIndex:3];
[invocation setArgument:&arg3 atIndex:4];
[invocation setArgument:&arg4 atIndex:5];

// 发起调用
[invocation invoke];

// 返回值
id rtn = nil;
[invocation getReturnValue:&rtn];
```

# KVO
在 OC 中, KVO 通过观察者模式, 可以监控 "对象的属性" 的改变. 比如: 某个属性的值被修改了, 这时会通过回调通知你.

1. 假如有一个普通的类, 包含两个属性
   
  ```Objective-C
  // KVO.h
  
  #import <Foundation/Foundation.h>
  
  @interface KVO : NSObject
  
  @property (nonatomic, copy) NSString *a;
  @property (nonatomic, assign) int b;
  
  @end
  ```
  ```Objective-C
  // KVO.m
  
  #import "KVO.h"
  
  @implementation KVO
  @end
  ```
  
2. 接下来使用 KVO 进行监听变化.

  ```Objective-C
  - (void)viewDidLoad {
      [super viewDidLoad];
      
      // 观察 KVO 对象
      KVO *obj = [KVO new];
      [obj addObserver:self forKeyPath:@"a" options:(NSKeyValueObservingOptionOld | NSKeyValueObservingOptionNew) context:nil];
      [obj addObserver:self forKeyPath:@"b" options:(NSKeyValueObservingOptionOld | NSKeyValueObservingOptionNew) context:nil];
      
      // 触发 KVO 通知
      obj.a = @"new string";
      obj.b = 1234;
      
      // 移除观察者
      [obj removeObserver:self forKeyPath:@"a"];
      [obj removeObserver:self forKeyPath:@"b"];
  }
  
  - (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
  {
      if ([object isKindOfClass:[KVO class]]) {
          if ([keyPath isEqualToString:@"a"]) {
              NSLog(@"'a' change: %@ -> %@", change[NSKeyValueChangeOldKey], change[NSKeyValueChangeNewKey]);
          } else if ([keyPath isEqualToString:@"b"]) {
              NSLog(@"'b' change: %@ -> %@", change[NSKeyValueChangeOldKey], change[NSKeyValueChangeNewKey]);
          }
      }
  }
  ```

# 运行时类型判断
```Objective-C
UILabel *label = [[UILabel alloc] init];

// ’isKindOfClass‘ 判断子类实例, 类似 Java 的 `instanceof`
[label isKindOfClass:[UIView class]];       // YES
[label isKindOfClass:[UIImage class]];      // NO

// ’isMemberOfClass‘ 判断当前类实例, Java 中没有对应的方法. 
[label isMemberOfClass:UILabel.class];      // YES
[label isMemberOfClass:UIView.class];       // NO

// 当前对象是否遵守某协议
[label conformsToProtocol:@protocol(UIContentSizeCategoryAdjusting)];       // YES
[label conformsToProtocol:@protocol(UIContentContainer)];      // NO

// 当前对象是否实现这个方法或存在这个属性
[label respondsToSelector:@selector(@"initWithFrame:)];       // YES. 方法
[label respondsToSelector:@selector(@"backgroundColor)];       // YES. 属性
[label respondsToSelector:@selector(@"fooooo:)];      // NO
```

# Refs
[国外精简教程](http://cocoadevcentral.com/d/learn_objectivec/)