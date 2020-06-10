package controllers

import "github.com/astaxie/beego"

type ErrorsController struct {
	beego.Controller
}


func (c *ErrorsController) Error404() {
	resp := NewResp()
	resp.Code=2404
	resp.Status = "error"
	c.Data["json"] = &resp
	c.ServeJSON()
}

func (c *ErrorsController) Error500() {
	resp := NewResp()
	resp.Code=2500
	resp.Status = "error"
	c.Data["json"] = &resp
	c.ServeJSON()
}


func (c *ErrorsController) Error501() {
	resp := NewResp()
	resp.Code=2501
	resp.Status = "error"
	c.Data["json"] = &resp
	c.ServeJSON()
}


