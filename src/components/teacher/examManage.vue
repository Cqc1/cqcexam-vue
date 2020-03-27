//查询所有考试
<template>
    <div class="fillcontain">
      <div class="search_container searchArea">
        <el-form
                :inline="true"
                ref="search_data"
                class="demo-form-inline search-form">
            <el-form-item>
                <div class="searchWord el-form-item">
                    <el-input class="el-form-item__content search-input" v-model="search" placeholder="请输入搜索内容">
                    </el-input>
                    <i class="el-icon-search search-icon"></i>
                </div>
            </el-form-item>
            <el-form-item class="btnRight">
                <el-button type="primary" size ="mini" icon="view" @click='onBatchDelExam(sels)' :disabled="this.sels.length === 0||this.disabled" >批量删除</el-button>
                <el-button type="success" size ="mini" icon="view">导出Elcel</el-button>
            </el-form-item>
        </el-form>
    </div>
        <div class="table_container">
    <el-table
            v-loading="loading"
            :data="tables"
            style="width: 100%"
            align='center'
            @selection-change="selsChange"
            ref="table"
            stripe :default-sort="{prop: 'createAt', order: 'descending'}"
    >
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="考试编号：">
                        <span>{{ props.row.examid }}</span>
                    </el-form-item>
                    <el-form-item label="试卷编号：">
                        <span>{{ props.row.paperid}}</span>
                    </el-form-item>
                    <el-form-item label="所属课程：">
                        <span>{{ props.row.course.couname }}</span>
                    </el-form-item>
                    <el-form-item label="年级：">
                        <span>{{ props.row.grade }}</span>
                    </el-form-item>
                    <el-form-item label="学期：">
                        <span>{{ props.row.term }}</span>
                    </el-form-item>
                    <el-form-item label="所属专业：">
                        <span>{{ props.row.major.major }}</span>
                    </el-form-item>
                    <el-form-item label="备考[院系,专业]编号：">
                        <span>{{ props.row.majors }}</span>
                    </el-form-item>
                    <el-form-item label="学院：">
                        <span>{{ props.row.institution.instituname}}</span>
                    </el-form-item>
                    <el-form-item label="考试时长：">
                        <span>{{ props.row.extime}}</span>
                    </el-form-item>
                    <el-form-item label="考试日期：">
                        <span>{{ props.row.exdate}}</span>
                    </el-form-item>
                    <el-form-item label="考试介绍：">
                        <span>{{ props.row.description}}</span>
                    </el-form-item>
                    <el-form-item label="是否已考：">
                        <span v-if="props.row.isexam==1">已考</span>
                        <span v-if="props.row.isexam==0">未考</span>
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>
        <el-table-column v-if="idFlag" prop="examid" label="examid" align='center'>
        </el-table-column>
        <el-table-column type="selection" align='center'>
        </el-table-column>
        <el-table-column
                label="所属课程"
                prop="course.couname">
        </el-table-column>
        <el-table-column
                label="考试介绍"
                prop="description">
        </el-table-column>
        <el-table-column
                label="所属学院"
                prop="institution.instituname">
        </el-table-column>
        <el-table-column
                label="所属专业"
                prop="major.major">
        </el-table-column>
        <el-table-column
                label="考试日期"
                prop="exdate">
        </el-table-column>
        <el-table-column prop="operation" align='center' label="操作" width="250">
            <template slot-scope='scope'>
                <el-button type="warning" icon='edit' size="mini" @click='onEditExam(scope.row.examid)'>编辑</el-button>
                <el-button type="danger" icon='delete' size="mini" @click='removeExam(scope.row.examid)'>删除</el-button>
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
                title="编辑考试安排信息"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <section class="update">
                <el-form ref="form" :model="form" label-width="90px">
                    <el-form-item label="考试编号：">
                        <el-input v-model="form.examid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="试卷编号：">
                        <el-input v-model="form.paperid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="所属课程：">
                        <el-input v-model="form.course.couname" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item  label="所属院系：">
                        <el-select v-model="InstituValue" @change="handleChange" placeholder="请选择学院">
                            <el-option
                                    v-for="item in Institutions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属专业：">
                        <el-select v-model="form.major.major"  :placeholder="InstituHolder" @change="change()">
                            <el-option
                                    v-for="item in Majors"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  label="备考专业">
                        <div class="block">
                            <el-cascader
                                    v-model="form.majorsId" placeholder="请选择学院专业" ref="Cascader"
                                    :options="institutionList" separator="/"
                                    :props="majorrop" expand-trigger="hover"
                                    @change="MajorsChange"
                                    clearable>
                            </el-cascader>
                        </div>
                    </el-form-item>
                    <el-form-item label="年级：">
                        <el-input v-model="form.grade"></el-input>
                    </el-form-item>
                    <el-form-item label="学期：">
                        <el-input v-model="form.term"></el-input>
                    </el-form-item>
                    <el-form-item label="考试时长：">
                        <el-input v-model="form.extime"></el-input>
                    </el-form-item>
                    <el-form-item label="考试日期：">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd"
                                            v-model="form.exdate" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="考试介绍：">
                        <el-input type="textarea" rows="1" resize="none" v-model="form.description"></el-input>
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
        props: {
            majorsId: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                majorrop: {
                    multiple: true,
                    label: 'label',
                    value: 'value',
                    children: 'labelsList'
                },
                institutionList: [/*{
                    institutionid:'',
                    instituname:'',
                    majors: {
                        majorid: '',
                        major: '',
                    }
                }*/],
                Institutions:[],//学院下拉框
                InstituValue: '',
                Majors:[],//专业下拉框
                majorValue: '',
                InstituHolder:'',
                tableData: null,
                sort: 'createAt',
                order: 'descending',
                sels: [],//选中显示的值
                disabled:true,
                loading:true,
                idFlag:false,
                add:false,//用于添加时的条件判断
                edit:true,//用于添加时的条件判断
                pagination: {
                    //分页后的考试信息
                    current: 1, //当前页
                    total: null, //记录条数
                    size: 6, //每页条数
                },
                dialogVisible: false, //对话框
                search:'',//用于模糊搜索
                form:{
                    examid:'',
                    paperid:'',
                    courseid:'',
                    grade:'',
                    term:'',
                    majors:'',
                    majorid:'',
                    majorsId:[],
                    institutionid:'',
                    extime:'',
                    exdate:'',
                    description:'',
                    isExam:'',
                    course:{
                        courseid:'',
                        couname:'',
                        institutionid:'',
                    },
                    major:{
                        majorid:'',
                        major:'',
                        institutionid:'',
                    },
                    institution:{
                        institutionid:'',
                        instuname:'',
                    }
                },
                checkDate:'',
                objarr:[],
            }
        },
        created() {
            this.getExamInfo();
            this.getInstitution2();//获取学院
            this.getMajor();  //获取专业
        },
        computed:{
        },
        methods: {
            getExamInfo(){
                //分页查询所有班级信息
                this.$axios(`/api/exam/findAll/${this.pagination.current}/${this.pagination.size}`).then(res => {
                    this.pagination = res.data.data;
                    this.loading = false;
                    this.tableData=[];
                    this.tableData = this.pagination.records;
                }).catch(error => {});
            },
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
            getInstitution2(){
                //不分页查询所有学院信息
                this.$axios(`/api/institution/selectAll`).then(res => {
                    this.loading = false;
                    this.Institutions=[];
                    res.data.data.forEach(element => {
                        this.Institutions.push({label:element.instituname,value:element.institutionid});
                    })
                }).catch(error => {});
            },
            getMajor(){
                //不分页查询所有专业信息
                this.$axios(`/api/major/selectAll`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.majors.push({label:element.major,value:element.majorid});
                        this.Majors.push({label:element.major,value:element.majorid});
                    })
                    this.majors.push({label:"所有专业",value:0});
                    this.instituHolder="请选择专业";
                }).catch(error => {});
            },
            //获取下拉框中的值
            handleChange(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.Institutions.find((item) => {
                    return item.value === val;
                });
                this.$axios(`/api/major/selectInstitu/${val}`).then(res => {
                    this.Majors = [];
                    this.InstituHolder = "请选择";
                    if (res.data.data.length > 0) {
                        res.data.data.forEach(element => {
                            this.Majors.push({label: element.major, value: element.majorid});
                        })
                        this.loading = false;
                        this.form.major.major=this.Majors[0].label
                        /* this.form.majorid = ''*/
                    } else {
                        this.form.major.major = ''
                        this.InstituHolder = "该院系下目前未设专业";
                    }
                })
            },
            getTreeData(data) {
                // 循环遍历json数据
                for (var i = 0; i < data.length; i++) {
                    data[i].disabled=false;
                    if (data[i].labelsList==null||data[i].labelsList.length < 1) {
                        // children若为空数组，则将children设为undefined
                        data[i].disabled=true;
                        data[i].labelsList = undefined;
                    } /*else {
                        // children若不为空数组，则继续 递归调用 本方法
                        this.getTreeData(data[i].institunames);
                    }*/
                }
                return data;
            },
            MajorsChange(value){    //获取级联数据
                /* this.$emit("changeMajorTree",value)*/
                console.log(this.form.majorsId)
                // 获取value值
                console.log(value)
               /* this.arrToStr( this.form.majorsId )*/
            },
            arrToStr( objarr ){
                var arrLen = objarr.length;
                var row = "[";
                for (var i = 0 ;i < arrLen ; i++){
                    row += "[";
                    for(var j = 0; j < objarr[i].length; j++){
                        row += objarr[i][j];
                        if(j < objarr[i].length-1){
                            row +=",";
                        }
                    }
                    row += "]";
                    if(i<arrLen-1){
                        row+=",";
                    }
                }
                row+="]";
                return row;
            },
          getInstituAndMajor(){
                //不分页级联获取院系和专业
                this.$axios(`/api/institution/selectAllMajor`).then(res => {
                    this.loading = false;
                    this.institutionList=[];
                    this.institutionList=res.data.data;
                    console.log(this.institutionList)
                    //获取用户所拥有的系统
                    //element框架级联要求，层级的key需一样，用props绑定，变成json字符串，全局替换单词为另一个
                    let str = JSON.stringify(res.data.data).replace(/institutionid/g,'value').replace(/instituname/g,'label')
                        .replace(/majorid/g,'value')
                        .replace(/major/g,'label')
                    /*.replace(/majorsList/g,'children')*/
                    this.institutionList = JSON.parse(str)
                    console.log(this.institutionList)
                    this.institutionList=this.getTreeData(this.institutionList);
                    console.log(this.institutionList)
                }).catch(error => {
                });
            },
            change(val){
                this.$forceUpdate()
            },
            //改变当前记录条数
            handleSizeChange(val) {
                this.pagination.size = val;
                this.getExamInfo();
            },
            //改变当前页码，重新发送请求
            handleCurrentChange(val) {
                this.pagination.current = val;
                this.getExamInfo();
            },
            // 编辑操作方法
            onEditExam(examId) { //修改课程信息
                this.dialogVisible = true
                this.$axios(`/api/exam/selectById/${examId}`).then(res => {
                    this.form = res.data.data
                    this.checkDate=this.form.exdate;
                })
                this.getInstituAndMajor();
                this.form.majorsId=eval(this.form.majors);
            },
            formatTime(date) { //日期格式化
                let year = date.getFullYear()
                let month= date.getMonth()+ 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                let day=date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                let hours=date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                let minutes=date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                let seconds=date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                // 拼接
                return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
            },
            submit() { //提交更改
                if(this.checkDate!=this.form.exdate) {
                    let examDate = this.formatTime(this.form.exdate)
                    this.form.exdate = examDate.substr(0, 10)
                }
                this.dialogVisible = false
                this.form.majors=this.arrToStr(this.form.majorsId);
                    this.$axios({
                        url: '/api/exam/update',
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
                        this.getExamInfo();
                })
            },
            handleClose(done) { //关闭提醒
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    }).catch(_ => {});
            },
            //删除操作方法
            removeExam(examId) { //删除当前班级
                this.$confirm('确认删除该记录吗?', '提示').then(() => {
                    this.$axios({
                        url: `/api/exam/delete/${examId}`,
                        method: 'delete',
                    }).then(res => {
                        // console.log(res);
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        })
                        this.getExamInfo();
                        this.pagination.current=1
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
            onBatchDelExam(rows){
                var ids = [];
                rows.forEach(element =>{
                    ids.push(element.examid)
                    console.log("====="+element.examid);
                })
                const param = ids.join(','); // 把数组项拼接成字符串，以逗号,分隔
                this.$confirm('确定要删除选中的文件吗?','提示').then(() =>{
                    this.$axios({
                        url: `/api/exam/deleteByIds/${param}`,
                        method: 'delete',
                    }).then(res => {
                        console.log(ids.examid);
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        console.log("====="+ids);
                        this.getExamInfo();
                        this.pagination.current=1
                    })
                }).catch(() => {})
            },
        },
        computed: {
            /*majorsId(){
                this.majorsId=eval(this.form.majors)
                return this.majorsId
            },*/
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
            }
        },
    }
</script>
<style lang="less" scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
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

