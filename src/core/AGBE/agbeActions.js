// 作者: Kage
import cryptoUtils from '../helpers/crypto.js';
import AgbeSys from './agbeSys.js';
import AgbeActionValidators from './agbeActionValidators.js';
import dateUtils from '../helpers/date.js';
import askApi from '../helpers/askApi.js';
/**
 * AGBE 提供网站各种操作
 */
class agbeActions {
    constructor(page, params, proxyType) {
        this.page = page;
        this.params = params;
        this.proxyType = proxyType;
        this.agbeSys = new AgbeSys(params, proxyType);
        this.agbeActionValidators = new AgbeActionValidators(this, page, params);
    }


    /** 登录 */
    async login() {
        const proxy = this.params.accounts[this.proxyType];
        await this.page.goto(this.params.siteUrl);
        await this.page.getByPlaceholder('请输入账号名称').fill(proxy.proxyAccount);
        await this.page.getByPlaceholder('请输入密码').fill(proxy.proxyPassword);
        await this.page.getByRole('button', { name: '登录' }).click();
    }
    /** 点击菜单 */
    async clickMenu(opts) {
        const siteMetaData = this.agbeSys.getSiteMetaData(opts.menuTitle, opts.subMenuTitle);
        await this.page.goto(this.params.siteUrl + siteMetaData.menuHref);
    }
    /** 点击导出按钮 */
    async clickExport(exceptionSelector = undefined) {
        // 設定分頁選擇器，默認為標準選擇器
        let element = '.app-main';
        if (exceptionSelector !== undefined && exceptionSelector != '') {
            element = exceptionSelector;
        }
        await this.page.locator(element).getByRole('button', { name: '导出' }).click();
    }
    /** 取得点击导出按钮提示 */
    async clickExportPrompt() {
        await this.page.waitForTimeout(300);
        try {
            //const message = (await this.page.locator('.el-message-box__message > div > div').allTextContents()).join('\n');
            const message = await this.page.locator('.el-message-box__message').innerText();
            return message;
        } catch {
            return '';
        }
    }
    /** 点击导出按钮确认 */
    async clickExportConfirm(timeoutMs = 300) {
        //可能遇到操作频繁多个5秒
        await this.page.waitForTimeout(300);
        await this.page.getByRole('button', { name: '确 定' }).click();
    }
    /** 点击导出按钮取消 */
    async clickExportCancel() {
        await this.page.waitForTimeout(300);
        await this.page.getByRole('button', { name: '取 消' }).click();
    }

    /** 点击异步导出按钮 */
    async clickAsyncExport() {
        await this.page.locator('div.right-menu .dlist').click();
    }
    /**
     * 异步导出下载档案
     * @returns {Promise<boolean>} - 如果下载成功，返回 true，否则返回 false
     */
    async asyncExportDownload(saveAsDir, timeoutMs = 1000) {
        try {
            const tableSelector = 'div.el-dialog__body table';
            const firstRow = await this.page.getByRole('dialog').locator(`${tableSelector} tbody tr`).first();

            // 等待并点选下载按钮
            await this.page.waitForTimeout(timeoutMs);
            const downloadPromise = this.page.waitForEvent('download');
            await firstRow.locator('td').nth(3).getByRole('button').click();

            // 处理下载
            const download = await downloadPromise;
            const filePath = `${saveAsDir}/${download.suggestedFilename()}`;
            await download.saveAs(filePath);
            // console.log(`文件下载成功: ${filePath}`);
            console.log(`档案: ${download.suggestedFilename()}`);

            // 关闭对话框
            await this.page.getByRole('dialog').getByRole('button', { name: '关闭' }).click();
            return true;

        } catch (error) {
            // console.error(`下载文件失败: ${error.message}`);
            return false;
        }
    }

