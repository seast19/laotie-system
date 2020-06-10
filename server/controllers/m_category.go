package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"wx_laotie_api_go/models"
)

//分类操作
type MCategoryController struct {
	beego.Controller
}

//查询某分类详细
func (c *MCategoryController) Get() {
	resp := Resp{}

	//获取参数
	cid, _ := c.GetInt("cid", -1)

	//查询分类
	o := orm.NewOrm()
	qs := o.QueryTable("Categorys")
	category := models.Categorys{}
	err := qs.Filter("Id", cid).One(&category)
	if err != nil {
		logs.Error(err)
		resp.Code = 2901
		resp.Status = "error"
		resp.Msg = "fail to get category"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}
	resp.Code = 2000
	resp.Status = "ok"
	resp.Data = category
	c.Data["json"] = &resp
	c.ServeJSON()
}

//添加分类
func (c *MCategoryController) Post() {
	resp := Resp{}

	data := struct {
		Category string `json:"category"`
		Desc     string `json:"desc"`
	}{}

	err := json.Unmarshal(c.Ctx.Input.RequestBody, &data)
	if err != nil {
		resp.Code = 2909
		resp.Msg = "参数错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//获取分类参数
	cat := data.Category

	if len(cat) == 0 {
		resp.Code = 2901
		resp.Status = "error"
		resp.Msg = "参数错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	category := models.Categorys{
		Category: cat,
	}
	o := orm.NewOrm()
	id, err := o.Insert(&category)
	if err != nil {
		logs.Error(err)
		resp.Code = 2500
		resp.Status = "error"
		resp.Msg = "add category fail"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	logs.Info("添加分类成功", id)
	resp.Code = 2000
	resp.Status = "ok"
	c.Data["json"] = &resp
	c.ServeJSON()
}

//删除分类
func (c *MCategoryController) Delete() {
	resp := Resp{}

	cid, _ := c.GetInt("cid", -1)

	o := orm.NewOrm()
	_, err := o.Delete(&models.Categorys{Id: cid})
	if err != nil {
		logs.Warning("删除失败", err)
		resp.Code = 2901
		resp.Status = "error"
		resp.Msg = "删除分类失败"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Code = 2000
	resp.Status = "ok"
	c.Data["json"] = &resp
	c.ServeJSON()
}
