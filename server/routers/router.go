package routers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/plugins/cors"
	"wx_laotie_api_go/controllers"
)

func init() {

	//跨域
	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin","jtoken", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type"},
		AllowCredentials: true,
	}))

	//***************************************
	//	用户api //
	//***************************************
	nsApi := beego.NewNamespace("/api",
		beego.NSNamespace("/open",
			beego.NSRouter("/login", &controllers.LoginController{}),                     //用户登录
			beego.NSRouter("/categorys", &controllers.CategoriesController{}),            //所有分类
			beego.NSRouter("/category", &controllers.CategoryController{}),               //一个分类
			beego.NSRouter("/questions", &controllers.QuestionsController{}),             //获取练习题目
			beego.NSRouter("/searchquestions", &controllers.SearchQuestionsController{}), //搜索题目
			beego.NSRouter("/rank", &controllers.RankController{}),                       //排行榜
			beego.NSRouter("/error", &controllers.ErrorLogs{}),                           //错误日志收集

		),
		beego.NSNamespace("/secret",
			beego.NSBefore(UserCheckLogin),
			beego.NSRouter("/check", &controllers.CheckController{}),           //验证登录
			beego.NSRouter("/paper", &controllers.PaperController{}),           //获取考卷
			beego.NSRouter("/temppaper", &controllers.TempPaperController{}),   //临时答案
			beego.NSRouter("/userpapers", &controllers.UserPapersController{}), //用户历史试卷
		),
	)

	//***************************************
	//管理页面api
	//***************************************

	nsMenage := beego.NewNamespace("/m/api",
		beego.NSBefore(CheckAdminApi),                                    //检查登录状态
		beego.NSRouter("/category", &controllers.MCategoryController{}),  //分类curd
		beego.NSRouter("/question", &controllers.MQuestionsController{}), //题库curd
		beego.NSRouter("/logs", &controllers.MLogs{}),                    //前端错误日志

	)
	//登录
	beego.Router("/m/login", &controllers.MLogin{}) //用户登录

	//管理页面
	//beego.Router("/admin", &controllers.MAdminPage{}) //管理页面

	//***************************************
	//其他接口
	//***************************************

	//	存活确认
	beego.Router("/ping", &controllers.PingController{}) //ping

	//	默认404
	beego.Router("/*", &controllers.DefaultController{}) //404

	//***************************************
	//注册路由
	beego.AddNamespace(nsApi, nsMenage)
}
