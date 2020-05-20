// 展示组件页面
<template>
    <div id="index">
        <header1 class="topbar"></header1>
        <section class="container">
            <div class="left_side">
                <mainLeft></mainLeft>
            </div>
            <div class="main_wrapper">
                <navigator class="nav"></navigator>
                <router-view></router-view>
            </div>
        </section>
        <!--<v-footer class="el-footer"></v-footer>-->
    </div>
</template>

<script>
    import header from '@/components/common/header'
    import mainLeft from '@/components/common/mainLeft'
    import navigator from '@/components/common/navigator'
    import myFooter from "@/components/common/myFooter"
    export default {
        components:{
            header1: header,
            mainLeft: mainLeft,
            navigator:navigator,
            "v-footer": myFooter
        },
        data() {
            return {
                username: ''
            }
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
    .el-footer{
        position: absolute;
        text-align:center;
        bottom:0;
        margin:0 auto;
        width:100%;
        color: #5c6b77
    }
    #index .nav {
        box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);
        margin-bottom: 30px;
    }
    .container {
        display: flex;
        background-color: #fff;
    }
    .main_wrapper {
        overflow: hidden;
        flex: 1;
        background-color: #fff;
    }
</style>