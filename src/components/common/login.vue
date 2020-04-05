//实现用户的登陆界面
<template>
    <div class="login_page">
        <transition name="form-fade" mode="in-out">
            <section class="form_contianer">
                <div class='titleArea rflex'>
                    <img class="logo" :src="logo" alt="南京工程学院">
                    <span class='title'>CQC<i>在线考试系统</i></span>
                </div>
                <div><el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
                    <el-form-item prop="username" class="login-item">
                        <span class="loginTips"><icon-svg icon-class="iconuser" /></span>
                        <el-input  @keyup.enter.native ="submitForm('loginForm')" class="area" type="text" placeholder="用户名" v-model="loginForm.username" ></el-input>
                    </el-form-item>
                    <el-form-item prop="password" class="login-item">
                        <span class="loginTips"><icon-svg icon-class="iconLock" /></span>
                        <el-input @keyup.enter.native ="submitForm('loginForm')" class="area" type="password" placeholder="密码" v-model="loginForm.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="submitForm(loginForm)" class="submit_btn">登录</el-button>
                    </el-form-item>
                    <div class="tiparea">
                        <p class="wxtip">温馨提示：</p>
                        <p class="tip">用户名为：admin<span></span></p>
                        <p class="tip">密码为：123456</p>
                    </div>
                </el-form></div>
                <div>
                    <el-row class="footer">
                    <el-col>
                        <p class="msg2">版权所有 ©2020 南京工程学院软件161班cqc </p>
                    </el-col>
                </el-row>
                </div>
            </section>
        </transition>
    </div>
</template>

<script>
    import logoImg from "@/assets/img/logo.jpg";
    import store from '@/store/store'
    import { login } from "@/api/user";
    import { setToken } from '@/utils/auth'
    import {mapState} from 'vuex'

    export default {
        data(){
            return {
                logo:logoImg,
                loginForm: {
                    username: '216160514',
                    password: '123456'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 9, message: '长度在 2 到 9个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                }
            }
        },
        mounted(){
        },
        methods: {
            submitForm(loginForm) {
                console.log("登录操作执行-------");
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        // let userinfo = this.loginForm;
                        // login(userinfo)
                        this.$axios({
                            url: `/api/login`,
                            method: 'post',
                            data: {
                                ...this.loginForm //props提供的语法糖，可以将父组件中的所有属性复制给子组件。
                            }
                        }).then(res => {
                            console.log(res);
                            let resData = res.data.data;
                            console.log(resData)
                            if(resData != null) {
                                switch (resData.role) {
                                    case "0":  //管理员
                                        this.$cookies.set("cname", resData.adminname)
                                        this.$cookies.set("cid", resData.adminid)
                                        this.$cookies.set("role", 0)
                                        let redirect=decodeURIComponent(this.$route.query.redirect||'/')
                                        setToken("Token",resData.token)
                                        // this.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
                                        this.$router.push({path: '/index'}) //跳转到首页
                                        break
                                    case "1": //教师
                                        this.$cookies.set("cname", resData.teaname)
                                        this.$cookies.set("cid", resData.teaid)
                                        this.$cookies.set("role", 1)
                                        setToken("Token",resData.token)
                                        this.$router.push({path: '/index'}) //跳转到教师用户
                                        break
                                    case "2": //学生
                                        this.$cookies.set("cname", resData.stuname)
                                        this.$cookies.set("cid", resData.stuid)
                                        setToken("Token",resData.token)
                                        this.$router.push({path: '/student'})
                                        break
                                }
                            }else{ //错误提示
                                this.$message({
                                    showClose: true,
                                    type: 'error',
                                    message: '用户名或者密码错误'
                                })
                            }
                        })
                    }
                });
            },
            clickTag(key) {
                this.role = key
            }
        },
        computed: mapState(["userInfo"]),
        mounted() {

        }
    }
</script>

<style lang="less" scoped>
    .login_page{
        position: absolute;
        width: 100%;
        height: 100%;
        background: url('../../assets/img/login.jpg')center top / cover no-repeat;
        background-size: 100% 100%;
    }
    .form_contianer{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background: #fff;
        width:370px;
        border-radius: 5px;
        padding: 25px;
        text-align: center;
        .titleArea{
            justify-content: center;
            align-items: center;
            text-transform: uppercase;
            font-size: 22px;
            width: 100%;
            padding-bottom: 20px;
            .logo{
                width: 40px;
                margin-right: 10px;
            }
            .title{
                i{
                    color: #FF6C60;
                }
            }
        }

        .loginForm{
            .submit_btn{
                width: 100%;
                padding:13px 0;
                font-size: 16px;
            }
            .loginTips{
                position: absolute;
                left: 10px;
                z-index: 20;
                // color: #FF7C1A;
                font-size: 18px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

    .manage_tip{
        margin-bottom:20px;
        .title{
            font-family: cursive;
            font-weight: bold;
            font-size: 26px;
            color:#fff;
        }
        .logo{
            width:60px;
            height:60px;
        }
    }

    .tiparea{
        text-align:left;
        font-size: 12px;
        color: #4cbb15;
        padding: 10px 0;
        .tip{
            margin-left: 54px;
        }
    }

    .form-fade-enter-active, .form-fade-leave-active {
        transition: all 1s;
    }
    .form-fade-enter, .form-fade-leave-active {
        transform: translate3d(0, -50px, 0);
        opacity: 0;
    }
    .loginForm{
        .el-button--primary{
            background-color:#FF7C1A;
            border:1px solid #FF7C1A;
        }
    }
    .sanFangArea{
        border-top: 1px solid #DCDFE6;
        padding: 10px 0;
        display: none;
        .title{
            font-size: 14px;
            color: #8b9196;
            margin-bottom: 10px;
        }
        ul{
            li{
                flex:1;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                .svg-icon{
                    font-size: 24px;
                }
            }
        }
    }
</style>