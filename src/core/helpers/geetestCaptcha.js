import { expect } from '@playwright/test';
import cryptoUtils from './crypto';
import askApi from './askApi';
const ddddocrApi = {
    // 使用圖型驗證前，要確保docker有啟用 （參考：https://github.com/sml2h3/ddddocr-fastapi)
    url: 'http://localhost:8081',
    slide: 'slide_match'
};

/**
 * 从 style 属性值中提取 URL
 * @param {string} styleValue 包含 url() 的 style 字符串
 * @returns 提取到的 URL 或 null
 */
function extractUrlFromStyle(styleValue) {
    const regex = /url\(["']?([^"')]+)["']?\)/;
    const match = styleValue.match(regex);
    return match && match[1] ? match[1] : null;
}

/** 处理 Geetest 图形验证（滑动、点击、九宫格拼图） 
 * @param {object} page - Playwright 的 `page` 实例
 * @param {object} geetestBox - `div.geetestBox` 的定位元素
 * @param {number} retries - 允许重试的次数 (默认为 3)
*/
async function solve(page, geetestBox, retries = 3) {
    // 等待验证框出现
    await expect(geetestBox).toBeVisible({ timeout: 5000 });
    // console.log("Geetest 验证框已出现，检测验证码类型...");

    //#region 检查验证码类型
    const captchaTypes = [
        { type: "slide", selector: "div.geetest_slide" },
        { type: "click", selector: "div.geetest_click" },
        { type: "nineGrid", selector: "div.geetest_nine" }
    ];
    const captchaType = (
        await Promise.all(
            captchaTypes.map(async ({ type, selector }) => 
                (await geetestBox.locator(selector).isVisible()) ? type : null
            )
        )
    ).find(Boolean) || null;
    //console.log(`检测到的验证码类型: ${captchaType || "未检测到"}`);
    //#endregion

    //#region 处理验证码
    switch (captchaType) {
        case "slide":
            await handleSlideCaptcha(page, geetestBox, retries);
            break;

        case "click": //TODO:尚未实作
            await handleClickCaptcha(page, geetestBox, retries);
            break;

        case "nineGrid": //TODO:尚未实作
            await handleNineGridCaptcha(page, geetestBox, retries);
            break;

        default:
            console.warn("未检测到 Geetest 验证码类型");
            break;
    }
    //#endregion
}

/** 滑动验证码 */
async function handleSlideCaptcha(page, geetestBox, retries) {
    // **检查 API 是否可用**
    const apiUrl = `${ddddocrApi.url}/${ddddocrApi.slide}`;
    if (!await askApi.isApiPostAvailable(page, apiUrl)) {
        throw new Error(`无法访问 API: ${apiUrl}`);
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        // console.log(`尝试滑动验证码 (${attempt}/${retries})`);
        try {
            // 定位滑块
            const slice = geetestBox.locator('div.geetest_slice');
            const sliceBox = await slice.boundingBox();
            if (!sliceBox) {
                throw new Error('滑块未找到');
            }

            // 取得图片
            const bgImageStyle = await geetestBox.locator('div.geetest_bg').getAttribute('style');
            const bgImageUrl = await extractUrlFromStyle(bgImageStyle);
            const sliceImageStyle = await geetestBox.locator('div.geetest_slice_bg').getAttribute('style');
            const sliceImageUrl = await extractUrlFromStyle(sliceImageStyle);
            if (!bgImageUrl || !sliceImageUrl) {
                throw new Error('无法获取验证码图片');
            }

            // #region 使用ddddocrApi滑块偏移量
            const data = {
                target: await cryptoUtils.imageToBase64(sliceImageUrl),
                background: await cryptoUtils.imageToBase64(bgImageUrl),
                simple_target: true
            };
            const responseBody = await askApi.sendMultipartFormData(page, apiUrl, data);
            const gapX = responseBody.data.target[0];
            // #endregion

            // 模拟鼠标拖动滑块操作
            await simulateSliderMove(page, sliceBox, gapX);
            await page.waitForTimeout(2000);

            // 检查是否通过验证
            if (await geetestBox.isVisible()) {
                console.warn(`滑动验证失败，进行重试 (${attempt}/${retries})`);
                continue;
            }
            console.log("滑动验证成功！");
            return;

        } catch (error) {
            console.error(`滑动验证码处理失败: ${error.message}`);
            if (attempt === retries) {
                throw new Error(`滑动验证码 ${retries} 次尝试后仍然失败.`);
            }
        }
           
        // 等待一段时间后再重试
        await page.waitForTimeout(2000);
    }

}

/** 点击验证码 */
async function handleClickCaptcha(page, geetestBox, retries) {
    throw new Error('点击验证码 尚未实作');
}

/** 九宫格拼图验证码 */
async function handleNineGridCaptcha(page, geetestBox, retries) {
    throw new Error(`九宫格拼图验证码 尚未实作`);
}



/**
* 模拟滑块的拖动操作
* @param page Playwright Page 对象
* @param sliceBox 滑块的 boundingBox（包含 x, y, width, height）
* @param gapX 滑块目标 x 坐标（绝对坐标）
*/
async function simulateSliderMove(page, sliceBox, gapX) {

    const sliceCenterX = sliceBox.x + sliceBox.width / 2;
    const targetX = sliceCenterX + gapX; // 计算目标位置
    // console.log(`滑块初始中心 X：${sliceCenterX}`);
    // console.log(`目标位置 X：${targetX} (需要移动 ${gapX} 像素)`);

    const mouse = page.mouse;
    await mouse.move(sliceCenterX, sliceBox.y + sliceBox.height / 2);  // 移动鼠标到滑块中心
    await mouse.down(); // 按下鼠标左键

    // 分步拖动滑块
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
        const x = sliceCenterX + (gapX * i) / steps;
        const y = sliceBox.y + sliceBox.height / 2;
        await mouse.move(x, y, { steps: 5 });
        await page.waitForTimeout(Math.random() * 50 + 30); // 随机延迟
    }

    await page.mouse.up();
    // console.log("滑块拖动完成！");
}


// 將所有函數封裝為一個對象並導出
const geetestCaptcha = {
    solve,
    simulateSliderMove
};

export default geetestCaptcha;