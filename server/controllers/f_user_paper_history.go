package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"wx_laotie_api_go/models"
)

//用户考试记录
type UserPapersController struct {
	beego.Controller
}

//获取试卷列表，按每页10条获取
func (c *UserPapersController) Get() {
	jwtToken := c.GetString("jwt")
	page, _ := c.GetInt("page", 1)

	resp := Resp{}

	user, err := getUser(jwtToken)
	if err != nil {
		logs.Warn(err)
		resp.Status = "error"
		resp.Msg = "用户session错误"
		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	paperList := []*models.Papers{}

	o := orm.NewOrm()
	qs := o.QueryTable("Papers")
	_, err = qs.Filter("User", user.Id).Filter("StopTime__gt", 0).RelatedSel().OrderBy("-Id").Limit(10, 10*(page-1)).All(&paperList, "Id", "Category", "StartTime", "StopTime", "Grade", "Score")
	if err != nil {
		logs.Error(err)
		resp.Status = "error"
		resp.Msg = "search user papers error"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Status = "ok"
	resp.Data = paperList
	c.Data["json"] = &resp
	c.ServeJSON()
}

//删除试卷
func (c *UserPapersController) Post() {
	jwtToken := c.GetString("jwt")
	pid, _ := c.GetInt64("pid", -1)

	resp := Resp{}

	_, err := getUser(jwtToken)
	if err != nil {
		logs.Warn(err)
		resp.Status = "error"
		resp.Msg = "用户session错误#3"
		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	_, err = models.DeletePaper(pid)
	if err != nil {
		logs.Error("删除 id%s 试卷失败：%s，", pid, err)
		resp.Status = "error"
		resp.Msg = "delete paper fail"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//过滤字段

	resp.Status = "ok"
	c.Data["json"] = &resp
	c.ServeJSON()
}
