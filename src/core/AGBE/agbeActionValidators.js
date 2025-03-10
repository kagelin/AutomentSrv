
/**
 * AGBE 验证Actions func
 */
class agbeActionValidators {
    constructor(agbeActions, page, params) {
        this.agbeActions = agbeActions;
        this.page = page;
        this.params = params;
        this.statusCode = { passed: "PASS", failed: "FAIL", notApplicable: "N/A", noData: "N/A (暂无数据)" };
        this.asyncExportRequiredFields = {
            siteMetaData: ["menuTitle", "subMenuTitle", "menuHref"],
            exportFiles: ["funcName", "prefixName", "listRoute"],
        };
    };

    /**
     * 检查对象是否包含所有必要参数＆值
     * @param {Object} obj - 需要验证的对象
     * @param {string[]} requiredFields - 需要检查的字段列表 （支持 "exportFiles.listRoute" 形式）
     * @param {string} event - 事件名称
     * @returns {boolean} - 如果有效返回 true，否则返回 false
     */    
    checkObject(obj, requiredFields, event = "参数验证") {
        if (!obj || typeof obj !== "object") {
            console.error(`❌ ${event}: 传入的不是有效的对象`);
            return false;
        }

        let isValid = true;
        let missingFields = [];

        for (const field of requiredFields) {
            const fieldValue = this.getNestedField(obj, field);

            if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
                missingFields.push(field);
                isValid = false;
            }
        }

        // 输出日志
        // 输出日志
        if (!isValid) {
            console.warn(`⚠️ [${event}]: 缺少必要字段 -> [${missingFields.join(', ')}]`);
        }
        return isValid;
    }

    /**
     * 取得检查对象的字段值
     * @param {Object} obj - 要检查的对象
     * @param {string} fieldPath - 例如 "a.b"
     * @returns {*} - 返回字段的值，如果字段不存在则返回 undefined
     */
    getNestedField(obj, fieldPath) {
        return fieldPath.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
    }

    /** 执行步骤前置作业 */
    async beforeStepCase(siteMetaData, exportFile) {
        try {
            // 验证参数
            const validationRules = [
                { obj: siteMetaData, fields: this.asyncExportRequiredFields.siteMetaData, event: "菜单参数" },
                { obj: exportFile, fields: this.asyncExportRequiredFields.exportFiles, event: "导出参数" }
            ];
            for (const rules of validationRules) {
                if (!await this.checkObject(rules.obj, rules.fields, rules.event)) {
                    return false;  // 如果有一个验证失败，则直接返回 false
                }
            }
            // 确保进入下一次循环前关闭对话窗
            await this.agbeActions.closeDialog();
            // 确保进入下一次循环前返回页面
            await this.agbeActions.clickBackButton();

            return true;
        } catch (error) {
            console.warn(`beforeStepCase ${this.statusCode.failed} err:${error.message}`);;
        }
    }
    /** 
     * 导出提示语验证 
     * Export prompt verification
     * @param {string} exceptionSelector - 指定選擇器 
    */
    async validateExportPrompt(exceptionSelector = undefined) {
        const testCase = "导出提示语验证";
        try {
            await this.agbeActions.clickExport(exceptionSelector);
            await this.page.waitForTimeout(300);
            const message = await this.agbeActions.clickExportPrompt();
            await this.agbeActions.clickExportCancel();

            // 驗證
            const expectedMessage = "是否导出？\n数据过大时请耐心等待";
            // expect.soft(message.replace(/\r\n/g, '\n')).toBe(expectedMessage);
            if (message.replace(/\r\n/g, '\n') === expectedMessage) {
                console.log(testCase, this.statusCode.passed);
            } else {
                console.warn(testCase, this.statusCode.failed);
            }
        } catch (error) {
            // console.warn(testCase, this.statusCode.failed, error.message);
            console.warn(`${testCase} ${this.statusCode.failed} err:${error.message}`);
        }
    }

    /** 
     * 点击导出二次确认弹窗 
     * Click Export to confirm the second pop-up window.
     * @param {object} exportFile - 导出文件的数据
     * @param {number} clickTimestamp - 点击导出的时间戳
     * @param {string} exceptionSelector - 指定選擇器 
    */
    async validateClickExportConfirm(excelFile, clickTimestamp, exceptionSelector = undefined) {
        const testCase = "点击导出二次确认弹窗";
        try {
            await this.page.waitForTimeout(300);
            await this.agbeActions.clickExport(exceptionSelector);
            await this.agbeActions.clickExportConfirm(5000);
            await this.agbeActions.waitResponsePromise(`${this.params.gatewayUrl}${excelFile.exportRoute}`, clickTimestamp);
            console.log(testCase, this.statusCode.passed);
        } catch (error) {
            console.warn(testCase, this.statusCode.failed, error.message);
        }
    };

    /**
     * 导出表内容UI验证
     * Export table content UI validation
     * @param {object} exportFile - 导出文件的数据
     * @param {number} clickTimestamp - 点击导出的时间戳
    */
    async validateAsyncExportTableUI(exportFile, clickTimestamp, formatPrefixName = undefined) {
        const testCase = "导出表内容UI验证";
        try {
            const tableSelector = 'div.el-dialog__body table';
            const firstRow = await this.page.getByRole('dialog').locator(`${tableSelector} tbody tr`).first();
            const ui_title = await firstRow.locator('td').nth(0).innerText();
            const ui_time = await firstRow.locator('td').nth(1).innerText();
            const ui_type = await firstRow.locator('td').nth(2).innerText();
            // console.log(`UI 验证: ui_title:${ui_title}, ui_time:${ui_time}, ui_type:${ui_type}`);

            // 解析时间戳并比较时间
            const downloadTimestamp = Date.parse(ui_time);
            //expect.soft(isNaN(downloadTimestamp), "无法解析下载时间").toBe(true);
            if (isNaN(downloadTimestamp)) {
                throw new Error(`无法解析下载时间: ${ui_time}`);
            }
            if (downloadTimestamp < clickTimestamp) {
                throw new Error(`导出表内容UI验证失败，无可下载的档案`);
            }

            // TODO:这边可以增加一个ui_type="导出中"的retry
            // 验证文件标题
            let prefixName = exportFile.prefixName;
            if (formatPrefixName !== undefined && formatPrefixName !== "") {
                prefixName = formatPrefixName;
            }
            if (ui_title.startsWith(`${prefixName}`)) {
                console.log(testCase, this.statusCode.passed);
                return true;
            }
            else {
                throw new Error(`预期: ${prefixName}, 实际: ${ui_title}`);
                // expect.soft(prefixName, "导出表内容 UI").toEqual(ui_title);
                return false;
            }
        } catch (error) {
            console.warn(`${testCase} ${this.statusCode.failed} err:${error.message}`);
            return false;
        }
    }
}

export default agbeActionValidators;