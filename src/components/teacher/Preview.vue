// 添加题库
<template>
    <div class="add">
        <el-tabs v-model="activeName">
            <el-tab-pane name="first">
                <span slot="label"><i class="el-icon-circle-plus"></i>试卷批阅</span>
                <section class="append">
                    <!-- 试题内容部分 -->
                    <div class="change" >
                        <div class="l-bottom">
                        <div class="item" >
                            <ul>
                                <li v-for="(list, index) in answer" :key="index">
                                    <a href="javascript:;"
                                       @click="change(list.questype,list.quesid,index)"
                                       :class="{'border': Index == index ,'bg': bg_flag && answer[index].isClick == true}">
                                        <span :class="{'mark': answer[index].isMark == true}"></span>
                                        {{Number(index)+1}}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        </div>
                        <div class="title">
                             <el-tag>题目:</el-tag><span>{{currentQues.question}}</span>
                        </div>
                        <div class="options" align='left'>
                            <ul>
                                <li>
                                    <el-tag type="success">分值：</el-tag> <span> {{currentQues.score}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="options" align='left'>
                            <ul>
                                <li>
                                    <el-tag type="success">正确答案:</el-tag> <span>  {{currentQues.answer}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="options" align='left'>
                        <ul>
                            <li>
                                <el-tag type="success">解析:</el-tag> <span>  {{currentQues.analysis}}</span>
                            </li>
                        </ul>
                       </div>
                        <div class="options" align='left'>
                            <ul>
                                <li>
                                    <el-tag type="success">考生答案:</el-tag> <span>  {{showQuestion.answer}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="options" align='left'>
                            <ul>
                                <li>
                                    <el-tag type="success">得分：</el-tag>
                                    <el-input
                                            placeholder="请输入该试题的得分"
                                            v-model="getScore[Index]"
                                            @blur="preview()"
                                            @keyup.enter.native="$event.target.blur"
                                            clearable="">
                                    </el-input>
                                </li>
                            </ul>
                        </div>
                        <div class="submit">
                            <el-button type="primary" @click="previous()">上一题</el-button>
                            <el-button type="primary" :disabled="save"@click="Submit()">提交</el-button>
                            <el-button type="primary" @click="next()">下一题</el-button>
                        </div>
                      </div>
                </section>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                order:0,//题的序号
                activeName: 'first',  //活动选项卡
                options: [],//题库类型
                value:'',
                score: { //单选题提交内容
                    objscore:'',
                    subscore:'',
                    totalscore:'',
                    ispreview:'',
                },
                Index: 0, //全局Index
                getScore:[],//保存学生的得分信息
                bg_flag: false, //已答标识符,已答改变背景色
                answer: [],//答案信息
                showQuestion:{
                    answerid: '',
                    examid: '',
                    stuid: '',
                    questype: '',
                    quesid: '',
                    answer: '',
                    rightAnswer: '',
                    score: '',
                    ques: {
                        questype: '',
                        quesname: ''
                    }
                },
                currentQues:{},
                number:0,
                arryLength:0,
                save:true,
                commit:true,
                getSum:0,//得到的总分
            };
        },
        created() {
            this.getAnswerInfo();
        },
        methods: {
            async getAnswerInfo() {
                let examid = this.$route.query.examid
                let stuid = this.$route.query.stuid
                //不分页查询所有答案信息
                this.$axios(`/api/answer/preview/${examid}/${stuid}`).then(res => {
                    this.answer = {...res.data.data}
                    for(var i=0;i<res.data.data.length;i++){
                        this.arryLength+=1
                        this.getScore[i]='';
                    }
                    console.log(this.arryLength);
                    this.showQuestion=this.answer[0];
                    this.$axios(`/api/selectOne/${this.showQuestion.questype}/${this.showQuestion.quesid}`).then(res => {
                        this.currentQues = {...res.data.data}
                    }).catch(error => {});
                }).catch(error => {});
            },
            //获取下拉框中的值
            handleChange(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.options.find((item) => {
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                console.log(obj.label)//label值
                console.log(obj.value)//value值
                // this.select=obj;
                this.questype=obj.value;
                if(this.questype==1){
                    this.currentArry=this.singArry;
                }
                if(this.questype==2){
                    this.currentArry=this.multArry;
                }
                if(this.questype==3){
                    this.currentArry=this.fillArry;
                }
                if(this.questype==4){
                    this.currentArry=this.judgeArry;
                }
                if(this.questype==5){
                    this.currentArry=this.shortArry;
                }
            },
            change(questype,quesid,index) { //单项选择题
                this.$axios(`/api/selectOne/${questype}/${quesid}`).then(res => {
                    this.currentQues = {...res.data.data}
                    console.log(this.currentQues);
                }).catch(error => {});
                this.Index = index
                let quesAnswer = this.answer[this.Index]
                this.showQuestion = quesAnswer
                console.log(`当前index:${index}`)
            },
            preview(){
                let data = this.answer
                data[this.Index]["isClick"] = true
            },
            previous() { //上一题
                this.Index --
                if(this.Index<0){
                    this.Index=0;
                    this.$message({
                        message: '已经到最顶头了!',
                        type: 'warning'
                    })
                }
            },
            next() { //下一题
                this.Index ++
                if(this.Index>this.arryLength-1){
                    this.Index=this.arryLength-1
                    this.save=false;
                    this.$message({
                        message: '已经到最末尾了!',
                        type: 'warning'
                    })
                }
            },
            Submit() { //提交更改
                for(var i=0;i<this.getScore.length;i++){
                    if(this.getScore[i]!=null&&this.getScore[i]!=''){
                        console.log(this.getScore[i]);
                        this.getSum+=Number(this.getScore[i])
                        this.commit=true;
                    }else{
                        this.commit=false;
                        this.$message({
                            message: '请批阅完第'+`${i+1}`+'题后再提交!',
                            type: 'warning'
                        })
                    }
                }
                if(this.commit){
                    let scoreid = this.$route.query.scoreid
                    let examid = this.$route.query.examid
                    this.$axios(`/api/score/selectById/${scoreid}`).then(res => {
                        this.score = res.data.data
                        this.score.subscore=this.getSum
                        this.score.totalscore=Number(this.score.subscore)+Number(this.score.objscore)
                        this.score.ispreview=1
                        var param=this.score;
                        console.log(param);
                        this.$axios.put(`/api/score/update`,param).then(res => {
                        if(res.data.code==200){
                            this.$message({
                                message: '批阅成功!',
                                type: 'success'
                            })
                            this.$router.push({path: '/teaPreview', query:{examid: examid}})
                        }else{
                            this.$message({
                                message: '批阅失败!',
                                type: 'error'
                            })
                        }
                      }).catch(error => {});
                    }).catch(error => {});
                }
            },
        }
    };
</script>

<style lang="scss" scoped>
    .add {
        margin: 0px 40px;
        .box {
            padding: 0px 20px;
            ul li {
                margin: 10px 0px;
                display: flex;
                align-items: center;
                .el-input {
                    width: 6%;
                }
                .w150 {
                    margin-left: 20px;
                    width: 7%;
                }
            }
        }
        .el-icon-circle-plus {
            margin-right: 10px;
        }
        .icon-daoru-tianchong {
            margin-right: 10px;
        }
        .append {
            margin: 0px 20px;
            ul {
                display: flex;
                align-items: center;
                li {
                    margin-right: 20px;
                }
            }
            .change {
                margin-top: 20px;
                padding: 20px 16px;
                background-color: #E7F6F6;
                border-radius: 4px;
                .title {
                    padding-left: 6px;
                    color: #2f4f4f;
                    span:nth-child(1) {
                        margin-right: 6px;
                    }
                    .answer {
                        margin: 20px 0px 20px 8px;
                    }
                    .el-input{
                        width: 98% !important;
                    }
                    .el-textarea {
                        width: 98% !important;
                    }
                }
                .options {
                    ul {
                        display: flex;
                        flex-direction: column;
                    }
                    ul li {
                        display: flex;
                        justify-content: left;
                        align-items: center;
                        width: 98%;
                        margin: 10px 0px;
                        span {
                            margin-right: 20px;
                        }
                    }
                }
                .submit {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .w150 {
                width: 130px;
            }
            li:nth-child(2) {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
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


