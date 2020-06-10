package controllers

import "wx_laotie_api_go/similarity"

//初始化分词库
var Sim, _ = similarity.New("static/dictionary.txt")
