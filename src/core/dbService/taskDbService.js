import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'automenttry';
const client = new MongoClient(url);

async function connect() {
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    const db = client.db(dbName);
    return db;
}

async function storeTasks(tasks) {
    const db = await connect();
    const tasksCollection = db.collection('tasks');
    await tasksCollection.insertMany(tasks);
    await client.close();
}

async function getTasks() {
    const db = await connect();
    const tasksCollection = db.collection('tasks');
    const tasks = await tasksCollection.find({}).toArray();
    await client.close();
    return tasks;
}

// const tasks = [{
//     id: 1,
//     name: 'login',
//     description: '登录',
//     screenShot: 'login.png',
//     refCode: 'login'
// }, {
//     id: 2,
//     name: 'clickMenu',
//     description: '点击菜单',
//     screenShot: 'clickMenu.png',
//     refCode: 'clickMenu'
// }, {
//     id: 3,
//     name: 'clickExport',
//     description: '点击导出按钮',
//     screenShot: 'clickExport.png',
//     refCode: 'clickExport'
// }, {
//     id: 4,
//     name: 'clickExportConfirm',
//     description: '点击导出按钮确认',
//     screenShot: 'clickExportConfirm.png',
//     refCode: 'clickExportConfirm'
// }];

// storeTasks(tasks).then(() => console.log('Tasks stored successfully'));