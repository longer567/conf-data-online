# conf-data-online
An configuration for data in online

### 启动
1. npm install
2. 执行docker-compose以启动运行环境
3. npm run start
4. 访问 localhost:3000 查看前端页面

### Data
##### 数据 value 目前只支持：json, string格式数据的生成
* 根据value的格式自动转化为json或string

### 可输入数据格式
##### 根据正确的预期数据转化为input树与result树
* 例如
```json{
{
    "a": {
        "title": "活动标题1",
        "value": ""
    },
    "b": {
        "title": "活动标题2",
        "value": {}
    },
    "c": {
        "title": "活动标题4与5的对象",
        "value": {
            "d": {
                "title": "活动标题4",
                "value": "ddd"
            },
            "f": {
                "title": "活动标题5",
                "value": "fff"
            }
        }
    }
}
}
```
* result
```json{
{
    "a": "",
    "b": {},
    "c": {
        "d": "ddd",
        "f": "fff"
    }
}
}
```

### 如何使用
##### 生成js与json文件的路径
* //localhost:3000/originValue/{itemName}-{itemHash}-origin.json
* //localhost:3000/jsItems/{itemName}-{itemHash}.js

1. html内使用`<script>`标签引入
2. 使用http请求获取数据