import fs from 'fs';
import path from 'node:path';

/** 读取参数文件 params.json */
function loadParams(basePath, fileName) {
    //取得目前档案的位置
    //const __dirname = path.dirname(new URL(import.meta.url).pathname);
    console.log('dirname:', __dirname);
    const filePath = path.join(__dirname,basePath, fileName); // 拼接路径
    //console.log('path',path.dirname(filePath));
    console.log('filePath:', filePath);
    const params = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return params;
}


// 將所有函數封裝為一個對象並導出
const files = {
    loadParams,
};
export default files;