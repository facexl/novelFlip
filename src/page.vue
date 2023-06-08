<template>
  <div
    class="app totalHeight"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
  >
    <div
      v-for="(item,i) in state.pages"
      :key="i"
      class="item"
      :style="{
        transform:item.transform,
        height:state.height+'px',
        lineHeight:state.lineHeight+'px'
      }"
    >
      <div
        class="page"
        :style="{
          height:item.innerHeight
        }"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
  <div class="pagenation">
    {{ state.currentPage===state.totalPage?'最后一页':state.currentPage }}
  </div>
  <div
    v-if="state.showtotal"
    id="total"
    ref="total"
    class="item"
    :style="{
      lineHeight:state.lineHeight+'px',
      opacity:0
    }"
  >
    {{ text }}
  </div>
</template>
      
<script lang='ts' setup>
import { text } from './text2'
  
const setLineHeight = ()=>{
  // 获取设备高度
  const deviceHeight = window.innerHeight || document.documentElement.clientHeight;
  // 容器高度 
  state.height = deviceHeight - 50
  // 转换成偶数
  state.height = state.height % 2 === 0 ? state.height:(state.height+1)
  // 设置默认 line-height
  let lineHeight = 20;
  let max = 40
  let result = 0;
  for(let i=lineHeight;i<max;i=i+0.5){
    if(state.height % i === 0){
      result = i;
      break
    }
  }
  if(!result){
    for(let i=lineHeight;i<max;i=i+0.5){
      if(state.height % i /i <0.2){
        result = i;
        break
      }
    }
  }
  // 返过来计算容器高度
  state.height = result * Math.ceil(state.height/result)
  state.lineHeight = result
  console.log('设备高度:',deviceHeight,'容器高度',state.height,'计算出的合适的line-height',state.lineHeight)
}

const total = ref()

const state = reactive<{
    showtotal:boolean,
    totalPage:number,
    currentPage:number,
    lineHeight:number,
    height:number,
    pages:{
      transform:string,
      innerHeight:string,
      text:string
    }[]
}>({
  showtotal:false,
  totalPage:0,
  currentPage:1,
  pages:[],
  lineHeight:0,
  height:0
})
  
// state.currentPage 1 2
// i 0 0+1-2
// trans 0 -100

const next = ()=>{
  if(state.currentPage===state.totalPage)return
  state.currentPage++
  state.pages.forEach((it,i)=>{
    it.transform = `translateX(${100*(i+1-state.currentPage)}%)`;
    it.text = i >= state.currentPage-2 && i<=state.currentPage+2 ? text : ''
  })
}
const last = ()=>{
  if(state.currentPage===1)return
  state.currentPage--
  state.pages.forEach((it,i)=>{
    it.transform = `translateX(${100*(i+1-state.currentPage)}%)`;
    it.text = i >= state.currentPage-2 && i<=state.currentPage+2 ? text : ''
  })
}

const calTotalPage = ()=>{
  const totalHeight = total.value.offsetHeight
  state.totalPage = +Math.ceil(totalHeight/state.height).toFixed(0)
  state.pages = new Array(state.totalPage).fill(0).map((_,i)=>{
    return {
      transform:`translateX(${100*i}%)`,
      innerHeight:state.height*state.totalPage+'px',
      text:i===0?text:''
    }
  })
  state.showtotal = false
}

const init = ()=>{
  [...document.querySelectorAll('.item')].forEach((el,i)=>{
    el.scrollTo(0,state.height*i)
  })
}

let xDown:number|null = null;
let yDown:number|null = null;
let dis = 3

const handleTouchStart = (event:TouchEvent)=>{
  const firstTouch = event.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}
const handleTouchMove = (event:TouchEvent)=>{
  if (!xDown || !yDown) {
    return;
  }
  const xDiff = event.touches[0].clientX - xDown;
  const yDiff = event.touches[0].clientY - yDown;
  console.log(xDiff,yDiff)
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > dis) {
      console.log("右滑");
      last()
    } else if (xDiff < -dis) {
      console.log("左滑");
      next()
    }
  }

  xDown = null;
  yDown = null;
}
      
onMounted(()=>{
  setLineHeight()
  state.showtotal = true
  setTimeout(()=>{
    calTotalPage()
    setTimeout(()=>{
      init()
    },50)
  },50)

})
      
</script>
      
  <style lang='less' scoped>
  .app{
      position: relative;
      height:100vh;
      overflow: hidden;
      background-color: #efddb8;
  }
      .item{
          position: absolute;
          left: 0;
          top:0;
          width:100%;
          padding:0 10px;
          overflow: hidden;
          border:1px solid red;
        //   margin-top:30px;
          transition: transform .3s ease-in-out;
          background: inherit;
          font-size: 20px;
      }
      .last{
          background-color: gray;
          transform: translateX(-100%);
      }
      .current{
          background-color:coral;
      }
      .next{
          background-color:yellowgreen;
          transform: translateX(100%);
      }
      .page,#total{
          overflow: hidden;
          white-space: pre-wrap;
            word-break: break-all;
            word-spacing: normal;
      }
      
      .pagenation{
        position: fixed;
        width:100%;
        bottom:20px;
        left:0;
        text-align: center;
        font-size: 16px;
        z-index:666;
      }
   </style>