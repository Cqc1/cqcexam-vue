import VUE from 'vue'
import VUEX from 'vuex'

VUE.use(VUEX)

const state = {
  isPractice: false, //练习模式标志
  flag: false, //菜单栏左右滑动标志
  userInfo: null,
  menu: [{
      index: '1',
      title: '考试管理',
      icon: 'icon-kechengbiao',
      content:[{item1:'功能介绍',path:'/examDescription'},{item2:'考试查询',path:'examManage'},{item3:'添加考试',path:'/addExam'}],
    },
    {
      index: '2',
      title: '试卷管理',
      icon: 'iconshijuan',
      content:[{item1:'试卷管理',path:'/paperManage'},{item2: '添加试卷',path: '/addPaper'}],
    },
    {
      index: '3',
      title: '题库管理',
      icon: 'icon-tiku',
      content:[{item1:'试题类型管理',path:'/quesTypeManage'},{item2:'所有题库',path:'/quesManage'},{item3:'增加题库',path:'/addQues'}],
    },
    {
      index: '4',
      title: '成绩管理',
      icon: 'icon-performance',
      content:[{item1:'学生成绩查询',path:'/allStudentsGrade'},{path: '/grade'},{item2: '成绩分段查询',path: '/selectExamToPart'},{path: '/scorePart'}],
    },
    {
      index: '5',
      title: '课程管理',
      icon: 'iconkechengguanli',
      content:[{item1:'课程管理',path:'/courseManage'},{item2: '添加课程',path: '/addCourse'}],
    },
    {
      index: '6',
      title: '学生管理',
      icon: 'icon-role',
      content:[{item1:'学生管理',path:'/studentManage'},{item2: '添加学生',path: '/addStudent'}],
    },

    // {
    //   index: '7',
    //   title: '模块管理',
    //   icon: 'icon-module4mokuai',
    //   content:[{item1:'模块操作',path:'/module'}],
    // }
  ],
}
const mutations = {
  practice(state,status) {
    state.isPractice = status
  },
  toggle(state) {
    state.flag = !state.flag
  },
  changeUserInfo(state,info) {
    state.userInfo = info
  }
}
const getters = {
 
}
const actions = {
  getUserInfo(context,info) {
    context.commit('changeUserInfo',info)
  },
  getPractice(context,status) {
    context.commit('practice',status)
  }
}
export default new VUEX.Store({
  state,
  mutations,
  getters,
  actions,
  // store
})
