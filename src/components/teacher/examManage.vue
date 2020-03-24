//查询所有考试
<template>
    <div class="fillcontain">
      <div class="search_container searchArea">
        <el-form
                :inline="true"
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
            <el-form-item>
                <div class="searchWord el-form-item">
                    <el-input class="el-form-item__content search-input" v-model="search" placeholder="请输入搜索内容">
                    </el-input>
                    <i class="el-icon-search search-icon"></i>
                </div>
            </el-form-item>
            <el-form-item class="btnRight">
                <el-button type="primary" size ="mini" icon="view"  >批量删除</el-button>
                <el-button type="success" size ="mini" icon="view">导出Elcel</el-button>
            </el-form-item>
        </el-form>
    </div>
        <div class="table_container">
    <el-table
            :data="tables"
            style="width: 100%">
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="考试编号">
                        <span>{{ props.row.examid }}</span>
                    </el-form-item>
                    <el-form-item label="试卷编号">
                        <span>{{ props.row.paperid}}</span>
                    </el-form-item>
                    <el-form-item label="所属课程">
                        <span>{{ props.row.course.couname }}</span>
                    </el-form-item>
                    <el-form-item label="年级">
                        <span>{{ props.row.grade }}</span>
                    </el-form-item>
                    <el-form-item label="学期">
                        <span>{{ props.row.term }}</span>
                    </el-form-item>
                    <el-form-item label="专业">
                        <span>{{ props.row.major }}</span>
                    </el-form-item>
                    <el-form-item label="学院">
                        <span>{{ props.row.institution}}</span>
                    </el-form-item>
                    <el-form-item label="考试时长">
                        <span>{{ props.row.extime}}</span>
                    </el-form-item>
                    <el-form-item label="考试日期">
                        <span>{{ props.row.exdate}}</span>
                    </el-form-item>
                    <el-form-item label="考试介绍">
                        <span>{{ props.row.description}}</span>
                    </el-form-item>
                    <el-form-item label="是否已考">
                        <span>{{ props.row.isexam}}</span>
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
                prop="institution">
        </el-table-column>
        <el-table-column
                label="所属专业"
                prop="major">
        </el-table-column>
        <el-table-column
                label="考试日期"
                prop="exDate">
        </el-table-column>
        <el-table-column prop="operation" align='center' label="操作" width="250">
            <template slot-scope='scope'>
                <el-button type="primary" size ="mini" icon="view" >备考考生id</el-button>
                <el-button type="warning" icon='edit' size="mini" >编辑</el-button>
                <el-button type="danger" icon='delete' size="mini" >删除</el-button>
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
                <el-form ref="form" :model="formData" label-width="90px">
                    <el-form-item label="考试编号">
                        <el-input v-model="formData.examid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="试卷编号">
                        <el-input v-model="formData.paperid" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="所属课程">
                        <el-input v-model="formData.course.couname" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="备考考生">
                        <el-input v-model="formData.stuid" ></el-input>
                    </el-form-item>
                    <el-form-item label="年级">
                        <el-input v-model="formData.grade"></el-input>
                    </el-form-item>
                    <el-form-item label="学期">
                        <el-input v-model="formData.grade"></el-input>
                    </el-form-item>
                    <el-form-item label="年级">
                        <el-input v-model="formData.grade"></el-input>
                    </el-form-item>
                    <el-form-item label="年级">
                        <el-input v-model="formData.grade"></el-input>
                    </el-form-item>
                    <el-form-item label="年级">
                        <el-input v-model="formData.grade"></el-input>
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
    export default {
        data() {
            return {
                tableData: null,
                courses: [],
                value: '',
                search:'',//用于模糊搜索
            }
        },
        created() {
            // this.getExamInfo();
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

