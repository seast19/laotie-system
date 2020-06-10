package main

import (
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
	_ "wx_laotie_api_go/models"
	_ "wx_laotie_api_go/routers"
)

func init() {
	//初始化日志模块
	logs.SetLevel(logs.LevelDebug)
	logs.EnableFuncCallDepth(true)
	logs.SetLogFuncCallDepth(3)
	err := logs.SetLogger(logs.AdapterFile, `{"filename":"./logs/logs.log","maxdays":30}`)
	if err != nil {
		fmt.Println("日志初始化失败:", err)
		panic("日志初始化失败")
	}

	//mysql注册驱动
	err = orm.RegisterDriver("mysql", orm.DRMySQL)
	if err != nil {
		logs.Error("mysql注册驱动失败：", err)
		panic("mysql注册驱动失败")
	}
	sqlSource := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8",
		beego.AppConfig.String("mysqluser"),
		beego.AppConfig.String("mysqlpass"),
		beego.AppConfig.String("mysqlurls"),
		beego.AppConfig.String("mysqlport"),
		beego.AppConfig.String("mysqldb"))
	err = orm.RegisterDataBase("default", "mysql", sqlSource)
	if err != nil {
		logs.Error("mysql注册数据库失败：", err)
		panic("mysql注册数据库失败")
	}

	//数据库创表
	err = orm.RunSyncdb("default", false, false)
	if err != nil {
		logs.Error("数据库创表失败：", err)
		panic("数据库创表失败")
	}
}

func main() {
	logs.Info("<=== 老铁题库小程序API启动 ===>")
	beego.Run()
}
