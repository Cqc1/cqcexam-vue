<template>
    <div class="fillcontain">
        <div class="search_container searchArea">
            <el-form
                    :inline="true"
                    :model='search_data'
                    :rules="rules"
                    ref="search_data"
                    class="demo-form-inline search-form">
                <el-form-item label="">
                    <el-input v-model="search_data.name" :rules="rules" placeholder="课程名"  @keyup.enter.native='onScreeoutCourse("search_data")'></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="mini" icon="search" @click='onScreeoutCourse("search_data")'>筛选</el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="primary" size ="mini" icon="view" @click='onBatchDelCourse(sels)' :disabled="this.sels.length === 0||this.disabled" >批量删除</el-button>
                    <el-button type="success" size ="mini" icon="view">导出Elcel</el-button>
                    <!--                    <el-button type="primary" size ="mini" icon="view" @click='onAddStudent()'>添加</el-button>-->
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-loading="loading"
                    :data="tableData" style="width: 100%"
                    align='center'
                    @selection-change="selsChange"
                    ref="table"
                    stripe :default-sort="{prop: 'createAt', order: 'descending'}"
            >
                <el-table-column v-if="idFlag" prop="courseid" label="courseid" align='center'>
                </el-table-column>
                <el-table-column type="selection" align='center'>
                </el-table-column>
                <el-table-column prop="courseid" label="课程编号" align='center'>
                </el-table-column>
                <el-table-column prop="couname" label="课程名称" align='center'>
                </el-table-column>
                <el-table-column prop="couperiod" label="课时" align='center'>
                </el-table-column>
                <el-table-column prop="credit" label="学分" align='center'>
                </el-table-column>
                <el-table-column prop="operation" align='center' label="操作" width="180">
                    <template slot-scope='scope'>
                        <el-button type="warning" icon='edit' size="mini" @click='onEditCourse(scope.row.courseid)'>编辑</el-button>
                        <el-button type="danger" icon='delete' size="mini" @click='removeCourse(scope.row.courseid)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.current"
                    :page-sizes="[6, 10]"
                    :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total"
                    class="page">
            </el-pagination>
            <!-- 编辑对话框-->
            <el-dialog
                    title="编辑课程信息"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose">
                <section class="update">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="课程编号">
                            <el-input v-model="form.courseid" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="课程名称">
                            <el-input v-model="form.couname"></el-input>
                        </el-form-item>
                        <el-form-item label="课程学时">
                            <el-input v-model="form.couperiod"></el-input>
                        </el-form-item>
                        <el-form-item label="课程学分">
                            <el-input v-model="form.credit"></el-input>
                        </el-form-item>
                    </el-form>
                </section>
                <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                search_data:{
                    startTime:'',
                    endTime:'',
                    name:''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入课程名', trigger: 'blur' },
                    ]
                },
                tableData: [],
                sort: 'createAt',
                order: 'descending',
                accept: '',
                ws: null,
                sels: [],//选中显示的值
                disabled:true,
                loading:true,
                idFlag:false,
                pagination: {
                    //分页后的考试信息
                    current: 1, //当前页
                    total: null, //记录条数
                    size: 6, //每页条数
                },
                dialogVisible: false, //对话框
                form: {}, //保存点击以后当前试卷的信息

            }
        },
        created() {
            this.getCourseInfo();
        },
        computed:{
        },
        methods: {
            onScreeoutCourse(searchForm){
                this.$refs[searchForm].validate((valid) => {
                    if (valid) {
                        //按条件查询信息
                        this.$axios(`/api/cou/${this.search_data.name}`).then(res => {
                            this.pagination.total = res.data.data.length;
                            this.tableData=[];
                            for(var i=0;i<res.data.data.length;i++){
                                this.tableData.push(res.data.data[i]);
                            }
                            this.loading = false;
                        }).catch(error => {});
                    }
                })
            },
            getCourseInfo() {
                //分页查询所有课程信息
                this.$axios(`/api/courses/${this.pagination.current}/${this.pagination.size}`).then(res => {
                    this.pagination = res.data.data;
                    this.loading = false;
                    this.tableData = this.pagination.records;
                }).catch(error => {});
            },
            //改变当前记录条数
            handleSizeChange(val) {
                this.pagination.size = val;
                this.getCourseInfo();
            },
            //改变当前页码，重新发送请求
            handleCurrentChange(val) {
                this.pagination.current = val;
                this.getCourseInfo();
            },
            // 编辑操作方法
            onEditCourse(courseId) { //修改课程信息
                this.dialogVisible = true
                this.$axios(`/api/course/${courseId}`).then(res => {
                    this.form = res.data.data
                })
            },
            submit() { //提交更改
                this.dialogVisible = false
                this.$axios({
                    url: '/api/course',
                    method: 'put',
                    data: {
                        ...this.form
                    }
                }).then(res => {
                    console.log(res)
                    if(res.data.code ==200) {
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        })
                    }
                    this.getCourseInfo()
                })
            },
            handleClose(done) { //关闭提醒
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    }).catch(_ => {});
            },
            //删除操作方法
            removeCourse(courseId) { //删除当前课程
                this.$confirm('确认删除该记录吗?', '提示').then(() => {
                    this.$axios({
                        url: `/api/course/${courseId}`,
                        method: 'delete',
                    }).then(res => {
                        // console.log(res);
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        })
                        this.getCourseInfo()
                    })
                }).catch(() => {})
            },
            selsChange(sels) {
                //被选中的行组成数组
                this.sels = sels;
                //遍历被选中行数所组成的数组
                for(let element of this.sels){
                    //按钮可用
                    this.disabled = false;
                }
            },
            //批量删除
            onBatchDelCourse(rows){
                var ids = [];
                rows.forEach(element =>{
                    ids.push(element.courseid)
                    console.log("====="+element.courseid);
                })
                const param = ids.join(','); // 把数组项拼接成字符串，以逗号,分隔
                this.$confirm('确定要删除选中的文件吗?','提示').then(() =>{
                    this.$axios({
                        url: `/api/course/deleteByIds/${param}`,
                        method: 'delete',
                    }).then(res => {
                        console.log(ids.courseid);
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        console.log("====="+ids);
                        this.getCourseInfo()
                    })
                }).catch(() => {})
            },
        },
    }
</script>

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

</style>