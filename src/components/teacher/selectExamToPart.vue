//查询所有考试跳转到分段页面
<template>
  <div class="exam">
    <el-table :data="pagination.records" align='center' border>
      <el-table-column align='center' fixed="left" prop="course.couname" label="所属课程" width="180"></el-table-column>
      <el-table-column align='center' prop="exname" label="考试名称" width="200"></el-table-column>
      <el-table-column align='center' prop="institution.instituname" label="所属学院" width="120"></el-table-column>
      <el-table-column align='center' prop="major.major" label="所属专业" width="200"></el-table-column>
      <el-table-column align='center' prop="grade" label="年级" width="100"></el-table-column>
      <el-table-column align='center' prop="exdate" label="考试日期" width="120"></el-table-column>
      <el-table-column align='center' prop="extime" label="持续时间" width="120"></el-table-column>
      <el-table-column align='center' prop="paper.totalscore" label="总分" width="120"></el-table-column>
      <el-table-column align='center' prop="description" label="考试介绍" width="120"></el-table-column>
      <el-table-column  align='center' fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="toPart(scope.row.examid,scope.row.exname)" type="primary" size="small">查看统计</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-sizes="[4, 8, 10, 20]"
      :page-size="pagination.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total" class="page">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {}, //保存点击以后当前试卷的信息
      pagination: { //分页后的考试信息
        current: 1, //当前页
        total: null, //记录条数
        size: 4 //每页条数
      },
      dialogVisible: false
    }
  },
  created() {
    this.getExamInfo()
  },
  methods: {
    getExamInfo() { //分页查询所有考试信息
      this.$axios(`/api/exam/findAll/${this.pagination.current}/${this.pagination.size}/${1}`).then(res => {
        this.pagination = res.data.data
      }).catch(error => {
      })
    },
    //改变当前记录条数
    handleSizeChange(val) {
      this.pagination.size = val
      this.getExamInfo()
    },
    //改变当前页码，重新发送请求
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getExamInfo()
    },
    toPart(examid,exname) { //跳转到分段charts页面
      this.$router.push({path: '/scorePart', query:{examid: examid, exname: exname}})
    }
  },
};
</script>
<style lang="scss" scoped>
.exam {
  padding: 0px 40px;
  .page {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edit{
    margin-left: 20px;
  }
}
</style>
