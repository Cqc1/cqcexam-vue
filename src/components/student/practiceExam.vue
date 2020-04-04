// 我的试卷页面
<template>
    <div id="myExam">
        <div class="title">我的练习试卷</div>
        <div class="wrapper">
            <ul class="top">
                <li class="order">练习试卷列表</li>
                <li class="search-li"><div class="icon"><input type="text" placeholder="考试名称" class="search" v-model="key"><i class="el-icon-search"></i></div></li>
                <li><el-button type="primary" @click="search()">搜索考试</el-button></li>
            </ul>
            <ul class="paper" v-loading="loading">
                <li class="item" v-if="pagination.records.length==0">
                    <div class="info" v-if="pagination.records.length==0">
                        <span>暂无练习安排</span>
                    </div>
                </li>
                <li class="item" v-for="(item,index) in pagination.records" :key="index">
                    <h4 @click="toExamMsg(item.examid)">{{item.exname}}</h4>
                    <p class="name">{{item.exname}}-{{item.description}}</p>
                    <div class="info">
                        <i class="el-icon-loading"></i><span>{{item.exdate.substr(0,10)}}</span>
                        <i class="iconfont icon-icon-time"></i><span v-if="item.extime != null">限时{{item.extime}}分钟</span>
                        <i class="iconfont icon-fenshu"></i><span>满分{{item.paper.totalscore}}分</span>
                    </div>
                </li>
            </ul>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pagination.current"
                        :page-sizes="[6, 10, 20, 40]"
                        :page-size="pagination.size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import store from '@/store/store'
    import {mapState} from 'vuex'
    export default {
        // name: 'myExam'
        data() {
            return {
                loading: false,
                key: null, //搜索关键字
                allExam: null, //所有考试信息
                pagination: { //分页后的考试信息
                    records:[],
                    current: 1, //当前页
                    total: null, //记录条数
                    size: 6 //每页条数
                }
            }
        },
        created() {
            this.getExamInfo()
            this.loading = true
        },
        // watch: {

        // },
        methods: {
            /*// 筛选
            filters(tabledate) {
              this.$axios(`/api/student/${this.$cookies.get("cid")}`).then(res => {
                if (res.data.code == 200) {
                  var institutionid=res.data.data.institutionid
                  var majorid=res.data.data.majorid
                  let newData = tabledate.filter(item => {
                    return item.exname.includes('['+institutionid+','+majorid+']')
                  })
                  this.pagination.records = newData
                }
              })
            },*/
            //获取当前所有考试信息
            getExamInfo() {
                this.$axios(`/api/exam/findAll/${this.pagination.current}/${this.pagination.size}/${2}`).then(res => {
                    this.pagination = res.data.data
                    this.loading = false
                    console.log(this.pagination)
                }).catch(error => {
                    console.log(error)
                })
            },
            //改变当前记录条数
            handleSizeChange(val) {
                this.pagination.size = val
                this.getExamInfo()
            },
            //改变当前页码，重新发送请求
            handleCurrentChange(val) {
                this.pagination.current = val
                this.getExamInfo()
            },
            //搜索试卷
            search() {
                this.$axios('/api/exam/exams').then(res => {
                    if(res.data.code == 200) {
                        let allExam = res.data.data
                        let newPage = allExam.filter(item => {
                            return item.exname.includes(this.key)
                        })
                        console.log(newPage)
                        this.pagination.records = newPage
                        this.pagination.total=newPage.length;
                        this.pagination.current=1;
                    }
                })
            },
            //跳转到试卷详情页
            toExamMsg(examid) {
                this.$axios(`/api/student/${this.$cookies.get("cid")}`).then(res => {
                    if (res.data.code == 200) {
                        var institutionid=res.data.data.institutionid
                        var majorid=res.data.data.majorid
                        this.$axios(`/api/exam/selectById/${examid}`).then(res => {
                            var majors=res.data.data.majors;
                            if(majors.includes('['+institutionid+','+majorid+']')){
                                this.$router.push({path: '/examMsg', query: {examid: examid}})
                                console.log(examid)
                            }else{
                                this.$message({
                                    message: '该练习暂不属于您的专业所考,您无法查看！',
                                    type: 'warning'
                                })
                            }
                        })
                    }else{
                        this.$message({
                            message: res.data.message,
                            type: 'error'
                        })
                    }
                })
            }
        },
        computed:mapState(["isPractice"])
    }
</script>

<style lang="scss" scoped>
    .pagination {
        padding: 20px 0px 30px 0px;
        .el-pagination {
            display: flex;
            justify-content: center;
        }
    }
    .paper {
        h4 {
            cursor: pointer;
        }
    }
    .paper .item a {
        color: #000;
    }
    .wrapper .top .order {
        cursor: pointer;
    }
    .wrapper .top .order:hover {
        color: #0195ff;
        border-bottom: 2px solid #0195ff;
    }
    .wrapper .top .order:visited {
        color: #0195ff;
        border-bottom: 2px solid #0195ff;
    }
    .item .info i {
        margin-right: 5px;
        color: #0195ff;
    }
    .item .info span {
        margin-right: 14px;
    }
    .paper .item {
        width: 380px;
        border-radius: 4px;
        padding: 20px 30px;
        border: 1px solid #606060;
        box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
        transition: all 0.6s ease;
    }
    .paper .item:hover {
        box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
        transform: scale(1.03);
    }
    .paper .item .info {
        font-size: 14px;
        color: #88949b;
    }
    .paper .item .name {
        font-size: 14px;
        color: #88949b;
    }
    .paper * {
        margin: 20px 0;
    }
    .wrapper .paper {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
    .top .el-icon-search {
        position: absolute;
        right: 10px;
        top: 10px;
    }
    .top .icon {
        position: relative;
    }
    .wrapper .top {
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
    }
    #myExam .search-li {
        margin-left: auto;
    }
    .top .search-li {
        margin-left: auto;
    }
    .top li {
        display: flex;
        align-items: center;
    }
    .top .search {
        margin-left: auto;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #eee;
        box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    }
    .top .search:hover {
        color: #0195ff;
        border-color: #0195ff;
    }
    .wrapper .top {
        display: flex;
    }
    .wrapper .top li {
        margin: 20px;
    }
    #myExam {
        width: 980px;
        margin: 0 auto;
    }
    #myExam .title {
        margin: 20px;
    }
    #myExam .wrapper {
        background-color: #fff;
    }
</style>
