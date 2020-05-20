// 添加试卷
<template>
    <div class="add">
        <el-tabs v-model="activeName">
            <el-tab-pane name="first">
                <span slot="label"><i class="el-icon-circle-plus"></i>随机组卷</span>
                <section class="append">
                    <ul>
                        <li>
                            <span>所属学院：</span>
                            <el-select v-model="instituValue" @change="handleChange1" placeholder="请选择学院">
                                <el-option
                                        v-for="item in institutions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li>
                        <span>所属课程：</span>
                        <el-select v-model="formData.courseid" @change="handleChange2" :placeholder="placeholder" class="w150">
                            <el-option
                                    v-for="item in courses"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        </li>
                        <li>
                        <span>难度等级：</span>
                        <el-select v-model="formData.level" placeholder="选择难度等级" class="w150">
                            <el-option
                                    v-for="item in levels"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        </li>
                        <li class="msg" @click="openMsg()"><i class="iconfont icon-flag"></i>组卷说明</li>
                    </ul>
                    <!-- 题型数量设置部分 -->
                    <div class="change" >
                        <el-form ref="formData" :model="formData" :rules="rules" label-width="90px">
                            <!-- 动态input生成,遍历typename-->
                            <div  v-for="item in formData.composition">
                                <el-form-item :label="item.quesname+'数量'" prop="quesnum">
                                    <el-input v-model="item.quesnum"
                                              :placeholder="'请输入'+item.quesname+'数量'"/>
                                </el-form-item>
                            </div>
                            <el-form-item label="试卷描述">
                                <el-input type="textarea" rows="1" resize="none"
                                          v-model="formData.description"
                                          placeholder="请输入该试卷的描述信息"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="submit">
                            <el-button type="primary" @click="Submit()">立即添加</el-button>
                        </div>
                    </div>
                </section>
            </el-tab-pane>
            <!--<el-tab-pane name="second">
                <span slot="label"><i class="iconfont icon-daoru-tianchong"></i>手动组卷</span>
                <div class="box">
                    <ul>
                        <li>
                            <span>试题难度:</span>
                            <el-select v-model="difficultyValue" placeholder="试题难度" class="w150">
                                <el-option
                                        v-for="item in difficulty"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li>
                            <span>选择题数量：</span> <el-input type="text" v-model="changeNumber"></el-input>
                        </li>
                        <li>
                            <span>填空题数量：</span> <el-input type="text" v-model="fillNumber"></el-input>
                        </li>
                        <li>
                            <span>判断题数量：</span> <el-input type="text" v-model="judgeNumber"></el-input>
                        </li>
                        <li>
                            <el-button type="primary" @click="create()">立即组卷</el-button>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>-->
        </el-tabs>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                activeName: 'first',  //活动选项卡
                institutions:[],//学院下拉框
                instituValue: '',
                placeholder:'',
                courses: [], //试题所属科目
                formData: { //提交内容
                    courseid:'',
                    level:'',
                    composition:{
                        questype:'',
                        quesname:'',
                        quesnum:'',
                    },
                    description:'',
                    user:'',
                },
                levels: [ //难度等级
                    {
                        value: '3',
                        label: '简单'
                    },
                    {
                        value: '7',
                        label: '良好'
                    },
                    {
                        value: '10',
                        label: '困难'
                    },
                    /*{
                        value: '4',
                        label: '4'
                    },
                    {
                        value: '5',
                        label: '5'
                    },*/
                ],
                typename:[],
                rules: {
                    quesnum:[{
                        validator:(rule,value,callback)=>{
                            if(value != ""){
                                if((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) == false){
                                    callback(new Error("请填写大于0的数字或者不填"));
                                }else{
                                    callback();
                                }
                            }else{
                                callback();
                            }

                        },
                        trigger:'change'
                    }],
                },
            };
        },
        created() {
            this.getQuesTypeInfo();
            this.getCourseInfo();
            this.getInstitution();//获取学院
        },
        methods: {
            async getQuesTypeInfo() {
                //不分页查询所有试题类型信息
                this.$axios(`/api/questypeInfo`).then(res => {
                    this.formData.composition=res.data.data;
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
            getInstitution(){
                //不分页查询所有学院信息
                this.$axios(`/api/institution/selectAll`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.institutions.push({label:element.instituname,value:element.institutionid});
                    })
                    this.institutions.push({label:"所有学院的课程",value:0});
                }).catch(error => {});
            },
            //获取下拉框中的值
            handleChange1(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.institutions.find((item) => {
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                console.log(obj.label)//label值
                console.log(obj.value)//value值
                // this.select=obj;
                if (val == 0) {
                    this.courses = [];
                    this.getCourseInfo();  //获取专业
                } else {
                    this.$axios(`/api/courses/selectByinstituteId/${val}`).then(res => {
                        this.courses = [];
                        this.placeholder = "请选择";
                        if (res.data.data.length > 0) {
                            res.data.data.forEach(element => {
                                this.courses.push({label: element.couname, value: element.courseid});
                            })
                            this.loading = false;
                            /*this.majorValue=this.majors[0].label*/
                            this.formData.courseid = ''
                            this.placeholder = "请选择";
                        } else {
                            this.formData.courseid = ''
                            this.placeholder = "该院系下目前未设课程";
                        }
                    })
                }
            },
            //获取下拉框中的值
            handleChange2(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.courses.find((item)=>{
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                this.formData.courseid=obj.value;
            },
            openMsg() {
                this.$alert('本系统组卷为随机组卷、单选题每题默认2分、多选题每题默认4分、填空题每题默认2分、判断题每题默认2分、简答题每题默认5分，其他非客观题默认每题5分。','随机组卷说明',{
                    confirmButtonText: '确定'
                })
            },
            Submit() { //提交
                /*this.openMsg();*/
                this.$confirm('是否已经认真阅读组卷说明？', '提示').then(() => {
                    if (this.formData.courseid != '' && this.formData.level != '') {
                        this.formData.user = this.$cookies.get("cname")
                        this.$axios({
                            url: '/api/item',
                            method: 'post',
                            data: {
                                ...this.formData
                            }
                        }).then(res => {
                            console.log(res)
                            let data = res.data
                            if (data.code == 200) {
                                setTimeout(() => {
                                    this.$router.push({path: '/paperManage'})
                                }, 1000)
                                this.$message({
                                    message: data.message,
                                    type: 'success'
                                })
                            } else if (data.code == 400) {
                                this.$message({
                                    message: data.message,
                                    type: 'error'
                                })
                            }

                        })
                    } else {
                        this.$message({
                            message: '请选择所属课程以及难度等级!',
                            type: 'error'
                        })
                    }
                }).catch(() => {
                })
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
    /*------------------------修改type=number的样式------------------------------------------------*/
/*    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }*/
</style>
