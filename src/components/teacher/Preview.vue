// 添加题库
<template>
    <div class="add">
        <el-tabs v-model="activeName">
            <el-tab-pane name="first">
                <span slot="label"><i class="el-icon-circle-plus"></i>试卷批阅</span>
                <section class="append">
                    <li>
                        <span>题目类型：</span>
                        <el-select v-model="value" @change="handleChange1" placeholder="请选择题型" class="w150">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </li>
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
                answer: {                //答案信息
                },
            };
        },
        created() {
            this.getQuesTypeInfo();
            this.getAnswerInfo();
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
            async getAnswerInfo() {
                let examid = this.$route.query.examid
                let stuid = this.$route.query.stuid
                //不分页查询所有答案信息
                this.$axios(`/api/answer/preview/${examid}/${stuid}`).then(res => {
                    this.answer = {...res.data}

                    res.data.data.forEach(element => {
                        this.options.push({label:element.quesname,value:element.questype});
                    })
                }).catch(error => {});
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
