//查询所有试卷
<template>
    <div class="fillcontain">
        <div class="search_container searchArea">
            <el-form
                    :inline="true"
                    :model='search_data'
                    :rules="rules"
                    ref="search_data"
                    class="demo-form-inline search-form">
                <el-form-item>
                    <el-select v-model="value" @change="handleChange" placeholder="请选择">
                        <el-option
                                v-for="item in courses"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="search_data.name" :rules="rules" placeholder="出卷人姓名"  @keyup.enter.native='onScreeoutQues("search_data")'></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="mini" icon="search" @click='onScreeoutPaper("search_data")'>筛选</el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="primary" size ="mini" icon="view" @click='onBatchDelPaper(sels)' :disabled="this.sels.length === 0||this.disabled" >批量删除</el-button>
                    <el-button type="success" size ="mini" icon="view">导出Elcel</el-button>
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
                <el-table-column v-if="idFlag" prop="paperid" label="paperid" align='center'>
                </el-table-column>
                <el-table-column type="selection" align='center'>
                </el-table-column>
                <el-table-column prop="course.couname" label="所属课程" align='center'>
                </el-table-column>
                <!-- 自定义列的遍历
                <el-table-column align='center' v-for="(item, index) in tableData[0].quesNumberList" :key="index" :label="item.quesname+'数量'" >
                    &lt;!&ndash; 数据的遍历  scope.row就代表数据的每一个对象&ndash;&gt;
                    <template  slot-scope="scope">
                        <span>{{scope.row.quesNumberList[index].questypenum}}</span>
                    </template>
                </el-table-column>-->
                <el-table-column prop="totalscore" label="总分值" align='center'>
                </el-table-column>
                <el-table-column prop="user" label="组卷人" align='center'>
                </el-table-column>
                <el-table-column prop="description" label="试卷描述" align='center'>
                </el-table-column>
                <el-table-column prop="operation" align='center' label="操作" width="250">
                    <template slot-scope='scope'>
                        <el-button type="primary" size ="mini" icon="view" @click='prePaper(scope.row.paperid)'>详情</el-button>
                        <el-button type="warning" icon='edit' size="mini" @click='onEditPaper(scope.row.paperid,scope.row.user)'>编辑</el-button>
                        <el-button type="danger" icon='delete' size="mini" @click='removePaper(scope.row.paperid,scope.row.user)'>删除</el-button>
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
                    title="编辑或查看试题信息"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose">
                <section class="update">
                    <el-form ref="form" :model="formData" label-width="90px">
                        <el-form-item label="试卷编号">
                            <el-input v-model="formData.paperid" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="所属课程">
                            <el-input v-model="formData.course.couname" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="试卷总分">
                            <el-input v-model="formData.totalscore" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="组卷人">
                            <el-input v-model="formData.user":disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item :key="index"
                                      :label="domain.quesname+'数量'"
                                      v-if="domain.quesname!=null||look"
                                      :rules="rules"
                                      :disabled="true"
                                      v-for="(domain,index) in formData.quesNumberList">
                            <el-input   type="money"
                                        :disabled="true"
                                        v-if="domain.questypenum!==''||look"
                                        autocomplete="off"
                                        v-model.number="domain.questypenum">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="试卷描述">
                            <el-input type="textarea" rows="1" resize="none" v-model="formData.description":disabled="look"></el-input>
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
    import qs from 'qs'
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
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ]
                },
                tableData: [{
                    quesNumberlist:[]
                }],
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
                look:false,//用于查看时的操作
                pagination: {
                    //分页后的考试信息
                    current: 1, //当前页
                    total: null, //记录条数
                    size: 6, //每页条数
                },
                dialogVisible: false, //对话框
                formData: {
                    course:{
                        courseid:'',
                        couname:'',
                    },
                    quesNumberList:{
                        paperid:'',
                        quesname:'',
                        questypenum:'',
                    },
                }, //保存点击以后当前试卷的信息
                obj:{},//保存选择框中的对象
                select:{value:-1},//保存选择器中的信息
                courses: [],
                value: ''
            }
        },
        created() {
            this.getPaperInfo();
            this.getCourseInfo();
        },
        computed:{
        },
        methods: {
            async getCourseInfo() {
                //不分页查询所有课程信息
                this.$axios(`/api/courseInfo`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.courses.push({label:element.couname,value:element.courseid});
                    })
                    this.courses.push({label:"所有课程试卷",value:0});
                }).catch(error => {});
            },
            onScreeoutPaper(searchForm){
                this.$refs[searchForm].validate((valid) => {
                    this.$confirm('请输入正确的组卷人姓名，否则无法筛选', '提示').then(() => {
                        if (valid&&this.search_data.name!='') {
                            //按条件查询信息
                            this.$axios(`/api/paper_user/${this.search_data.name}`).then(res => {
                                this.pagination.total = res.data.data.length;
                                this.tableData = [];
                                for (var i = 0; i < res.data.data.length; i++) {
                                    this.tableData.push(res.data.data[i]);
                                }
                                this.loading = false;
                            }).catch(error => {
                            });
                        } else {
                            this.$message({
                                message: '无法进行筛选',
                                type: 'error'
                            })
                            this.getPaperInfo()
                        }
                    })
                })
            },
            getPaperInfo() {
                //分页查询所有试题信息
                this.$axios(`/api/papers/${this.pagination.current}/${this.pagination.size}`).then(res => {
                    this.pagination = res.data.data;
                    this.loading = false;
                    this.tableData = this.pagination.records;
                    this.pagination.current=1;
                }).catch(error => {});
            },
            //改变当前记录条数
            handleSizeChange(val) {
                this.pagination.size = val;
                this.getPaperInfo();
            },
            //改变当前页码，重新发送请求
            handleCurrentChange(val) {
                this.pagination.current = val;
                this.getPaperInfo();
            },
            //查看操作方法
            prePaper(paperid){
                this.dialogVisible = true;
                this.look=true;
                this.$axios(`/api/paper_detail/${paperid}`).then(res => {
                        this.formData = res.data.data
                })
            },
            // 编辑操作方法
            onEditPaper(paperid,user) { //修改试题信息
                this.look=false;
                var User=this.$cookies.get("cname")
                var Role=this.$cookies.get("role")
                if(User===user||Role==="0") {
                    this.dialogVisible = true
                    this.$axios(`/api/paper_paperid/${paperid}`).then(res => {
                        this.formData = res.data.data
                    })
                }else{
                    this.$message({
                        message: '您不是该试卷的组卷人或超级管理员，无法进行修改',
                        type: 'warning'
                    })
                    this.getPaperInfo()
                }
            },
            //删除操作方法
            removePaper(paperid,user) { //删除当前试题
                var User=this.$cookies.get("cname")
                var Role=this.$cookies.get("role")
                if(User===user||Role==="0") {
                    this.$confirm('确认删除该试卷吗?', '提示').then(() => {
                        this.$axios({
                            url: `/api/paper_del/${paperid}`,
                            method: 'delete',
                        }).then(res => {
                            this.$message({
                                message: res.data.message,
                                type: 'success'
                            })
                            this.getPaperInfo()
                        })
                    }).catch(() => {})
                }else{
                    this.$message({
                        message: '您不是该试卷的组卷人或超级管理员，无法进行删除',
                        type: 'warning'
                    })
                    this.getPaperInfo()
                }
            },
            //批量删除
            onBatchDelPaper(rows)
            {
                var ids = [];
                rows.forEach(element => {
                    ids.push(element.paperid)
                })
                const param = ids.join(','); // 把数组项拼接成字符串，以逗号,分隔
                this.$confirm('确定要批量删除所选试卷吗？此操作不可恢复', '提示').then(() => {
                    if (this.$cookies.get("role")==0) {
                        this.$axios({
                            url: `/api/paper/deleteByIds/${param}`,
                            method: 'delete',
                        }).then(res => {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                            this.getPaperInfo()
                        })
                    } else {
                        this.$message({
                            message: '您不是管理员，没有权限执行该操作！',
                            type: 'error'
                        })
                        this.getQuesInfo()
                    }
                }).catch(() => {
                })
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
            //获取下拉框中的值
            handleChange(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.courses.find((item)=>{
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                console.log(obj.label)//label值
                console.log(obj.value)//value值
                if(val==0){
                    this.getPaperInfo();
                }else {
                    this.$axios(`/api/paper_courseid/${val}`).then(res => {
                        this.pagination.total = res.data.data.length;
                        this.tableData = [];
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.tableData.push(res.data.data[i]);
                        }
                        this.loading = false;
                    })
                }
            },
            submit() { //提交更改
                var code;
                var param=this.formData;
                if(this.look==true){
                    this.dialogVisible = false;
                }else {
                    this.dialogVisible = false
                    this.$axios.put(`/api/paper_Update`, param)
                        .then(res => {
                            code = res.data.code
                            if (code == 200) {
                                this.$message({
                                    message: '更新成功',
                                    type: 'success'
                                })
                                this.getPaperInfo()
                            }
                        })
                }
            },
            handleClose(done) { //关闭提醒
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    }).catch(_ => {});
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