<!-- 添加教师 -->
<template>
    <section class="add">
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item prop="teaname" label="姓名">
                <el-input v-model="form.teaname"></el-input>
            </el-form-item>
            <el-form-item prop="institutionid" label="所属院系">
                <el-select v-model="form.institutionid" placeholder="请选择所属学院" @change="change()">
                    <el-option
                            v-for="item in institutions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="sex" label="性别">
                <el-input v-model="form.sex"></el-input>
            </el-form-item>
            <el-form-item prop="tel" label="电话号码">
                <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item  prop="email" label="邮箱">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item  prop="teapwd" label="密码">
                <el-input v-model="form.teapwd"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
                <el-button type="text" @click="cancel()">取消</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                institutions:[],
                form: { //表单数据初始化
                    teaname: null,
                    institutionid:'',
                    instituname:'',
                    tel: null,
                    email: null,
                    teapwd: null,
                    sex: null,
                    role: 1
                },
                rules: {
                    teaname: [
                        { required: true, message: '请输入教师姓名', trigger: 'blur' },
                    ],
                    institutionid: [
                        { required: true, message: '请选择所属学院', trigger: 'blur' },
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
                    teapwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ],
                    sex: [
                        { required: true, message: '请输入性别，只能为‘男’或‘女’', trigger: 'blur' },
                    ],
                },
            };
        },
        created() {
            this.getInstitution();
        },
        methods: {
            getInstitution(){
                //分页查询所有院系信息
                this.$axios(`/api/institution/selectAll`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.institutions.push({label:element.instituname,value:element.institutionid});
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
                       url: '/api/teacher',
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
                           this.$router.push({path: '/teacherManage'})
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
        padding: 0px 40px;
        width: 400px;
    }
</style>