## 初始化

```
npm init
```
## 安装 express cookie body-parser markdown mongoose swig
```
npm i express cookie body-parser markdown mongoose swig -S
```

## 连接数据库

在一个终端里输入：
```
sudo mongod --config /usr/local/etc/mongod.conf
```
在别外一个终端里输入：
```
mongod
```
```
mongod --dbpath=/Users/lipanke/Documents/mygit/nodeblog/db --port=27018
```
这时候就会看到waiting for connections on port 27018这个东西
去打开robomongo 建立连接
