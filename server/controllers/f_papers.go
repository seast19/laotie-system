package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"math"
	"math/rand"
	"sort"
	"strconv"
	"time"
	"wx_laotie_api_go/common"
	"wx_laotie_api_go/models"
)

//试卷表 控制器
type PaperController struct {
	beego.Controller
}

//获取试卷
func (c *PaperController) Get() {
	//获取参数
	cid, _ := c.GetInt("cid", -1)
	grade := c.GetString("grade")
	jwtToken := c.GetString("jwt")

	resp := NewRespPaper()

	//验证用户登录
	user, err := getUser(jwtToken)
	if err != nil {
		logs.Warn("获取user对象失败：", err)
		resp.Status = "error"
		resp.Msg = "用户session错误#1"
		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	category, err := models.GetCategoryModel(cid)
	if err != nil {
		logs.Warn("获取category对象失败：", err)
		resp.Status = "error"
		resp.Msg = "请求参数错误#2"
		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	//检查是否有待恢复试卷
	o := orm.NewOrm()
	qs := o.QueryTable("Papers")

	//恢复旧试卷
	if qs.Filter("StopTime", 0).Filter("Category", category).Filter("Grade", grade).Filter("User", user).Exist() {
		r, err := recoverPaper(category, grade, user)
		if err != nil {
			logs.Error("恢复试卷错误：", err)
			resp.Status = "error"
			resp.Msg = "恢复试卷错误"
			c.Data["json"] = resp
			c.ServeJSON()
			return
		}

		c.Data["json"] = r
		c.ServeJSON()
		return
	}

	//生成新试卷
	r, err := newPaper(category, grade, user)
	if err != nil {
		logs.Error("新建试卷错误：", err)
		resp.Status = "error"
		resp.Msg = "新建试卷错误"
		c.Data["json"] = resp
		c.ServeJSON()
		return
	}
	c.Data["json"] = r
	c.ServeJSON()

}




//恢复为完成试卷
func recoverPaper(category *models.Categorys, grade string, user *models.User) (*RespPaper, error) {
	resp := NewRespPaper()

	paper := models.Papers{}

	//获取待恢复试卷
	o := orm.NewOrm()
	qs1 := o.QueryTable("Papers")
	err := qs1.Filter("StopTime", 0).Filter("Category", category).Filter("Grade", grade).Filter("User", user).OrderBy("-StartTime").One(&paper)
	if err != nil {
		logs.Error("没有空白试卷")
		return nil, err
	}

	//提取原问题id
	quesIdList := []int{}
	err = json.Unmarshal([]byte(paper.Questions), &quesIdList)
	if err != nil {
		logs.Error("反序列化储存的试卷错误")
		return nil, err
	}

	//查询试题
	quesList := []models.Questions{}
	qs2 := o.QueryTable("Questions")
	_, err = qs2.Filter("Id__in", quesIdList).OrderBy("Id").All(&quesList, "Id", "Q", "A1", "A2", "A3", "A4", "Type", "Grade")
	if err != nil {
		return nil, err
	}

	resp.Status = "ok"
	resp.Data = quesList
	resp.PaperId = int64(paper.Id)
	resp.TempAns = paper.TempAns //使用string
	resp.PaperStartTime = paper.StartTime
	return resp, nil
}

//实现排序接口
type QuesSlice []*models.Questions
func (l QuesSlice) Len() int            { return len(l) }
func (l QuesSlice) Swap(i, j int)      { l[i], l[j] = l[j], l[i] }
func (l QuesSlice) Less(i, j int) bool { return l[i].Id < l[j].Id }

//新建试卷
func newPaper(category *models.Categorys, grade string, user *models.User) (*RespPaper, error) {
	resp := NewRespPaper()
	questionsList := QuesSlice{}

	//获取题目
	o := orm.NewOrm()
	qs := o.QueryTable("Questions")
	_, err := qs.Filter("Category", category).Filter("Grade", grade).All(&questionsList, "Id", "Q", "A1", "A2", "A3", "A4", "Type", "Grade")
	if err != nil {
		logs.Error("新建试卷找不到题目：", err)
		return nil, err
	}

	//打乱顺序,获取前100道题目
	rand.Seed(time.Now().UnixNano()) //设置种子
	rand.Shuffle(len(questionsList), func(i, j int) {
		questionsList[i], questionsList[j] = questionsList[j], questionsList[i]
	})
	questionsList = questionsList[0:100]

	//记录用户抽取到题目的题号
	questionsIdList := []int{}
	for _, item := range questionsList {
		questionsIdList = append(questionsIdList, item.Id)
	}
	questionsIdListStr, err := json.Marshal(questionsIdList)
	if err != nil {
		logs.Error("序列换用户试卷题目id: %s 错误:", err)
		return nil, err
	}

	//将该试卷加入papers表
	paper := models.Papers{
		StartTime: time.Now().UnixNano() / 1e6,
		Category:  category,
		Grade:     grade,
		User:      user,
		Questions: string(questionsIdListStr),
	}
	id, err := o.Insert(&paper)
	if err != nil {
		logs.Error("新建试卷插入失败：", err)
		return nil, err
	}

	//将抽到的试卷按id排序
	sort.Sort(questionsList)

	resp.Status = "ok"
	resp.PaperId = id
	resp.Data = questionsList
	return resp, nil
}

//批改试卷
func (c *PaperController) Post() {
	//获取参数
	pid, _ := c.GetInt("paper_id", -1)
	ans := c.GetString("answers")
	jwtToken := c.GetString("jwt")

	resp := NewRespScore()

	user, err := getUser(jwtToken)
	if err != nil {
		logs.Warn(err)
		resp.Status = "error"
		resp.Msg = "用户session错误"
		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	o := orm.NewOrm()
	qs := o.QueryTable("Papers")

	//	找到该id下的试卷 ,试卷不存在则结束
	if !qs.Filter("Id", pid).Filter("User", user).Filter("StopTime", 0).Exist() {
		logs.Error("试卷id或user不存在:" + strconv.Itoa(pid))
		resp.Status = "error"
		resp.Msg = "paper not exist"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//解析答案
	ansList := []models.Questions{}
	err = json.Unmarshal([]byte(ans), &ansList)
	if err != nil {
		logs.Error("反序列化用户答案失败", err)
		resp.Status = "error"
		resp.Msg = "ans unmarshal error"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//批卷
	paper := models.Papers{}
	err = qs.Filter("Id", pid).Filter("User", user).Filter("StopTime", 0).One(&paper)
	if err != nil {
		logs.Error("获取待批改试卷错误：", err)
		resp.Status = "error"
		resp.Msg = "no paper with current pid"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//	判断答案是否正确

	var score float64
	errList := []models.Questions{}
	sim := Sim //拷贝一份分词库，防止多线程干扰

	//对每个用户答案进行查找正确答案
	qs2 := o.QueryTable("Questions")
	for _, userAns := range ansList {
		//找数据库的题目
		ques := models.Questions{}
		err := qs2.Filter("Id", userAns.Id).One(&ques)
		if err != nil {
			logs.Info("找不到题目id:", userAns.Id)
			continue
		}

		//匹配答案
		//选择判断使用精准匹配
		if ques.Type == "选择题" || ques.Type == "判断题" {
			if userAns.Ans == ques.Ans {
				score += 1
				continue
			}
			//添加错误题目
			errList = append(errList, ques)
			continue
		}

		//简答题等 使用相似度匹配
		//去除答案的符号，无用字符等
		tempScore, err := sim.SimiCos(common.DelSymbolFromString(userAns.Ans), common.DelSymbolFromString(ques.Ans))
		if err != nil {
			errList = append(errList, ques)
			continue
		}

		//匹配率小于0.8，视为回答错误
		if math.IsNaN(tempScore) || tempScore < 0.8 {
			errList = append(errList, ques)
			continue
		}
		score += 1
	}

	paper.Ans = ans
	paper.Score = score
	paper.StopTime = time.Now().UnixNano() / 1e6
	n, err := o.Update(&paper)
	if err != nil || n == 0 {
		logs.Error("更新批卷失败")
		resp.Status = "error"
		resp.Msg = "update paper error"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Status = "ok"
	resp.ErrList = errList
	resp.Score = int64(score)
	c.Data["json"] = &resp
	c.ServeJSON()
}

//临时保存答案
//试卷表
type TempPaperController struct {
	beego.Controller
}

//获取临时答案并保存
func (c *TempPaperController) Get() {
	jwtToken := c.GetString("jwt")
	userAnsList := c.GetString("ansList")
	paperId, _ := c.GetInt("paperid", -1)

	resp := NewResp()

	user, err := getUser(jwtToken)
	if err != nil {
		logs.Warn(err)
		resp.Status = "error"
		resp.Msg = "用户session错误"
		c.Data["json"] = resp
		c.ServeJSON()
		return
	}

	o := orm.NewOrm()
	qs := o.QueryTable("papers")
	_, err = qs.Filter("User", user).Filter("Id", paperId).Filter("StopTime", 0).Update(orm.Params{"temp_ans": userAnsList})
	if err != nil {
		logs.Warn("临时保存答案失败:", err)
		resp.Status = "error"
		resp.Msg = "临时保存答案失败"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Status = "ok"
	c.Data["json"] = &resp
	c.ServeJSON()
}
