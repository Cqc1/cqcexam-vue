// 添加题库
<template>
    <div class="add">
        <el-tabs v-model="activeName">
            <el-tab-pane name="first">
                <span slot="label"><i class="el-icon-circle-plus"></i>添加试题</span>
                <section class="append">
                    <ul>
                        <li>
                            <span>题目类型：</span>
                            <el-select v-model="form.questype" @change="handleChange1" placeholder="请选择题型" class="w150">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li>
                            <span>所属课程：</span>
                            <el-select v-model="form.courseid" @change="handleChange2" placeholder="请选择课程" class="w150">
                                <el-option
                                        v-for="item in courses"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li>
                            <span>所属章节：</span>
                            <el-input
                                    placeholder="请输入对应章节"
                                    v-model="form.chapter"
                                    class="w150"
                                    clearable>
                            </el-input>
                        </li>
                        <li>
                            <span>难度等级：</span>
                            <el-select v-model="form.level" placeholder="选择难度等级" class="w150">
                                <el-option
                                        v-for="item in levels"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li v-if="form.questype == '1'">
                            <span>正确选项：</span>
                            <el-select v-model="form.answer" placeholder="选择正确答案" class="w150">
                                <el-option
                                        v-for="item in rights"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li v-if="form.questype == '2'">
                            <span>正确选项：</span>
                            <el-input
                                    placeholder="请输入正确答案"
                                    v-model="form.answer"
                                    class="w150"
                                    clearable>
                            </el-input>
                        </li>
                    </ul>
                    <!-- 试题内容部分 -->
                    <div class="change" >
                        <div class="title">
                            <el-tag>题目:</el-tag><span>在下面的输入框中输入题目,形如--DNS 服务器和DHCP服务器的作用是（）</span>
                            <el-input
                                    type="textarea"
                                    rows="4"
                                    v-model="form.question"
                                    placeholder="请输入题目内容"
                                    resize="none"
                                    class="answer">
                            </el-input>
                        </div>
                        <div class="options" v-if="form.questype == '1'||form.questype == '2'">
                            <ul>
                                <li>
                                    <el-tag type="success">A</el-tag>
                                    <el-input
                                            placeholder="请输入选项A的内容"
                                            v-model="form.optiona"
                                            clearable="">
                                    </el-input>
                                </li>
                                <li>
                                    <el-tag type="success">B</el-tag>
                                    <el-input
                                            placeholder="请输入选项B的内容"
                                            v-model="form.optionb"
                                            clearable="">
                                    </el-input>
                                </li>
                                <li>
                                    <el-tag type="success">C</el-tag>
                                    <el-input
                                            placeholder="请输入选项C的内容"
                                            v-model="form.optionc"
                                            clearable="">
                                    </el-input>
                                </li>
                                <li>
                                    <el-tag type="success">D</el-tag>
                                    <el-input
                                            placeholder="请输入选项D的内容"
                                            v-model="form.optiond"
                                            clearable="">
                                    </el-input>
                                </li>
                            </ul>
                        </div>
                        <div class="options">
                            <ul>
                                <li>
                            <el-tag type="success">分值：</el-tag>
                            <el-input
                                    placeholder="请输入该试题分值"
                                    v-model="form.score"
                                    clearable=""
                            >
                            </el-input>
                                </li>
                            </ul>
                        </div>
                        <div  class="title" v-if="form.questype == '4'">
                            <el-tag>正确答案:</el-tag>
                            <el-radio class="answer" v-model="form.answer" label="T">正确</el-radio>
                            <el-radio class="answer" v-model="form.answer" label="F">错误</el-radio>
                        </div>
                        <div class="title" v-if="form.questype != '1'&&form.questype != '2'&&form.questype != '4'">
                            <el-tag>正确答案:</el-tag><span>在下面的输入框中输入正确答案</span>
                            <el-input
                                    v-model="form.answer"
                                    placeholder="请输入正确答案"
                                    class="answer"
                            ></el-input>
                        </div>
                        <div class="title">
                            <el-tag>解析:</el-tag><span>在下面的输入框中输入题目解析</span>
                            <el-input
                                    type="textarea"
                                    rows="4"
                                    v-model="form.analysis"
                                    placeholder="请输入答案解析"
                                    resize="none"
                                    class="answer">
                            </el-input>
                        </div>
                        <div class="submit">
                            <el-button type="primary" @click="Submit()">立即添加</el-button>
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
                activeName: 'first',  //活动选项卡
                options: [],//题库类型
                courses: [],       //试题所属科目
                levels: [ //难度等级
                    {
                        value: '1',
                        label: '1'
                    },
                    {
                        value: '2',
                        label: '2'
                    },
                    {
                        value: '3',
                        label: '3'
                    },
                    {
                        value: '4',
                        label: '4'
                    },
                    {
                        value: '5',
                        label: '5'
                    },
                ],
                rights: [ //正确答案
                    {
                        value: 'A',
                        label: 'A'
                    },
                    {
                        value: 'B',
                        label: 'B'
                    },
                    {
                        value: 'C',
                        label: 'C'
                    },
                    {
                        value: 'D',
                        label: 'D'
                    },
                ],
                form: { //单选题提交内容
                    courseid:'', //所属课程编号
                    level: '', //难度等级选中值
                    answer: '', //正确答案选中值
                    chapter: '', //对应章节
                    question: '', //题目
                    analysis: '', //解析
                    score:'',//分值
                    optiona: '',
                    optionb: '',
                    optionc: '',
                    optiond: '',
                    questype:'',//自身题目类型编号
                },
                select:{
                    typevalue:-1,
                    couvalue:-1,
                },//保存题型和课程选择器中的信息，保证不能为空或未定义
            };
        },
        created() {
            this.getQuesTypeInfo();
            this.getCourseInfo();
        },
        methods: {
            async getQuesTypeInfo() {
                //不分页查询所有试题类型信息
                this.$axios(`/api/questypeInfo`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.options.push({label:element.quesname,value:element.questype});
                    })
                }).catch(error => {});
            },
            async getCourseInfo() {
                //不分页查询所有课程信息
                this.$axios(`/api/courseInfo`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.courses.push({label:element.couname,value:element.courseid});
                    })
                }).catch(error => {});
            },
            //获取下拉框中的值
            handleChange1(val){
                this.form={};
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.options.find((item)=>{
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                this.select.typevalue=obj.value;
                this.form.questype=obj.value;
            },
            handleChange2(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.options.find((item)=>{
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                this.select.couvalue=obj.value;
            },
            Submit() { //提交更改
                var code;
                var param=this.form;
                if(this.select.typevalue != -1&&this.select.couvalue != -1){
                    if(this.form.questype=="1"){
                        this.$axios.post(`/api/sing_Add`,param)
                            .then(res => {
                                code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '已添加成功！',
                                        type: 'success'
                                    })
                                    this.form={}
                                    this.select.typevalue=-1;
                                    this.select.couvalue=-1;
                                }
                            })
                    }else if(this.form.questype=="2"){
                        this.$axios.post(`/api/mult_Add`,param)
                            .then(res => {
                                code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '已添加成功！',
                                        type: 'success'
                                    })
                                    this.form={}
                                    this.select.typevalue=-1;
                                    this.select.couvalue=-1;
                                }
                            })
                    }else if(this.form.questype=="3"){
                        this.$axios.post(`/api/fill_Add`,param)
                            .then(res => {
                                code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '已添加成功！',
                                        type: 'success'
                                    })
                                    this.form={}
                                    this.select.typevalue=-1;
                                    this.select.couvalue=-1;
                                }
                            })
                    }else if(this.form.questype=="4"){
                        this.$axios.post(`/api/judge_Add`,param)
                            .then(res => {
                                code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '已添加成功！',
                                        type: 'success'
                                    })
                                    this.form={}
                                    this.select.typevalue=-1;
                                    this.select.couvalue=-1;
                                }
                            })
                    }else{
                        this.$axios.post(`/api/short_Add`,param)
                            .then(res => {
                                code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '已添加成功！',
                                        type: 'success'
                                    })
                                    this.form={}
                                    this.select.typevalue=-1;
                                    this.select.couvalue=-1;
                                }
                            })
                    }
                }else{
                    this.$message({
                        message: '添加失败，请选择试题类型和试题所属科目！',
                        type: 'error'
                    })
                    this.form={}
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
                        justify-content: center;
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
            .fill {
                .fillAnswer {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span {
                        margin-right: 6px;
                    }
                    .el-input {
                        width: 91% !important;
                    }
                }
                .analysis {
                    margin-top: 20px;
                    margin-left: 5px;
                }
            }
            .judge {
                .judgeAnswer {
                    margin-left: 30px;
                    margin-bottom: 30px;
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
</style>
