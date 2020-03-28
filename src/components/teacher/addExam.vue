<!-- 添加考试 -->
<template>
    <section class="add">
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item  prop="institutionid" label="所属院系：">
                <el-select v-model="form.institutionid" @change="handleChange1" placeholder="请选择学院">
                    <el-option
                            v-for="item in Institutions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="courseid" label="所属课程：">
                <el-select v-model="form.courseid" @change="handleChange2" :placeholder="placeholder">
                    <el-option
                            v-for="item in Courses"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="majorid" label="所属专业：">
                <el-select v-model="form.majorid"  :placeholder="InstituHolder" @change="change()">
                    <el-option
                            v-for="item in Majors"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="paperid" label="试卷选择：">
                <el-select v-model="form.paperid" @change="change" :placeholder="placeholder2">
                    <el-option
                            v-for="item in Papers"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="majorsId" label="备考专业：">
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
            <el-form-item prop="exname" label="考试名称：">
                <el-input v-model="form.exname"></el-input>
            </el-form-item>
            <el-form-item prop="grade" label="年级：">
                <el-input v-model="form.grade"></el-input>
            </el-form-item>
            <el-form-item prop="term" label="学期：">
                <el-input v-model="form.term"></el-input>
            </el-form-item>
            <el-form-item prop="extime" label="考试时长：">
                <el-input v-model.number="form.extime"></el-input>
            </el-form-item>
            <el-form-item prop="exdate" label="考试日期：">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" format="yyyy-MM-dd"
                                    v-model="form.exdate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item prop="description" label="考试介绍：">
                <el-input type="textarea" rows="1" resize="none" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
                <el-button type="text" @click="cancel()">取消</el-button>
            </el-form-item>
        </el-form>
    </section>
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
                Majors:[],//专业下拉框
                majorValue: '',
                InstituHolder:'',
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
                rules: {
                    institutionid: [
                        { required: true, message: '请选择所属院系', trigger: 'blur' },
                    ],
                    courseid: [
                        { required: true, message: '请选择所属课程', trigger: 'blur' },
                    ],
                    majorid: [
                        { required: true, message: '请选择所属专业', trigger: 'blur' },
                    ],
                    paperid: [
                        { required: true, message: '请选择试卷', trigger: 'blur' },
                    ],
                    exname: [
                        { required: true, message: '请输入考试名称', trigger: 'blur' },
                    ],
                    grade: [
                        { required: true, message: '请输入年级', trigger: 'blur' },
                    ],
                    term: [
                        { required: true, message: '请输入学期', trigger: 'blur' },
                    ],
                    extime: [
                        { required: true, message: '请输入考试时长,单位为分钟', trigger: 'blur' },
                        { min: 3,type: 'number', message: '请输入大于0数字', trigger: 'blur' },
                    ],
                    exdate: [
                        { required: true, message: '请选择考试日期', trigger: 'blur' },
                    ],
                    description: [
                        { required: true, message: '请选择考试介绍', trigger: 'blur' },
                    ],
                },
                majorrop: {
                    multiple: true,
                    label: 'label',
                    value: 'value',
                    children: 'labelsList'
                },
                institutionList: [],
                Institutions: [],
                placeholder:'',
                placeholder2:'',
                Courses: [],
                Papers: [],
            };
        },
        created() {
            this.getInstitution();//获取学院
            this.getInstituAndMajor();
        },
        methods: {
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
            MajorsChange(value){
                /* this.$emit("changeMajorTree",value)*/
                console.log(this.form.majorsId)
                // 获取value值
                console.log(value)
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
            getInstitution() {
                //不分页查询所有学院信息
                this.$axios(`/api/institution/selectAll`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.Institutions.push({label: element.instituname, value: element.institutionid});
                    })
                }).catch(error => {
                });
            },
            //获取下拉框中的值
            handleChange1(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.Institutions.find((item)=>{
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                console.log(obj.label)//label值
                console.log(obj.value)//value值
                this.$axios(`/api/courses/selectByinstituteId/${val}`).then(res => {
                    this.Courses= [];
                    this.placeholder = "请选择";
                    if (res.data.data.length > 0) {
                        res.data.data.forEach(element => {
                            this.Courses.push({label: element.couname, value: element.courseid});
                        })
                        this.loading = false;
                        this.form.courseid=this.Courses[0].label
                        /* this.form.majorid = ''*/
                    } else {
                        this.form.courseid = ''
                        this.InstituHolder = "该院系下目前未设课程";
                    }
                })
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
            //获取下拉框中的值
            handleChange2(val){
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.Courses.find((item)=>{
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                console.log(obj.label)//label值
                console.log(obj.value)//value值
                if(this.form.courseid!='') {
                    this.$axios(`/api/paper_courseid/${val}`).then(res => {
                        this.Papers = [];
                        this.placeholder2 = "请选择试卷";
                        if (res.data.data.length > 0) {
                            res.data.data.forEach(element => {
                                this.Papers.push({label: element.description, value: element.paperid});
                            })
                            this.loading = false;
                            this.form.paperid = this.Papers[0].paperid
                            /* this.form.majorid = ''*/
                        } else {
                            this.form.paperid = ''
                            this.placeholder2 = "该课程下目前未组试卷";
                        }
                    })
                }else{
                    this.$message({
                        message: '请先选择课程',
                        type: 'error'
                    })
                }
            },
            change(){
                this.$forceUpdate()
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
            formatTime(date) { //日期格式化
                let year = date.getFullYear()
                let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                // 拼接
                return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
            },
            arrToStr( objarr ){// 将二维数组转换为字符串
                var arrLen = objarr.length;
                var row = "{";
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
                row+="}";
                return row;
            },
            onSubmit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let examDate = this.formatTime(this.form.exdate)
                        this.form.exdate = examDate.substr(0, 10)
                        this.form.majors=this.arrToStr(this.form.majorsId);
                        this.$axios(`/api/exam/OnlyExamId`).then(res => {
                            this.form.examId = res.data.data.examId + 1 //实现examId自增1
                            this.$axios({
                                url: '/api/exam/add',
                                method: 'post',
                                data: {
                                    ...this.form
                                }
                            }).then(res => {
                                if (res.data.code == 200) {
                                    this.$message({
                                        message: '新增考试成功',
                                        type: 'success'
                                    })
                                    this.$router.push({path: '/examManage'})
                                }else{
                                    this.$message({
                                        message: res.data.message,
                                        type: 'error'
                                    })
                                }
                            })
                        })
                    }
                })
            },
            cancel() { //取消按钮
                this.form = {}
            },

        },

    };
</script>
<style lang="scss" scoped>
    .add {
        padding: 0px 40px;
        width: 400px;
    }
</style>

