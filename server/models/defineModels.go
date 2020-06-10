package models

import (
	"github.com/astaxie/beego/orm"
	_ "github.com/mattn/go-sqlite3"
)

//用户表
type User struct {
	Id         int    `json:"id"`
	OpenId     string `json:"open_id" orm:"unique;size(64)"`
	SessionKey string `json:"session_key"`

	NickName string `json:"nick_name"`
	Img      string `json:"img"`
}

//分类表
type Categorys struct {
	Id       int    `json:"id"`
	Category string `orm:"unique;size(64)" json:"category"`
	Desc     string `json:"desc" orm:"null"`
	G1Count  int    `json:"g1_count"`
	G2Count  int    `json:"g2_count"`
	G3Count  int    `json:"g3_count"`
	G4Count  int    `json:"g4_count"`
	G5Count  int    `json:"g5_count"`
	G6Count  int    `json:"g6_count"`
}

//题库表
type Questions struct {
	Id  int    `json:"id"`
	Q   string `json:"q" orm:"type(text)"`
	A1  string `json:"a1"`
	A2  string `json:"a2"`
	A3  string `json:"a3"`
	A4  string `json:"a4"`
	Ans string `json:"ans" orm:"type(text)"`

	Type     string     `json:"type"`
	Grade    string     `json:"grade"`
	Category *Categorys `orm:"null;rel(fk);on_delete(set_null)" json:"category"`
}

//试卷信息表
type Papers struct {
	Id        int   `json:"id"`
	StartTime int64 `json:"start_time"`
	StopTime  int64 `json:"stop_time"`

	User     *User      `json:"user" orm:"null;rel(fk);on_delete(set_null)"`
	Category *Categorys `json:"category" orm:"null;rel(fk);on_delete(set_null)"`
	Grade    string     `json:"grade"`

	Questions string  `json:"questions" orm:"type(text)"`
	Ans       string  `json:"ans" orm:"type(text)"`
	TempAns   string  `json:"temp_ans" orm:"type(text)"`
	Score     float64 `json:"score"`
}

//排行榜表
type Rank struct {
	Id       int   `json:"id"`
	User     *User `json:"user" orm:"null;rel(fk);on_delete(set_null)"`
	Score    int   `json:"score"`
	SpanTime int   `json:"span_time"`

	Category *Categorys `json:"category" orm:"null;rel(fk);on_delete(set_null)"`
	Grade    string     `json:"grade"`
}

//错误日志表
type Errors struct {
	Id   int    `json:"id"`
	Time int64  `json:"time"`
	Msg  string `json:"msg" orm:"type(text)"`
}

func init() {
	orm.RegisterModel(new(User), new(Categorys), new(Questions), new(Papers), new(Errors))
}
