<!--左边下拉导航栏-->
<template>
    <div id="left">
        <el-menu
                active-text-color="#dd5862"
                text-color="#FFFFFF"
                :default-active="this.$route.path"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                :collapse="flag"
                background-color="#2A2A2A"
                menu-trigger="click" router>
            <el-submenu v-for="(item,index) in menu" :index='item.index' :key="index">
                <template slot="title">
                    <div class="left-width">
                        <i class="iconfont" :class="item.icon"></i>
                        <span slot="title" class="title">{{item.title}}</span>
                    </div>
                </template>
                <el-menu-item-group v-for="(list,index1) in item.content" :key="index1">
                    <el-menu-item @click="handleTitle(item.index)" :index="list.path" v-if="list.item1 != null">{{list.item1}}</el-menu-item>
                    <el-menu-item @click="handleTitle(item.index)" :index="list.path" v-if="list.item2 != null">{{list.item2}}</el-menu-item>
                    <el-menu-item @click="handleTitle(item.index)" :index="list.path" v-if="list.item3 != null">{{list.item3}}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    import store from '@/store/store'
    import {mapState} from 'vuex'
    export default {
        name: "mainLeft",
        data() {
            return {

            }
        },
        computed: mapState(["flag","menu"]),
        created() {
            this.addData()
        },
        methods: {
            handleOpen(key, keyPath) {
                // console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                // console.log(key, keyPath);
            },
            //点击标题传递参数给navigator组件
            handleTitle(index) {
                this.bus.$emit('sendIndex',index)
            },
            del(id){
                this.menu.some((item, i)=>{
                    if(item.index==id){
                        this.list.splice(i, 1)
                        //在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
                        return true
                    }
                })
            },
            Del(title){
                var index = this.menu.findIndex(item =>{
                    console.log(item.title.trim()==title);
                    if(item.title.trim()==title){
                        return true
                    }
                })
                this.menu.splice(index,1)
            },
            addData() {
                let role = this.$cookies.get("role")
                console.log(role);
                if(role == 0) {
                    this.menu.push({
                        index: '7',
                        title: '教师管理',
                        icon: 'icon-Userselect',
                        content:[{item1:'教师管理',path:'/teacherManage'},{item2: '添加教师',path: '/addTeacher'}],
                    })
                    this.menu.push({
                        index: '8',
                        title: '学院管理',
                        icon: 'iconxueyuan',
                        content:[{item1:'院系管理',path:'/instituteManage'},{item2: '专业管理',path: '/majorManage'},{item3: '班级管理',path: '/classManage'}],
                    },)
                }
            }
        },
        store
    }
</script>

<style>
    .el-menu-vertical-demo .el-submenu__title {
        overflow: hidden;
    }
    .left-width .iconfont {
        font-size: 22px;
        color: #fff;
    }
    .left-width {
        width: 150px;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        min-height: 900px;

    }
    #left {
        height: 900px;
        background-color: #000000;
        z-index: 0;
    }
    #left .el-menu-vertical-demo .title {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        margin-left: 14px;
    }
    .el-submenu {
        border-bottom: 1px solid #eeeeee0f !important;
    }
    .el-submenu__title:hover {
        background-color: #fff;
    }
    .el-submenu__title i {
        color: #fbfbfc !important;
    }
</style>

