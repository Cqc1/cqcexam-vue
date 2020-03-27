// 所有学生
<template>
  <div class="all">
    <el-table :data="pagination.records" border>
      <el-table-column fixed="left" prop="stuid" label="学号" width="180"></el-table-column>
      <el-table-column prop="student.stuname" label="姓名" width="150"></el-table-column>
      <el-table-column prop="institution" label="学院" width="150"></el-table-column>
      <el-table-column prop="major" label="专业" width="150"></el-table-column>
      <el-table-column prop="grade" label="年级" width="150"></el-table-column>
      <el-table-column prop="claname" label="班级" width="100"></el-table-column>
      <el-table-column prop="description" label="试卷" width="150"></el-table-column>
      <el-table-column prop="objscore" label="客观得分" width="80"></el-table-column>
      <el-table-column prop="subscore" label="主观得分" width="80"></el-table-column>
      <el-table-column prop="totalscore" label="总分" width="80"></el-table-column>
      <el-table-column prop="student.sex" label="性别" width="50"></el-table-column>
      <el-table-column prop="student.tel" label="联系方式" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!--<el-button @click="checkGrade(scope.row.stuid)" type="primary" size="mini">查看</el-button>-->
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
      class="page"
    ></el-pagination>
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
      }
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
    /*checkGrade(studentId) {
      this.$router.push({ path: "/grade", query: { studentId: studentId } });
    }*/
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
