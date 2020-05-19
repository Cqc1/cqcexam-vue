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
    meta:{
      loginRequest:true
    },
    children: [
      {
        path: '/', //首页默认路由
        component: () => import('@/components/common/hello'),
        meta:{
          loginRequest:true
        },
      },
      {path: '/managerPwd', component: () => import('@/components/common/manager'),meta:{
          loginRequest:true
        },},
       /* 成绩管理模块*/
      {
        path:'/paperReview', //成绩批阅
        component: () => import('@/components/teacher/paperReview'),
        meta:{
          loginRequest:true
        },
      },
      {
        path:'/teaPreview', //学生成绩批阅
        component: () => import('@/components/teacher/teaPreview'),
        meta:{
          loginRequest:true
        },
      },
      {
        path:'/Preview', //学生成绩批阅
        component: () => import('@/components/teacher/Preview'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/selectExamToPart', //学生分数段
        component: () => import('@/components/teacher/selectExamToPart'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/scorePart',
        component: () => import('@/components/charts/scorePart'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/allStudentsGrade', //所有学生成绩统计
        component: () => import('@/components/teacher/allStudentsGrade'),
        meta:{
          loginRequest:true
        },
      },
       /* 考试管理模块*/
      {
        path: '/examManage', //查询所有考试
        component: () => import('@/components/teacher/examManage'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/addExam', //添加考试
        component: () => import('@/components/teacher/addExam'),
        meta:{
          loginRequest:true
        },
      },
       /* 题库管理模块*/
      {
        path: '/quesTypeManage', //题库管理功能介绍
        component: ()=> import('@/components/teacher/quesTypeManage'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/quesManage', //查询所有题库
        component: () => import('@/components/teacher/quesManage'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/addQues', //增加题库主界面
        component: () => import('@/components/teacher/addQues'),
        meta:{
          loginRequest:true
        },
      },
       /* 课程管理模块*/
      {
        path: '/courseManage', //课程管理界面
        component: () => import('@/components/teacher/courseManage'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/addCourse', //添加课程界面
        component: () => import('@/components/teacher/addCourse'),
        meta:{
          loginRequest:true
        },
      },
       /* 试卷管理模块*/
      {
        path: '/paperManage', //试卷管理界面
        component: () => import('@/components/teacher/paperManage'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/addPaper', //添加试卷界面
        component: () => import('@/components/teacher/addPaper'),
        meta:{
          loginRequest:true
        },
      },
       /* 学生管理模块*/
      {
        path: '/studentManage', //学生管理界面
        component: () => import('@/components/teacher/studentManage'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/addStudent', //添加学生
        component: () => import('@/components/teacher/addStudent'),
        meta:{
          loginRequest:true
        },
      },
        /*教师管理模块*/
      {
        path: '/teacherManage',
        component: () => import('@/components/admin/teacherManage'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/addTeacher',
        component: () => import ('@/components/admin/addTeacher'),
        meta:{
          loginRequest:true
        },
      },
       /*院系管理模块*/
      {
        path: '/instituteManage',
        component: () => import ('@/components/admin/instituteManage'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/majorManage',
        component: () => import ('@/components/admin/majorManage'),
        meta:{
          loginRequest:true
        },
      },
      {
        path: '/classManage',
        component: () => import ('@/components/admin/classManage'),
        meta:{
          loginRequest:true
        },
      },
    ]
  },
  {
    path: '/student',
    component: () => import('@/components/student/index'),
    meta:{
      loginRequest:true
    },
    children: [
      {path:"/",component: ()=> import('@/components/student/myExam'),meta:{
          loginRequest:true
        },},
      {path:"/practice",component: ()=> import('@/components/student/practiceExam'),meta:{
          loginRequest:true
        },},
      {path:'/startExam', component: () => import('@/components/student/startExam'),meta:{
          loginRequest:true
        },},
      {path: '/manager', component: () => import('@/components/student/manager'),meta:{
          loginRequest:true
        },},
      {path: '/examMsg', component: () => import('@/components/student/examMsg'),meta:{
          loginRequest:true
        },},
      {path: '/message', component: () => import('@/components/student/message'),meta:{
          loginRequest:true
        },},
      {path: '/studentScore', component: () => import("@/components/student/answerScore"),meta:{
          loginRequest:true
        },},
      {path: '/scoreTable', component: () => import("@/components/student/scoreTable"),meta:{
          loginRequest:true
        },}
    ]
  },
  {path: '/answer',component: () => import('@/components/student/answer'),meta:{
      loginRequest:true
    },}
]

const router = new VueRouter({
  routes
})

export default router

router.beforeEach((to,from,next)=>{
  if(to.meta.loginRequest){
    if($cookies.get("cname")||$cookies.get("cid")){
      next();
    }else{
      next({
        path:'/',
        query:{
          redirect:to.fullPath
        }
      })
    }
  }else{
    next()
  }
})
