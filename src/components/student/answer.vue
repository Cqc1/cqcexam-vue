<!--考生答题界面-->
<template>
  <div id="answer">
    <!--顶部信息栏-->
     <div class="top">
       <ul class="item">
         <li><i class="iconfont icon-menufold icon20" ref="toggle" @click="slider_flag = !slider_flag"></i></li>
         <li>{{examData.exname}}</li>
         <li @click="flag = !flag">
           <i class="iconfont icon-user icon20"></i>
           <div class="msg"  v-if="flag" @click="flag = !flag">
             <p>姓名：{{userInfo.name}}</p>
             <p>准考证号:  {{userInfo.id}}</p>
           </div>
         </li>
         <li><i class="iconfont icon-arrLeft icon20"></i></li>
       </ul>
     </div>
     <div class="flexarea">
        <!--左边题目编号区-->
        <transition name="slider-fade">
          <div class="left" v-if="slider_flag">
            <ul class="l-top">
              <li>
                <a href="javascript:;"></a>
                <span>当前</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>未答</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>已答</span>
              </li>
              <li>
                <a href="javascript:;"></a>
                <span>标记</span>
              </li>
            </ul>
            <div class="l-bottom">
              <div class="item" v-for="item in paperScores">
                <p>{{item.quesname}}部分</p>
                <ul>
                  <li v-for="(list, index) in topic[item.questype]" :key="index">
                    <a href="javascript:;"
                       @click="change(item.questype,index)"
                       :class="{'border': Index == index && currentType == item.questype,'bg': bg_flag &&
                        topic[item.questype][index].isClick == true}">
                      <span :class="{'mark': topic[item.questype][index].isMark == true}"></span>
                      {{index+1}}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="final" @click="commit()">结束考试</div>
            </div>
          </div>
        </transition>  
        <!--右边选择答题区-->
        <transition name="slider-fade">
        <div class="right">
          <div class="title">
            <p>{{title}}</p>
            <i class="iconfont icon-right auto-right"></i>
            <span>全卷共{{paperQuesNum}}题  <i class="iconfont icon-time"></i>倒计时：<b>{{time}}</b>分钟</span>
          </div>
          <div class="content">
            <p class="topic"><el-tag type="success">{{number}} </el-tag> {{showQuestion}}  <span>{{"("+showScore+"分)"}}</span></p>
            <div v-if="currentType == 1">
            <el-radio-group v-model="radio[singAnswer.quesid]"
                            @change="getChangeLabel(currentType,singAnswer.quesid,radio[singAnswer.quesid],singAnswer.answer,showScore)" >
              <el-tag>A：<el-radio  label="A">{{singAnswer.optiona}}</el-radio></el-tag>
              <el-tag>B：<el-radio  label="B">{{singAnswer.optionb}}</el-radio></el-tag>
              <el-tag>C：<el-radio  label="C">{{singAnswer.optionc}}</el-radio></el-tag>
              <el-tag>D：<el-radio  label="D">{{singAnswer.optiond}}</el-radio></el-tag>
            </el-radio-group>
            <div class="analysis" v-if="isPractice">
              <ul>
                <li> <el-tag type="success">正确答案：</el-tag><span class="right">{{singAnswer.answer}}</span></li>
                <li><el-tag>题目解析：</el-tag></li>
                <li>{{singAnswer.analysis == null ? '暂无解析': singAnswer.analysis}}</li>
              </ul>
            </div>
          </div>
            <div v-if="currentType == 2">
              <el-radio-group v-model="checkbox[multAnswer.quesid]"
                              @change="getChangeLabe2(currentType,multAnswer.quesid,checkbox[multAnswer.quesid],multAnswer.answer,showScore)" >
                <el-tag>A：<el-checkbox label="A">{{multAnswer.optiona}}</el-checkbox></el-tag>
                <el-tag>B：<el-checkbox label="B">{{multAnswer.optionb}}</el-checkbox></el-tag>
                <el-tag>C：<el-checkbox label="C">{{multAnswer.optionc}}</el-checkbox></el-tag>
                <el-tag>D：<el-checkbox label="D">{{multAnswer.optiond}}</el-checkbox></el-tag>
              </el-radio-group>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li> <el-tag type="success">正确答案：</el-tag><span class="right">{{multAnswer.answer}}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{multAnswer.analysis == null ? '暂无解析': multAnswer.analysis}}</li>
                </ul>
              </div>
            </div>
            <div  v-if="currentType == 3">
              <div>
                <el-input placeholder="请填在此处,每空之间以;(英文)分隔"
                  v-model="fill[fillAnswer.quesid]"
                          @blur="fillBG(currentType,fillAnswer.quesid,fill[fillAnswer.quesid],fillAnswer.answer,showScore)"
                          @keyup.enter.native="$event.target.blur">
                </el-input>
              </div>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{fillAnswer.answer}}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{fillAnswer.analysis == null ? '暂无解析': fillAnswer.analysis}}</li>
                </ul>
              </div>
            </div>
            <div class="judge" v-if="currentType == 4">
              <el-radio-group v-model="judge[judgeAnswer.quesid]"
                              @change="getJudgeLabel(currentType,judgeAnswer.quesid,judge[judgeAnswer.quesid],judgeAnswer.answer,showScore)" v-if="currentType == 4">
                <el-radio label="T">正确</el-radio>
                <el-radio label="F">错误</el-radio>
              </el-radio-group>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{judgeAnswer.answer}}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{judgeAnswer.analysis == null ? '暂无解析': judgeAnswer.analysis}}</li>
                </ul>
              </div>
            </div>
            <div v-if="currentType != 1&&currentType != 2&&currentType != 3&&currentType != 4">
              <el-input placeholder="请填在此处"
                        type="textarea"
                        class="input"
                        v-model="short[shortAnswer.questype+shortAnswer.quesid]"
                        @blur="shortBG(currentType,shortAnswer.quesid,short[shortAnswer.questype+shortAnswer.quesid],shortAnswer.answer,showScore)"
                        @keyup.enter.native="$event.target.blur">
              </el-input>
              <div class="analysis" v-if="isPractice">
                <ul>
                  <li> <el-tag type="success">正确姿势：</el-tag><span class="right">{{shortAnswer.answer}}</span></li>
                  <li><el-tag>题目解析：</el-tag></li>
                  <li>{{shortAnswer.analysis == null ? '暂无解析': shortAnswer.analysis}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="operation">
            <ul class="end">
              <li @click="previous()"><i class="iconfont icon-previous"></i><span>上一题</span></li>
              <li @click="mark()"><i class="iconfont icon-mark-o"></i><span>标记</span></li>
              <li @click="next()"><span>下一题</span><i class="iconfont icon-next"></i></li>
            </ul>
          </div>
        </div>
        </transition>
     </div> 
  </div>
</template>

<script>
import store from '@/store/store'
import {mapState} from 'vuex'
export default {
  store,
  data() {
    return {
      order:0,//题的序号

      startTime: null, //考试开始时间
      endTime: null, //考试结束时间
      time: null, //考试持续时间
      singAnswer:[],  //vue官方不支持3层以上数据嵌套,如嵌套则会数据渲染出现问题,此变量直接接收3层嵌套时的数据。
      answerScore: 0, //答题总分数
      bg_flag: false, //已答标识符,已答改变背景色
      isFillClick: false, //选择题是否点击标识符
      slider_flag: true, //左侧显示隐藏标识符
      flag: false, //个人信息显示隐藏标识符
      currentType: 1, //当前题型类型  1--选择题  2--填空题  3--判断题

      radio: [], //保存考生所有单项选择题的选项
      checkbox:[],//保存考生所有多项选择题的选项
      fill:[],//保存考生所有填空题题的选项
      judge:[],//保存考生所有判断题的选项
      short:[],//保存考生所有简答题等的选项

      title: "请选择正确的选项",
      Index: 0, //全局Index
      userInfo: { //用户信息
        name: null,
        id: null
      },
      topicCount: [],//每种类型题目的总数
      score: [],  //每种类型分数的总数
      examData: { //考试信息
        paperid:'',
        // source: null,
        // totalScore: null,
      },
      topic: {                //试卷信息
      },

      paperQuesType:{},//试卷各题型信息
      paperQuesNum:0,//试卷试题总数量
      paperScores:[],//试卷各试题题型大概内容
      QuesAnswer:[],//各种题目

      showQuestion: '', //当前显示题目信息
      showScore:'',//当前显示题目分
      myAnswer:[],//用于接收考生的答案信息
      myanswer:'',//考生存入前的当前的答案

      result1:[],//用于标记当前答案是否已答
      result2:[],//用于标记当前答案是否已答
      result3:[],//用于标记当前答案是否已答
      result4:[],//用于标记当前答案是否已答
      result5:[],//用于标记当前答案是否已答
      preType:[],//用于获取当前对象的上一个对象键值
      nextType:[],//用于获取当前对象的下一个对象键值

      score:{   //用于提交分数
        examid:'',
        stuid:'',
        course:'',
        objscore:'',
        answerdate:'',
      },

      showAnswer: {}, //当前题目对应的答案选项
      number: 1, //题号
      part: null, //填空题的空格数量
      multAnswer:[],//多选题
      fillAnswer: [[]], //二维数组保存所有填空题答案
      judgeAnswer: [], //保存所有判断题答案
      shortAnswer:[],//简答等其他题型
      topic1Answer: [],  //学生选择题作答编号,
      rightAnswer: ''
    }
  },
  created() {
    this.getCookies()
    this.getExamData()
    this.showTime()
  },
  methods: {
    getTime(date) { //日期格式化
      let year = date.getFullYear()
      let month= date.getMonth()+ 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let day=date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours=date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes=date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds=date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    },
    getCookies() {  //获取cookie
      this.userInfo.name = this.$cookies.get("cname")
      this.userInfo.id = this.$cookies.get("cid")
    },
    calcuScore() { //计算答题分数
      
    },
    getExamData() { //获取当前试卷所有信息
      this.myAnswer=[]
      this.startTime = this.format(new Date(), "yyyy-MM-dd HH:mm:ss");
      let examCode = this.$route.query.examid //获取路由传递过来的试卷编号
      this.$axios(`/api/exam/selectById/${examCode}`).then(res => {  //通过examCode请求试卷详细信息
        this.examData = { ...res.data.data} //获取考试详情
        this.index = 0
        this.time = this.examData.extime //获取分钟数
        let paperid = this.examData.paperid
        this.$axios(`/api/que_paper/score/${paperid}`).then(res => {  //通过paperId获取试题题目信息
          this.paperQuesType = {...res.data.data}
          this.paperScores=this.paperQuesType.paperScores
          console.log(this.paperScores)
          for(var i=0;i<this.paperScores.length;i++){
            this.paperQuesNum+=this.paperQuesType.paperScores[i].quesnum;
          }
          /*console.log(this.topic);*/
        })
        this.$axios(`/api/paper_content/${paperid}`).then(res => {  //通过paperId获取试题题目信息
          this.topic = {...res.data}
          console.log(this.topic)
          for(var j=0;j<this.paperScores.length;j++){   //用了记录当前的题型的上一个或下一个题型
            if(j==0){
              this.preType[this.paperScores[j].questype]=null;
              this.nextType[this.paperScores[j].questype]=this.paperScores[j+1].questype;
            }else if(j==this.paperScores.length-1){
              this.nextType[this.paperScores[j].questype]=null;
              this.preType[this.paperScores[j].questype]=this.paperScores[j-1].questype;
            }else{
              this.preType[this.paperScores[j].questype]=this.paperScores[j-1].questype;
              this.nextType[this.paperScores[j].questype]=this.paperScores[j+1].questype;
            }
          }
            let dataInit = this.topic[this.paperScores[0].questype]
            console.log(dataInit)
            this.number = 1
            this.showQuestion = dataInit[0].question
            this.showScore=dataInit[0].score
            if(this.topic[this.paperScores[0].questype][0].questype==1){
              this.singAnswer = dataInit[0]
            }else if(this.topic[this.paperScores[0].questype][0].questype==2){
              this.multAnswer = dataInit[0]
            }else if(this.topic[this.paperScores[0].questype][0].questype==3){
              this.fillAnswer = dataInit[0]
            }else if(this.topic[this.paperScores[0].questype][0].questype==4){
              this.judgeAnswer = dataInit[0]
            }else{
              this.shortAnswer = dataInit[0]
            }
        })
      })
    },
    change(questype,index) { //单项选择题
      if(questype==1) {
        this.Index = index
        let quesAnswer = this.topic[questype][this.Index]
        this.singAnswer = quesAnswer
        /*this.radio[this.singAnswer.quesid]=''*/
        this.isFillClick = true
        this.currentType = questype
        console.log(`当前index:${index}`)
        this.title = "请选择正确的选项"
        this.showQuestion = this.singAnswer.question //获取题目信息
        this.showScore=this.singAnswer.score//获取题目分数信息
        /*this.showAnswer = this.singAnswer*/
        this.number =index+1
        } else if (questype == 2) {
          this.Index = index
          let quesAnswer = this.topic[questype][this.Index]
          this.multAnswer = quesAnswer
          this.isFillClick = true
          this.currentType = questype
          console.log(`当前index:${index}`)
          this.title = "请选择正确的选项"
          this.showQuestion = this.multAnswer.question //获取题目信息
          this.showScore=this.multAnswer.score//获取题目分数信息
          this.number =index+ 1
        } else if (questype == 3) {
          this.Index = index
          let quesAnswer = this.topic[questype][this.Index]
          this.fillAnswer = quesAnswer
          this.currentType = questype
          this.Index = index
          console.log(`当前index:${index}`)
          this.title = "请在横线处填写答案"
          this.showQuestion = this.fillAnswer.question //获取题目信息
          this.showScore=this.fillAnswer.score//获取题目分数信息
          this.number =index+ 1
        }else if (questype == 4) {
          this.currentType = questype
          this.Index = index
          let quesAnswer = this.topic[questype][this.Index]
          this.judgeAnswer = quesAnswer
          console.log(`当前index:${index}`)
          this.title = "请作出正确判断"
          this.showQuestion = this.judgeAnswer.question //获取题目信息
          this.showScore=this.judgeAnswer.score//获取题目分数信息
          this.number =index+ 1
        }else {
          let len = this.topic[questype].length
          this.currentType = questype
          this.Index = index
          let quesAnswer = this.topic[questype][this.Index]
          this.shortAnswer = quesAnswer
          console.log(`当前index:${index}`)
          this.title = "请在输入框处填写答案"
          this.showQuestion = this.shortAnswer.question //获取题目信息
          this.showScore=this.shortAnswer.score//获取题目分数信息
          this.number =index+ 1
        }
    },
    getChangeLabel(questype,quesid,myanswer,rightAnswer,score) { //获取单项选择题作答选项
      if(questype && quesid && myanswer &&rightAnswer &&score) {
        console.log(questype,quesid,myanswer)
        let data = this.topic[questype]
        data[this.Index]["isClick"] = true
        console.log(this.Index)
        /* 保存学生答题选项 */
        this.myAnswer.forEach(item => {
          if (item.questype == questype && item.quesid == quesid) {
            /*this.$set({questype: questype, quesid: quesid, answer: myanswer})*/
            item.questype=questype;item.quesid=quesid;item.answer=myanswer;
            console.log("this.myAnswer")
          }
        })
        if(!this.result1[quesid]){
          console.log(questype,quesid,myanswer)
          this.myAnswer.push({examid:this.$route.query.examid,stuid: this.$cookies.get("cid"),questype: questype,
            quesid: quesid, answer: myanswer, rightAnswer:rightAnswer,score:score})
          this.bg_flag = true
          this.result1[quesid]=true
        }
      }
      console.log(this.myAnswer)
    },
    getChangeLabe2(questype,quesid,myanswer,rightAnswer,score) { //获取多项选择题作答选项
      if(questype && quesid && myanswer && rightAnswer &&score) {
        console.log(questype,quesid,myanswer)
        let data = this.topic[questype]
        data[this.Index]["isClick"] = true
        /* 保存学生答题选项 */
        this.myAnswer.forEach(item => {
          if (item.questype == questype && item.quesid == quesid) {
            /*this.$set({questype: questype, quesid: quesid, answer: myanswer})*/
            item.questype=questype;item.quesid=quesid;item.answer=myanswer;
            console.log("this.myAnswer")
          }
        })
        if(!this.result2[quesid]){
          console.log(questype,quesid,myanswer)
          this.myAnswer.push({examid:this.$route.query.examid,stuid: this.$cookies.get("cid"),
            questype: questype, quesid: quesid, answer: myanswer, rightAnswer:rightAnswer,score:score})
          this.bg_flag = true
          this.result2[quesid]=true
        }
      }
      console.log(this.myAnswer)
    },
    fillBG(questype,quesid,myanswer,rightAnswer,score) {
      if(questype && quesid && myanswer&&rightAnswer&&score&&myanswer!=undefined) {
        console.log(questype,quesid,myanswer)
        let data = this.topic[questype]
        data[this.Index]["isClick"] = true
        /* 保存学生答题选项 */
        this.myAnswer.forEach(item => {
          if (item.questype == questype && item.quesid == quesid) {
            /*this.$set({questype: questype, quesid: quesid, answer: myanswer})*/
            item.questype=questype;item.quesid=quesid;item.answer=myanswer;
            console.log("this.myAnswer")
          }
        })
        if(!this.result3[quesid]){
          console.log(questype,quesid,myanswer)
          this.myAnswer.push({examid:this.$route.query.examid,stuid: this.$cookies.get("cid"),
            questype: questype, quesid: quesid, answer: myanswer,rightAnswer:rightAnswer,score:score})
          this.bg_flag = true
          this.result3[quesid]=true
        }
      }
      console.log(this.myAnswer)
    },
    getJudgeLabel(questype,quesid,myanswer,rightAnswer,score) {  //获取判断题作答选项
      if(questype && quesid && myanswer&&rightAnswer&&score) {
        console.log(questype,quesid,myanswer)
        let data = this.topic[questype]
        data[this.Index]["isClick"] = true
        /* 保存学生答题选项 */
        this.myAnswer.forEach(item => {
          if (item.questype == questype && item.quesid == quesid) {
            /*this.$set({questype: questype, quesid: quesid, answer: myanswer})*/
            item.questype=questype;item.quesid=quesid;item.answer=myanswer;
            console.log("this.myAnswer")
          }
        })
        if(!this.result4[quesid]){
          console.log(questype,quesid,myanswer)
          this.myAnswer.push({examid:this.$route.query.examid,stuid: this.$cookies.get("cid"),
            questype: questype, quesid: quesid, answer: myanswer,rightAnswer:rightAnswer,score:score})
          this.bg_flag = true
          this.result4[quesid]=true
        }
      }
      console.log(this.myAnswer)
    },
    shortBG(questype,quesid,myanswer,rightAnswer,score) {
      if(questype && quesid && myanswer&&rightAnswer&&score&&myanswer!=undefined) {
        console.log(questype,quesid,myanswer)
        let data = this.topic[questype]
        data[this.Index]["isClick"] = true
        /* 保存学生答题选项 */
        this.myAnswer.forEach(item => {
          if (item.questype == questype && item.quesid == quesid) {
            /*this.$set({questype: questype, quesid: quesid, answer: myanswer})*/
            item.questype=questype;item.quesid=quesid;item.answer=myanswer;
            console.log("this.myAnswer")
          }
        })
        if(!this.result5[questype+quesid]){
          console.log(questype,quesid,myanswer)
          this.myAnswer.push({examid:this.$route.query.examid,stuid: this.$cookies.get("cid"),
            questype: questype, quesid: quesid, answer: myanswer,rightAnswer:rightAnswer,score:score})
          this.bg_flag = true
          this.result5[questype+quesid]=true
        }
      }
      console.log(this.myAnswer)
      console.log(this.myAnswer)
    },
    previous() { //上一题
      this.Index --
      if(this.Index<0){
        if(this.preType[this.currentType]==null){
          this.Index=0;
          this.$message({
            message: '已经到最顶头了!',
            type: 'warning'
          })
        }else{
          this.Index=this.topic[this.preType[this.currentType]].length-1
          console.log(this.preType[this.currentType],this.Index)
          this.change(this.preType[this.currentType],this.Index)
        }
      }else{
        this.change(this.currentType,this.Index)
      }
    },
    next() { //下一题
      this.Index ++
      if(this.Index>this.topic[this.currentType].length-1){
        if(this.nextType[this.currentType]==null){
          this.Index=this.topic[this.currentType].length-1
          this.$message({
            message: '已经到最末尾了!',
            type: 'warning'
          })
        }else{
          this.Index=0
          console.log(this.nextType[this.currentType],this.Index)
          this.change(this.nextType[this.currentType],this.Index)
        }
      }else{
        this.change(this.currentType,this.Index)
      }
    },
    mark() { //标记功能
      this.topic[this.currentType][this.Index]["isMark"] = true //标记
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
    commit() { //答案提交计算分数
      /* 计算客观题总分 */
      let finalScore = 0
      this.myAnswer.forEach((element,index) => { //循环每道选择题根据选项计算分数
        if(element != null&&(element.questype==1||element.questype==2||element.questype==3||element.questype==4)) {
          if (element.answer.trim() == element.rightAnswer.trim()) {
            console.log(element.answer.trim()== element.rightAnswer.trim())
            finalScore += element.score
          }
        }
        // console.log(topic1Answer)
      })
      console.log(`目前总分${finalScore}`)
      if(this.time != 0) {
        this.$confirm("考试结束时间未到,是否提前交卷", "友情提示", {
          confirmButtonText: '立即交卷',
          cancelButtonText: '再检查一下',
          type: 'warning'
        }).then(() => {
          console.log("交卷")
          this.endTime = this.format(new Date(), "yyyy-MM-dd HH:mm:ss");
          //提交答题信息
          this.$axios.post('/api/answer/commit',this.myAnswer)
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: '提交试卷成功！',
                type: 'success'
              })
              this.score.examid = this.$route.query.examid;
              this.score.stuid = this.$cookies.get("cid");
              this.score.course = this.examData.course.couname;
              this.score.objscore = finalScore;
              this.score.answerdate = this.endTime;
              //提交成绩信息
              this.$axios.post('/api/score/add',this.score).then(res => {
                if (res.data.code == 200) {
                  this.$router.push({
                    path: '/studentScore', query: {
                      score: finalScore,
                      startTime: this.startTime,
                      endTime: this.endTime
                    }
                  })
                }
              }).catch(() => {
              })
            }
          }).catch(() => {
            console.log("继续答题")
          })
        })
      }
    },
    showTime() { //倒计时
      setInterval(() => {
        this.time -= 1
        if(this.time == 10) {
          this.$message({
            showClose: true,
            type: 'error',
            message: '考生注意,考试时间还剩10分钟！！！'
          })
          if(this.time == 0) {
            console.log("考试时间已到,强制交卷。")
          }
        }
      },1000 * 60)
    }
  },
  computed:mapState(["isPractice"])
}
</script>

