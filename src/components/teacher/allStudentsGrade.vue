// 所有学生
<template>
  <div class="all">
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
          <el-button type="primary" size ="mini" icon="view" @click='onBatchDelScore(sels)' :disabled="this.sels.length === 0||this.disabled" >批量删除</el-button>
          <el-button type="success" size ="mini" icon="view" @click="downloadList">导出Elcel</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
            id="outTable"
            v-loading="loading"
            :data="tables" style="width: 100%"
            align='center'
            @selection-change="selsChange"
            ref="table"
            stripe :default-sort="{prop: 'createAt', order: 'descending'}">
      <el-table-column v-if="idFlag" prop="scoreid" label="scoreid" align='center'>
      </el-table-column>
      <el-table-column type="selection" align='center'>
      </el-table-column>
      <el-table-column align='center' fixed="left" prop="stuid" label="学号" width="180"></el-table-column>
      <el-table-column align='center' prop="student.stuname" label="姓名" width="150"></el-table-column>
      <el-table-column align='center' prop="instituname" label="学院" width="150"></el-table-column>
      <el-table-column align='center' prop="major" label="专业" width="150"></el-table-column>
      <el-table-column align='center' prop="grade" label="年级" width="150"></el-table-column>
      <el-table-column align='center' prop="claname" label="班级" width="100"></el-table-column>
      <el-table-column align='center' prop="exname" label="试卷" width="150"></el-table-column>
      <el-table-column align='center' prop="objscore" label="客观得分" width="80"></el-table-column>
      <el-table-column align='center' prop="subscore" label="主观得分" width="80"></el-table-column>
      <el-table-column align='center' prop="totalscore" label="总分" width="80"></el-table-column>
      <el-table-column align='center' prop="student.sex" label="性别" width="50"></el-table-column>
      <el-table-column align='center' prop="student.tel" label="联系方式" width="120"></el-table-column>
      <el-table-column align='center' label="是否批阅" width="120">
        <template slot-scope="scope">
          <el-tag>{{scope.row.ispreview== 1 ? "已批阅" : "未批阅"}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align='center' fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="warning" icon='edit' size="mini" @click='onEditScore(scope.row.scoreid)'>编辑</el-button>
          <el-button type="danger" icon='delete' size="mini" @click='removeScore(scope.row.scoreid)'>删除</el-button>
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
      class="page"
    ></el-pagination>
    <!-- 编辑对话框-->
    <el-dialog
            title="编辑成绩信息"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
      <section class="update">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="成绩编号：">
            <el-input v-model="form.scoreid" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="考生学号：">
            <el-input v-model="form.stuid" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="考试编号：">
            <el-input v-model="form.examid" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="考试名称：">
            <el-input type="textarea" rows="1" resize="none" v-model="form.exname" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客观题得分：">
            <el-input v-model="form.objscore" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="主观题得分：">
            <el-input v-model="form.subscore"></el-input>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
export default {
  data() {
    return {
      tableData: [],
      sort: 'createAt',
      order: 'descending',
      sels: [],//选中显示的值
      disabled:true,
      loading:true,
      idFlag:false,
      search:'',//用于模糊查询
      pagination: {
        //分页后的考试信息
        current: 1, //当前页
        total: null, //记录条数
        size: 6 //每页条数
      },
      dialogVisible: false, //对话框
      form:{
      },
    };
  },
  created() {
    this.getScoreInfo();
  },
  methods: {
    getScoreInfo() {
      //分页查询所有试卷信息
      this.$axios(`/api/score/findAll/${this.pagination.current}/${this.pagination.size}`).then(res => {
        this.pagination = res.data.data;
        this.loading = false;
        this.tableData=[];
        this.tableData = this.pagination.records;
      }).catch(error => {});
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getScoreInfo();
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getScoreInfo();
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
              .then(_ => {
                done();
              }).catch(_ => {});
    },
    // 编辑操作方法
    onEditScore(scoreId) { //修改分数信息
      this.dialogVisible = true
      this.$axios(`/api/score/selectById/${scoreId}`).then(res => {
        this.form = res.data.data
      })
    },
    //导出
    downloadList:function(){
      let vb = XLSX.utils.table_to_book(document.getElementById('outTable'));
      let vbout = XLSX.write(vb, {bookType: 'xlsx', bookSST: true, type: 'array'});
      try {
        FileSaver.saveAs(new Blob([vbout], {type: 'application/octet-stream'}), '所有学生成绩名单.xlsx');
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, vbout);
      }
      return vbout;
    },
    submit() { //提交更改
      this.dialogVisible = false
      this.form.totalscore=(this.form.objscore-0)+(this.form.subscore-0)
      this.$axios({
        url: '/api/score/update',
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
        this.getScoreInfo();
      })
    },
    //批量删除
    onBatchDelScore(rows){
      var ids = [];
      rows.forEach(element =>{
        ids.push(element.scoreid)
        console.log("====="+element.scoreid);
      })
      const param = ids.join(','); // 把数组项拼接成字符串，以逗号,分隔
      this.$confirm('确定要删除选中的文件吗?','提示').then(() =>{
        this.$axios({
          url: `/api/score/deleteByIds/${param}`,
          method: 'delete',
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          console.log("====="+ids);
          this.pagination.current=1;
          this.getScoreInfo()
        })
      }).catch(() => {})
    },
    //删除操作方法
  removeScore(scoreId) { //删除当前班级
      this.$confirm('确认删除该记录吗?', '提示').then(() => {
        this.$axios({
          url: `/api/score/delete/${scoreId}`,
          method: 'delete',
        }).then(res => {
          // console.log(res);
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          this.getScoreInfo();
          this.pagination.current=1
        })
      }).catch(() => {})
    },
    handleClose(done) { //关闭提醒
      this.$confirm('确认关闭？')
              .then(_ => {
                done();
              }).catch(_ => {});
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
};
</script>
<style lang="scss" scoped>
.all {
  padding: 0px 40px;
  .page {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edit {
    margin-left: 20px;
  }
  .el-table tr {
    background-color: #dd5862 !important;
  }
}
.el-table .warning-row {
  background: #000 !important;
}

.el-table .success-row {
  background: #dd5862;
}
</style>
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
