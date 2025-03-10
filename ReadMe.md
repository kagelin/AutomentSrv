# Automent Poc

## 专案建立步骤

1. 安装 Express```npm install express --save```
1. 安装 Express 应用程式产生器 ```npm install express-generator -g```
1. 建立专案 ```express --view=pug AutomentPoc```
1. 到专案目录 ```cd AutomentPoc```
1. 初始化专案 ```npm install```
1. 在 MacOS 或 Linux 中，使用下列指令來執行應用程式 ```$ DEBUG=myapp:* npm start```

## 物件结构

```Typescript
Task:{
    id:number,
    descript:string,
    refCode:abegActions.login
}

Job:[Task..]

```
