const init = {
    pageDigits : 2
};

/**
 * 无条件舍去到指定小数位的字串
 * @param {string} value 输入的数字
 * @param {int} decimalPlaces 保留的小数位数
 * @returns {string} 无条件舍去后的文字
 */
function truncateToFixedString(value) {
    const valueStr = value.toString();
    const decimalIndex = valueStr.indexOf('.');
    if (decimalIndex === -1) {
        // 如果没有小数点，直接返回原始字串
        return valueStr;
    }
    const integerPart = valueStr.substring(0, decimalIndex);
    const decimalPart = valueStr.substring(decimalIndex + 1, decimalIndex + 1 + init.pageDigits);
    const truncatedValueStr = `${integerPart}.${decimalPart}`;
    return truncatedValueStr;
}

/**
 * 将字符串形式的数字转换为指定小数位的数字
 * @param {string} value 字符串形式的数字
 * @returns {number} 格式化后的数字
 * @throws 如果输入不是有效数字，抛出错误
 */
function formatToPageNumber(value) {
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
        throw new Error(`Invalid number: ${value}`);
    }
    return Number(numericValue.toFixed(init.pageDigits));
}


const numberUtils = {
    truncateToFixedString,
    formatToPageNumber
};
export default numberUtils;