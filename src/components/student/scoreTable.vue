//显示学生成绩
<template>
  <div class="table">
    <p class="title">我的分数</p>
    <section class="content">
      <el-table ref="filterTable" :data="score" v-loading="loading">
        <el-table-column
          prop="answerdate"
          label="考试日期"
          sortable
          width="300"
          column-key="answerdate"
          :filters="filter"
          :filter-method="filterHandler">
        </el-table-column>
        <el-table-column
          prop="exname"
          label="考试名称"
          width="300"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag>{{scope.row.exname}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalscore" label="考试分数" width="200"></el-table-column>
        <el-table-column label="是否及格" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.totalscore==null">{{"暂未出成绩"}}</el-tag>
            <el-tag v-if="scope.row.totalscore!=null" :type="scope.row.totalscore>= 60 ? 'success' : 'danger'">{{scope.row.totalscore >= 60 ? "及格" : "不及格"}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false, //加载标识符
      score: [], //学生成绩
      filter: null //过滤参数
    }
  },
  created() {
    this.getScore()
    this.loading = true //数据加载则遮罩表格
  },
  methods: {
    getScore() {
      let studentId = this.$cookies.get("cid")
      this.$axios(`/api/score/selectByStuId/${studentId}`).then(res => {
        if(res.data.code == 200) {
          this.loading = false //数据加载完成去掉遮罩
          this.score = res.data.data
          let mapVal = this.score.map((element,index) => { //通过map得到 filter:[{text,value}]形式的数组对象

            let newVal = {}
            newVal.text = element.answerdate
            newVal.value = element.answerdate
            return newVal
          })
          let hash = []
          const newArr = mapVal.reduce((item, next) => { //对新对象进行去重操作
            hash[next.text] ? '' : hash[next.text] = true && item.push(next);
            return item
          }, []);
          this.filter = newArr
        }else{
          this.loading = false //数据加载完成去掉遮罩
        }
      })
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  width: 980px;
  margin: 0 auto;
  .title {
    margin: 20px;
  }
  .content {
    background-color: #fff;
    padding: 20px;
  }
}
</style>
