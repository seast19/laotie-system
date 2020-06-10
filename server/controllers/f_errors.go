package controllers

import (
	"github.com/astaxie/beego"
	"wx_laotie_api_go/models"
)


//前段错误日志收集
type ErrorLogs struct {
	beego.Controller
}

//用户上传日志
func (c*ErrorLogs)Post()  {
	msg := c.GetString("msg")
	models.SetErrorLog(msg)

	resp:=NewResp()
	resp.Status="ok"
	c.Data["json"] = &resp
	c.ServeJSON()
	return
}
