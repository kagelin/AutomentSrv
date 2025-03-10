import path from "path";
import fs from 'fs';
import * as fspromises from 'fs/promises';
import cryptoUtils from './crypto.js';

/**
 * 检查 API 是否可用
 * @param {object} page
 * @param {string} apiUrl - 要检查的 API URL
 * @returns {Promise<boolean>} - API 是否可访问
 */
async function isApiPostAvailable(page, apiUrl) {
  try {
    const response = await page.request.post(apiUrl, { timeout: 5000 });
    return response.status() === 200;
  } catch (error) {
    // if (error.response) {
    //   console.error(`API 不可用: ${apiUrl}，状态码: ${error.response.status()}`);
    // } else {
    //   console.error(`API 不可用: ${apiUrl}，错误: ${error.message}`);
    // }
    return false;
  }
}

/** 发送 `multipart/form-data` 格式的 API 请求 
 * @param {object} page - Playwright 的 `page` 实例，用于执行 API 请求。
 * @param {string} apiUrl - 目标 API 的 URL。
 * @param {object} data - 需要发送的表单数据对象，键值对格式，例如：{type: true,value: "123",} - 所有内容转换为string提交
 * @returns 返回 API 响应的 JSON 数据
*/
async function sendMultipartFormData(page, apiUrl, data) {
  const formData = new FormData();

  // 遍历对象，添加到 FormData
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      let value = data[key];
      formData.append(key, value.toString());
    }
  }

  // 发送 POST 请求
  const response = await page.request.post(apiUrl, {
    headers: { 'Accept': 'application/json' },
    multipart: formData
  });

  // 检查请求是否成功
  if (response.ok()) {
    // console.log(`请求成功，API 响应:`, response.json());
    // 解析 JSON 并返回
    return await response.json();
  } else {
    console.error(`请求失败，状态码: ${response.status()}, 错误信息: ${await response.text()}`);
  }
  return '';
}

/** 发送 API 请求 (加密) 
 * @param {object} page - Playwright 的 `page` 实例，用于执行 API 请求。
 * @param {string} refererUrl - `Referer`和`referrer` URL
 * @param {string} url - 目标 API 的 URL
 * @param {object|string} dataContext - 请求数据
 * @param {string} cryptKey - 加密密钥（用于 AES 加密和 MD5 签名）
 * @returns {Promise<object|string>} - API 返回解密后的响应数据
*/
async function askApiCrypto(page, refererUrl, url, dataContext, cryptKey) {
  const enData = md5.encryptAES(dataContext, cryptKey);
  const obNonce = Math.round(Math.random() * Math.pow(2, 63));
  const obTimestamp = Date.now();
  const obSign = cryptoUtils.calculateMD5(cryptoUtils.calculateMD5(enData + cryptKey + obNonce + obTimestamp));
  const token = (await page.context().cookies()).find(cookie => cookie.name === 'token');
  const localStorageData = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    return data;
  });
  const xRequestBrowser = localStorageData['finger'];
  const response = await page.request.post(url, {
    headers: {
      "sec-ch-ua-platform": "macOS",
      "x-request-merchant": "0|BWZK",
      "lang": "zh_CN",
      "ob-encrypted": "true",
      "ob-secret-version": "v1.0.0",
      "sec-ch-ua": "\"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "merchant-id": "0",
      "accept": "application/json, text/plain, */*",
      "x-request-sys": "1",
      "content-type": "application/json; charset=UTF-8",
      "ob-application": "5",
      "referer": `${refererUrl}`, //"https://merchant-manager-web.dx259.com/",
      "accept-language": "en-US",
      "ob-sign": `${obSign}`,
      "ob-timestamp": `${obTimestamp}`,
      "x-request-token": `${token?.value}`,
      "ob-nonce": `${obNonce}`,
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "x-request-browser": `${xRequestBrowser}`
    },
    referrer: `${refererUrl}`, //"https://merchant-manager-web.dx259.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    data: enData,
    method: "POST",
    mode: "cors",
    credentials: "omit"
  })
  if (response.ok()) {
    // 获取响应内容
    const data = await response.text();
    if (cryptKey) {
      return cryptoUtils.decryptAES(data, cryptKey);
    } else {
      return data;
    }
  } else {
    console.log(`请求失败，状态码: ${response.status()}`);
  }
  return '';
}

