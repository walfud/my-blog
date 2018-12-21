# 类型 (Type)
区分标量和

## 向量 (Vector)

### 数字 (Number)

### 字符串 (String)

### 布尔 (Bool)

### 空值 (null)

### 集合 (Collection)
#### 数组 (Array)
#### 映射 (Map)

## 标量 (Scalar)
todo: 只有在必要的地方, 否则尽量不要使用标量这种机器原生类型.

### 原生数字 (Native Number)
#### 原生整数 (Native Integer)
| 长度(bit) | 关键字 |
| :-: | :- |
| 8 | _Int8 |
| 32 | _Int32 |
| 64 | _Int64/_Int |
| 机器字长 | _IntMachine |

#### 原生浮点 (Native Float)
| 长度(bit) | 关键字 |
| :-: | :- |
| 64 | _Float64/_Float |

#### 原生字符 (Native Character)
| 长度(bit) | 关键字 |
| :-: | :- |
| 8 | _Char |

#### 原生字节 (Native Byte)
| 长度(bit) | 关键字 |
| :-: | :- |
| 8 | _Byte |

### 字面量表示 (Literals)
* 二进制: 
  - 0b11110000 
  - 0b1111_0000 (可以使用 ‘_’ 进行 4 位分割)
  - 0b11110000_00000000 (也可以 8 位分割)
* 十进制: 
  - 30000000/30000000.0
  - 30,000,000/30,000,000.0 (可以使用 ‘,’ 进行千分位分割)
* 十六进制
  - 0xff3355aa

# 语句 与 表达式 (Statement & Expression)
语句没有返回值, 而表达式有返回值.

# 