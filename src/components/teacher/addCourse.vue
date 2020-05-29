<!-- 添加课程 -->
<template>
    <div class="add">
        <el-tabs v-model="activeName">
            <el-tab-pane name="first">
                <span slot="label"><i class="el-icon-circle-plus"></i>添加课程</span>
                <section class="append">
                    <el-form ref="form" :rules="rules" :model="form" label-width="90px" class="demo-dynamic">
                        <div class="change" >
                            <el-form-item prop="couname" label="课程名称">
                                <el-input v-model="form.couname"></el-input>
                            </el-form-item>
                            <el-form-item prop="couperiod" label="课程学时">
                                <el-input v-model.number="form.couperiod"></el-input>
                            </el-form-item>
                            <el-form-item  prop="institutionid" label="所属院系">
                                <el-select v-model="form.institutionid"  @change="change" placeholder="请选择学院">
                                    <el-option
                                            v-for="item in Institutions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="credit" label="课程学分">
                                <el-input v-model.number="form.credit"></el-input>
                            </el-form-item>
                            <div class="submit">
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit('form')">添加</el-button>
                                    <el-button type="primary" @click="cancel()">取消</el-button>
                                </el-form-item>
                                <!-- <el-button type="primary" @click="Submit()">立即添加</el-button>-->
                            </div>
                        </div>
                    </el-form>
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
                form: { //表单数据初始化
                    couname: null,
                    credit: null,
                    couperiod: null,
                    institutionid:''
                },
                Institutions:[],//学院下拉框
                rules: {
                    couname: [
                        { required: true, message: '请输入课程名', trigger: 'blur' },
                    ],
                    credit: [
                        { required: true, message: '请输入学分', trigger: 'blur' },
                        { type:'number',min: 1, max: 20, message: '长度在 1 到 20个字符', trigger: 'blur' }
                    ],
                    couperiod: [
                        { required: true, message: '请输入课时', trigger: 'blur' },
                        { type:'number',min: 1, max: 100, message: '长度在 1 到 100个字符', trigger: 'blur' }
                    ],
                    institutionid: [
                        { required: true, message: '请输选择所属院系', trigger: 'blur' },
                    ],
                }
            };
        },
        created() {
            this.getInstitution2();//获取学院
        },
        methods: {
            getInstitution2(){
                //不分页查询所有学院信息
                this.$axios(`/api/institution/selectAll`).then(res => {
                    this.loading = false;
                    this.Institutions=[];
                    res.data.data.forEach(element => {
                        this.Institutions.push({label:element.instituname,value:element.institutionid});
                    })
                }).catch(error => {});
            },
            change(){
                this.$forceUpdate()
            },
            onSubmit(form) { //数据提交
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$axios({
                            url: '/api/course/add',
                            method: 'post',
                            data: {
                                ...this.form
                            }
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.$message({
                                    message: '数据添加成功',
                                    type: 'success'
                                })
                                this.$router.push({path: '/courseManage'})
                            }
                        })
                    } else {
                        this.$message({
                            message: '请输入正确信息',
                            type: 'error'
                        })
                    }
                })
            },
            cancel() { //取消按钮
                this.form = {}
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
</style>