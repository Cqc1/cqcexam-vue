export const util={
  //格式化日期格式2019-08-22
  dateYMD:function (nowDate) {
    if (typeof nowDate == "string" || typeof nowDate == "" || typeof nowDate == "undefined" || typeof nowDate == undefined) {
      return nowDate;
    }
    let dateA = {
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      date: nowDate.getDate(),
    };
    return dateA.year + '-' + ((dateA.month).toString().length == 2 ? dateA.month : "0" + dateA.month) + '-' + ((dateA.date).toString().length == 2 ? dateA.date : "0" + dateA.date);
  },
  //登录超时提醒
  overTimeOut:function () {
    var than=this;
    var lastTime = new Date().getTime();
    var currentTime = new Date().getTime();
    var timeOut = 1 * 60 * 1000; //设置超时时间： 1分

    $(function(){
      /* 鼠标移动事件 */
      $(document).mouseover(function(){
        lastTime = new Date().getTime(); //更新操作时间
      });
    });

    var testTime=function(){
      currentTime = new Date().getTime(); //更新当前时间
      if(currentTime - lastTime > timeOut){ //判断是否超时
        alert("登录超时");
        //sessionStorage.token=token
        sessionStorage.removeItem("admin_token");
        than.$router.push({path:"/"});
        //than.redirectLogin();//重定向到登录页面
      }
    };

    /* 定时器  间隔1秒检测是否长时间未操作页面  */
    window.setInterval(testTime, 1000);
  },
  redirectLogin(){

  }
};
