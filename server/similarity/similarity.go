package similarity

import (
	"errors"
	"fmt"
	"github.com/go-ego/gse"
	"math"
	"strconv"
)

//存放字符串分词后字典
type Similarity struct {
	S1  map[string]float64
	S2  map[string]float64
	Seg gse.Segmenter
}

//工厂函数
func New(filePath string) (Similarity, error) {
	s := Similarity{}
	//全局加载一次字典
	err := s.Seg.LoadDict(filePath)
	if err != nil {
		return Similarity{}, errors.New("构建相似度对象失败")
	}
	return s, nil
}

//余弦相似度
func (s Similarity) SimiCos(s1, s2 string) (float64, error) {
	//清空s1  s2 内的数据，防止第二次调用时数据污染
	s.S1 = map[string]float64{}
	s.S2 = map[string]float64{}

	//计算两字符串分词
	s1List := s.cut(s1)
	s2List := s.cut(s2)

	//所有词汇
	s3Map := map[string]bool{}
	for _, v := range s1List {
		s3Map[v] = true
	}
	for _, v := range s2List {
		s3Map[v] = true
	}

	//	计算词频
	for _, v := range s1List {
		s.S1[v] += 1
	}
	for _, v := range s2List {
		s.S2[v] += 1
	}

	//计算余弦相似度
	var a float64
	var b float64
	var c float64

	for k, _ := range s3Map {
		a += s.S1[k] * s.S2[k]
		b += s.S1[k] * s.S1[k]
		c += s.S2[k] * s.S2[k]
	}

	var d float64
	d = a / (math.Sqrt(b) * math.Sqrt(c))
	e, err := strconv.ParseFloat(fmt.Sprintf("%.2f", d), 64)
	return e, err
}

//分词
func (s Similarity) cut(s1 string) []string {
	text1 := []byte(s1)
	segments := s.Seg.Segment(text1)
	return gse.ToSlice(segments)
}
