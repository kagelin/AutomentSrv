import { chromium } from 'playwright';
import AgbeActions from '../core/AGBE/agbeActions.js';
import sysConfig from '../core/sysConfig.js';
import files from '../core/helpers/files.js';

import express from 'express'; 
import prce from 'child_process';
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {

  const browserConfig = {
    headless: false,  // false: 显示浏览器
    args: [
      '--disable-blink-features=AutomationControlled', // 避免检测自动化
      '--start-maximized' //强制窗口最大化
    ],
  };
  var _params = files.loadParams(sysConfig.baseDir, sysConfig.agbeParam);

  const browser = await chromium.launch(browserConfig, { viewport: null });
  const context = await browser.newContext();
  const page = await context.newPage();

  var agbeActions = new AgbeActions(page, _params, 'cashyj')
  var tasks = [{
    id: 1,
    name: 'login',
    description: '登录',
    screenShot: 'login.png',
    refCode: agbeActions.login.bind(agbeActions),
    baseOpt: { username: 'string', password: 'string' }
  }, {
    id: 2,
    name: 'clickMenu',
    description: '点击菜单',
    screenShot: 'clickMenu.png',
    refCode: agbeActions.clickMenu.bind(agbeActions)
  }, {
    id: 3,
    name: 'clickExport',
    description: '点击导出按钮',
    screenShot: 'clickExport.png',
    refCode: agbeActions.clickExport.bind(agbeActions)
  }, {
    id: 4,
    name: 'clickExportConfirm',
    description: '点击导出按钮确认',
    screenShot: 'clickExportConfirm.png',
    refCode: agbeActions.clickExportConfirm.bind(agbeActions)
  }];
  var job_a = {
    id: 5,
    name: 'export proxy list',
    description: '导出代理列表',
    tasks: [tasks[0], tasks[1], tasks[2], tasks[3]],
    opts: [
      undefined,
      { menuTitle: '团队管理', subMenuTitle: '代理列表' },
      undefined,
      undefined
    ]
  }
  var jobs = [job_a];
  for (let i = 0; i < jobs.length; i++) {
    var j = jobs[i];
    console.log(j.description);
    var tasks = j.tasks;
    var opts = j.opts;
    for (let index = 0; index < tasks.length; index++) {
      console.log('  ', tasks[index].description);
      await tasks[index].refCode(opts[index]);
      await page.waitForTimeout(2000);
    }
  }
  await browser.close();
  console.log('done');

  res.render('index', { title: 'Automent Server' });
});

router.post('/pytest', async function (req, res, next) {
  console.log(req.body);
  let outMessage = '';
  
  prce.exec('sh /Users/30fc0007/Documents/projects_vscode/AutomentSrv/test.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    outMessage = stdout;
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send(`success ${outMessage}`);
  });
  return;
  //res.send(`process ${child}`);
});
export default router;
