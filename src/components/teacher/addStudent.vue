<!-- 添加学生 -->
<template>
    <div class="add">
        <el-tabs v-model="activeName">
            <el-tab-pane name="first">
                <span slot="label"><i class="el-icon-circle-plus"></i>添加学生</span>
                <section class="append">
                    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                        <div class="change" >
                            <el-form-item prop="stuname" label="姓名">
                                <el-input v-model="form.stuname"></el-input>
                            </el-form-item>
                            <el-form-item prop="sex" label="性别">
                                <el-input v-model="form.sex"></el-input>
                            </el-form-item>
                            <el-form-item prop="clazzid" label="所属班级">
                                <el-select v-model="form.clazzid" placeholder="请选择班级" @change="change()">
                                    <el-option
                                            v-for="item in Clazzs"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="tel" label="电话号码">
                                <el-input v-model="form.tel"></el-input>
                            </el-form-item>
                            <el-form-item prop="email" label="邮箱">
                                <el-input v-model="form.email"></el-input>
                            </el-form-item>
                            <el-form-item prop="stupwd" label="密码">
                                <el-input v-model="form.stupwd"></el-input>
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
                Clazzs:[],
                form: { //表单数据初始化
                    stuname: null,
                    clazzid: null,
                    tel: null,
                    email: null,
                    stupwd: null,
                    sex: null,
                    role: 2
                },
                rules: {
                    stuname: [
                        { required: true, message: '请输入学生姓名', trigger: 'blur' },
                    ],
                    clazzid: [
                        { required: true, message: '请选择所属班级', trigger: 'blur' },
                    ],
                    tel: [
                        { required: true, message: '请输入电话号码', trigger: 'blur' },
                        {  validator: function(rule, value, callback) {
                            if (/^1[34578]\d{9}$/.test(value) == false) {
                                callback(new Error("手机号格式错误"));
                            } else {
                                callback();
                            }
                            },
                            trigger: "blur"
                        }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                    ],
                    stupwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    sex: [
                        { required: true, message: '请输入性别，只能为‘男’或‘女’', trigger: 'blur' },
                    ],
                },
            };
        },
        created() {
            this.getClazz();
        },
        methods: {
            getClazz(){
                //分页查询所有班级信息
                this.$axios(`/api/clazz/selectAll`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.Clazzs.push({label:element.calname,value:element.clazzid});
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
                          url: '/api/student',
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
                              this.$router.push({path: '/studentManage'})
                          }
                      })
                  }else{
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