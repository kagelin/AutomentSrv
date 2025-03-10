/**
 * 格式化日期為 format 字符串
 * @param {Date} date 
 * @param {string} format : "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd", "yyyyMMdd", "yyyyMM" (預設 "yyyy-MM-dd")
 * @param {string} appendString 后面接的字串
 * @returns
 */
function getFormatDateString(date, format, appendString) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let result = '';
    if (format === 'yyyy-MM-dd HH:mm:ss') {
        result = year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) + ' ' + ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + second).slice(-2);
    } else if (format === 'yyyy-MM-dd') {
        result = year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
    } else if (format === 'yyyyMMdd') {
        result = year + ('0' + month).slice(-2) + ('0' + day).slice(-2);
    } else if (format === 'yyyyMM') {
        result = year + ('0' + month).slice(-2);
    }else{
        result = year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2);
    }
    if (appendString) {
        result += appendString;
    }
    return result;
}

/** 
 * 格式化日期為 YYYY-MM-DD HH:mm:ss 字符串 
 * @param {Date} date - 需要格式化的日期
 * @returns {string} 格式化後的日期字符串
 */
function getFormatDatetimeString(date) {
    return date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2);
}

/**
 * 格式化日期為 YYYYMMDDHHmmss 字符串
 * @param {Date} date - 需要格式化的日期
 * @returns {string} 格式化後的日期字符串
 */
function getFormatDatetimeCompact(date) {
    return date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);
}

// 获取当前日期的yyyyMM格式 计算与substractMonths的偏移量并返回yyyyMM格式
function getSubstractMonth(substractMonths) {
    const now_date = new Date();
    const now_year = now_date.getFullYear();
    const now_month = now_date.getMonth() + 1;
    let sum_month = now_month + substractMonths;
    let real_month = (sum_month % 12 + 12) % 12 || 12;
    let real_year = now_year + Math.floor((sum_month - 1) / 12);

    return real_year + ('0' + real_month).slice(-2);
}

/**
 * 获取当前时间并转换为 UTC+8 时区时间
 * 格式化日期為 YYYY-MM-DD HH:mm:ss.fff
 * @returns {string} 格式化後的日期字符串
*/
function getUTC8Time() {
    const now = new Date();
    const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 加上 8 小时
    return utc8Time.toISOString().replace('T', ' ').replace('Z', ''); // 格式化为 YYYY-MM-DD HH:mm:ss
}

/**
 * 
 * @param {*} date 
 * @param {*} year 
 * @param {*} month 
 * @param {*} day 
 * @param {*} hour 
 * @param {*} minute 
 * @param {*} second 
 * @returns 
 */
function calculateDate(date, year, month, day, hour, minute, second) {
    let newDate = new Date(date);

    newDate.setFullYear(newDate.getFullYear() + year);
    newDate.setMonth(newDate.getMonth() + month);
    newDate.setDate(newDate.getDate() + day);
    newDate.setHours(newDate.getHours() + hour);
    newDate.setMinutes(newDate.getMinutes() + minute);
    newDate.setSeconds(newDate.getSeconds() + second);
    return newDate;
}

/**
 * 获取当月最后一天
 * @param {Date} date 
 * @returns 
 */
function getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
/**
 * 获取当月第一天
 * @param {Date} date 
 * @returns 
 */
function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
// 將所有函數封裝為一個對象並導出
const dateUtils = {
    getFormatDateString,
    getFormatDatetimeString,
    getFormatDatetimeCompact,
    getUTC8Time,
    calculateDate,
    getLastDayOfMonth,
    getFirstDayOfMonth,
    getSubstractMonth
};

export default dateUtils;