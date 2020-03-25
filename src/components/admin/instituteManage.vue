<template>
    <div class="fillcontain">
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
                <el-form-item class="btnRight">
                    <el-button type="primary" size ="mini" icon="view" @click='onBatchDelYuan(sels)' :disabled="this.sels.length === 0||this.disabled" >批量删除</el-button>
                    <el-button type="success" size ="mini" icon="view">导出Elcel</el-button>
                    <el-button type="primary" size ="mini" icon="view" @click='onAddYuan()'>添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-loading="loading"
                    :data="tables" style="width: 100%"
                    align='center'
                    @selection-change="selsChange"
                    ref="table"
                    stripe :default-sort="{prop: 'createAt', order: 'descending'}"
            >
                <el-table-column v-if="idFlag" prop="institutionid" label="institutionid" align='center'>
                </el-table-column>
                <el-table-column type="selection" align='center'>
                </el-table-column>
                <el-table-column prop="institutionid" label="院系编号" align='center'>
                </el-table-column>
                <el-table-column prop="instituname" label="院系名称" align='center'>
                </el-table-column>
                <el-table-column prop="operation" align='center' label="操作" width="180">
                    <template slot-scope='scope'>
                        <el-button type="warning" icon='edit' size="mini" @click='onEditYuan(scope.row.institutionid)'>编辑</el-button>
                        <el-button type="danger" icon='delete' size="mini" @click='removeYuan(scope.row.institutionid)'>删除</el-button>
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
                    title="编辑或添加院系信息"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose">
                <section class="update">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item v-if="add" label="院系编号">
                            <el-input v-model="form.institutionid" v-if="add" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="院系名称">
                            <el-input v-model="form.instituname"></el-input>
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
                tableData: [],
                sort: 'createAt',
                order: 'descending',
                sels: [],//选中显示的值
                disabled:true,
                loading:true,
                idFlag:false,
                add:false,//用于添加时的条件判断
                pagination: {
                    //分页后的考试信息
                    current: 1, //当前页
                    total: null, //记录条数
                    size: 6, //每页条数
                },
                dialogVisible: false, //对话框
                form: {
                    institutionid:null,
                    instituname:null,
                }, //保存点击以后当前试卷的信息
                search:'',//用于模糊查询
            }
        },
        created() {
            this.getInstitutionInfo();
        },
        computed:{
        },
        methods: {

            change(){
                this.$forceUpdate()
            },
            getInstitutionInfo() {
                //分页查询所有院系信息
                this.$axios(`/api/institution/findAll/${this.pagination.current}/${this.pagination.size}`).then(res => {
                    this.pagination = res.data.data;
                    this.loading = false;
                    this.tableData=[];
                    this.tableData = this.pagination.records;
                    /*this.pagination.current=1;*/
                }).catch(error => {});
            },
            //改变当前记录条数
            handleSizeChange(val) {
                this.pagination.size = val;
                this.getInstitutionInfo()
            },
            //改变当前页码，重新发送请求
            handleCurrentChange(val) {
                this.pagination.current = val;
                this.getInstitutionInfo()
            },
            // 编辑操作方法
            onEditYuan(institutionid) { //修改课程信息
                this.add=true
                this.dialogVisible = true
                this.$axios(`/api/institution/select/${institutionid}`).then(res => {
                    this.form = res.data.data
                })
            },
            //添加操作方法
            onAddYuan(){
                this.add=false;
                this.dialogVisible = true
                this.form={};
            },
            submit() { //提交更改
                this.dialogVisible = false
                if(this.add==false){
                    if(this.form.instituname==null){
                        this.$message({
                            message: '添加失败！请输入院系名称',
                            type: 'error'
                        })
                    }else {
                        this.$axios({
                            url: '/api/institution/add',
                            method: 'post',
                            data: {
                                ...this.form
                            }
                        }).then(res => {
                            console.log(res)
                            if (res.data.code == 200) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                })
                            }
                            this.getInstitutionInfo()
                        })
                    }
                }else {
                    this.$axios({
                        url: '/api/institution/update',
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
                        this.getInstitutionInfo()
                    })
                }
            },
            handleClose(done) { //关闭提醒
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    }).catch(_ => {});
            },
            //删除操作方法
            removeYuan(institutionId) { //删除当前班级
                this.$confirm('确认删除该记录吗?', '提示').then(() => {
                    this.$axios({
                        url: `/api/institution/delete/${institutionId}`,
                        method: 'delete',
                    }).then(res => {
                        // console.log(res);
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        })
                        this.pagination.current=1;
                        this.getInstitutionInfo()

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
            onBatchDelYuan(rows){
                var ids = [];
                rows.forEach(element =>{
                    ids.push(element.institutionid)
                    console.log("====="+element.institutionid);
                })
                const param = ids.join(','); // 把数组项拼接成字符串，以逗号,分隔
                this.$confirm('确定要删除选中的文件吗?','提示').then(() =>{
                    this.$axios({
                        url: `/api/institution/deleteByIds/${param}`,
                        method: 'delete',
                    }).then(res => {
                        console.log(ids.institutionid);
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        console.log("====="+ids);
                        this.pagination.current=1;
                        this.getInstitutionInfo()

                    })
                }).catch(() => {})
            },
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