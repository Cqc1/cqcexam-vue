<template>
    <div class="fillcontain">
        <div class="search_container searchArea">
            <el-form
                    :inline="true"
                    :model='search_data'
                    :rules="rules"
                    ref="search_data"
                    class="demo-form-inline search-form">
                <el-form-item  prop="id">
                    <el-input v-model.number="search_data.id"  placeholder="学生编号" @keyup.enter.native="onScreeoutStudent('search_data')"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="search_data.name"  placeholder="学生姓名关键字"  @keyup.enter.native="onScreeoutStudent('search_data')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="mini" icon="search" @click='onScreeoutStudent("search_data")'>筛选</el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="primary" size ="mini" icon="view" @click='onBatchDelStudent(sels)' :disabled="this.sels.length === 0||this.disabled" >批量删除</el-button>
                    <el-button type="success" size ="mini" icon="view" @click="downloadList">导出Elcel</el-button>
                </el-form-item>
                <el-form-item >
                    <vue-xlsx-table @on-select-file="selectExcel" size ="mini" icon="view" type="success">批量导入</vue-xlsx-table>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    id="outTable"
                    v-loading="loading"
                    :data="tableData" style="width: 100%"
                    align='center'
                    @selection-change="selsChange"
                    ref="table"
                    stripe :default-sort="{prop: 'createAt', order: 'descending'}"
            >
                <el-table-column v-if="idFlag" prop="stuid" label="stuid" align='center'>
                </el-table-column>
                <el-table-column type="selection" align='center'>
                </el-table-column>
                <el-table-column prop="stuid" label="学生学号" align='center'>
                </el-table-column>
                <el-table-column prop="stuname" label="学生姓名" align='center'>
                </el-table-column>
                <el-table-column prop="sex" label="性别" align='center'>
                </el-table-column>
                <el-table-column prop="clazz.calname" label="班级" align='center'>
                </el-table-column>
                <el-table-column prop="email" label="电子邮箱" align='center'>
                </el-table-column>
                <el-table-column prop="tel" label="电话号码" align='center'>
                </el-table-column>
                <el-table-column prop="operation" align='center' label="操作" width="180">
                    <template slot-scope='scope'>
                        <el-button type="warning" icon='edit' size="mini" @click='onEditStudent(scope.row.stuid)'>编辑</el-button>
                        <el-button type="danger" icon='delete' size="mini" @click='removeStudent(scope.row.stuid)'>删除</el-button>
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
                    title="编辑学生信息"
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
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        data(){
            return {
                Clazzs:[],
                search_data:{
                    startTime:'',
                    id:'',
                    name:''
                },
                rules: {
                    id: [
                        { required: false, message: '请输入学生学号', trigger: 'blur' },
                        { type: 'number', message: '请输入数字类型', trigger: 'blur' },
                    ]
                },
                tableData: [],
                sort: 'createAt',
                order: 'descending',
                accept: '',
                ws: null,
                editid:'',
                sortnum:0,
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
                form: {
                    clazz:{
                        clazzid:'',
                        calname:''
                    }
                }, //保存点击以后当前试卷的信息

            }
        },
        created() {
            this.getStudentInfo();
            this.getClazz();
        },
        computed:{
        },
        methods: {

            onScreeoutStudent(searchForm){
                if(this.search_data.name!=''&&this.search_data.id!='') {
                    this.$message({
                        message: '请不要同时输入筛选',
                        type: 'error'
                    })
                }else if(this.search_data.id!=''){
                    this.$refs[searchForm].validate((valid) => {
                        if (valid) {
                            //按条件查询信息
                            this.$axios(`/api/student/${this.search_data.id}`).then(res => {
                                /*this.loading = false;*/
                                if(res.data.code ==200) {
                                    this.pagination.total = res.data.data.length;
                                    this.tableData=[];
                                    this.tableData.push(res.data.data);
                                    this.$message({
                                        message: '查询成功',
                                        type: 'success'
                                    })
                                }else{
                                    this.$message({
                                        message: res.data.message,
                                        type: 'error'
                                    })
                                }
                            }).catch(error => {});
                        }
                    })
                }else if(this.search_data.name!=''){
                            //按条件查询信息
                            this.$axios(`/api/stu/${this.search_data.name}`).then(res => {
                                if(res.data.code ==200) {
                                    this.pagination.total = res.data.data.length;
                                    this.tableData=[];
                                    for(var i=0;i<res.data.data.length;i++){
                                        this.tableData.push(res.data.data[i]);
                                    }
                                    this.loading = false;
                                    this.$message({
                                        message: '查询成功',
                                        type: 'success'
                                    })
                                }else{
                                    this.$message({
                                        message: res.data.message,
                                        type: 'error'
                                    })
                                }
                            }).catch(error => {});
                }else{
                    this.getStudentInfo();
                }
            },
            getStudentInfo() {
                //分页查询所有试卷信息
                this.$axios(`/api/students/${this.pagination.current}/${this.pagination.size}`).then(res => {
                    this.pagination = res.data.data;
                    this.loading = false;
                    this.tableData = this.pagination.records;
                    this.pagination.current=1;
                }).catch(error => {});
            },
            getClazz(){
                //分页查询所有班级信息
                this.$axios(`/api/clazz/selectAll`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.Clazzs.push({label:element.calname,value:element.clazzid});
                    })
                }).catch(error => {});
            },
            change(){
                this.$forceUpdate()
            },
            //改变当前记录条数
            handleSizeChange(val) {
                this.pagination.size = val;
                this.getStudentInfo();
            },
            //改变当前页码，重新发送请求
            handleCurrentChange(val) {
                this.pagination.current = val;
                this.getStudentInfo();
            },
            // 编辑操作方法
            onEditStudent(studentId) { //修改学生信息
                this.dialogVisible = true
                this.$axios(`/api/student/${studentId}`).then(res => {
                    this.form = res.data.data
                })
            },
            //导出
            downloadList:function(){
                let vb = XLSX.utils.table_to_book(document.getElementById('outTable'));

                let vbout = XLSX.write(vb, {bookType: 'xlsx', bookSST: true, type: 'array'});

                try {

                    FileSaver.saveAs(new Blob([vbout], {type: 'application/octet-stream'}), '学生名单.xlsx');
                } catch (e) {
                    if (typeof console !== 'undefined') console.log(e, vbout);
                }
                return vbout;
            },
            selectExcel(convertedData) {    //批量导入
            //可以打印一下看convertedData有哪些东西
                console.log(convertedData);
                let data=convertedData.body;
                this.excelList=[];
                data.forEach((item)=> {
                    let dataitem={
                        stuid: item.学生学号,
                        stuname: item.学生姓名,
                        sex: item.性别,
                        clazzid: item.班级,
                        email:item.电子邮箱,
                        tel: item.电话号码,
                    };
                    this.excelList.push(dataitem)
                });
                for(var i=0;i<this.excelList.length;i++){
                    for(var j=0;j<this.Clazzs.length;j++) {
                        if (this.excelList[i].clazzid == this.Clazzs[j].label) {
                            this.excelList[i].clazzid=this.Clazzs[j].value
                        }
                    }
                }
                this.$axios.post('/api/studentAll',this.excelList)
                .then(res => {
                    //这是我自己封装过的axios请求，按自己的发送请求就行了
                    if(res.data.code==200) {
                        this.$message({
                            message: '导入成功！',
                            type: 'success'
                        });
                        this.getStudentInfo();
                        //我这里是在保存成功后请求了一遍列表接口，用来刷新列表
                    }else{
                        this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                        this.getStudentInfo();
                    }

                });
            },

            submit() { //提交更改
                this.dialogVisible = false
                this.$axios({
                    url: '/api/student',
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
                    this.getStudentInfo()
                })
            },
            handleClose(done) { //关闭提醒
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    }).catch(_ => {});
            },
            //删除操作方法
            removeStudent(studentId) { //删除当前学生
                // let studentId=row.stuid;
                this.$confirm('确认删除该记录吗?', '提示').then(() => {
                    this.$axios({
                        url: `/api/student/${studentId}`,
                        method: 'delete',
                }).then(res => {
                    // console.log(res);
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    this.getStudentInfo()
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
            onBatchDelStudent(rows){
                var ids = [];
                rows.forEach(element =>{
                    ids.push(element.stuid)
                    console.log("====="+element.stuid);
                })
                const param = ids.join(','); // 把数组项拼接成字符串，以逗号,分隔
                this.$confirm('确定要删除选中的文件吗?','提示').then(() =>{
                    this.$axios({
                        url: `/api/student/deleteByIds/${param}`,
                        method: 'delete',
                    }).then(res => {
                        console.log(ids.stuid);
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        console.log("====="+ids);
                        this.getStudentInfo()
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