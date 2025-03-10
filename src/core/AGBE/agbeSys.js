import dateUtils from "../helpers/date.js";
/**
 * AGBE 系統提供各种资料与取得资料的方法
 */
class agbeSys {
    constructor(params, proxyType) {
        this.proxy = params.accounts[proxyType];
        this.replace_str = /[/$/¥ ,共 条]/g;
        /** 前端页面显示指定的小数位数 */
        this.pageDigits = 2;
        /** 网站模块 */
        this.siteModules = [
            { name: "总览", path: "dashboard" },
            { name: "团队管理", path: "team-manage" },
            { name: "游戏设置", path: "game-manage" },
            { name: "数据查询", path: "statistics" },
            { name: "我的", path: "personal-center" }
        ];
        /** 德州牌桌 */
        this.dxnTable = [
            { name: "德州", gameType: "2001" },
            { name: "十三水", gameType: "3001" }
        ];
        /**
         * 网站资料
         * business: 业务类型分为现金佣金, 现金占成, 信用 => ("cashyj","cashzc","credit")
         * menuTitle: 菜单标题
         * subMenuTitle: 子菜单标题
         * menuHref: 菜单链接
         * exportFiles: 导出文件
         *  exportFiles.funcName: 功能页面
         *  exportFiles.prefixName: 导出文件前缀名
         *  exportFiles.reqObj: 导出文件请求参数
         *  exportFiles.listRoute: 查询列表路由
         *  exportFiles.exportRoute: 导出文件路由
         *  exportFiles.dxnTable: 德州牌桌参数
         *  exportFiles.navigation: 功能导航 (非必填, 若没有填写会使用menuTitle/subMenuTitle/exportFiles.funcName做显示)
         */
        this.siteMetaDatas = [
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '总览', subMenuTitle: '首页', menuHref: '/dashboard',
                exportFiles: []
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '团队管理', subMenuTitle: '代理列表', menuHref: '/team-manage/proxy-list',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "代理列表", prefixName: "代理列表",
                        reqObj: { "pageNum": 1, "pageSize": 10, "sortKey": 5, "sortType": "desc", "subProxyType": 0, "parentProxyName": `${this.proxy.proxyAccount}` },
                        listRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/listV2',
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/proxyCashLsExport',
                    }
                ]
            },
            {
                business: ["cashzc", "credit"], menuTitle: '团队管理', subMenuTitle: '代理收益比例', menuHref: '/team-manage/zhancheng-rate',
                //已设置, 待设置
                exportFiles: [
                    {
                        business: ["cashzc", "credit"], funcName: "已设置", prefixName: "收益比例列表",
                        reqObj: { "proxyPathUsername": "", "isDirectlyUnder": 1, "orderKey": 4, "orderType": "asc", "total": 1, "pageNum": 1, "pageSize": 10, "userName": this.proxy.proxyAccount, "status": 1, "userType": 1 },
                        listRoute: '/dx-proxy-gateway/dx-proxy-manager/rebateRate/list',
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/rebateRate/rebateRateProxytExport'
                    },
                    {
                        business: ["cashzc", "credit"], funcName: "待设置", prefixName: "收益比例列表",
                        reqObj: { "proxyPathUsername": "", "isDirectlyUnder": 1, "orderKey": 4, "orderType": "asc", "date": [], "total": 1, "pageNum": 1, "pageSize": 10, "userName": this.proxy.proxyAccount, "status": 4, "userType": 1 },
                        listRoute: '/dx-proxy-gateway/dx-proxy-manager/rebateRate/list',
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/rebateRate/rebateRateProxytExport'
                    },
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '团队管理', subMenuTitle: '会员列表', menuHref: '/team-manage/member-list',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "会员列表", prefixName: "会员列表",
                        reqObj: { "proxyLevel": 2, "_val": "", "_type": 0, "searchPage": 1, "proxyUserName": "", "sortKey": 3, "sortType": "desc" },
                        listRoute: '/dx-proxy-gateway/dx-proxy-manager/member/list',
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/member/memberLsExport'
                    },
                    {
                        //btn[查看详情].资金明细
                        business: ["cashyj", "cashzc", "credit"], funcName: "资金明细", prefixName: "资金明细",
                        //createdTimeStart: 14天前 00:00:00 , createdTimeEnd: 今天 23:59:59
                        reqObj: {
                            "createdTimeStart": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdTimeEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"), "pageNum": 1, "pageSize": 10, "userName": "vp0101"
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/member/detail/funds",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/member/detail/funds/export",
                        navigation: "团队管理/会员列表/查看详情/资金明细"
                    },
                    {
                        //btn[查看详情].牌桌信息
                        business: ["cashyj", "cashzc", "credit"], funcName: "牌桌信息", prefixName: "牌桌信息列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10, "clubId": "null", "userId": "1089221280990431316",
                            "createdStartAt": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdEndAt": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59")
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/member/tableList",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/member/tableListExport",
                        navigation: "团队管理/会员列表/查看详情/牌桌信息"
                    },
                    {
                        //btn[查看详情].比赛信息
                        business: ["cashyj", "cashzc", "credit"], funcName: "比赛信息", prefixName: "比赛列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10,
                            "userId": `${this.proxy.userId}`,
                            "parentProxyId": `${this.proxy.userId}`,
                            "signUpStartTimeStr": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "signUpEndTimeStr": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59")
                        },
                        listRoute: "",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/race/user/raceUserListExport",
                        navigation: "团队管理/会员列表/查看详情/比赛信息"
                    },
                    {
                        //btn[更多].登录日志
                        business: ["cashyj", "cashzc", "credit"], funcName: "登录日志", prefixName: "登录日志",
                        reqObj: {
                            "loginStartTime": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "loginEndTime": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "pageNum": 1, "pageSize": 10, "userName": `${this.proxy.userName}`, "userId": `${this.proxy.userId}`
                        },
                        listRoute: '/dx-proxy-gateway/dx-proxy-manager/log/memberLoginLog',
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/log/exportV2',
                        navigation: "团队管理/会员列表/更多/登录日志"
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '团队管理', subMenuTitle: '会员返水比例', menuHref: '/team-manage/rebate-rate',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "已设置", prefixName: "返水比例列表",
                        reqObj: { "parentProxyName": "", "isDirectlyUnder": 1, "orderKey": 4, "orderType": "asc", "date": [], "total": 1, "pageNum": 1, "pageSize": 10, "status": 1, "userType": 0 },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/rebateRate/memberRebateRatelist",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/rebateRate/rebateRateMemberExport'
                    },
                    //参数说明 reqObj.total 可能是待设置的数量
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "待设置", prefixName: "返水比例列表",
                        reqObj: { "parentProxyName": "", "isDirectlyUnder": 1, "orderKey": 4, "orderType": "asc", "date": [], "total": 15, "pageNum": 1, "pageSize": 10, "status": 4, "userType": 0 },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/rebateRate/memberRebateRatelist",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/rebateRate/rebateRateMemberExport'
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc"], menuTitle: '团队管理', subMenuTitle: '代理转账', menuHref: '/team-manage/proxy-transfer',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc"], funcName: "转账记录", prefixName: "转账记录",
                        reqObj: {
                            "createdAtStart": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdAtEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/transfer/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/transfer/export'
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc"], menuTitle: '团队管理', subMenuTitle: '代会员存款', menuHref: '/team-manage/member-transfer',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc"], funcName: "代存记录", prefixName: "代存记录",
                        reqObj: {
                            "createdAtStart": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdAtEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/assistDeposit/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/assistDeposit/export"
                    }
                ]
            },
            {
                business: ["cashyj"], menuTitle: '团队管理', subMenuTitle: 'VIP详情', menuHref: '/team-manage/vip-info',
                exportFiles: [
                    {
                        business: ["cashyj"], funcName: "VIP详情", prefixName: "会员-vip详情导出",
                        reqObj: { "queryCondition": { "memberType": 3, "parentProxyName": "", "proxyType": 2 }, "exportFlag": true },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/member/queryVipLevelList",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/member/queryVipLevelList/export"
                    }
                ]
            },
            {
                business: ["credit"], menuTitle: '团队管理', subMenuTitle: '帮下级还款', menuHref: '/team-manage/credit-repayment',
                exportFiles: [
                    {
                        business: ["credit"], funcName: "还款记录", prefixName: "还款记录",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10, "userType": 0,
                            "createdAtBegin": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdAtEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 00:00:00")
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/helpCreditRepay/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/helpCreditRepay/export'
                    }]
            },
            //还款记录.帮会员还款, 还款记录.帮代理还款
            {
                business: ["credit"], menuTitle: '团队管理', subMenuTitle: '给下级上下分', menuHref: '/team-manage/integral-adjustment',
                exportFiles: [{
                    business: ["credit"], funcName: "上下分记录", prefixName: "上下分记录",
                    reqObj: {
                        "createdTimeStart": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                        "createdTimeEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 00:00:00"),
                        "pageNum": 1, "pageSize": 10
                    },
                    listRoute: "dx-proxy-gateway/dx-proxy-manager/proxy/queryRecord",
                    exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/downRecord'
                }]
            },
            //游戏设置 
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '游戏设置', subMenuTitle: '德州俱乐部', menuHref: '/game-manage/club',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "牌桌列表", prefixName: "牌桌列表",
                        reqObj: {
                            "pageNum": 1,
                            "pageSize": 10,
                            "proxyId": `${this.proxy.proxyId}`,
                            "status": null,
                            "createdStartAt": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdEndAt": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59")
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/listClubExport"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "会员列表", prefixName: "会员列表",
                        reqObj: {
                            "pageNum": 1,
                            "pageSize": 10,
                            "sortKey": 3,
                            "sortType": "desc",
                            "searchPage": 2,
                            "occurDtStart": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "occurDtEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59")
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/member/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/member/memberLsExport"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "俱乐部联盟", prefixName: "俱乐部联盟",
                        reqObj: {
                            "pageNum": 1,
                            "pageSize": 10,
                            "proxyId": `${this.proxy.proxyId}`,
                            "proxyName": `${this.proxy.proxyAccount}`,
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/clubLeagues/List",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/clubLeagues/export"
                    },
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '游戏设置', subMenuTitle: '牌桌列表', menuHref: '/game-manage/card-table',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "德州", prefixName: "牌桌列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10,
                            "createdStartAt": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdEndAt": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "topProxyId": `${this.proxy.proxyId}`, "topProxyName": `${this.proxy.proxyAccount}`, "parentProxyId": 0, "proxyId": `${this.proxy.proxyId}`, "playTypeId": 1
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/listExport"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"],
                        dxnTable: this.getDxnTable("德州"),
                        funcName: "结算详情",
                        prefixName: "德州扑克-牌桌ID-{tableId}-结算详情", //德州扑克-牌桌ID-3093511-结算详情
                        reqObj: { "pageNum": 1, "pageSize": 10, "tableId": this.proxy.tableId, "gameType": 2001, "gameName": "德州扑克" },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/gameOrderUserSettlementByTexasList",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/downGameOrderUserSettlementByTexasList",
                        navigation: "游戏设置/牌桌列表/德州/查看详情/结算详情"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"],
                        dxnTable: this.getDxnTable("德州"),
                        funcName: "手牌列表",
                        prefixName: "德州扑克-牌桌ID-{tableId}-手牌数据", //德州扑克-牌桌ID-3093511-手牌数据
                        reqObj: { "tableId": this.proxy.tableId, "pageNum": 1, "pageSize": 10, "gameName": "德州扑克" },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/hand/listNew",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/tableHand/listExport",
                        navigation: "游戏设置/牌桌列表/德州/查看详情/手牌列表"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"],
                        funcName: "聊天记录",
                        dxnTable: this.getDxnTable("德州"),
                        prefixName: "代理聊天记录列表",//TODO:沒有數據待確認
                        reqObj: {
                            "sendTimeStart": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "sendTimeEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "tableId": this.proxy.tableId, "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/querySystemChatRecordsInfo",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/exportSystemChatRecordsInfo",
                        navigation: "游戏设置/牌桌列表/德州/查看详情/聊天记录"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "十三水", prefixName: "牌桌列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10,
                            "createdStartAt": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdEndAt": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "topProxyId": `${this.proxy.proxyId}`, "topProxyName": "vp01", "parentProxyId": 0, "proxyId": `${this.proxy.proxyId}`, "playTypeId": 2
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxTable/sss/sssTableList",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxTable/sss/tableListExport"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"],
                        dxnTable: this.getDxnTable("十三水"),
                        funcName: "结算详情",
                        prefixName: "牌桌详情_结算详情",
                        reqObj: { "pageNum": 1, "pageSize": 10, "tableId": this.proxy.tableId_13card },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/sssUserTable/gameOrderUserSettlementDetail",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/sssUserTable/gameOrderUserSettlementDetailExport",
                        navigation: "游戏设置/牌桌列表/十三水/查看详情/结算详情"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"],
                        dxnTable: this.getDxnTable("十三水"),
                        funcName: "手牌列表",
                        prefixName: "牌桌详情_十三水手牌数据",
                        reqObj: { "tableId": this.proxy.tableId_13card, "pageNum": 1, "pageSize": 10 },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxhand/sss/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxhand/sss/talbeInfo/handListExport",
                        navigation: "游戏设置/牌桌列表/十三水/查看详情/手牌列表"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"],
                        reqObj: {
                            "sendTimeStart": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "sendTimeEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "tableId": this.proxy.tableId_13card,
                            "pageNum": 1,
                            "pageSize": 10
                        },
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/dxtable/exportSystemChatRecordsInfo',
                        dxnTable: this.getDxnTable("十三水"),
                        funcName: "聊天记录",
                        prefixName: "代理聊天记录列表",
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/querySystemChatRecordsInfo",
                        navigation: "游戏设置/牌桌列表/十三水/查看详情/聊天记录"
                    },
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '游戏设置', subMenuTitle: '会员牌桌列表', menuHref: '/game-manage/member-card',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "德州", prefixName: "会员牌桌列表",
                        reqObj: {
                            "createdStartAt": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdEndAt": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "pageNum": 1, "pageSize": 10,
                            "proxyId": `${this.proxy.proxyId}`, "playTypeId": 1
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxUsertable/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/dxUsertable/listExport'
                    },
                    {

                        dxnTable: this.getDxnTable("德州"),
                        business: ["cashyj", "cashzc"],
                        funcName: "结算详情",
                        prefixName: "德州扑克-牌桌ID-{tableCode}-结算详情", //德州扑克-牌桌ID-D1100082835208093768-结算详情
                        reqObj: { "pageNum": 1, "pageSize": 10, "tableId": this.proxy.tableId, "gameType": 2001, "gameName": "德州扑克", "tableCode": this.proxy.tableCode },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/gameOrderUserSettlementByTexasList",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/downGameOrderUserSettlementByTexasList",
                        navigation: "游戏设置/会员牌桌列表/德州/查看详情/结算详情"
                    },
                    {
                        dxnTable: this.getDxnTable("德州"),
                        business: ["cashyj", "cashzc"],
                        funcName: "手牌列表",
                        prefixName: "德州扑克-牌桌ID-{tableCode}-手牌数据", //德州扑克-牌桌ID-D1100082835208093768-手牌数据
                        reqObj: { "tableId": this.proxy.tableId, "pageNum": 1, "pageSize": 10, "gameName": "德州扑克", "tableCode": this.proxy.tableCode },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/hand/listNew",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/tableHand/listExport",
                        navigation: "游戏设置/会员牌桌列表/德州/查看详情/手牌列表"
                    },
                    {
                        dxnTable: this.getDxnTable("德州"),
                        business: ["cashyj", "cashzc"],
                        funcName: "聊天记录",
                        prefixName: "代理聊天记录列表",//TODO:沒有數據待確認
                        reqObj: {
                            "sendTimeStart": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "sendTimeEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "tableId": this.proxy.tableId,
                            "pageNum": 1,
                            "pageSize": 10
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/querySystemChatRecordsInfo",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/exportSystemChatRecordsInfo",
                        navigation: "游戏设置/会员牌桌列表/德州/查看详情/聊天记录"
                    },
                    {
                        business: ["cashyj", "cashzc"], funcName: "十三水", prefixName: "会员牌桌列表",
                        reqObj: {
                            "createdStartAt": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createdEndAt": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "pageNum": 1, "pageSize": 10, "proxyId": `${this.proxy.proxyId}`, "playTypeId": 2
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/sssUserTable/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/sssUserTable/listExport'
                    },
                    {
                        dxnTable: this.getDxnTable("十三水"),
                        business: ["cashyj", "cashzc"],
                        funcName: "结算详情",
                        prefixName: "牌桌详情_十三水结算详情",
                        reqObj: { "pageNum": 1, "pageSize": 10, "tableId": this.proxy.tableId, "tableCode": this.proxy.tableCode },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/sssUserTable/gameOrderUserSettlementDetail",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/sssUserTable/gameOrderUserSettlementDetailExport",
                        navigation: "游戏设置/会员牌桌列表/十三水/查看详情/结算详情"
                    },
                    {
                        dxnTable: this.getDxnTable("十三水"),
                        business: ["cashyj", "cashzc"],
                        funcName: "手牌列表",
                        prefixName: "牌桌详情_十三水手牌数据",
                        reqObj: { "tableId": this.proxy.tableId, "pageNum": 1, "pageSize": 10, "tableCode": this.proxy.tableCode },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxhand/sss/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxhand/sss/talbeInfo/handListExport",
                        navigation: "游戏设置/会员牌桌列表/十三水/查看详情/手牌列表"
                    },
                    {
                        dxnTable: this.getDxnTable("十三水"),
                        business: ["cashyj"],
                        funcName: "聊天记录",
                        prefixName: "代理聊天记录列表",
                        reqObj: {
                            "sendTimeStart": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -21, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "sendTimeEnd": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "tableId": this.proxy.tableId_13card, "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/querySystemChatRecordsInfo",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/exportSystemChatRecordsInfo",
                        navigation: "游戏设置/会员牌桌列表/十三水/查看详情/聊天记录"
                    },
                ]
            },

            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '游戏设置', subMenuTitle: '手牌列表', menuHref: '/game-manage/hand-card',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "德州", prefixName: "手牌列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10,
                            "handBeginTimeFrom": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "handBeginTimeTo": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "proxyId": `${this.proxy.proxyId}`, "playTypeId": 1
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxtable/hand/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/dxtable/hand/listExport'
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "十三水", prefixName: "十三水手牌列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10,
                            "handBeginTimeFrom": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "handBeginTimeTo": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "proxyId": `${this.proxy.proxyId}`, "playTypeId": 2
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxhand/sss/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/dxhand/sss/listExport'
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '游戏设置', subMenuTitle: '会员手牌列表', menuHref: '/game-manage/member-hand',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "德州", prefixName: "会员手牌列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10,
                            "handBeginTimeFrom": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "handBeginTimeTo": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "resultInfoStage": 5,
                            "proxyId": `${this.proxy.proxyId}`, "playTypeId": 1, "startHandCardList": []
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxUserHand/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/dxUserHand/listExport'
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "十三水", prefixName: "十三水会员手牌列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10,
                            "handBeginTimeFrom": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "handBeginTimeTo": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "proxyId": `${this.proxy.proxyId}`, "playTypeId": 2
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/dxUserHand/sss/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/dxUserHand/sss/listExport'
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '游戏设置', subMenuTitle: '起手牌管理', menuHref: '/game-manage/start-hand',
                exportFiles: []
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '游戏设置', subMenuTitle: '会员商品列表', menuHref: '/game-manage/member-product-list',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "会员商品列表", prefixName: "会员商品列表",
                        reqObj: {
                            "buyTimeFrom": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "buyTimeTo": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "pageNum": 1, "pageSize": 10, "proxyId": `${this.proxy.proxyId}`
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/mallUserGoods/getUserGoodsPage",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/mallUserGoods/listExport"
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '游戏设置', subMenuTitle: '鱿鱼游戏', menuHref: '/game-manage/squid-game',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "鱿鱼游戏", prefixName: "鱿鱼列表",
                        reqObj: {
                            "handBeginTimeFrom": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "handBeginTimeTo": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "pageNum": 1, "pageSize": 10, "proxyId": `${this.proxy.proxyId}`
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/squidRoundData/getRoundPage",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/squidRoundData/listExport"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "鱿鱼游戏账变", prefixName: "鱿鱼钱包帐变",
                        reqObj: {
                            "startDate": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "endDate": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "pageNum": 1, "pageSize": 10, "proxyId": `${this.proxy.proxyId}`
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/squid/accountChangeDetail",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/squid/accountChangeDetailExport"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "会员鱿鱼列表", prefixName: "会员鱿鱼列表",
                        reqObj: {
                            "settleTimeFrom": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "settleTimeTo": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "pageNum": 1, "pageSize": 10, "proxyId": `${this.proxy.proxyId}`
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/squidSettleRecord/getSettlePage",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/squidSettleRecord/listExport"
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '游戏设置', subMenuTitle: '会员限红', menuHref: '/game-manage/red-limit',
                exportFiles: []
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '数据查询', subMenuTitle: '注单数据', menuHref: '/statistics/game-record',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "注单数据", prefixName: "注单数据",
                        reqObj: {
                            "directFlag": "", "pageNum": 1, "pageSize": 10, "queryType": 0,
                            "startTime": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "endTime": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59")
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/member/gameRecords",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/order/downUserGameRecordList'
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '数据查询', subMenuTitle: '订单数据', menuHref: '/statistics/order-list',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "订单数据", prefixName: "订单列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10, "proxyId": `${this.proxy.proxyId}`, "userNameType": `${this.proxy.userNameType}`,
                            "orderTimeFrom": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "orderTimeTo": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"),
                            "netTimeFrom": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "netTimeTo": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59")
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/order/listPage",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/order/listExport'
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '数据查询', subMenuTitle: '德州保险', menuHref: '/statistics/insurance-list',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "德州保险", prefixName: "保险列表",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10, "proxyId": `${this.proxy.proxyId}`,
                            "createStartTime": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), "yyyy-MM-dd", " 00:00:00"),
                            "createEndTime": dateUtils.getFormatDateString(new Date(), "yyyy-MM-dd", " 23:59:59"), "userNameType": 1
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/insure/info/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/insure/info/listExport'
                    }
                ]
            },
            {
                business: ["cashyj"], menuTitle: '数据查询', subMenuTitle: '佣金账单', menuHref: '/statistics/commission-bill',
                exportFiles: [
                    {
                        business: ["cashyj"], funcName: "团队佣金账单", prefixName: "佣金账单",
                        reqObj: {
                            "cycleStartDate": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, -3, 0, 0, 0, 0), 'yyyyMM'),
                            "cycleEndDate": dateUtils.getFormatDateString(new Date(), 'yyyyMM'),
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/commission/record/listPage",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/commission/record/export'
                    },
                    //betType: 1:德州俱乐部分成明细 , 101:德州游戏大厅分成明细
                    {
                        business: ["cashyj"],
                        funcName: "德州俱乐部分成明细", //德州俱乐部服务费分成,弹窗数据点开
                        prefixName: "德州俱乐部分成明细",
                        reqObj: {
                            "proxyName": this.proxy.proxyAccount, "betType": 1, "pageNum": 1, "pageSize": 10,
                            "cycleStartDate": dateUtils.getFormatDateString(dateUtils.getFirstDayOfMonth(dateUtils.calculateDate(new Date(), 0, 0, 0, 0, 0, 0)), 'yyyyMMdd'),
                            "cycleEndDate": dateUtils.getFormatDateString(dateUtils.getLastDayOfMonth(dateUtils.calculateDate(new Date(), 0, 0, 0, 0, 0, 0)), 'yyyyMMdd')
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/commission/order-record/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/commission/proxy/export',
                        navigation: "数据查询/佣金账单/团队佣金明细/德州俱乐部分成明细"
                    },
                    {
                        business: ["cashyj"],
                        funcName: "德州游戏大厅分成明细", //德州俱乐部服务费分成,弹窗数据点开
                        prefixName: "德州游戏大厅分成明细",
                        reqObj: {
                            "proxyName": this.proxy.proxyAccount, "betType": 101, "pageNum": 1, "pageSize": 10,
                            "cycleStartDate": dateUtils.getFormatDateString(dateUtils.getFirstDayOfMonth(dateUtils.calculateDate(new Date(), 0, 0, 0, 0, 0, 0)), 'yyyyMMdd'),
                            "cycleEndDate": dateUtils.getFormatDateString(dateUtils.getLastDayOfMonth(dateUtils.calculateDate(new Date(), 0, 0, 0, 0, 0, 0)), 'yyyyMMdd')
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/commission/order-record/list",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/commission/proxy/export',
                        navigation: "数据查询/佣金账单/团队佣金明细/德州游戏大厅分成明细"

                    },
                    //红利明细
                    {
                        business: ["cashyj"],
                        funcName: "红利明细",
                        prefixName: "红利详情",
                        reqObj: {
                            "receiveStartTime": dateUtils.getFormatDateString(dateUtils.getFirstDayOfMonth(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0)), 'yyyy-MM-dd'),
                            "receiveEndTime": dateUtils.getFormatDateString(dateUtils.getLastDayOfMonth(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0)), 'yyyy-MM-dd'),
                            "topProxyIds": [`${this.proxy.proxyId}`], "receiveType": 1
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/commission/proxyBonusAmount/listPage",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/commission/proxyBonusAmount/export',
                        navigation: "数据查询/佣金账单/团队佣金明细/查看详情/综合场馆/红利详情"
                    },
                    {
                        business: ["cashyj"], funcName: "会员返水账单", prefixName: "佣金账单-会员返水账单列表",
                        reqObj: {
                            "reportStDate": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd'),
                            "reportEdDate": dateUtils.getFormatDateString(new Date(), 'yyyyMMdd'),
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/report/budgetCommissionManage/memberRebateAccount/listPage",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/budgetCommissionManage/memberRebateAccount/export'
                    },
                    {
                        //会员返水账单/查看详情/返水明细/德州俱乐部/订单明细
                        business: ["cashyj"], funcName: "德州俱乐部", prefixName: "德州俱乐部返水详情",
                        reqObj: {
                            "venueCode": "dz",
                            "betType": 1,
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, 0, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10,

                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/order-record/member/exportV2'
                    },
                    {
                        //会员返水账单/查看详情/返水明细/德州游戏大厅/订单明细
                        business: ["cashyj"], funcName: "德州游戏大厅", prefixName: "德州游戏大厅返水详情",
                        reqObj: {
                            "venueCode": "dz",
                            "betType": 101,
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10,

                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/order-record/member/exportV2'
                    },
                    {
                        //会员返水账单/查看详情/返水明细/体育/订单明细
                        business: ["cashyj"], funcName: "会员返水账单/查看详情/返水明细/体育/订单明细", prefixName: "体育注单返水详情",
                        reqObj: {
                            "venueCode": "ty",
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10,

                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //会员返水账单/查看详情/返水明细/电竞/订单明细
                        business: ["cashyj"], funcName: "会员返水账单/查看详情/返水明细/电竞/订单明细", prefixName: "电竞注单返水详情",
                        reqObj: {
                            "venueCode": "dj",
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10,

                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //会员返水账单/查看详情/返水明细/真人/订单明细
                        business: ["cashyj"], funcName: "会员返水账单/查看详情/返水明细/真人/订单明细", prefixName: "真人注单返水详情",
                        reqObj: {
                            "venueCode": "zr",
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10,

                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //会员返水账单/查看详情/返水明细/棋牌/订单明细
                        business: ["cashyj"], funcName: "会员返水账单/查看详情/返水明细/棋牌/订单明细", prefixName: "棋牌注单返水详情",
                        reqObj: {
                            "venueCode": "qp",
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10,

                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //会员返水账单/查看详情/返水明细/彩票/订单明细
                        business: ["cashyj"], funcName: "会员返水账单/查看详情/返水明细/彩票/订单明细", prefixName: "彩票注单返水详情",
                        reqObj: {
                            "venueCode": "cp",
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10,

                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //会员返水账单/查看详情/返水明细/电子/订单明细
                        business: ["cashyj"], funcName: "会员返水账单/查看详情/返水明细/电子/订单明细", prefixName: "电子注单返水详情",
                        reqObj: {
                            "venueCode": "dy",
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10,

                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    }
                ]
            },
            {
                business: ["cashzc", "credit"], menuTitle: '数据查询', subMenuTitle: '收益统计', menuHref: '/statistics/profit-manage',
                exportFiles: [
                    {
                        business: ["credit", "cashzc"], funcName: "团队收益", prefixName: "团队收益",
                        reqObj: {
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "payoutStatus": 0, "pageNum": 1, "pageSize": 10, "payoutStatusList": [0, 1, 3, 5, 6]
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/rebateAmountManager/export'
                    },
                    {
                        //团队收益/查看详情/收益明细/德州俱乐部/订单明细
                        business: ["credit", "cashzc"], funcName: "德州俱乐部分成明细", prefixName: "德州俱乐部分成明细",
                        reqObj: {
                            "proxyName": this.proxy.proxyAccount,
                            "betType": 1,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/order-record/proxy/export'
                    },
                    {
                        //团队收益/查看详情/收益明细/德州游戏大厅/订单明细
                        business: ["credit", "cashzc"], funcName: "德州游戏大厅分成明细", prefixName: "德州游戏大厅分成明细",
                        reqObj: {
                            "proxyName": this.proxy.proxyAccount,
                            "betType": 101,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/order-record/proxy/export'
                    },
                    {
                        //团队收益/查看详情/收益明细/体育/注单明细
                        business: ["credit", "cashzc"], funcName: "团队收益/查看详情/收益明细/体育/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "ty",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/proxy/export'
                    },
                    {
                        //团队收益/查看详情/收益明细/电竞/注单明细
                        business: ["credit", "cashzc"], funcName: "团队收益/查看详情/收益明细/电竞/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "dj",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/proxy/export'
                    },
                    {
                        //团队收益/查看详情/收益明细/真人/注单明细
                        business: ["credit", "cashzc"], funcName: "团队收益/查看详情/收益明细/真人/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "zr",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/proxy/export'
                    },
                    {
                        //团队收益/查看详情/收益明细/棋牌/注单明细
                        business: ["credit", "cashzc"], funcName: "团队收益/查看详情/收益明细/棋牌/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "qp",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/proxy/export'
                    },
                    {
                        //团队收益/查看详情/收益明细/彩票/注单明细
                        business: ["credit", "cashzc"], funcName: "团队收益/查看详情/收益明细/彩票/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "cp",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/proxy/export'
                    },
                    {
                        //团队收益/查看详情/收益明细/电子/注单明细
                        business: ["credit", "cashzc"], funcName: "团队收益/查看详情/收益明细/电子/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "dy",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/proxy/export'
                    },
                    {
                        business: ["credit", "cashzc"], funcName: "下级会员返水", prefixName: "下级会员返水",
                        reqObj: {
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "payoutStatus": 0, "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/rebateAmountManager/subMemberEarnings/export'
                    },
                    {
                        //下级会员返水/查看详情/返水明细/德州俱乐部/订单明细
                        business: ["credit", "cashzc"], funcName: "德州俱乐部返水详情", prefixName: "德州俱乐部返水详情",
                        reqObj: {
                            "betType": 1,
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/order-record/member/exportV2'
                    },
                    {
                        //下级会员返水/查看详情/返水明细/德州游戏大厅/订单明细
                        business: ["credit", "cashzc"], funcName: "德州俱乐部返水详情", prefixName: "德州游戏大厅返水详情",
                        reqObj: {
                            "betType": 101,
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/order-record/member/exportV2'
                    },
                    {
                        //下级会员返水/查看详情/返水明细/德州游戏大厅比赛/订单明细
                        business: ["credit", "cashzc"], funcName: "德州返水详情", prefixName: "德州返水详情",
                        reqObj: {
                            "betType": 101,
                            "memberName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/order-record/member/exportV2'
                    }
                    //////
                    ,
                    {
                        //下级会员返水/查看详情/返水明细/体育/注单明细
                        business: ["credit", "cashzc"], funcName: "下级会员返水/查看详情/返水明细/体育/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "ty",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //下级会员返水/查看详情/返水明细/电竞/注单明细
                        business: ["credit", "cashzc"], funcName: "下级会员返水/查看详情/返水明细/电竞/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "dj",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //下级会员返水/查看详情/返水明细/真人/注单明细
                        business: ["credit", "cashzc"], funcName: "下级会员返水/查看详情/返水明细/真人/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "zr",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //下级会员返水/查看详情/返水明细/棋牌/注单明细
                        business: ["credit", "cashzc"], funcName: "下级会员返水/查看详情/返水明细/棋牌/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "qp",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //下级会员返水/查看详情/返水明细/彩票/注单明细
                        business: ["credit", "cashzc"], funcName: "下级会员返水/查看详情/返水明细/彩票/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "cp",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                    {
                        //下级会员返水/查看详情/返水明细/电子/注单明细
                        business: ["credit", "cashzc"], funcName: "下级会员返水/查看详情/返水明细/电子/注单明细", prefixName: "",
                        reqObj: {
                            "venueType": "dy",
                            "proxyName": this.proxy.proxyAccount,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/proxy/report/bet-record/member/exportV2'
                    },
                ]
            },
            {
                business: ["credit", "cashzc"], menuTitle: '数据查询', subMenuTitle: '盈亏统计', menuHref: '/statistics/proxy-member',
                exportFiles: [
                    {
                        business: ["credit", "cashzc"], funcName: "代理盈亏", prefixName: "代理盈亏",
                        reqObj: {
                            "startDate": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd'),
                            "endDate": dateUtils.getFormatDateString(new Date(), 'yyyyMMdd'),
                            "proxyName": `${this.proxy.proxyAccount}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/proxyNetAmount/recalculate/day/export'
                    },
                    {
                        business: ["credit", "cashzc"], funcName: "会员盈亏", prefixName: "会员盈亏",
                        reqObj: {
                            "startDate": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -7, 0, 0, 0), 'yyyyMMdd'),
                            "endDate": dateUtils.getFormatDateString(new Date(), 'yyyyMMdd'),
                            "memberType": 4, "userName": "", "pageNum": 1, "pageSize": 10, "unique": "proxyManagerExport"
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/memberNetAmount/export'
                    }
                ]
            },
            //
            {
                business: ["cashzc"], menuTitle: '数据查询', subMenuTitle: '占成账单', menuHref: '/statistics/zhancheng-bill',
                exportFiles: [

                    {
                        business: ["cashzc"], funcName: "占成账单", prefixName: "占成账单", reqObj:
                        {
                            "queryRange": 4,
                            //"cycleStartDate":"20241101","cycleEndDate":"20250228"
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.getFirstDayOfMonth(dateUtils.calculateDate(new Date(), 0, -3, 0, 0, 0, 0)), 'yyyyMMdd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(dateUtils.getLastDayOfMonth(dateUtils.calculateDate(new Date(), 0, 0, 0, 0, 0, 0)), 'yyyyMMdd')}`
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/proxyBill/zhanchengExport'
                    },
                ]
            },
            {
                business: ["credit"], menuTitle: '数据查询', subMenuTitle: '账单', menuHref: '/statistics/bill',
                exportFiles: [
                    {
                        business: ["credit"], funcName: "", prefixName: "账单-代理账单",
                        reqObj: { "queryRange": 4, "periodType": 1 },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/proxyBill/export'
                    },
                    {
                        business: ["credit"], funcName: "", prefixName: "账单-会员账单",
                        reqObj: { "memberType": 4, "periodType": 1 },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/proxyLoanBill/member/export'
                    },
                    {
                        business: ["credit"], funcName: "", prefixName: "账单-代理线清算账单",
                        reqObj: { "recycleMode": 2 },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/proxyLiquidationBill/list/export'
                    }
                ]
            },//代理账单, 会员账单, 代理线清算账单
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '数据查询', subMenuTitle: '会员真人打赏记录', menuHref: '/statistics/streamer-rewards',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "", prefixName: "会员真人打赏记录",
                        reqObj: {
                            "directMember": false,
                            "cycleStartDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyy-MM-dd')}`,
                            "cycleEndDate": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd')}`
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/report/liveReward/query",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/report/liveReward/export"
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '数据查询', subMenuTitle: '运营数据', menuHref: '/statistics/data-statistics',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc"], funcName: "运营数据概览", prefixName: "运营数据概览",
                        reqObj: {
                            "startDate": dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyyMMdd'),
                            "endDate": dateUtils.getFormatDateString(new Date(), 'yyyyMMdd'),
                            "pageNum": 1, "pageSize": 50
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/statistics/operationalData/day/page",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/statistics/operationalData/day/export"
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "收益&净输赢统计", prefixName: "团队收益",
                        reqObj: {
                            "startDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyyMMdd')}`,
                            "endDate": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/report/proxyTeamIncome/listPage",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/report/proxyTeamIncome/export'
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "代理数据统计", prefixName: "代理报表",
                        reqObj: {
                            "startTime": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyyMMdd')}`,
                            "endTime": `${dateUtils.getFormatDateString(new Date(), 'yyyyMMdd')}`,
                            "pageNum": 1, "pageSize": 10, "proxyType": 1
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/rebate/getProxyReportPage",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/rebate/proxyDayReportExportV2'
                    },
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "会员数据统计", prefixName: "会员报表",
                        reqObj: {
                            "orderType": "desc", "orderKey": "registerAt",
                            "startTime": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyy-MM-dd')}`,
                            "endTime": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd')}`,
                            "pageNum": 1, "pageSize": 10, "dataAreaType": 1
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/report/playerStaticInfo/listPage",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/report/playerStaticInfo/listPageExportV2"
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '数据查询', subMenuTitle: '德州游戏数据', menuHref: '/statistics/texas-games-data',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "德州游戏数据", prefixName: "德州游戏数据",
                        reqObj: {
                            "proxyName": this.proxy.proxyAccount,
                            "startDate": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyy-MM-dd')}`,
                            "endDate": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd')}`,
                            "pageNum": 1, "pageSize": 10, "proxyId": `${this.proxy.proxyId}`
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/report/memberTexasHoldNetAmount/listPage",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/report/memberTexasHoldNetAmount/export"
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '数据查询', subMenuTitle: '德州游戏订单', menuHref: '/statistics/dzgame-record',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "德州游戏订单", prefixName: "德州游戏订单",
                        reqObj: {
                            "total": 0, "pageNum": 1, "pageSize": 10,
                            "startOrderTime": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyy-MM-dd', ' 00:00:00')}`,
                            "endOrderTime": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd', ' 23:59:59')}`
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/gameOrder/dzGameOrderList",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/gameOrder/listExport"
                    }
                ]
            },
            {
                business: ["credit"], menuTitle: '数据查询', subMenuTitle: '净资产统计', menuHref: '/statistics/net-assets',
                exportFiles: [
                    {
                        business: ["credit"], funcName: "", prefixName: "净资产统计",
                        reqObj: { "rangeType": 2, "reportDate": "20250221", "userName": "", "platFormType": 2 },
                        listRoute: "",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/report/net-assert/export"
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '我的', subMenuTitle: '钱包', menuHref: '/personal-center/wallet-management',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc"], funcName: "钱包", prefixName: "钱包",
                        reqObj: {
                            "startTime": `${dateUtils.getFormatDateString(dateUtils.getFirstDayOfMonth(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0)), 'yyyy-MM-dd', ' 00:00:00')}`,
                            "endTime": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd', ' 23:59:59')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/wallet/proxyDespositWithdrawRecord",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/wallet/exportProxyDespositWithdrawRecord"
                    },
                    {
                        business: ["credit"], funcName: "现金钱包", prefixName: "现金钱包",
                        reqObj: {
                            "startTime": `${dateUtils.getFormatDateString(dateUtils.getFirstDayOfMonth(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0)), 'yyyy-MM-dd', ' 00:00:00')}`,
                            "endTime": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd', ' 23:59:59')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/wallet/proxyDespositWithdrawRecord",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/wallet/exportProxyDespositWithdrawRecord"
                    },
                    {
                        business: ["credit"], funcName: "信用钱包", prefixName: "信用钱包",
                        reqObj: {
                            "startTime": `${dateUtils.getFormatDateString(dateUtils.getFirstDayOfMonth(dateUtils.calculateDate(new Date(), 0, -1, 0, 0, 0, 0)), 'yyyy-MM-dd', ' 00:00:00')}`,
                            "endTime": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd', ' 23:59:59')}`,
                            "pageNum": 1, "pageSize": 10
                        },
                        listRoute: "",
                        exportRoute: '/dx-proxy-gateway/dx-proxy-manager/wallet/exportProxyLoanRepayRecord'
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '我的', subMenuTitle: '账变明细', menuHref: '/personal-center/finance-records',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc"], funcName: "账变明细", prefixName: "账变明细",
                        reqObj: {
                            "createdTimeStart": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyy-MM-dd', ' 00:00:00')}`,
                            "createdTimeEnd": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd', ' 23:59:59')}`,
                            "nameType": "0"
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/account/change/cash/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/account/change/cash/export"
                    },
                    {
                        business: ["credit"], funcName: "现金钱包", prefixName: "账变明细",
                        reqObj: {
                            "createdTimeStart": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyy-MM-dd', ' 00:00:00')}`,
                            "createdTimeEnd": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd', ' 23:59:59')}`,
                            "nameType": "0"
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/account/change/cash/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/account/change/cash/export"
                    },
                    {
                        business: ["credit"], funcName: "信用钱包", prefixName: "账变明细",
                        reqObj: {
                            "createdTimeStart": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyy-MM-dd', ' 00:00:00')}`,
                            "createdTimeEnd": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd', ' 23:59:59')}`,
                            "nameType": "0"
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/account/change/cash/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/account/change/credit/export"
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '我的', subMenuTitle: '存款充值', menuHref: '/personal-center/deposit',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "存款记录", prefixName: "存款记录",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10,
                            "createdAtStart": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyy-MM-dd', ' 00:00:00')}`,
                            "createdAtEnd": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd', ' 23:59:59')}`,
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/deposit/record",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/deposit/record/export"
                    }]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '我的', subMenuTitle: '申请取款', menuHref: '/personal-center/withdraw',
                exportFiles: [
                    {
                        business: ["cashyj", "cashzc", "credit"], funcName: "取款记录", prefixName: "取款记录",
                        reqObj: {
                            "pageNum": 1, "pageSize": 10,
                            "createdAtStart": `${dateUtils.getFormatDateString(dateUtils.calculateDate(new Date(), 0, 0, -14, 0, 0, 0), 'yyyy-MM-dd', ' 00:00:00')}`,
                            "createdAtEnd": `${dateUtils.getFormatDateString(new Date(), 'yyyy-MM-dd', ' 23:59:59')}`,
                        },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/withdrawal/record",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/proxy/withdrawal/record/export"
                    }
                ]
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '我的', subMenuTitle: '推广管理', menuHref: '/personal-center/promote',
                exportFiles: []
            },
            {
                business: ["cashzc", "credit"], menuTitle: '我的', subMenuTitle: '助理账号', menuHref: '/personal-center/assistant',
                exportFiles: []
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '我的', subMenuTitle: '个人资料', menuHref: '/personal-center/profile',
                exportFiles: []
            },
            {
                business: ["cashyj", "cashzc", "credit"], menuTitle: '我的', subMenuTitle: '消息', menuHref: '/personal-center/notification',
                exportFiles: [
                    //noticeType 1:系统通知, 2:消息, 3:公告
                    {
                        business: ["cashyj", "credit"], funcName: "系统通知", prefixName: "代理消息列表",
                        reqObj: { "pageNum": 1, "pageSize": 10, "noticeType": 1 },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxyMessage/notifyList",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/proxyMessage/notifyListExport"
                    },
                    {
                        business: ["cashyj", "credit"], funcName: "公告", prefixName: "代理消息列表",
                        reqObj: { "pageNum": 1, "pageSize": 10, "noticeType": 3 },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxyMessage/notifyList",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/proxyMessage/notifyListExport"
                    },
                    {
                        business: ["cashyj", "credit"], funcName: "消息", prefixName: "代理消息列表",
                        reqObj: { "pageNum": 1, "pageSize": 10, "noticeType": 2 },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/proxyMessage/notifyList",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/proxyMessage/notifyListExport"
                    }
                ]
            },
            {
                business: ["cashyj"], menuTitle: '我的', subMenuTitle: '我的佣金比例', menuHref: '/personal-center/my-commission',
                exportFiles: [
                    {
                        business: ["cashyj"], funcName: "我的佣金比例", prefixName: "我的佣金比例",
                        reqObj: { "userType": 1, "orderKey": 1, "orderType": "desc", "userId": `${this.proxy.proxyId}` },
                        listRoute: "/dx-proxy-gateway/dx-proxy-manager/commissionRate/list",
                        exportRoute: "/dx-proxy-gateway/dx-proxy-manager/commissionRate/export"
                    }
                ]
            },
        ];
    };
    /**
     * 取得 SiteMetaData
     * @param {string} menuTitle 
     * @param {string} subMenuTitle 
     * @returns
     */
    getSiteMetaData(menuTitle, subMenuTitle) {
        return this.siteMetaDatas.find((data) => data.menuTitle === menuTitle && data.subMenuTitle === subMenuTitle);
    };
    /**
     * 取得德州牌桌资料
     * @param {string} name - 牌桌名称
     */
    getDxnTable(name) {
        return this.dxnTable.find((x) => x.name === name);
    }
    /** 印出面包屑导航 */
    async printBreadcrumbNavigation(siteMetaData, exportFile) {
        if (exportFile.navigation != undefined && exportFile.navigation !== "") {
            console.log(`\n${exportFile.navigation}:`);
        } else {
            console.log(`\n${siteMetaData.menuTitle}/${siteMetaData.subMenuTitle}/${exportFile.funcName}:`);
        }
    }
}

export default agbeSys;