/** 发送 API 请求 (不加密) 
 * @param {object} page - Playwright 的 `page` 实例，用于执行 API 请求。
 * @param {string} refererUrl - `Referer`和`referrer` URL
 * @param {string} url - 目标 API 的 URL
 * @param {object|string} dataContext - 请求数据
 * @returns {Promise<object|string>} - API 返回响应数据
*/
async function askApiNoCrypto(page, refererUrl, url, dataContext) {
  const obNonce = Math.round(Math.random() * Math.pow(2, 63));
  const obTimestamp = Date.now();
  const token = (await page.context().cookies()).find(cookie => cookie.name === 'token');
  const localStorageData = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    return data;
  });
  const xRequestBrowser = localStorageData['finger'];
  const response = await page.request.post(url, {
    headers: {
      "sec-ch-ua-platform": "macOS",
      "x-request-merchant": "0|BWZK",
      "lang": "zh_CN",
      "ob-encrypted": "false",
      "ob-secret-version": "v1.0.0",
      "sec-ch-ua": "\"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "merchant-id": "0",
      "accept": "application/json, text/plain, */*",
      "x-request-sys": "1",
      "priority": "u=1, i",
      "content-type": "application/json; charset=UTF-8",
      "ob-application": "5",
      "referer": `${refererUrl}`, //"https://merchant-manager-web-fat1.dx252.com/",
      "accept-language": "en-US",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "ob-timestamp": `${obTimestamp}`,
      "x-request-token": `${token?.value}`,
      "ob-nonce": `${obNonce}`,
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "x-request-browser": `${xRequestBrowser}`
    },
    referrer: `${refererUrl}`, //"https://merchant-manager-web-fat1.dx252.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    data: dataContext,
    method: "POST",
    mode: "cors",
    credentials: "omit"
  })
  if (response.ok()) {
    const data = await response.text();
    return data;
    //console.log(`请求成功，响应内容: ${des_data}`);
  } else {
    console.log(`请求失败，状态码: ${response.status()}`);
  }
  return '';
}

/**
 * 取得异步导出的档案下载清单
 * (原本放在tests/action.js)
 * @param {object} page 
 * @param {string} refererUrl 
 * @param {string} url - 目标 API 的 URL 
 * @param {string} cryptKey - 加密密钥（用于 AES 加密和 MD5 签名）
 * @returns 
 */
async function getDownloadList(page, refererUrl, url, cryptKey) {
  const enData = 'pscDQL8Q4pu3JoaQ4lGaRKK6eBLuZP6rl3wi0qiCNl60f743vSOylzk2DcPdfQj0';
  const obNonce = Math.round(Math.random() * Math.pow(2, 63));
  const obTimestamp = Date.now();
  const obSign = cryptoUtils.calculateMD5(cryptoUtils.calculateMD5(enData + cryptKey + obNonce + obTimestamp));
  const token = (await page.context().cookies()).find(cookie => cookie.name === 'token');
  const localStorageData = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    return data;
  });

  const xRequestBrowser = localStorageData['finger'];
  const response = await page.request.post(url, {
    headers: {
      "sec-ch-ua-platform": "macOS",
      "x-request-merchant": "0|BWZK",
      "lang": "zh_CN",
      "ob-encrypted": "true",
      "ob-secret-version": "v1.0.0",
      "sec-ch-ua": "\"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "merchant-id": "0",
      "accept": "application/json, text/plain, */*",
      "x-request-sys": "1",
      "content-type": "application/json; charset=UTF-8",
      "ob-application": "5",
      "referer": `${refererUrl}`, //""https://merchant-manager-web.dx259.com/",
      "accept-language": "en-US",
      "ob-sign": `${obSign}`,
      "ob-timestamp": `${obTimestamp}`,
      "x-request-token": `${token?.value}`,
      "ob-nonce": `${obNonce}`,
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "x-request-browser": `${xRequestBrowser}`
    },
    referrer: `${refererUrl}`, //""https://merchant-manager-web.dx259.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    data: enData,
    method: "POST",
    mode: "cors",
    credentials: "omit"
  })

  if (response.ok()) {
    // 获取响应内容
    const data = await response.text();
    if (cryptKey) {
      return cryptoUtils.decryptAES(data, cryptKey);
    } else {
      return data;
    }
  } else {
    console.log(`请求失败，状态码: ${response.status()}`);
  }
  return '';
}

/**
 * 下载文件并存到指定的位置，若没有指定则存到当前目录且档名为 downloadedFile
 * (原本放在tests/index.js)
 * @param {object} page 
 * @param {string} fileUrl - 异步导出的档案路径
 * @param {string} destnationFilePath - 目標檔案路徑+名称
 * @returns {boolean}
 */
async function downloadFileFromUrl(page, fileUrl, destnationFilePath = 'downloadedFile') {
  const response = await page.request.get(fileUrl);
  // 检查响应状态
  if (response.ok()) {
    // 获取响应内容
    const data = await response.body();
    let absFilePath = destnationFilePath;
    // let absFilePath = '';
    // if (destnationFilePath.startsWith('/')) {
    //   absFilePath = destnationFilePath;
    // } else {
    //   absFilePath = path.join(__dirname, destnationFilePath);
    // }

    const dir = path.dirname(absFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await fspromises.writeFile(absFilePath, data);
    console.log(`SaveTo: ${absFilePath}`);
    return true;
  } else {
    console.log(`请求失败，状态码: ${response.status()}`);
    return false;
  }
}


// 將所有函數封裝為一個對象並導出
const askApi = {
  isApiPostAvailable,
  sendMultipartFormData,
  askApiCrypto,
  askApiNoCrypto,
  getDownloadList,
  downloadFileFromUrl,
};
export default askApi;
