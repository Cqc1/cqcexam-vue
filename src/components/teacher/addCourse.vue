<!-- 添加课程 -->
<template>
    <section class="add">
        <el-form ref="form" :rules="rules" :model="form" label-width="90px" class="demo-dynamic">
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
        padding: 0px 40px;
        width: 400px;
    }
</style>