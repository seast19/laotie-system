package controllers

import (
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"wx_laotie_api_go/models"
)

//更新某分类，某等级的题数
func updateCatGradeNum(cat int, grade string) {
	//找到分类
	o := orm.NewOrm()
	qs := o.QueryTable("Categorys")
	category := models.Categorys{}
	err := qs.Filter("Id", cat).One(&category)
	if err != nil {
		logs.Error("更新题数失败...", err)
		return
	}

	//计算该分类，该等级题数
	qs2 := o.QueryTable("Questions")
	count, err := qs2.Filter("Category", category).Filter("Grade", grade).Count()
	if err != nil {
		logs.Error("更新题数失败2...", err)
		return
	}

	//构造待更新题数的category
	switch grade {
	case "初级工":
		category.G1Count = int(count)
	case "中级工":
		category.G2Count = int(count)
	case "高级工":
		category.G3Count = int(count)
	case "技师":
		category.G4Count = int(count)
	case "高级技师":
		category.G5Count = int(count)
	case "其他":
		category.G6Count = int(count)

	}

	_, err = o.Update(&category)
	if err != nil {
		logs.Error(err)
		return
	}
	logs.Info("更新题数成功")

}
