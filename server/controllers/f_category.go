package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"wx_laotie_api_go/models"
)

//所有分类信息控制器
type CategoriesController struct {
	beego.Controller
}

//获取所有分类信息
func (c *CategoriesController) Get() {
	resp := NewResp()

	categories, err := models.GetCategoriesModel()
	if err != nil {
		logs.Error("查询所有分类错误：", err)
		resp.Status = "err"
		resp.Msg = "fail to get categories"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Status = "ok"
	resp.Data = categories
	c.Data["json"] = &resp
	c.ServeJSON()
}

//单个分类 控制器
type CategoryController struct {
	beego.Controller
}

//获取某个分类信息
func (c *CategoryController) Get() {
	//获取参数
	cid, _ := c.GetInt("cid", -1)
	resp := NewResp()

	cat, err := models.GetCategoryModel(cid)
	if err != nil {
		logs.Error("查询cid为 %s 分类错误：%s", cid, err)
		resp.Status = "err"
		resp.Msg = "fail to get category"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Status = "ok"
	resp.Data = cat
	c.Data["json"] = &resp
	c.ServeJSON()
}
