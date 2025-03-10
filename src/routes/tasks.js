import express from 'express';
var router = express.Router();

/* GET tasks listing. */
router.get('/', function(req, res, next) {
  //todo 从数据库中获取 task 数据
  res.send('respond with a resource');

});

/** 接收 json request  */
router.post('/', function(req, res, next) {
  var taskData = req.body;
  console.log(taskData);
  
  //todo 将 taskData 保存到数据库
  //todo 从数据库中获取 task 数据
  res.send('respond with a resource');

});



module.exports = router;
