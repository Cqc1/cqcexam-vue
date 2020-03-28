// 所有学生
<template>
  <div class="all">
    <el-table :data="pagination.records" align='center' border>
      <el-table-column align='center' fixed="left" prop="stuid" label="学号" width="180"></el-table-column>
      <el-table-column align='center' prop="student.stuname" label="姓名" width="150"></el-table-column>
      <el-table-column align='center' prop="instituname" label="学院" width="150"></el-table-column>
      <el-table-column align='center' prop="major" label="专业" width="150"></el-table-column>
      <el-table-column align='center' prop="grade" label="年级" width="150"></el-table-column>
      <el-table-column align='center' prop="claname" label="班级" width="100"></el-table-column>
      <el-table-column align='center' prop="description" label="试卷" width="150"></el-table-column>
      <el-table-column align='center' prop="objscore" label="客观得分" width="80"></el-table-column>
      <el-table-column align='center' prop="subscore" label="主观得分" width="80"></el-table-column>
      <el-table-column align='center' prop="totalscore" label="总分" width="80"></el-table-column>
      <el-table-column align='center' prop="student.sex" label="性别" width="50"></el-table-column>
      <el-table-column align='center' prop="student.tel" label="联系方式" width="120"></el-table-column>
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
            <el-input v-model="form.description" :disabled="true"></el-input>
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
export default {
  data() {
    return {
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
