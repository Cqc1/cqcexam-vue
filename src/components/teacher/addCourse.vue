<!-- 添加课程 -->
<template>
    <section class="add">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="课程名称">
                <el-input v-model="form.couname"></el-input>
            </el-form-item>
            <el-form-item label="课程学时">
                <el-input v-model="form.couperiod"></el-input>
            </el-form-item>
            <el-form-item label="课程学分">
                <el-input v-model="form.credit"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit()">立即创建</el-button>
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
                }
            };
        },
        methods: {
            onSubmit() { //数据提交
                this.$axios({
                    url: '/api/course',
                    method: 'post',
                    data: {
                        ...this.form
                    }
                }).then(res => {
                    if(res.data.code == 200) {
                        this.$message({
                            message: '数据添加成功',
                            type: 'success'
                        })
                        this.$router.push({path: '/courseManage'})
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