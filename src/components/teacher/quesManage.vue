//查询所有题库
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
                    <el-select v-model="instituValue" @change="handleChange1" placeholder="请选择学院">
                        <el-option
                                v-for="item in institutions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="Value" @change="handleChange2" :placeholder="placeholder">
                        <el-option
                                v-for="item in courses"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="value" @change="handleChange3" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-input v-model="search_data.name"  placeholder="题目信息关键字"  @keyup.enter.native='onScreeoutQues("search_data")'></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="mini" icon="search" @click='onScreeoutQues("search_data")'>筛选</el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="primary" size ="mini" icon="view" @click='onBatchDelQues(sels,select.value)' :disabled="(this.sels.length === 0&&(this.select.value===0||this.select.value===-1))||this.disabled" >批量删除</el-button>
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
                    border
                    height="450"
                    stripe :default-sort="{prop: 'createAt', order: 'descending'}"
            >
                <el-table-column v-if="idFlag" prop="quesid" label="quesid" align='center'>
                </el-table-column>
                <el-table-column type="selection" align='center'>
                </el-table-column>
                <el-table-column prop="couname" label="所属课程" align='center' width="200">
                </el-table-column>
                <el-table-column prop="question" label="题目信息" align='center' width="300">
                </el-table-column>
                <el-table-column prop="chapter" label="所属章节" align='center'>
                </el-table-column>
                <el-table-column prop="type" label="题目类型" align='center'>
                </el-table-column>
                <el-table-column prop="score" label="试题分数" align='center'>
                </el-table-column>
                <el-table-column prop="level" label="难度等级" align='center'>
                </el-table-column>
                <el-table-column prop="operation" align='center' label="操作" width="250">
                    <template slot-scope='scope'>
                        <el-button type="primary" size ="mini" icon="view" @click='preQues(scope.row.quesid,scope.row.questype)'>详情</el-button>
                        <el-button type="warning" icon='edit' size="mini" @click='onEditQues(scope.row.quesid,scope.row.questype)'>编辑</el-button>
                        <el-button type="danger" icon='delete' size="mini" @click='removeQues(scope.row.quesid,scope.row.questype)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    v-if="isPagination"
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
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="试题编号">
                            <el-input v-model="form.quesid" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="所属课程">
                            <el-input v-model="form.course.couname" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="题目信息">
                            <el-input type="textarea" rows="1" resize="none" v-model="form.question" :disabled="this.look"></el-input>
                        </el-form-item>
                        <el-form-item v-if="form.questype==1||form.questype==2" label="选项A">
                            <el-input type="textarea" rows="1" resize="none" v-model="form.optiona":disabled="this.look"></el-input>
                        </el-form-item>
                        <el-form-item v-if="form.questype==1||form.questype==2" label="选项B">
                            <el-input type="textarea" rows="1" resize="none" v-model="form.optionb":disabled="this.look"></el-input>
                        </el-form-item>
                        <el-form-item v-if="form.questype==1||form.questype==2" label="选项C">
                            <el-input type="textarea" rows="1" resize="none" v-model="form.optionc":disabled="this.look"></el-input>
                        </el-form-item>
                        <el-form-item v-if="form.questype==1||form.questype==2" label="选项D">
                            <el-input type="textarea" rows="1" resize="none" v-model="form.optiond":disabled="this.look"></el-input>
                        </el-form-item>
                        <el-form-item label="试题答案">
                            <el-input type="textarea" rows="1" resize="none" v-model="form.answer":disabled="this.look"></el-input>
                        </el-form-item>
                        <el-form-item label="试题解析">
                            <el-input type="textarea" rows="1" resize="none" v-model="form.analysis":disabled="this.look"></el-input>
                        </el-form-item>
                        <el-form-item label="试题分值">
                            <el-input v-model="form.score":disabled="this.look"></el-input>
                        </el-form-item>
                        <el-form-item label="所属章节">
                            <el-input v-model="form.chapter":disabled="this.look"></el-input>
                        </el-form-item>
                        <el-form-item label="难度等级">
                            <el-input v-model="form.level":disabled="this.look"></el-input>
                        </el-form-item>
                    </el-form>
                </section>
                <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit(form.questype)">确 定</el-button>
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
                institutions:[],//学院下拉框
                instituValue: '',
                placeholder:'',
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
                isPagination:true,
                look: false,//便于编辑与查看时状态的转换
                pagination: {
                    //分页后的考试信息
                    current: 1, //当前页
                    total: null, //记录条数
                    size: 6, //每页条数
                },
                dialogVisible: false, //对话框
                form: {
                    course:{},
                }, //保存点击以后当前试卷的信息
                obj:{},//保存选择框中的对象
                select:{value:-1},//保存选择器中的信息
                options: [],     //试题类型信息
                courses: [],       //试题所属科目
                Value:'',//课程值
                value: ''
            }
        },
        created() {
            this.getQuesInfo();
            this.getQuesTypeInfo();
            this.getCourseInfo();
            this.getInstitution();//获取学院
        },
        computed:{
        },
        methods: {
            async getQuesTypeInfo() {
                //不分页查询所有试题类型信息
                this.$axios(`/api/questypeInfo`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.options.push({label:element.quesname,value:element.questype});
                    })
                    this.options.push({label:"所有试题",value:0});
                }).catch(error => {});
            },
            async getCourseInfo() {
                //不分页查询所有课程信息
                this.$axios(`/api/courseInfo`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.courses.push({label:element.couname,value:element.courseid});
                    })
                    this.courses.push({label:"所有课程试题",value:0});
                }).catch(error => {});
            },
            onScreeoutQues(searchForm){
                this.$refs[searchForm].validate((valid) => {
                    this.$confirm('请通过试题类型筛选后才可以进一步筛选，否则无法筛选', '提示').then(() => {
                        if (valid && this.select.value != -1) {
                            //按条件查询信息
                            this.$axios(`/api/ques_scr/${this.search_data.name}/${this.select.value}`).then(res => {
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
                            this.getQuesInfo()
                                }
                            })
                    })
            },
            getQuesInfo() {
                //分页查询所有试题信息
                this.$axios(`/api/ques_all/${this.pagination.current}/${this.pagination.size}`).then(res => {
                    this.pagination = res.data.data;
                    this.loading = false;
                    this.tableData = this.pagination.records;
                    this.isPagination=true;
                }).catch(error => {});
            },
            //改变当前记录条数
            handleSizeChange(val) {
                this.pagination.size = val;
                this.getQuesInfo();
            },
            //改变当前页码，重新发送请求
            handleCurrentChange(val) {
                this.pagination.current = val;
                this.getQuesInfo();
            },
            //查看操作方法
            preQues(quesid,type){
                this.dialogVisible = true;
                this.look=true;
                this.$axios(`/api/ques_pre/${quesid}/${type}`).then(res => {
                    this.form = res.data.data
                })
            },
            // 编辑操作方法
            onEditQues(quesid,type) { //修改试题信息
                this.look=false;
                this.dialogVisible = true
                this.$axios(`/api/ques_pre/${quesid}/${type}`).then(res => {
                    this.form = res.data.data
                })
            },
            //删除操作方法
            removeQues(quesid,questype) { //删除当前试题
                var code;
                this.$confirm('是否删除当前试题信息', '提示').then(() => {
                    if (questype == "1") {
                        this.$axios.delete(`/api/sing_del/${quesid}`)
                            .then(res => {
                                code = res.data.code
                                if (code == 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                    this.pagination.current=1;
                                }
                            })
                    } else if (questype == "2") {
                        this.$axios.delete(`/api/mult_del/${quesid}`)
                            .then(res => {
                                code = res.data.code
                                if (code == 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                    this.pagination.current=1;
                                }
                            })
                    } else if (questype == "3") {
                        this.$axios.delete(`/api/fill_del/${quesid}`)
                            .then(res => {
                                code = res.data.code
                                if (code == 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                    this.pagination.current=1;
                                }
                            })
                    } else if (questype == "4") {
                        this.$axios.delete(`/api/judge_del/${quesid}`)
                            .then(res => {
                                code = res.data.code
                                if (code == 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                    this.pagination.current=1;
                                }
                            })
                    } else {
                        this.$axios.delete(`/api/short_del/${quesid}`)
                            .then(res => {
                                code = res.data.code
                                if (code == 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                    this.pagination.current=1;
                                }
                            })
                    }
                }).catch(() => {
                })
            },
            //批量删除
            onBatchDelQues(rows,value)
                {
                    var ids = [];
                    rows.forEach(element => {
                        ids.push(element.quesid)
                        console.log("=====" + value);
                    })
                    value=this.select.value
                    const param = ids.join(','); // 把数组项拼接成字符串，以逗号,分隔
                    console.log(param+this.select.value)
                    this.$confirm('请通过试题类型筛选后才可以进行批量删除，否则无法删除', '提示').then(() => {
                        if (this.select.value != -1&&this.select.value != 0) {
                            this.$axios({
                                url: `/api/ques_del/deleteByIds/${param}/${this.select.value}`,
                                method: 'delete',
                            }).then(res => {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                })
                                console.log("=====" + ids);
                                //按类型条件查询信息
                                this.$axios(`/api/ques/selectBytype/${this.select.value}`).then(res => {
                                    this.pagination.total = res.data.data.length;
                                    this.tableData = [];
                                    for (var i = 0; i < res.data.data.length; i++) {
                                        this.tableData.push(res.data.data[i]);
                                    }
                                    this.loading = false;
                                })
                            })
                        } else {
                            this.$message({
                                message: '删除不成功',
                                type: 'error'
                            })
                            console.log("=====" + ids);
                            this.getQuesInfo()
                            this.pagination.current=1;
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
            getInstitution(){
                //不分页查询所有学院信息
                this.$axios(`/api/institution/selectAll`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.institutions.push({label:element.instituname,value:element.institutionid});
                    })
                    this.institutions.push({label:"所有学院的课程",value:0});
                }).catch(error => {});
            },
            //获取下拉框中的值
            handleChange1(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.institutions.find((item) => {
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                console.log(obj.label)//label值
                console.log(obj.value)//value值
                // this.select=obj;
                if (val == 0) {
                    this.courses = [];
                    this.getCourseInfo();  //获取课程
                } else {
                    this.$axios(`/api/courses/selectByinstituteId/${val}`).then(res => {
                        this.courses = [];
                        this.placeholder = "请选择";
                        if (res.data.data.length > 0) {
                            res.data.data.forEach(element => {
                                this.courses.push({label: element.couname, value: element.courseid});
                            })
                            this.loading = false;
                            /*this.majorValue=this.majors[0].label*/
                            this.Value = ''
                        } else {
                            this.value = ''
                            this.placeholder = "该院系下目前未设课程";
                        }
                    })
                }
            },
            //获取下拉框中的值
            handleChange2(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.courses.find((item)=>{
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                console.log(obj.label)//label值
                console.log(obj.value)//value值
                // this.select=obj;
                if(val==0){
                    this.getQuesInfo();
                    this.value=''
                }else {
                    this.$axios(`/api/ques/selectBycourse/${val}`).then(res => {
                        this.pagination.total = res.data.data.length;
                        this.tableData = [];
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.tableData.push(res.data.data[i]);
                        }
                        this.loading = false;
                    })
                    this.value=''
                    this.isPagination=false;
                }
            },
            handleChange3(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.options.find((item)=>{
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                console.log(obj.label)//label值
                console.log(obj.value)//value值
                this.select=obj;
                this.Value=''
                if(val==0){
                    this.getQuesInfo();
                }else {
                    this.$axios(`/api/ques/selectBytype/${val}`).then(res => {
                        this.pagination.total = res.data.data.length;
                        this.tableData = [];
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.tableData.push(res.data.data[i]);
                        }
                        this.loading = false
                        this.isPagination=false;
                    })
                }
            },
            submit(questype) { //提交更改
                var code;
                var param=this.form;
                if(this.look==true){
                    this.dialogVisible = false;
                }else {
                    this.dialogVisible = false
                    if(questype=="1"){
                        this.$axios.put(`/api/sing_Update/${questype}`,param)
                            .then(res => {
                            code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '更新成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                }
                        })
                    }else if(questype=="2"){
                        this.$axios.put(`/api/mult_Update/${questype}`,param)
                            .then(res => {
                                code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '更新成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                }
                            })
                    }else if(questype=="3"){
                        this.$axios.put(`/api/fill_Update/${questype}`,param)
                            .then(res => {
                                code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '更新成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                }
                            })
                    }else if(questype=="4"){
                        this.$axios.put(`/api/judge_Update/${questype}`,param)
                            .then(res => {
                                code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '更新成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                }
                            })
                    }else{
                        this.$axios.put(`/api/short_Update/${questype}`,param)
                            .then(res => {
                                code=res.data.code
                                if(code==200){
                                    this.$message({
                                        message: '更新成功',
                                        type: 'success'
                                    })
                                    this.getQuesInfo()
                                }
                            })
                    }
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