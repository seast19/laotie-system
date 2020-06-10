package routers

import (
	"github.com/astaxie/beego/context"
	"github.com/astaxie/beego/logs"
	"wx_laotie_api_go/common"
	"wx_laotie_api_go/controllers"
)

//后台相关拦截器



//检查管理登录api
func CheckAdminApi(ctx *context.Context) {
	//获取客户端jwt
	jwtToken := ctx.Input.Header("jtoken")

	resp := controllers.NewResp()

	//验证jwt
	_,err:= common.ParseJWTAdmin(jwtToken)
	if err!=nil{
		resp.Code=2401
		resp.Msg="用户未登录"
		ctx.Output.Status=401
		ctx.Output.JSON(resp,false,false)
		return
	}
}


//用户相关拦截器
//拦截未登录用户
func UserCheckLogin(ctx *context.Context)  {
	jwtToken := ctx.Input.Query("jwt")

	_,err:=common.ParseJWT(jwtToken)
	if err!=nil{
		logs.Warn("拦截未登录用户请求 id:%s",ctx.Request.RemoteAddr)
		resp := controllers.Resp{
			Status: "error",
			Msg:    "user not login",
		}
		_ = ctx.Output.JSON(resp, false, false)
	}
}
