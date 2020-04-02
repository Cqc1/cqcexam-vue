// 点击试卷后的缩略信息
<template>
  <div id="msg">
    <div class="title">
      <span>试卷列表</span>
      <span>/  {{examData.exname}}</span>
    </div>
    <div class="wrapper">
      <ul class="top">
        <li class="example">{{examData.exname}}</li>
        <li><i class="iconfont icon-pen-"></i></li>
        <li><i class="iconfont icon-share"></i></li>
        <li class="right">
          <div>
            <span class="count">总分</span>
            <span class="score">{{examData.paper.totalscore}}</span>
          </div>
        </li>
      </ul>
      <ul class="bottom">
        <li>考试时间：{{examData.exdate}}</li>
        <li>来自 {{examData.institution.instituname}}</li>
        <li class="btn">{{examData.course.couname}}</li>
        <li v-if="!this.$route.query.isPractice" class="right"><el-button  @click="toAnswer(examData.examid)">开始答题</el-button></li>
        <li v-if="this.$route.query.isPractice" class="right"><el-button  @click="toAnswer(examData.examid)">开始练习</el-button></li>
      </ul>
      <ul class="info">
        <li @click="dialogVisible = true"><a href="javascript:;"><i class="iconfont icon-info"></i>考生须知</a></li>
      </ul>
    </div>
    <div class="content">
      <el-collapse v-model="activeName" >
        <el-collapse-item class="header" name="0">
          <template slot="title" class="stitle" >
            <div class="title">
              <span>{{examData.exname}}</span><i class="header-icon el-icon-info"></i>
              <span class="time">{{examData.paper.totalscore}}分 / {{examData.extime}}分钟</span>
              <el-button type="primary" size="small">点击查看试题详情</el-button>
            </div>
          </template>
          <el-collapse class="inner">
            <el-collapse-item v-for="item in topic.paperScores" >
              <template slot="title" :name="item.questype">
                <div class="titlei">{{item.quesname}} (共{{item.quesnum}}题  共计{{item.typescore}}分)</div>
              </template>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
        
      </el-collapse>
    </div>
    <!--考生须知对话框-->
    <el-dialog
      title="考生须知"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{examData.description}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, //对话框属性
      activeName: '0',  //默认打开序号
      topicCount: [],//每种类型题目的总数
      score: [],  //每种类型分数的总数
      examData: { //考试信息
        institution:'',
        course:'',
        paper:'',
        // source: null,
        // totalScore: null,
      },
      topic: {  //试卷信息
        paperScores:'',
      },
      currentTime:'',
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    //初始化页面数据
    init() {
      let examCode = this.$route.query.examid //获取路由传递过来的试卷编号
      this.$axios(`/api/exam/selectById/${examCode}`).then(res => {  //通过examCid请求试卷详细信息
        res.data.data.exdate = res.data.data.exdate.substr(0,10)
        this.examData = { ...res.data.data}
        let paperId = this.examData.paperid
        this.$axios(`/api/que_paper/score/${paperId}`).then(res => {  //通过paperId获取试题题目信息
          this.topic = {...res.data.data}
          console.log(this.topic);
        })
      })
    },
    format(date, fmt) {
      let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    },
    toAnswer(id) {
      this.currentTime = this.format(new Date(), "yyyy-MM-dd HH:mm:ss");
      let date = new Date(this.examData.exdate);
      this.examData.exdate=this.format(date, "yyyy-MM-dd HH:mm:ss");
      console.log(this.currentTime+"====="+this.examData.exdate);
      if(this.currentTime>this.examData.exdate&&!this.$route.query.isPractice){
        if(this.examData.isexam==0){
          this.$router.push({path:"/answer",query:{examid: id, path:this.$route.params.path}})
        }else{
          this.$message({
            message: '该考试已经考过，不许重复考试！',
            type: 'warning'
          })
        }
      }else if(this.$route.query.isPractice) {
        this.$router.push({path:"/answer",query:{examid: id,isPractice:true}})
      }else{
        this.$message({
          message: '还未到考试开始时间！',
          type: 'warning'
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.bottom {
  .right{
    .el-button{
      color: #409EFF;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }
}
.right {
  margin-left: auto;
}
.inner .contenti .question {
  margin-left: 40px;
  color: #9a9a9a;
  font-size: 14px;
}
.content .inner .titlei {
  margin-left: 20px;
  font-size: 16px;
  color: #88949b;
  font-weight: bold;
}
.content .title .time {
  font-size: 16px;
  margin-left: 420px;
  color: #999;
}
.content .stitle {
  background-color: #0195ff;
}
.content .title span {
  margin-right: 10px;
}
#msg .content .title {
  font-size: 20px;
  margin: 0px;
  display: flex;
  align-items: center;
}
.content {
  margin-top: 20px;
  background-color: #fff;
}
.content .header {
  padding: 10px 30px;
}
.wrapper .info {
  margin: 20px 0px 0px 20px;
  border-top: 1px solid #eee;
  padding: 20px 0px 10px 0px;
}
.wrapper .info a {
  color: #88949b;
  font-size: 14px;
}
.wrapper .info a:hover {
  color: #0195ff;
}
.wrapper .bottom .btn {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #88949b;
  border-radius: 4px;
} 
.wrapper .bottom {
  display: flex;
  margin-left: 20px;
  color: #999;
  font-size: 14px;
  align-items: center;
}
.wrapper .bottom li {
  margin-right: 14px;
}
#msg {
  background-color: #eee;
  width: 980px;
  margin: 0 auto;
}
#msg .title {
  margin: 20px;
}
#msg .wrapper {
  background-color: #fff;
  padding: 10px;
}
.wrapper .top {
  display: flex;
  margin: 20px;
  align-items: center;
}
.wrapper .top .right {
  margin-left: auto;
}
.wrapper .top .example {
  color: #333;
  font-size: 22px;
  font-weight: 700;
}
.wrapper .top li i {
  margin-left: 20px;
  color: #88949b;
}
.wrapper .right .count {
  margin-right: 60px;
  color: #fff;
  padding: 4px 10px;
  background-color: #88949b;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #88949b;
}
.wrapper .right .score {
  position: absolute;
  left: 53px;
  top: -5px;
  padding: 1px 12px;
  font-size: 20px;
  color: #88949b;
  border: 1px dashed #88949b;
  border-left: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  font-weight: bold;
}
.wrapper .right div {
  position: relative;
}
</style>
