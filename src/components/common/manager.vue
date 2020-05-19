<!--管理中心-->
<template>
  <div id='manager'>
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <h3 class="alter">修改密码</h3>
        <el-form-item label="旧密码" prop="oldpass" class="pass">
          <el-input type="password" v-model="ruleForm2.oldpass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" class="pass">
        <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import store from '@/store/store'
  import {mapState,mapMutations} from 'vuex'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ispass: true,
        ruleForm2: {
          oldpass:'',
          pass: '',
          checkPass: ''
        },
        rules2: {
          oldpass: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    computed: mapState(["flag","menu"]),
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let id = this.$cookies.get("cid")
            let role = this.$cookies.get("role")
            if(role==0){
              //按条件查询信息
              this.$axios(`/api/admin/${id}`).then(res => {
                if (this.ruleForm2.oldpass !== res.data.adminpwd) {
                  this.$message({
                    message: '您输入的旧密码错误！',
                    type: 'error'
                  })
                }else{
                  this.$axios({ //修改密码
                    url: '/api/adminPWD',
                    method: 'put',
                    data: {
                      adminpwd: this.ruleForm2.pass,
                      adminid:id
                    }
                  }).then(res => {
                    if(res.data != null ) { //修改成功提示
                      this.$router.push({path:"/"}) //跳转到登录页面
                      this.$cookies.remove("cname") //清除cookie
                      this.$cookies.remove("cid")
                      this.menu.pop()
                      this.menu.pop()//弹出管理员所添加的菜单功能
                      this.$message({
                        message: res.data.message+'请重新登录！',
                        type: 'success'
                      })
                    }
                  })
                }
              }).catch(error => {});
            }else{
              //按条件查询信息
              this.$axios(`/api/teacher/${id}`).then(res => {
                if (this.ruleForm2.oldpass !== res.data.data.teapwd) {
                  this.$message({
                    message: '您输入的旧密码错误！',
                    type: 'error'
                  })
                }else{
                  this.$axios({ //修改密码
                    url: '/api/teacherPWD',
                    method: 'put',
                    data: {
                      teapwd: this.ruleForm2.pass,
                      teaid:id
                    }
                  }).then(res => {
                    if(res.data != null ) { //修改成功提示
                      this.$message({
                        message: res.data.message+'请重新登录！',
                        type: 'success'
                      })
                    }
                    this.$router.push({path:"/"}) //跳转到登录页面
                    this.$cookies.remove("cname") //清除cookie
                    this.$cookies.remove("cid")
                  })
                }
              }).catch(error => {});
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    store
  }
</script>

<style scoped>
#manager .pass  label{
  color: red;
  font-size: 20px;
}
#manager {
  width: 600px;
  margin: 0 auto;
  margin-top: 100px;
  text-align: center;
  margin-bottom: 300px;
}
#manager .alter {
  margin: 30px 0px;
}
</style>