<style lang="scss">
.iconfont.icon-time {
  color: #2776df;
  margin: 0px 6px 0px 20px;
}
.analysis {
  margin-top: 20px;
  .right {
    color: #2776df;
    font-size: 18px;
    border: 1px solid #2776df;
    padding: 0px 6px;
    border-radius: 4px;
    margin-left: 20px;
  }
  ul li:nth-child(2) {
    margin: 20px 0px;
  }
  ul li:nth-child(3) {
    padding: 10px;
    background-color: #d3c6c9;
    border-radius: 4px;
  }
}
.analysis span:nth-child(1) {
  font-size: 18px;
}
.mark {
  position: absolute;
  width: 4px;
  height: 4px;
  content: "";
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 22px;
}
.border {
  position: relative;
  border: 1px solid #FF90AA !important;
}
.bg {
  background-color: #5188b8 !important;
}
.fill .el-input {
  display: inline-flex;
  width: 150px;
  margin-left: 20px;
  .el-input__inner {
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    padding-left: 20px;
  }
}
/* slider过渡效果 */
.slider-fade-enter-active {
  transition: all .3s ease;
}
.slider-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slider-fade-enter, .slider-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}

.operation .end li:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(39, 118, 223);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #fff;
}
.operation .end li {
  cursor: pointer;
  margin: 0 100px;
}
.operation {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 0px;
  margin-right: 10px;
}
.operation .end {
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(39, 118, 223);
}
.content .number {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: rgb(39, 118, 223);
  border-radius: 4px;
  margin-right: 4px;
}
.content {
  padding: 0px 20px;
}
.input { width:99%;height:99%;border-top:0px;border-left:0px;border-right:0px;border-bottom:0px;}
.content .topic {
  padding: 20px 0px;
  padding-top: 30px; 
}
.right .content {
  background-color: #fff;
  margin: 10px;
  margin-left: 0px;
  height: 470px;
}
.content .el-radio-group label {
  color: #000;
  margin: 5px 0px;
}
.content .el-radio-group {
  display: flex;
  flex-direction:column;
}
.right .title p {
  margin-left: 20px;
}
.flexarea {
  display: flex;
}
.flexarea .right {
  flex: 1;
}
.auto-right {
  margin-left: auto;
  color: #2776df;
  margin-right: 10px;
}
.right .title {
  margin-right: 10px;
  padding-right: 30px;
  display: flex;
  margin-top: 10px;
  background-color: #fff;
  height: 50px;
  line-height: 50px;
}
.clearfix {
  clear: both;
}
.l-bottom .final {
  cursor: pointer;
  display: inline-block;
  text-align: center;
 background-color: rgb(39, 118, 223);
  width: 240px;
  margin: 20px 0px 20px 10px;
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  margin-top: 22px;
}
#answer .left .item {
  padding: 0px;
  font-size: 16px;
}
.l-bottom {
  border-radius: 4px;
  background-color: #fff;
}
.l-bottom .item p {
  margin-bottom: 15px;
  margin-top: 10px;
  color: #000;
  margin-left: 10px;
  letter-spacing: 2px;
}
.l-bottom .item li {
  width: 15%;
  margin-left: 5px;
  margin-bottom: 10px;
}
.l-bottom .item {
  display: flex;
  flex-direction: column;
}
.l-bottom .item ul {
  width: 100%;
  margin-bottom: -8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.l-bottom .item ul li a { 
  position: relative;
  justify-content: center;
  display: inline-flex;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #eee;
  text-align: center;
  color: #000;
  font-size: 16px;
}
.left .l-top {
  display: flex;
  justify-content: space-around;
  padding: 16px 0px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
}
.left {
  width: 260px;
  height: 100%;
  margin: 10px 10px 0px 10px;
}
.left .l-top li:nth-child(2) a {
  border: 1px solid #eee;
}
.left .l-top li:nth-child(3) a {
  background-color: #5188b8;
  border: none;
}
.left .l-top li:nth-child(4) a {
  position: relative;
  border: 1px solid #eee;
}
.left .l-top li:nth-child(4) a::before {
  width: 4px;
  height: 4px;
  content: " ";
  position: absolute;
  background-color: red;
  border-radius: 50%;
  top: 0px;
  left: 16px;
}
.left .l-top li {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.left .l-top li a {
  display: inline-block;
  padding: 10px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #FF90AA;
}
#answer .top {
  background-color: rgb(42, 42, 42);
}
#answer .item {
  color: #fff;
  display: flex;
  padding: 20px;
  font-size: 20px;
}
#answer .top .item li:nth-child(1) {
  margin-right: 10px;
}
#answer .top .item li:nth-child(3) {
  position: relative;
  margin-left: auto;
}
#answer {
  padding-bottom: 30px;
}
.icon20 {
  font-size: 20px;
  font-weight: bold;
}
.item .msg {
  padding: 10px 15px;
  border-radius: 4px;
  top: 47px;
  right: -30px;
  color: #6c757d;
  position: absolute;
  border: 1px solid rgba(0,0,0,.15);
  background-color: #fff;
}
.item .msg p {
  font-size: 16px;
  width: 200px;
  text-align: left;
}
</style>
