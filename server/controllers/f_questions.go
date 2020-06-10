package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"math/rand"
	"sort"
	"time"
	"wx_laotie_api_go/models"
)

//题库表
type QuestionsController struct {
	beego.Controller
}

//获取题目
func (c *QuestionsController) Get() {
	//获取参数
	cid, _ := c.GetInt("cid", -1)
	grade := c.GetString("grade")
	practiseType := c.GetString("type") //练习方式

	resp := NewResp()

	//获取题库
	questionsList := []*models.Questions{}
	category,_ := models.GetCategoryModel(cid)

	o := orm.NewOrm()
	qs := o.QueryTable("Questions")
	n, err := qs.Filter("Category", category).Filter("Grade", grade).All(&questionsList)
	if err != nil || n == 0 {
		logs.Error("获取不到题目 n=%d err=%s", n, err)
		resp.Status = "error"
		resp.Msg = "no questions"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	switch practiseType {
	//顺序练习
	case "sx":
		//按题型排序
		sortQuesByType(questionsList)
		resp.Status = "ok"
		resp.Data = questionsList
		c.Data["json"] = &resp
		c.ServeJSON()
	//随机练习
	case "sj":
		//打乱切片
		rand.Seed(time.Now().UnixNano())
		rand.Shuffle(len(questionsList), func(i, j int) {
			questionsList[i], questionsList[j] = questionsList[j], questionsList[i]
		})

		resp.Status = "ok"
		resp.Data = questionsList
		c.Data["json"] = &resp
		c.ServeJSON()

	default:
		logs.Warn("获取题目无练习方式")
		resp.Status = "error"
		resp.Msg = "params error"
		c.Data["json"] = &resp
		c.ServeJSON()
	}
}

//搜索题目
type SearchQuestionsController struct {
	beego.Controller
}

//搜索题目
func (c *SearchQuestionsController) Get() {
	keywords := c.GetString("keywords", "")
	page, _ := c.GetInt64("page", 1)
	resp := NewRespSearchQues()

	//无效搜索关键字处理
	if keywords == "" {
		resp.Status = "error"
		resp.Msg = "keywords error"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//	搜索题目
	questions := []models.Questions{}
	o := orm.NewOrm()
	qs := o.QueryTable("Questions")
	_, err := qs.Filter("Q__contains", keywords).Offset((page - 1) * 20).RelatedSel().Limit(20).OrderBy("Id").All(&questions)
	if err != nil {
		logs.Warn("搜索题目失败，查询关键字：%s", keywords)
		resp.Status = "error"
		resp.Msg = "search questions error"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//题目数量
	count, err := qs.Filter("Q__contains", keywords).Count()
	if err != nil {
		logs.Warn("搜索题目数量失败，查询关键字：%s", keywords)
		resp.Status = "error"
		resp.Msg = "search questions count error"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Status = "ok"
	resp.Num = count
	resp.Data = questions
	c.Data["json"] = &resp
	c.ServeJSON()
	return
}

//按题型排序题目
func sortQuesByType(questionsList []*models.Questions) {
	sort.Slice(questionsList, func(i, j int) bool {
		typeWeightFirst := 0
		typeWeightLast := 0

		switch questionsList[i].Type {
		case "判断题":
			typeWeightFirst = 1
		case "选择题":
			typeWeightFirst = 2
		case "填空题":
			typeWeightFirst = 3
		case "简答题":
			typeWeightFirst = 4
		case "论述题":
			typeWeightFirst = 5
		default:
			typeWeightFirst = 6
		}

		switch questionsList[j].Type {
		case "判断题":
			typeWeightLast = 1
		case "选择题":
			typeWeightLast = 2
		case "填空题":
			typeWeightLast = 3
		case "简答题":
			typeWeightLast = 4
		case "论述题":
			typeWeightLast = 5
		default:
			typeWeightLast = 6
		}
		return typeWeightFirst < typeWeightLast
	})
}
