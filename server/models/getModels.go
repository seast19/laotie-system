package models

import (
	"errors"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"strconv"
	"time"
)

//获取所有分类信息
func GetCategoriesModel() ([]*Categorys, error) {
	categories := []*Categorys{}
	o := orm.NewOrm()
	qs := o.QueryTable("Categorys")
	_, err := qs.OrderBy("-Id").All(&categories)
	if err != nil {
		logs.Error(err)
		return nil, err
	}

	return categories, nil
}

//获取分类对象
func GetCategoryModel(cid int) (*Categorys, error) {
	o := orm.NewOrm()
	qs2 := o.QueryTable("Categorys")
	category := Categorys{}
	err := qs2.Filter("Id", cid).One(&category)
	if err != nil {
		logs.Error(err)
		return nil, err
	}
	return &category, nil
}

//获取用户对象
func GetUserModel(uid int) (*User, error) {
	o := orm.NewOrm()
	qs2 := o.QueryTable("User")

	user := User{}
	err := qs2.Filter("Id", uid).One(&user)
	if err != nil {
		return nil, errors.New("no such user: " + strconv.Itoa(uid))
	}
	return &user, nil
}

//删除试卷
func DeletePaper(id int64) (int64, error) {
	o := orm.NewOrm()
	qs2 := o.QueryTable("Papers")

	n, err := qs2.Filter("Id", id).Delete()
	if err != nil {
		return 0, err
	}
	return n, nil
}

//添加前段错误日志
func SetErrorLog(msg string) {
	o := orm.NewOrm()

	errorLog := Errors{}
	errorLog.Time = time.Now().UnixNano() / 1e6
	errorLog.Msg = msg

	_, err := o.Insert(&errorLog)
	if err != nil {
		logs.Error("添加前段错误日志失败", err)
	}
	return
}

//获取前端错误日志
func GetErrorLogs(page int) ([]Errors, int64, error) {
	errorLogList := []Errors{}

	qs := orm.NewOrm().QueryTable("Errors")
	count, err := qs.Count()
	if err != nil {
		logs.Error(err)
		return nil, 0, err
	}

	_, err = qs.OrderBy("-Id").Limit(10, (page-1)*10).All(&errorLogList)
	if err != nil {
		logs.Error(err)
		return nil, 0, err
	}

	return errorLogList, count, nil
}

//删除前端错误日志
func DeleteErrorLogs(cid int) error {
	qs := orm.NewOrm().QueryTable("Errors")
	_,err:=qs.Filter("Id",cid).Delete()
	if err!=nil{
		logs.Error("删除前端日志错误：%d",cid)
		return err
	}

	return nil
}
