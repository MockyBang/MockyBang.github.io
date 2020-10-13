---
title: python3 字典切片
top: false
cover: false
toc: true
mathjax: true
date: 2020-10-13 19:36:58
password:
summary:
tags:
categories:
---

# Python3 字典切片

python 的 list, string, tuple 都提供了切片操作，用起来非常方便。有时候会需要对字典进行截取，只需要其中一部分数据。然而 python 的 dict 没有提供类似的切片操作，所以就得要自己实现。

其实也很简单：先取出所有 keys，再对 keys 切片，然后用得到的键去字典里找值重新创建一个新的字典。

## 示例代码

```python
def dict_slice(adict, start=None, end=None):
    """
    字典切片
    """
    adict_keys = list(adict.keys())
    if start and end:
        adict_keys = adict_keys[start:end]
    elif start:
        adict_keys = adict_keys[start:]
    elif end:
        adict_keys = adict_keys[:end]
    else:
        adict_keys = adict_keys[:]

    return {k: adict[k] for k in adict_keys}
```

---

## 简单验证

```python
In [2]: test = {0: "世界", 1: "你好", 2: "ANDROID", 5: "CENTOS"}

In [3]: dict_slice(test, start=2)
Out[3]: {2: 'ANDROID', 5: 'CENTOS'}

In [4]: dict_slice(test, end=2)
Out[4]: {0: '世界', 1: '你好'}

In [5]: dict_slice(test, start=1, end=3)
Out[5]: {1: '你好', 2: 'ANDROID'}
```

在某些场景下，如果需要对字典的切片有其他需求，如字典按键值排序等，还可以在创建新字典之前进行处理。
