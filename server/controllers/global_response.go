package controllers

import "github.com/astaxie/beego"

//返回数据结构体
type Resp struct {
	Code int `json:"code"`
	Status string      `json:"status"`
	Msg    string      `json:"msg"`
	Data   interface{} `json:"data"`
}

//返回用户数据
type RespUser struct {
	Resp

	Jwt string `json:"jwt"`
}

//返回试卷数据
type RespPaper struct {
	Resp

	PaperId        int64  `json:"paper_id"`
	PaperStartTime int64  `json:"paper_start_time"`
	TempAns        string `json:"temp_ans"`
}

//返回用户分数
type RespScore struct {
	Resp

	ErrList interface{} `json:"err_list"`
	Score   int64       `json:"score"`
}

//返回搜索试卷结果
type RespSearchQues struct {
	Resp

	Num   int64       `json:"num"`
}

//返回错误日志
type RespErrorLogs struct {
	Resp
	Num int64 `json:"num"`
}


//返回数据 工厂函数
func NewResp() *Resp {
	r := Resp{}
	r.Status="error"
	r.Msg=""
	r.Data=[]int{}

	return &r
}

//返回错误日志
func NewErrorLogs() *RespErrorLogs {
	r:= RespErrorLogs{}
	r.Status="error"
	r.Msg=""
	r.Data=[]int{}

	r.Num=0
	return &r
}

//返回用户数据
func NewRespUser() *RespUser {
	r := RespUser{}
	r.Status="error"
	r.Msg=""
	r.Data=[]int{}

	r.Jwt=""

	return &r
}

func NewRespPaper() *RespPaper {
	r := RespPaper{}
	r.Status="error"
	r.Msg=""
	r.Data=[]int{}

	r.PaperId=-1
	r.TempAns="[]"
	r.PaperStartTime=-1

	return &r
}

func NewRespScore() *RespScore {
	r := RespScore{}
	r.Status="error"
	r.Msg=""
	r.Data=[]int{}

	r.Score=-1
	r.ErrList=[]int{}
	return &r
}

func NewRespSearchQues() *RespSearchQues {
	r := RespSearchQues{}
	r.Status="error"
	r.Msg=""
	r.Data=[]int{}

	r.Num=0
	return &r
}


//测试响应
type PingController struct {
	beego.Controller
}

//ping-pong
func (c *PingController) Get() {
	resp := NewResp()
	resp.Status = "ok"
	resp.Msg = "pong"
	c.Data["json"] = resp
	c.ServeJSON()
	return
}

//默认404页面
type DefaultController struct {
	beego.Controller
}

func (c *DefaultController) Get() {
	resp := NewResp()
	resp.Status = "error"
	resp.Msg = "page or api not found"
	c.Ctx.ResponseWriter.WriteHeader(404)
	c.Data["json"] = resp
	c.ServeJSON()
	return
}
