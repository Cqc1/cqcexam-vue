<!-- 顶部信息栏 -->
<template>
    <header id="topbar">
        <el-row>
            <el-col :span="4" class="topbar-left">
                <i class="iconfont icon-kaoshi"></i>
                <span class="title" @click="index()">CQC-EXAM</span>
            </el-col>
            <el-col :span="20" class="topbar-right">
                <i class="el-icon-menu" @click="toggle()"></i>
                <div class="user">
                    <span>{{user.userName}}</span>
                    <img src="@/assets/img/user.png" class="user-img" ref="img" @click="showSetting()" />
                    <transition name="fade">
                        <div class="out" ref="out" v-show="login_flag">
                            <ul>
                                <li @click="Info()"><a href="javascript:;">用户信息</a></li>
                                <li @click="upPwd()"><a href="javascript:;">修改密码</a></li>
                                <li class="exit" @click="exit()"><a href="javascript:;">退出登录</a></li>
                            </ul>
                        </div>
                    </transition>
                </div>
            </el-col>
        </el-row>
        <!--&lt;!&ndash; 编辑对话框&ndash;&gt;
        <el-dialog
                title="编辑或修改信息"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <section class="update">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="学号">
                        <el-input v-model="form.stuid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="form.stuname" ></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.stupwd"></el-input>
                    </el-form-item>
                    <el-form-item  label="所属班级">
                        <el-select v-model="form.clazzid" :placeholder="form.clazz.calname" @change="change()">
                            <el-option
                                    v-for="item in Clazzs"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-input v-model="form.sex"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码">
                        <el-input v-model="form.tel"></el-input>
                    </el-form-item>
                </el-form>
            </section>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
        </el-dialog>-->
    </header>
</template>

<script>
    import store from '@/store/store'
    import {mapState,mapMutations} from 'vuex'
    export default {
        data() {
            return {
                dialogVisible: false, //对话框
                login_flag: false,
                user: { //用户信息
                    userName: null,
                    userId: null
                }
            }
        },
        created() {
            this.getUserInfo()
        },
        computed: mapState(["flag","menu"]),
        methods: {
            //显示、隐藏退出按钮
            showSetting() {
                this.login_flag = !this.login_flag
            },
            //左侧栏放大缩小
            ...mapMutations(["toggle"]),
            getUserInfo() { //获取用户信息
                let userName = this.$cookies.get("cname")
                let userId = this.$cookies.get("cid")
                this.user.userName = userName
                this.user.userId = userId
            },
            index() {
                this.$router.push({path: '/index'})
            },
            exit() {
                let role = this.$cookies.get("role")
                this.$router.push({path:"/"}) //跳转到登录页面
                this.$cookies.remove("cname") //清除cookie
                this.$cookies.remove("cid")
                this.$cookies.remove("role")
                if(role == 0) {
                    this.menu.pop()
                }
            },
            exit() {
                let role = this.$cookies.get("role")
                this.$router.push({path:"/"}) //跳转到登录页面
                this.$cookies.remove("cname") //清除cookie
                this.$cookies.remove("cid")
                this.$cookies.remove("role")
                if(role == 0) {
                    this.menu.pop()
                }
            },
            exit() {
                let role = this.$cookies.get("role")
                this.$router.push({path:"/"}) //跳转到登录页面
                this.$cookies.remove("cname") //清除cookie
                this.$cookies.remove("cid")
                this.$cookies.remove("role")
                if(role == 0) {
                    this.menu.pop()
                }
            }
        },
        store
    }
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    #topbar {
        position: relative;
        z-index: 10;
        background-color: rgba(42, 42, 42, 0.98);
        height: 80px;
        line-height: 80px;
        color: #fff;
        box-shadow: 5px 0px 10px rgba(4, 14, 65, 0.86);
    }
    #topbar .topbar-left {
        height: 80px;
        display: flex;
        justify-content: center;
        background: rgba(0, 0, 0, 0.05);
        overflow: hidden;
    }
    .topbar-left .icon-kaoshi {
        font-size: 60px;
    }
    .topbar-left .title {
        font-size: 20px;
        cursor: pointer;
    }
    .topbar-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .topbar-right .user-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .topbar-right .el-icon-menu {
        font-size: 30px;
        margin-left: 20px;
    }
    .topbar-right .user {
        position: relative;
        margin-right: 40px;
        display: flex;
    }
    .topbar-right .user .user-img {
        margin-top: 15px;
        margin-left: 10px;
        cursor: pointer;
    }
    .user .out {
        font-size: 14px;
        position: absolute;
        top: 80px;
        right: 0px;
        background-color: #fff;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        padding: 12px;
    }
    .user .out ul {
        list-style: none;
    }
    .user .out ul > li {
        height: 26px;
        line-height: 26px;
    }
    .out a {
        text-decoration: none;
        color: #000;
    }
    .out .exit {
        margin-top: 4px;
        padding-top: 4px;
        border-top: 1px solid #ccc;
    }
</style>
