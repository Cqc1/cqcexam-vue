<template>
    <div class="fillcontain">
        <div class="search_container searchArea">
            <el-form
                    :inline="true"
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
                    <el-select v-model="majorValue" @change="handleChange2" :placeholder="instituHolder">
                        <el-option
                                v-for="item in majors"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <div class="searchWord el-form-item">
                        <el-input class="el-form-item__content search-input" v-model="search" placeholder="请输入搜索内容">
                        </el-input>
                        <i class="el-icon-search search-icon"></i>
                    </div>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button type="primary" size ="mini" icon="view" @click='onBatchDelClazz(sels)' :disabled="this.sels.length === 0||this.disabled" >批量删除</el-button>
                    <el-button type="success" size ="mini" icon="view">导出Elcel</el-button>
                    <el-button type="primary" size ="mini" icon="view" @click='onAddClazz()'>添加</el-button>
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
                <el-table-column v-if="idFlag" prop="clazzid" label="clazzid" align='center'>
                </el-table-column>
                <el-table-column type="selection" align='center'>
                </el-table-column>
                <el-table-column prop="clazzid" label="班级编号" align='center'>
                </el-table-column>
                <el-table-column prop="calname" label="班级名称" align='center'>
                </el-table-column>
                <el-table-column prop="major.major" label="所属专业" align='center'>
                </el-table-column>
                <el-table-column prop="operation" align='center' label="操作" width="180">
                    <template slot-scope='scope'>
                        <el-button type="warning" icon='edit' size="mini" @click='onEditClazz(scope.row.clazzid)'>编辑</el-button>
                        <el-button type="danger" icon='delete' size="mini" @click='removeClazz(scope.row.clazzid)'>删除</el-button>
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
                    title="编辑或添加班级信息"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose">
                <section class="update">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item v-if="add" label="班级编号">
                            <el-input v-model="form.clazzid" v-if="add" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item v-if="edit" label="所属院系">
                            <el-select v-model="InstituValue" v-if="edit" @change="handleChange3" placeholder="请选择学院">
                                <el-option
                                        v-for="item in Institutions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="edit" label="所属专业">
                            <el-select v-model="form.majorid" v-if="edit" :placeholder="InstituHolder" @change="change()">
                                <el-option
                                        v-for="item in Majors"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="班级名称">
                            <el-input v-model="form.calname"></el-input>
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
                institutions:[],//学院下拉框
                Institutions:[],//学院下拉框
                instituValue: '',
                InstituValue: '',
                majors:[],//专业下拉框
                Majors:[],//专业下拉框
                majorValue: '',
                instituHolder:'',
                InstituHolder:'',
                tableData: [],
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
                form: {
                    clazzid:null,
                    calname:null,
                    institutionid:null,
                    majorid:null,
                }, //保存点击以后当前试卷的信息
                search:'',//用于模糊查询
            }
        },
        created() {
            this.getClazzInfo();
            this.getInstitution();//获取学院
            this.getInstitution2();//获取学院
            this.getMajor();  //获取专业
        },
        computed:{
        },
        methods: {
            getInstitution(){
                //不分页查询所有学院信息
                this.$axios(`/api/institution/selectAll`).then(res => {
                    this.loading = false;
                    res.data.data.forEach(element => {
                        this.institutions.push({label:element.instituname,value:element.institutionid});
                    })
                    this.institutions.push({label:"所有学院的专业",value:0});
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
                    this.majors = [];
                    this.getMajor();  //获取专业
                } else {
                    this.$axios(`/api/major/selectInstitu/${val}`).then(res => {
                        this.majors = [];
                        this.instituHolder = "请选择";
                        if (res.data.data.length > 0) {
                            res.data.data.forEach(element => {
                                this.majors.push({label: element.major, value: element.majorid});
                            })
                            this.loading = false;
                            /*this.majorValue=this.majors[0].label*/
                            this.majorValue = ''
                        } else {
                            this.majorValue = ''
                            this.instituHolder = "该院系下目前未设专业";
                        }
                    })
                }
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
            handleChange2(val){
                this.search=''
                //传进来的val是select组件选中的value值
                let obj = {}; //用来存储下拉框中的对象
                obj = this.majors.find((item)=>{
                    return item.value === val;
                });
                //obj 就是被选中的那个对象，也就能拿到label值了。
                console.log(obj.label)//label值
                console.log(obj.value)//value值
                // this.select=obj;
                if(val==0){
                    this.getClazzInfo();
                }else {
                    this.$axios(`/api/clazz/selectByMajor/${val}`).then(res => {
                        this.pagination.total = res.data.data.length;
                        this.tableData = [];
                        for (var i = 0; i < res.data.data.length; i++) {
                            this.tableData.push(res.data.data[i]);
                        }
                        this.loading = false;
                    })
                }
            },
            //获取下拉框中的值
            handleChange3(val){
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
                            this.form.majorid=this.Majors[0].label
                           /* this.form.majorid = ''*/
                        } else {
                            this.form.majorid = ''
                            this.InstituHolder = "该院系下目前未设专业";
                        }
                    })
            },
            change(val){
               /* console.log('操作人选中项发生变化', val)
                if (val) {
                    let obj = {}
                    obj = this.Majors.find(item => {
                        //这里的operateOption就是上面遍历的数据源
                        return item.value === val //筛选出匹配数据
                    })
                    this.$set(this.form, this.form.majorid, val.value)
                    this.form.major = obj.label
                    console.log('修改操作人名称', obj.label, obj.value)
                } else {
                    this.form.major = ''
                    this.$set(this.form, this.form.majorid, '')
                }*/
                this.$forceUpdate()
            },
            getClazzInfo() {
                //分页查询所有班级信息
                this.$axios(`/api/clazz/findAll/${this.pagination.current}/${this.pagination.size}`).then(res => {
                    this.pagination = res.data.data;
                    this.loading = false;
                    this.tableData=[];
                    this.tableData = this.pagination.records;
                }).catch(error => {});
            },
            //改变当前记录条数
            handleSizeChange(val) {
                this.pagination.size = val;
                this.getClazzInfo();
            },
            //改变当前页码，重新发送请求
            handleCurrentChange(val) {
                this.pagination.current = val;
                this.getClazzInfo();
            },
            // 编辑操作方法
            onEditClazz(clazzId) { //修改课程信息
                this.add=true
                this.edit=false
                this.dialogVisible = true
                this.$axios(`/api/clazz/select/${clazzId}`).then(res => {
                this.form = res.data.data
                })
            },
            //添加操作方法
            onAddClazz(){
              this.add=false;
              this.edit=true
              this.dialogVisible = true
              this.form={};
            },
            submit() { //提交更改
                this.dialogVisible = false
                if(this.add==false){
                    if(this.form.calname==null||this.form.majorid==null){
                        this.$message({
                            message: '添加失败！请输入班级专业以及班级名称',
                            type: 'error'
                        })
                    }else {
                        this.$axios({
                            url: '/api/clazz/add',
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
                            this.getClazzInfo();
                        })
                    }
                }else {
                    this.$axios({
                        url: '/api/clazz/update',
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
                        this.getClazzInfo();
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
            removeClazz(clazzId) { //删除当前班级
                this.$confirm('确认删除该记录吗?', '提示').then(() => {
                    this.$axios({
                        url: `/api/clazz/delete/${clazzId}`,
                        method: 'delete',
                    }).then(res => {
                        // console.log(res);
                        this.$message({
                            message: res.data.message,
                            type: 'success'
                        })
                        this.getClazzInfo();
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
            onBatchDelClazz(rows){
                var ids = [];
                rows.forEach(element =>{
                    ids.push(element.clazzid)
                    console.log("====="+element.clazzid);
                })
                const param = ids.join(','); // 把数组项拼接成字符串，以逗号,分隔
                this.$confirm('确定要删除选中的文件吗?','提示').then(() =>{
                    this.$axios({
                        url: `/api/clazz/deleteByIds/${param}`,
                        method: 'delete',
                    }).then(res => {
                        console.log(ids.clazzid);
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        console.log("====="+ids);
                        this.getClazzInfo()
                        this.pagination.current=1
                    })
                }).catch(() => {})
            },
        },
        computed: {
            // 模糊搜索
            tables() {
                if(this.search!=''){
                    /*this.instituValue=''*/
                    this.majorValue=''
                }
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