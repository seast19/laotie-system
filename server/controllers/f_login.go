package controllers

import (
	"encoding/json"
	"errors"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	"io/ioutil"
	"net/http"
	"net/url"
	"wx_laotie_api_go/common"
	"wx_laotie_api_go/models"
)

//var signingKeys = []byte("seast.net")

//验证登录
type CheckController struct {
	beego.Controller
}

//通过jwt验证登录状态
func (c *CheckController) Get() {
	resp := NewResp()

	resp.Status = "ok"
	c.Data["json"] = &resp
	c.ServeJSON()
	return
}

//登录结构体
type LoginController struct {
	beego.Controller
}

//微信响应
type wxRespJson struct {
	SessionKey string `json:"session_key"`
	Openid     string `json:"openid"`
	ErrCode    int    `json:"errcode"`
	ErrMsg     string `json:"errmsg"`
}

//用户登录
func (c *LoginController) Get() {

	code := c.GetString("code")
	userImg := c.GetString("userimg")
	nickName := common.FilterEmoji(c.GetString("usernickname"))
	jwtToken := ""

	resp := NewRespUser()

	//获取用户信息
	wxResp, err := getUserInfoFromWX(code)
	if err != nil {
		logs.Error("从微信服务器获取信息失败：", err)
		resp.Status = "error"
		resp.Msg = "fail to check code"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//服务器返回错误信息
	if wxResp.SessionKey == "" || wxResp.ErrCode != 0 {
		logs.Error("微信返回数据提示有错误：", err)
		resp.Status = "error"
		resp.Msg = "wx server error"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//开启事务
	o := orm.NewOrm()
	qs := o.QueryTable("User")
	_ = o.Begin()

	//微信服务器获取信息成功则更新用户状态
	//找找用户是否存在
	if qs.Filter("OpenId", wxResp.Openid).Exist() {
		//	用户存在则更新token
		user := models.User{}
		err := qs.Filter("OpenId", wxResp.Openid).One(&user)
		if err != nil {
			_ = o.Rollback()
			logs.Error("更新用户信息失败：#1", err)
			resp.Status = "error"
			resp.Msg = "update user info fail"
			c.Data["json"] = &resp
			c.ServeJSON()
			return
		}

		_, err = qs.Filter("OpenId", wxResp.Openid).Update(orm.Params{
			"SessionKey": wxResp.SessionKey,
			//"SessionToken": sessionToken,
			//"ExpireAt":     time.Now().UnixNano()/1e6 + 1296000000, //15天会话有效期(ms)
			"NickName": nickName,
			"Img":      userImg,
		})
		if err != nil {
			_ = o.Rollback()
			logs.Error("更新用户信息失败：#2", err)
			resp.Status = "error"
			resp.Msg = "update user info fail"
			c.Data["json"] = &resp
			c.ServeJSON()
			return
		}
		//生成jwt
		jwtToken, err = common.GenJWT(user.Id)
		if err != nil {
			_ = o.Rollback()
			logs.Error("更新用户信息失败：#3", err)
			resp.Status = "error"
			resp.Msg = "update user info fail"
			c.Data["json"] = &resp
			c.ServeJSON()
			return
		}
		_ = o.Commit()
	} else {
		//用户不存在则新建用户
		user := models.User{
			OpenId:     wxResp.Openid,
			SessionKey: wxResp.SessionKey,
			//SessionToken: sessionToken,
			//ExpireAt:     time.Now().UnixNano()/1e6 + 1296000000,
			NickName: nickName,
			Img:      userImg,
		}
		uid, err := o.Insert(&user)
		if err != nil {
			_ = o.Rollback()
			logs.Error("新建用户失败#1:", err)
			resp.Status = "error"
			resp.Msg = "insert user info fail"
			c.Data["json"] = &resp
			c.ServeJSON()
			return
		}
		//生成jwt
		jwtToken, err = common.GenJWT(int(uid))
		if err != nil {
			_ = o.Rollback()
			logs.Error("新建用户失败#2：", err)
			resp.Status = "error"
			resp.Msg = "update user info fail"
			c.Data["json"] = &resp
			c.ServeJSON()
			return
		}
		_ = o.Commit()
	}
	resp.Status = "ok"
	resp.Jwt = jwtToken
	//resp.Session = sessionToken
	c.Data["json"] = &resp
	c.ServeJSON()
}

//从wx服务器获取用户信息
func getUserInfoFromWX(code string) (*wxRespJson, error) {
	//使用code请求微信服务器，获取用户信息
	v := url.Values{}
	v.Add("appid", "wx1015af5b99f4339d")
	v.Add("secret", "83d95df00cc53fc1ac4c54970b7ebb19")
	v.Add("js_code", code)
	v.Add("grant_type", "authorization_code")
	httpResp, err := http.Get("https://api.weixin.qq.com/sns/jscode2session?" + v.Encode())
	if err != nil {
		logs.Error("请求微信服务器失败:", err)
		return nil, errors.New("请求微信服务器失败")
	}
	defer httpResp.Body.Close()

	//反序列化微信服务器返回信息
	body, err := ioutil.ReadAll(httpResp.Body)
	if err != nil {
		logs.Error("读取微信数据失败", err)
		return nil, errors.New("读取微信数据失败")
	}
	resp := wxRespJson{}
	err = json.Unmarshal(body, &resp)
	if err != nil {
		logs.Error("反序列化微信数据失败", err)
		return nil, errors.New("反序列化微信数据失败")
	}

	return &resp, nil
}

//获取已登录用户信息
func getUser(jwtToken string) (*models.User, error) {
	uid, err := common.ParseJWT(jwtToken)
	if err != nil {
		return nil, err
	}

	return models.GetUserModel(uid)

}
