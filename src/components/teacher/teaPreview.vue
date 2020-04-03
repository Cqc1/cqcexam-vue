// 所有学生
<template>
    <div class="all">
        <el-table :data="form" align='center' height="450" border>
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
            <el-table-column align='center' label="是否批阅" width="120">
                <template slot-scope="scope">
                    <el-tag>{{scope.row.ispreview==1 ? "已批阅" : "未批阅"}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align='center' fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button @click="toPreview(scope.row.examid,scope.row.stuid)" type="warning" icon='edit' size="small">批阅</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form:[],
            };
        },
        created() {
            this.getScoreInfo();
        },
        methods: {
            getScoreInfo() {
                let examid = this.$route.query.examid
                //分页查询所有试卷信息
                this.$axios(`/api/score/selectByExamId/${examid}/${0}`).then(res => {
                    this.form = res.data.data;
                }).catch(error => {
                });
            },
            // 批阅试卷
            toPreview(examid,stuid) {
                this.$router.push({path: '/Preview', query:{examid: examid, stuid: stuid}})
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