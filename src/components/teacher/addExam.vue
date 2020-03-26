<!-- 添加考试 -->
<template>
    <section class="add">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item  label="所属院系">
                <el-select v-model="form.institutionid" @change="handleChange1" placeholder="请选择学院">
                    <el-option
                            v-for="item in Institutions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="所属课程">
                <el-select v-model="form.courseid" @change="handleChange2" :placeholder="placeholder">
                    <el-option
                            v-for="item in Courses"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item  label="试卷选择">
                <el-select v-model="form.paperid" @change="change" :placeholder="placeholder2">
                    <el-option
                            v-for="item in Papers"
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
            <el-form-item label="试卷名称">
                <el-input v-model="form.source"></el-input>
            </el-form-item>
            <el-form-item label="介绍">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="所属学院">
                <el-input v-model="form.institute"></el-input>
            </el-form-item>
            <el-form-item label="所属专业">
                <el-input v-model="form.major"></el-input>
            </el-form-item>
            <el-form-item label="年级">
                <el-input v-model="form.grade"></el-input>
            </el-form-item>
            <el-form-item label="考试日期">
                <el-col :span="11">
                    <el-date-picker placeholder="选择日期" v-model="form.examDate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="持续时间">
                <el-input v-model="form.totalTime"></el-input>
            </el-form-item>
            <el-form-item label="总分">
                <el-input v-model="form.totalScore"></el-input>
            </el-form-item>
            <el-form-item label="考试类型">
                <el-input v-model="form.type"></el-input>
            </el-form-item>
            <el-form-item label="考生提示">
                <el-input type="textarea" v-model="form.tips"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit()">立即创建</el-button>
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
                form: { //表单数据初始化
                    source: null,
                    description: null,
                    institute: null,
                    major: null,
                    grade: null,
                    examDate: null,
                    totalTime: null,
                    totalScore: null,
                    type: null,
                    tips: null,
                    paperId: null,
                    majorsId:{}
                },
                majorrop: {
                    multiple: true,
                    label: 'instituname',
                    value: 'institutionid',
                    children: 'institunames'
                    /*lazy: true,
                    lazyLoad(node, resolve) {
                        setTimeout(() => {
                            if (node.level == 0) {
                                this.$axios.get(`/api/institution/selectAll`).then(response => {
                                    const institutions = response.data.map((value, i) => ({
                                        value: value.institutionsid,
                                        label: value.instituname,
                                        leaf: node.level >= 2
                                    }));
                                    resolve(institutions);
                                });
                            }
                            if (node.level == 1) {
                                this.$axios.get(`/api/major/selectInstitu/${node.value}`).then(response => {
                                    const majors = response.data.map((value, i) => ({
                                        value: value.majorid,
                                        label: value.major,
                                        leaf: node.level >= 2
                                    }));
                                    resolve(majors);
                                });
                            }
                            }, 100);
                    }*/


                },
                institutionList: [/*{
                    institutionid:'',
                    instituname:'',
                    majors: {
                        majorid: '',
                        major: '',
                    }
                }*/],
                /*majors:{
                    label:'majorid',
                    value:'major',
                },*/
                Institutions: [],
                placeholder:'',
                placeholder2:'',
                Courses: [],
                Papers: [],
            };
        },
        created() {
            this.getInstitution();//获取学院
        },
        methods: {
            MajorsChange(value){
                this.$emit("changeMajorTree",value)
            },
            getInstituAndMajor(){
                //不分页级联获取院系和专业
                this.$axios(`/api/institution/selectAllMajor`).then(res => {
                    this.loading = false;
                    this.institutionList=[];
                    this.institutionList=res.data.data;
                    /*console.log(this.institutionList)*/
                    //获取用户所拥有的系统
                    //element框架级联要求，层级的key需一样，用props绑定，变成json字符串，全局替换单词为另一个
                    let str = JSON.stringify(res.data.data).replace(/majorid/g,'institutionid')
                    str = str.replace(/major/g,'instituname')
                    this.institutionList = JSON.parse(str)
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
                            this.form.paperid = this.Papers[0].label
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
            onSubmit() {
                let examDate = this.formatTime(this.form.examDate)
                this.form.examDate = examDate.substr(0, 10)
                this.$axios(`/api/examManagePaperId`).then(res => {
                    this.form.paperId = res.data.data.paperId + 1 //实现paperId自增1
                    this.$axios({
                        url: '/api/exam',
                        method: 'post',
                        data: {
                            ...this.form
                        }
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.$message({
                                message: '数据添加成功',
                                type: 'success'
                            })
                            this.$router.push({path: '/selectExam'})
                        }
                    })
                })
            },
            cancel() { //取消按钮
                this.form = {}
            },


            formatCC() {
                let htmladd = document.createElement("bottom");
                htmladd.innerHTML = "确认";
                htmladd.className = "htmladd";
                htmladd.style.cssText =
                    "cursor: pointer;position: absolute;bottom: -35px;height: 35px;line-height:35px;width:100%;background:#fff;text-align: center;color:#606266;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);";
                let that = this;
                var el_l = document.querySelectorAll(".el-popper.el-cascader__dropdown.ticket_ccCascader");
                if (el_l.length > 0 && el_l.length == 1) {
                    var el = el_l[0];
                    if (!el.querySelector(".htmladd")) {
                        el.appendChild(htmladd);
                        var bo = el.querySelectorAll(".htmladd")[0];
                        bo.onclick = function() {
                            that.$refs.ccCascader.dropDownVisible = false;
                            let params = {
                                id: that.ticketObject.id,
                                cc: that.ticketOrder.cc
                            };
                            that.$axios
                                .put(that.$httpServer.updateTicketOrder, params)
                                .then(res => {
                                    if (res && res.data.code == "0") {
                                        that.$message1({
                                            message: "保存成功",
                                            type: "success",
                                            duration: 500
                                        });
                                        that.handleNodeClick(that.types, that.ticketObject.id);
                                        that.getTicketsNum();
                                    }
                                });
                        };
                    }
                }
            },
        },
        mounted() {
            this.getInstituAndMajor();  //级联获取院系和专业
            let that = this;
            setInterval(function() {
                document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                    el.onclick = function() {
                        if (this.previousElementSibling) this.previousElementSibling.click();
                    };
                });
            }, 1000);
            this.$nextTick(function() {
                that.formatCC();
            });
        },
        updated() {
            this.$nextTick(function() {
                this.formatCC();
            });
        }

    };
</script>
<style lang="scss" scoped>
    .add {
        padding: 0px 40px;
        width: 400px;
    }
</style>

