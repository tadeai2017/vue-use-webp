# vue-use-webp
通过vue指令的方式来更方便的使用webp图片，支持src属性和backgroundImage属性
## Features
	1. 若传入base64图片资源则自动忽略，不进行任何处理
	2. 支持src属性和backgroundImage属性
	3. 若webp图片加载失败，则自动使用初始传入的图片格式（如png、jpg等）
	4. webp图片兼容性参考 https://www.caniuse.com/?search=webp
## Installation
```
npm install vue-use-webp
```
## Usage
### main.js
```
import Vue from "vue"
import VueUseWebp from "vue-use-webp"

Vue.use(VueUseWebp)
```
### component
1. src方式使用远程图片
```
<img v-webp="'https://newimage-demo.oss-cn-hangzhou.aliyuncs.com/smile.jpeg'"/>
```
2. src方式使用本地图片
```
<img v-webp="require('static/test.png')"/>
```
3. 使用变量
```
<img v-webp="url"/>
<script>
    export default {
        data() {
            return {
                url: require('static/test.png')
            }
        }
    }
</script>
```
4. background-image方式使用
```
<div v-webp:bg="require('static/test.png')"></div>
```
