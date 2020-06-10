package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"github.com/tealeg/xlsx"
	"wx_laotie_api_go/models"
)

//题库结构体
type MQuestionsController struct {
	beego.Controller
}

//上传题库
func (c *MQuestionsController) Post() {
	//获取参数
	catId, _ := c.GetInt("categoryId", -1)

	resp := Resp{}

	//	获取文件
	f, h, err := c.GetFile("files")
	if err != nil {
		logs.Error("获取文件错误:", err)
		resp.Code=2901
		resp.Status = "error"
		resp.Msg = "文件错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}
	defer f.Close()

	//保存文件到本地
	err = c.SaveToFile("files", "uploads/"+h.Filename)
	if err != nil {
		logs.Error("savefile err ", err)
		resp.Code=2500
		resp.Status = "error"
		resp.Msg = "保存文件错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//	解析文件至题库
	excelFileName := "uploads/" + h.Filename
	xlFile, err := xlsx.OpenFile(excelFileName)
	if err != nil {
		logs.Error("open failed: %s\n", err)
		resp.Code=2901
		resp.Status = "error"
		resp.Msg = "文件解析错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//工作簿
	sheet := xlFile.Sheets[0]

	// 获取 QuerySeter 对象
	o := orm.NewOrm()
	qs := o.QueryTable("Categorys")
	category := models.Categorys{}
	err = qs.Filter("Id", catId).One(&category)
	if err != nil {
		logs.Error("查询cid错误", err)
		resp.Code=2901
		resp.Status = "error"
		resp.Msg = "文件内容格式错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//验证文件分类是否与上传的cid一致
	if sheet.Cell(1, 9).Value != category.Category {
		logs.Error("文件错误#1")
		resp.Code=2901
		resp.Status = "error"
		resp.Msg = "文件分类错误#1"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}
	//判断等级是否是指定等级
	gradeFlag := false
	for _, item := range []string{"初级工", "中级工", "高级工", "技师", "高级技师", "其他"} {
		if sheet.Cell(1, 8).Value == item {
			gradeFlag = true
			break
		}
	}
	if !gradeFlag {
		logs.Error("文件错误#2")
		resp.Code=2901
		resp.Status = "error"
		resp.Msg = "文件等级错误#2"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	grade := sheet.Cell(1, 8).Value

	//将每道题加入列表，统一加入题库
	var quesList []models.Questions
	for index, row := range sheet.Rows {
		//第一条为标题，跳过
		if index == 0 {
			continue
		}

		//去除数据库重复的题目
		qs := o.QueryTable("Questions")
		n, err := qs.Filter("Q", row.Cells[1].Value).Filter("Category", category).Filter("Grade", grade).Count()
		if err != nil || n > 0 {
			continue
		}

		//当前题目列表去重
		repeat := false
		rQ := row.Cells[1].Value
		for _, v := range quesList {
			if v.Q == rQ {
				repeat = true
				break
			}
		}
		if !repeat {
			ques := models.Questions{
				Q:        row.Cells[1].Value,
				A1:       row.Cells[2].Value,
				A2:       row.Cells[3].Value,
				A3:       row.Cells[4].Value,
				A4:       row.Cells[5].Value,
				Ans:      row.Cells[6].Value,
				Type:     row.Cells[7].Value,
				Grade:    row.Cells[8].Value,
				Category: &models.Categorys{Id: catId},
			}
			quesList = append(quesList, ques)
		}
	}

	//批量插入
	_ = o.Begin()
	n, err := o.InsertMulti(1, quesList)
	if err != nil {
		logs.Error("批量插入失败", err)
		_ = o.Rollback()
	} else {
		logs.Info("插入题库 %s - %s %d 条题目", category.Category, grade, n)
		_ = o.Commit()
	}

	//更新当前分类等级题数
	updateCatGradeNum(catId, grade)

	resp.Code=2000
	resp.Status = "ok"
	c.Data["json"] = &resp
	c.ServeJSON()
	return
}

//删除题库
func (c *MQuestionsController) Delete() {
	//获取参数
	grade := c.GetString("grade")
	cid, _ := c.GetInt("categoryId", -1)

	resp := Resp{}

	//	查找分类
	o := orm.NewOrm()
	qs := o.QueryTable("Categorys")
	if !qs.Filter("Id", cid).Exist() {
		resp.Code=2901
		resp.Status = "error"
		resp.Msg = "参数错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//删除题库
	_, err := o.Raw("DELETE FROM questions WHERE grade=? AND category_id=?", grade, cid).Exec()
	if err != nil {
		logs.Error("删除失败", err)
		resp.Code=2500
		resp.Status = "error"
		resp.Msg = "数据库操作失败"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//更新题数
	updateCatGradeNum(cid, grade)

	logs.Info("删除题目成功")
	resp.Code=2000
	resp.Status = "ok"
	c.Data["json"] = &resp
	c.ServeJSON()
}
