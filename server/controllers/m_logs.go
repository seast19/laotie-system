package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"wx_laotie_api_go/models"
)

type MLogs struct {
	beego.Controller
}
// 获取日志
func (c *MLogs) Get() {
	resp := NewErrorLogs()
	page, _ := c.GetInt("page", 1)


	errList, n, err := models.GetErrorLogs(page)
	if err != nil {
		logs.Error("查询错误日志失败")
		resp.Code=2901
		resp.Status = "error"
		resp.Msg = "查询日志失败"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Code=2000
	resp.Status = "ok"
	resp.Data = errList
	resp.Num = n
	c.Data["json"] = &resp
	c.ServeJSON()
	return

}

// 删除日志
func (c*MLogs)Delete()  {
	resp:=NewResp()
	cid,_:=c.GetInt("id",-1)

	err:= models.DeleteErrorLogs(cid)
	if err!=nil{
		logs.Error("删除错误日志失败")
		resp.Code=2901
		resp.Status="error"
		resp.Msg="删除日志失败"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Code=2000
	resp.Status = "ok"
	c.Data["json"] = &resp
	c.ServeJSON()
	return
}
