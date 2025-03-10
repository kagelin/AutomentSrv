import crypto from "crypto";
import axios from "axios";
import pako from "pako";
/**
 * Base32 解码函数
 * @param {string} base32 - 需要解码的 Base32 编码字符串
 * @returns {Buffer} 解码后的 Buffer 数据
 */
function base32ToBuffer(base32) {
    const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (const char of base32.toUpperCase()) {
        const index = base32Alphabet.indexOf(char);
        if (index === -1) continue; // 忽略无效字符（如填充=）
        bits += index.toString(2).padStart(5, '0');
    }
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return Buffer.from(bytes);
}

/** 生成 TOTP 函数 */
function generateTOTP(secret, timeStep = 30, digits = 6) {
    // 解码 Base32 密钥
    const key = base32ToBuffer(secret);
    // 当前时间计数器值（Unix 时间戳 / 时间步长）
    const epoch = Math.floor(Date.now() / 1000);

    let timeCounter = Math.floor(epoch / timeStep);

    // 将计数器转换为 8 字节的 Buffer
    const counter = Buffer.alloc(8);
    for (let i = 7; i >= 0; i--) {
        counter[i] = timeCounter & 0xff;
        timeCounter >>= 8;
    }

    // 使用 HMAC-SHA1 对计数器进行加密
    const hmac = crypto.createHmac('sha1', key).update(counter).digest();

    // 从加密结果中提取动态偏移量
    const offset = hmac[hmac.length - 1] & 0xf;

    // 计算 4 字节的动态验证码
    const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % Math.pow(10, digits);

    // 返回指定长度的 TOTP
    return code.toString().padStart(digits, '0');
}

/**
 * 通过 URL 获取图片，并转换为 Base64
 * @param {string} imageUrl 图片的 URL
 * @returns Base64 编码的图片数据
 */
async function imageToBase64(imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        return `data:image/png;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
    } catch (error) {
        console.error(`获取图片失败: ${imageUrl}`, error);
        throw error;
    }
}

function calculateMD5(message) {
    return crypto.createHash("md5").update(message, "utf8").digest("hex");
    // return CryptoJS.MD5(message).toString();
}

/**
 * 使用 AES 加密数据
 * @param {object} payload - 要加密的对象
 * @param {string} key - 加密密钥（长度需为 16 字符）
 * @returns {string} - 加密后的 Base64
 */
function encryptAES(payload, key) {
    const utf8Key = Buffer.from(key, "utf8");
    const iv = utf8Key;

    // Gzip 压缩 payload
    const compressedPayload = pako.gzip(JSON.stringify(payload));

    // 加密数据 (16字符使用aes-128-cbc)
    const cipher = crypto.createCipheriv('aes-128-cbc', utf8Key, iv);
    let encrypted = cipher.update(compressedPayload);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // 返回 Base64 编码
    return encrypted.toString('base64');
}

function decryptAES(encryptedPayload, key) {
    const utf8Key = Buffer.from(key, "utf8");
    const iv = utf8Key;

    // 对加密数据进行去空白和去换行
    encryptedPayload = encryptedPayload.replace(/\s+/g, "");
        
    // 解码 Base64
    const encryptedBuffer = Buffer.from(encryptedPayload, 'base64');
   
    // 解密数据 (16字符使用aes-128-cbc)
    const decipher = crypto.createDecipheriv('aes-128-cbc', utf8Key, iv);
    let decrypted;
    try {
        decrypted = Buffer.concat([
            decipher.update(encryptedBuffer),
            decipher.final()
        ]);
    } catch (error) {
        throw new Error('Decryption failed: ' + error.message);
    }

    // 进行 gzip 解压缩并返回 JSON 对象
    const decompressedPayload = pako.ungzip(decrypted, { to: "string" });
    return decompressedPayload;
}

// 將所有函數封裝為一個對象並導出
const cryptoUtils = {
    generateTOTP,
    imageToBase64,
    calculateMD5,
    encryptAES,
    decryptAES,
};

export default cryptoUtils;