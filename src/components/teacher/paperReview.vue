//查询所有考试跳转到分段页面
<template>
    <div class="exam">
        <div class="search_container searchArea">
            <el-form
                    :inline="true"
                    class="demo-form-inline search-form">
                <el-form-item>
                    <div class="searchWord el-form-item">
                        <el-input class="el-form-item__content search-input" v-model="search" placeholder="请输入搜索内容">
                        </el-input>
                        <i class="el-icon-search search-icon"></i>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <el-table
                  v-loading="loading"
                  :data="tables" style="width: 100%"
                  align='center'
                  ref="table"
                  stripe :default-sort="{prop: 'createAt', order: 'descending'}">
            <el-table-column align='center' fixed="left" prop="course.couname" label="所属课程" width="180"></el-table-column>
            <el-table-column align='center' prop="exname" label="考试名称" width="200"></el-table-column>
            <el-table-column align='center' prop="institution.instituname" label="所属学院" width="120"></el-table-column>
            <el-table-column align='center' prop="major.major" label="所属专业" width="200"></el-table-column>
            <el-table-column align='center' prop="grade" label="年级" width="100"></el-table-column>
            <el-table-column align='center' prop="exdate" label="考试日期" width="120"></el-table-column>
            <el-table-column align='center' prop="extime" label="持续时间" width="120"></el-table-column>
            <el-table-column align='center' prop="paper.totalscore" label="总分" width="120"></el-table-column>
            <el-table-column align='center' prop="description" label="考试介绍" width="120"></el-table-column>
            <el-table-column  align='center' fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="toPreview(scope.row.examid,scope.row.exname)" :disabled="arry[scope.row.examid]==0"type="primary" size="small">试卷批阅</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.current"
                :page-sizes="[4, 8, 10, 20]"
                :page-size="pagination.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total" class="page">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                sort: 'createAt',
                order: 'descending',
                search:'',//用于模糊查询
                form: {}, //保存点击以后当前试卷的信息
                pagination: { //分页后的考试信息
                    current: 1, //当前页
                    total: null, //记录条数
                    size: 4 //每页条数
                },
                loading:true,
                dialogVisible: false,
                arry:[],
            }
        },
        created() {
            this.getExamInfo()
        },
        methods: {
            getExamInfo() { //分页查询所有考试信息
                this.$axios(`/api/exam/findAll/${this.pagination.current}/${this.pagination.size}/${1}`).then(res => {
                    this.pagination = res.data.data
                    this.loading = false;
                    this.tableData=[];
                    this.tableData = this.pagination.records;
                }).catch(error => {
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
            toPreview(examid,exname) { //跳转到批改试卷页面
                //分页查询所有试卷信息
                this.$axios(`/api/score/selectByExamId/${examid}/${0}`).then(res => {
                    console.log(res.data.data);
                    if(res.data.code==404||res.data.data==null){
                        this.arry[examid]=0
                        this.$message({
                            message: '暂无试卷批改!',
                            type: 'warning'
                        })
                        console.log(this.arry);
                    }else{
                        this.arry[examid]=1
                        this.$router.push({path: '/teaPreview', query:{examid: examid, exname: exname}})
                        console.log(this.arry);
                    }
                })
            }
        },
        computed: {
            // 模糊搜索
            tables() {
                const search = this.search;
                if (search) {
                    return this.tableData.filter(data => {
                        return Object.keys(data).some(key => {
                            return String(data[key]).toLowerCase().indexOf(search) > -1
                        })
                    })
                }
                return this.tableData
            },
        }
    };
</script>
<style lang="scss" scoped>
    .exam {
        padding: 0px 40px;
        .page {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .edit{
            margin-left: 20px;
        }
    }
</style>
<style lang="less" scoped>
    .search_container{
        margin-bottom: 20px;
    }
    .btnRight{
        float: right;
        margin-right: 0px !important;
    }
    .searchArea{
        background: rgb(253, 253, 253);
        border-radius:1px;
        padding: 1px 10px 0;
    }
    .table_container{
        padding: 10px;
        background: #fff;
        border-radius: 2px;
    }
    .el-dialog--small{
        width: 600px !important;
    }
    .pagination{
        text-align: left;
        margin-top: 10px;
    }

    .searchWord {
        display: inline-block;
        width: 210px;
        position: relative;
    }

    .searchWord .search-input {
        display: inline-block;
        width: 200px;
        position: relative;
    }
    .searchWord .search-icon {
        position: absolute;
        top: 13px;
        left: 10px;
        font-size: 14px;
        color: #409eff;
    }
</style>
<style>
    .searchWord .search-input input[autocomplete="off"],
    .searchWord .search-input input[autocomplete="off"].el-input__inner {
        padding-left: 30px !important;
    }
</style>

