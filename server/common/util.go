package common

import (
	"regexp"
	"strings"
	"unicode/utf8"
)




//过滤字符大于3的unicode编码，过滤emoji
func FilterEmoji(content string) string {
	newContent := ""
	for _, value := range content {
		_, size := utf8.DecodeRuneInString(string(value))
		if size <= 3 {
			newContent += string(value)

		} else {
			newContent += "?"
		}
	}
	return newContent
}

//去除字符串的符号
func DelSymbolFromString(srcStr string) string {
	srcStr = strings.Replace(srcStr, "\n", "", -1)
	srcStr = strings.Replace(srcStr, " ", "", -1)
	srcStr = strings.Replace(srcStr, "\r", "", -1)

	srcStr = strings.Replace(srcStr, ";", "", -1)
	srcStr = strings.Replace(srcStr, ",", "", -1)
	srcStr = strings.Replace(srcStr, ".", "", -1)
	srcStr = strings.Replace(srcStr, ":", "", -1)
	srcStr = strings.Replace(srcStr, "\"", "", -1)
	srcStr = strings.Replace(srcStr, "'", "", -1)

	srcStr = strings.Replace(srcStr, "；", "", -1)
	srcStr = strings.Replace(srcStr, "，", "", -1)
	srcStr = strings.Replace(srcStr, "。", "", -1)
	srcStr = strings.Replace(srcStr, "：", "", -1)
	srcStr = strings.Replace(srcStr, "、", "", -1)
	srcStr = strings.Replace(srcStr, "’", "", -1)
	srcStr = strings.Replace(srcStr, "‘", "", -1)
	srcStr = strings.Replace(srcStr, "”", "", -1)
	srcStr = strings.Replace(srcStr, "“", "", -1)
	srcStr = strings.Replace(srcStr, "、", "", -1)

	srcStr = strings.Replace(srcStr, "答", "", -1)

	re := regexp.MustCompile("（.*?分）")
	srcStr = re.ReplaceAllString(srcStr, "")

	return srcStr
}



