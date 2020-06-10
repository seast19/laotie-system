package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/parnurzeal/gorequest"
	"io/ioutil"
	"net/http"
	"net/url"
	"wx_laotie_api_go/common"
)

type MLogin struct {
	beego.Controller
}

//用户登录
func (c *MLogin) Post() {
	resp := NewRespUser()

	//获取参数
	data := struct {
		UserName string `json:"username"`
		Pwd      string `json:"pwd"`
		//Token    string `json:"token"`
		Code   string `json:"code"`
		CToken string `json:"ctoken"`
	}{}

	err := json.Unmarshal(c.Ctx.Input.RequestBody, &data)
	if err != nil {
		fmt.Println(err)
		resp.Code = 6099
		resp.Status = "error"
		resp.Msg = "请求参数错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//验证码方 验证token
	if !checkSCFCode(data.Code, data.CToken) {
		resp.Code = 6004
		resp.Status = "error"
		resp.Msg = "验证码错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	username := data.UserName
	pwd := data.Pwd

	//验证账户密码
	if username != "admin" || pwd != "121126" {
		resp.Code = 6001
		resp.Status = "error"
		resp.Msg = "用户名或密码错误"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	//生成jwt
	jwtToken, err := common.GenJWTAdmin(username, pwd)
	if err != nil {
		logs.Error("生成jwt错误")
		c.Abort("500")
		return
	}

	resp.Code = 6000
	resp.Status = "ok"
	resp.Msg = "登录成功"
	resp.Jwt = jwtToken
	c.Data["json"] = &resp
	c.ServeJSON()
	return

}

//检查用户登录状态
func (c *MLogin) Get() {
	resp := NewResp()
	jwtToken := c.Ctx.Input.Header("jtoken")

	_, err := common.ParseJWTAdmin(jwtToken)
	if err != nil {
		logs.Info("登陆失败")
		resp.Code = 6006
		resp.Status = "error"
		resp.Msg = "用户jToken无效"
		c.Data["json"] = &resp
		c.ServeJSON()
		return
	}

	resp.Code = 6000
	resp.Status = "ok"
	c.Data["json"] = &resp
	c.ServeJSON()
}

//向云函数验证 用户验证码
func checkSCFCode(code, cToken string) bool {
	request := gorequest.New()
	_, body, errs := request.Post("https://service-dlgbjcx0-1254302252.gz.apigw.tencentcs.com/release/simple-captcha").
		Set("Content-Type", "application/json; charset=utf-8").
		SendMap(map[string]string{
			"action":         "check",
			"usercode":       code,
			"userciphertext": cToken,
		}).
		End()
	if errs != nil {
		logs.Error("腾讯云验证码接口请求失败 ->%s",errs)
		return false
	}

	scfData := struct {
		Code       int    `json:"code"`
		Img        string `json:"img"`        //图片base64
		CipherText string `json:"ciphertext"` // sha256(code+salt+time)
		CheckStatus string `json:"checkstatus"` //验证状态 [1,-1,-2]
	}{}

	err := json.Unmarshal([]byte(body), &scfData)
	if err != nil {
		logs.Warning(err)
		return false
	}

	if scfData.Code == 2000 && scfData.CheckStatus == "1" {
		return true
	}
	return false
}

//向vaptcha验证token
func checkToken(token, ip string) (string, error) {
	data := url.Values{
		"id":        []string{"5e31596276cb1970819ea8a9"},
		"secretkey": []string{"732498ff69334a24ad32c9bb2660c662"},
		"token":     []string{token},
		"ip":        []string{ip},
	}

	//请求vaptcha
	r, err := http.PostForm("http://0.vaptcha.com/verify", data)
	if err != nil {
		logs.Error("请求vaptcha失败", err)
		return "服务器错误", err
	}
	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		logs.Error("获取body失败", err)
		return "服务器错误", err
	}

	//反序列化
	vaptchaResp := struct {
		Success int    `json:"success"`
		Score   int    `json:"score"`
		Msg     string `json:"msg"`
	}{}
	err = json.Unmarshal(body, &vaptchaResp)
	if err != nil {
		logs.Error("反序列化body失败", err)
		return "服务器错误", err
	}

	//验证信息
	if vaptchaResp.Success == 1 {
		return "", nil
	}

	logs.Warn("验证码错误，", vaptchaResp.Msg)
	return "验证码错误", errors.New("验证码错误")
}