    async getMyDownloadList() {
        const gatewayUrl = `${this.params.siteUrl}/dx-proxy-gateway/dx-proxy-manager/download/listPage`;

        await this.page.getByRole('button', { name: '导出Excel' }).click();
        await this.page.locator('.el-icon-bottom').click();
        await this.page.getByRole('button', { name: 'Close' }).click();
    }
    /**
     * 给予cookieName 取得cookie值
     * @param {*} page 
     * @param {*} cookieName 
     * @returns 
     */
    async getCookie(cookieName) {
        return (await this.page.context().cookies()).find(cookie => cookie.name === cookieName);
    }
    /**
     * 取得下载列表
       * @param {number} pageNum 页次
     * @param {number} pageSize 单页数量
     * @returns {String} Api 回应物件
     */
    async getDownloadList(pageNum = 1, pageSize = 10) {
        const route = '/dx-proxy-gateway/dx-proxy-manager/download/listPage';
        const reqObj = { "pageNum": pageNum, "pageSize": pageSize };
        return await this.askApi(reqObj, route);
    }
    /**
     * Api 呼叫
     * @param {*} reqObj 
     * @param {*} route 
     * @returns 
     */
    async askApi(reqObj, route) {
        const reqData = this.params.gatewayParams.obEncrypted ? cryptoUtils.encryptAES(reqObj, this.params.aesKey) : reqObj;
        const obNonce = Math.round(Math.random() * Math.pow(2, 63));
        const obTimestamp = Date.now();
        const obSign = cryptoUtils.calculateMD5(cryptoUtils.calculateMD5(reqData + this.params.aesKey + obNonce + obTimestamp));
        const lang = await this.getCookie('language');
        const localStorageData = await this.page.evaluate(() => {
            return localStorage;
        });
        const sessionStorageData = await this.page.evaluate(() => {
            return sessionStorage;
        });
        const token = sessionStorageData['__TOKEN__'];
        const xRequestBrowser = localStorageData['new-finger'];
        const headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US",
            "content-type": "application/json; charset=UTF-8",
            "lang": lang?.value,
            "merchant-id": `${this.params.merchantId}`,
            "ob-application": `${this.params.gatewayParams.obApplication}`,
            "ob-client": `${this.params.gatewayParams.obClient}`,
            "ob-encrypted": `${this.params.gatewayParams.obEncrypted}`,
            "ob-nonce": `${obNonce}`,
            "ob-secret-version": `${this.params.gatewayParams.obSecretVersion}`,
            "ob-sign": `${obSign}`,
            "ob-timestamp": `${obTimestamp}`,
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-request-browser": `${xRequestBrowser}`,
            "x-request-sys": "1",
            "x-request-token": token.replaceAll("\"", ""),
            "Referer": `${this.params.siteUrl}`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        };
        const response = await this.page.request.post(`${this.params.gatewayUrl}${route}`, {
            headers: headers,
            referrer: `${this.params.gatewayUrl}`,
            referrerPolicy: "strict-origin-when-cross-origin",
            data: reqData,
            method: "POST",
            mode: "cors",
            credentials: "omit"
        })
        if (response.ok()) {
            // 获取响应内容
            const data = await response.text();
            if (this.params.gatewayParams.obEncrypted) {
                return cryptoUtils.decryptAES(data, cryptKey);
            } else {
                return data;
            }
        } else {
            //console.log(`请求失败，状态码: ${response.status()}`);
            return { error: response.status() }
        }
        return '';
    }
    /**
     * 用 gateway Api导出Excel
     * @param {Object} reqObj 
     * @param {String} route 
     * @returns {String} Excel 文件内容
     */
    async exportExcel(reqObj, route) {
        const data = await this.askApi(reqObj, route);
        return data;
    }
    /**
     * 
     * @param {Date} startDatetime 
     * @param {string} saveDir 
     * @returns 
     */
    async batchDownloadFromDoloadList(startDatetime, saveDir, retryMillisecond = 10000) {
        let downloadAmount = 0;
        let isWaitting = false; //是否继续等待
        //记录现在时间+1秒
        const waittingTime = new Date().getTime() + retryMillisecond;

        //const takeFileBeforeDatetime = Date.parse(takeFileBeforeDatetimeStr);
        console.log(`Take Files Before < ${dateUtils.getFormatDatetimeString(startDatetime)} >`);
        let filesCount = 0;
        let deDataObj = null;
        do {
            isWaitting = false;
            filesCount = 0;
            //将json转换为对象
            deDataObj = JSON.parse(await this.getDownloadList(1, 10));
            // console.log('eeee', deDataObj);
            //检查档案下载状态是否都已完成
            for (let index = 0; index < deDataObj.data.record.length; index++) {
                const element = deDataObj.data.record[index];
                const fileDate = new Date(element.createdAt);
                if (fileDate >= startDatetime) {
                    filesCount++;
                    //status: 1:导出中, 2:导出成功, 3:导出失败，若还有导出中的档案则继续等待
                    if (element.status == 1) {
                        console.log(`(${element.type}, ${element.status}, ${element.createdAt}) ${element.fileName} `);
                        console.log(`等待中...\n`);
                        await page.waitForTimeout(2000);
                        isWaitting = true;
                        break;
                    }
                }
            }
        } while ((filesCount == 0 || isWaitting) && waittingTime > new Date().getTime());
        for (let index = 0; index < deDataObj.data.record.length; index++) {
            const element = deDataObj.data.record[index];
            const fileDate = new Date(element.createdAt);
            if (fileDate >= startDatetime) {
                console.log(`(${element.type}, ${element.status}, ${element.showStatus}, ${element.createdAt}) ${element.fileName} `);
                //status: 1:导出中, 2:导出成功, 3:导出失败，若还有导出中的档案则继续等待
                if (element.status == 2) {
                    if (await askApi.downloadFileFromUrl(this.page, element.fileUrl, saveDir + element.fileName)) {
                        downloadAmount++;
                    }
                }
            }
        }
        return downloadAmount;
    };

    /**
     * 等待指定 API 的响应
     * @param {string} apiRoute 需要监听的 Api
     * @param {number} clickTimestamp 过滤请求的时间戳 (e.g. Date.now())
     * @param {number} timeoutMs - 超时时间（毫秒），默认 10000ms（10 秒）
     * @returns {Object} 返回符合条件的 Api 响应
     */
    async waitResponsePromise(apiRoute, clickTimestamp, timeoutMs = 10000) {
        try {
            const responsePromise = this.page.waitForResponse(response =>
                response.url().includes(apiRoute) &&
                response.request().timing().startTime >= clickTimestamp
                // && response.status() === 200
                , { timeout: timeoutMs }
            );
            return await responsePromise;
        } catch (error) {
            console.warn(`API 响应超时 (${timeoutMs / 1000} 秒): ${apiRoute}`);
        }
        return null;
    }

    /** 从功能子页面返回到功能页 */
    async clickBackButton() {
        if (await this.page.getByRole('button', { name: '返 回' }).isVisible()) {
            await this.page.getByRole('button', { name: '返 回' }).click();
        }
    }

    /** 关闭所有dialog视窗 */
    async closeDialog() {
        await this.page.waitForTimeout(300);
        // 获取所有 dialog
        try {
            const dialogs = await this.page.locator('div.el-dialog__wrapper').all();
            for (const dialog of dialogs) {
                if (await dialog.isVisible()) {
                    await dialog.getByRole('button', { name: 'Close' }).click();
                    await this.page.waitForTimeout(300);
                }
            }
        } catch { }
    }

    /**
     * 确认分頁有无笔数
     * @param {string} exceptionPaginationTotalSelector - 例外的 pagination 選擇器（可選）
     * @param {number} exceptionNth - 选择第几个匹配的分页元素（默认选取第一个）
     * @returns {Promise<boolean>} - 如果有数据，返回 true，否则返回 false
     */
    async getDataPaginationTotal(exceptionPaginationTotalSelector = undefined, exceptionNth = 0, timeoutMs = 300) {
        let paginationTotal = 0;
        try {
            // 設定分頁選擇器，默認為標準選擇器
            let paginationTotalSelector = 'div.base-pagination span.el-pagination__total';
            if (exceptionPaginationTotalSelector !== undefined && exceptionPaginationTotalSelector != '') {
                paginationTotalSelector = exceptionPaginationTotalSelector;
            }
            // 找第几个元素    
            let nth = 0;
            if (exceptionNth !== undefined && exceptionNth != "") {
                nth = exceptionNth;
            }
            // 確認元素是否存在
            await this.page.waitForTimeout(timeoutMs);
            const paginationElement = this.page.locator(paginationTotalSelector).nth(nth);
            if ((await paginationElement.count()) > 0) {
                const pagination__total = (await paginationElement.innerText()).replaceAll(this.agbeSys.replace_str, '');
                if (pagination__total && pagination__total !== '0') {
                    paginationTotal = pagination__total;
                }
            }
        } catch (error) {
            console.error(`确认数据失败: ${error}`);
        }
        return paginationTotal;
    }

    /**
     * 点击表格内的按钮
     * @param {string} btnText - 要点击的按钮名称
     * @param {string} exceptionSelector - 例外的 tableSelector
     * @param {number} exceptionNth - 选择第几个匹配的分页元素（默认选取第一个）
     */
    async clickTableButton(btnText, exceptionSelector = undefined, exceptionNth = 0) {
        let tableSelector = `.el-table__fixed-body-wrapper > .el-table__body > tbody > tr`;
        if (exceptionSelector != undefined && exceptionSelector != "") {
            tableSelector = exceptionSelector;
        }
        // 找第几个元素    
        let nth = 0;
        if (exceptionNth !== undefined && exceptionNth != "") {
            nth = exceptionNth;
        }

        try {
            await this.page.locator(tableSelector).nth(exceptionNth).getByRole('button', { name: btnText }).click();
            return true;
        }
        catch {
            return false;
        }
    }

    /**
     * 点击表格内的子选单按钮 (先hover再click)
     * @param {string} btnText - 要hover的按钮名称
     * @param {string} exceptionSelector - 例外的 tableSelector
     * @param {number} exceptionNth - 选择第几个匹配的分页元素（默认选取第一个）
     */
    async hoverTableButton(hoverText, exceptionSelector = undefined, exceptionNth = 0) {
        let tableSelector = `.el-table__fixed-body-wrapper > .el-table__body > tbody > tr`;
        if (exceptionSelector != undefined && exceptionSelector != "") {
            tableSelector = exceptionSelector;
        }
        // 找第几个元素    
        let nth = 0;
        if (exceptionNth !== undefined && exceptionNth != "") {
            nth = exceptionNth;
        }

        try {
            await this.page.locator(tableSelector).nth(exceptionNth).getByRole('button', { name: btnText }).hover();
            return true;
        }
        catch {
            return false;
        }
    }

    /** 取得网址指定参数 */
    async getUrlQueryParam(paramName) {
        const url = this.page.url(); // 获取当前页面 URL
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get(paramName);
    }
}

export default agbeActions;