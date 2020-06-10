package common

import (
	"errors"
	"github.com/astaxie/beego/logs"
	"github.com/dgrijalva/jwt-go"
	"time"
)

var signingKeys = []byte("seast.net")

var signingKeysAdmin = []byte("qwertrewq")

// 小程序解析jwt，获取用户id
func ParseJWT(tokenString string) (int, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return signingKeys, nil
	})
	if err != nil {
		logs.Warn("解析jwt错误 #1：", err)
		return 0, err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return int(claims["user_id"].(float64)), nil
	}
	return 0, errors.New("invalid jwt token")
}

//小程序生成jwt
func GenJWT(id int) (string, error) {
	claims := struct {
		UserId       int    `json:"user_id"`
		UserNickname string `json:"user_nickname"`
		UserImg      string `json:"user_img"`
		jwt.StandardClaims
	}{
		id,
		"",
		"",
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 15).Unix(), //有效期15天
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(signingKeys)
	if err != nil {
		logs.Error("生成jwt错误：", err)
		return "", err
	}
	return ss, nil
}

//后后台生成jwt
func GenJWTAdmin(u, p string) (string, error) {
	claims := struct {
		UserName string    `json:"user_name"`
		UserPws  string `json:"user_pwd"`
		jwt.StandardClaims
	}{
		u,
		p,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 15).Unix(), //有效期15天
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := token.SignedString(signingKeys)
	if err != nil {
		logs.Error("生成jwt错误#2：", err)
		return "", err
	}
	return ss, nil
}

//后台解析jwt
func ParseJWTAdmin(tokenString string) (string, error) {
	if len(tokenString)==0{
		return "",errors.New("jwt长度为空")
	}


	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return signingKeys, nil
	})
	if err != nil {
		logs.Warn("解析jwt错误 #2：", err)
		return "", err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["user_name"].(string), nil
	}
	return "", errors.New("invalid jwt token")
}
