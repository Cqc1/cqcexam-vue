import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login', //登录界面
    component: () => import('@/components/common/login')
  },
  {
    path: '/index', //管理员教师主页
    component: () => import('@/components/admin/index'),
    children: [
      {
        path: '/', //首页默认路由
        component: () => import('@/components/common/hello')
      },
      // {
      //   path:'/grade', //学生成绩
      //   component: () => import('@/components/charts/grade')
      // },
      // {
      //   path: '/selectExamToPart', //学生分数段
      //   component: () => import('@/components/teacher/selectExamToPart')
      // },
      // {
      //   path: '/scorePart',
      //   component: () => import('@/components/charts/scorePart')
      // },
      // {
      //   path: '/allStudentsGrade', //所有学生成绩统计
      //   component: () => import('@/components/teacher/allStudentsGrade')
      // },
      // {
      //   path: '/examDescription', //考试管理功能描述
      //   component: () => import('@/components/teacher/examDescription')
      // },
      // {
      //   path: '/selectExam', //查询所有考试
      //   component: () => import('@/components/teacher/selectExam')
      // },
      // {
      //   path: '/addExam', //添加考试
      //   component: () => import('@/components/teacher/addExam')
      // },
      {
        path: '/quesTypeManage', //题库管理功能介绍
        component: ()=> import('@/components/teacher/quesTypeManage')
      },
      {
        path: '/quesManage', //查询所有题库
        component: () => import('@/components/teacher/quesManage')
      },
      {
        path: '/addQues', //增加题库主界面
        component: () => import('@/components/teacher/addQues')
      },
      {
        path: '/courseManage', //课程管理界面
        component: () => import('@/components/teacher/courseManage')
      },
      {
        path: '/addCourse', //添加课程界面
        component: () => import('@/components/teacher/addCourse')
      },
      {
        path: '/paperManage', //试卷管理界面
        component: () => import('@/components/teacher/paperManage')
      },
      {
        path: '/addPaper', //添加试卷界面
        component: () => import('@/components/teacher/addPaper')
      },
      {
        path: '/studentManage', //学生管理界面
        component: () => import('@/components/teacher/studentManage')
      },
      {
        path: '/addStudent', //添加学生
        component: () => import('@/components/teacher/addStudent')
      },
      {
        path: '/teacherManage',
        component: () => import('@/components/admin/teacherManage')
      },
      {
        path: '/addTeacher',
        component: () => import ('@/components/admin/addTeacher')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
