package controllers

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
)

//排行榜
type RankController struct {
	beego.Controller
}

//获取排行榜数据
func (c *RankController) Get() {
	//获取参数
	cid, _ := c.GetInt("cid", -1)
	grade := c.GetString("grade")

	resp := NewResp()

	rankList := []struct {
		Id       int     `json:"id"`
		SpanTime int64   `json:"span_time"`
		Score    float64 `json:"score"`
		NickName string  `json:"nick_name"`
		Img      string  `json:"img"`
	}{}

	query := `
SELECT
	a.id AS id,
	( a.stop_time - a.start_time ) AS span_time,
	a.score AS score,
	b.nick_name AS nick_name,
	b.img AS img 
FROM
	papers a
	LEFT JOIN user AS b ON a.user_id = b.id 
WHERE
	a.id IN (
SELECT
	substring_index( GROUP_CONCAT( id ORDER BY -score , (stop_time-start_time) ), ',', 1 ) id 
FROM
	papers 
WHERE
	category_id = ? 
	AND grade = ?
	AND stop_time > 0 
GROUP BY
	user_id 
	) 
ORDER BY
	- a.score ,span_time 
LIMIT 10
`

	o := orm.NewOrm()
	_, err := o.Raw(query, cid, grade).QueryRows(&rankList)
	if err != nil {
		logs.Error("查询排行榜失败：",err)
		resp.Status = "error"
		resp.Msg = "query rank fail"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Status = "ok"
	resp.Data = rankList
	c.Data["json"] = &resp
	c.ServeJSON()
}
