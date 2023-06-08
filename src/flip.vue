<template>
  <div
    class="app totalHeight"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div
      class="itembox"
      :style="{
        height:height+'px',
      }"
    >
      <div
        v-for="(item,i) in state.pages"
        :key="i"
        class="item"
        :style="{
          zIndex:item.zindex,
          height:height+'px',
          lineHeight:lineHeight+'px',
          transition:state.transition
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
      lineHeight:lineHeight+'px',
      opacity:0
    }"
  >
    {{ text }}
  </div>
</template>
        
<script lang='ts' setup>
import { text } from './text'
    
const height = 600
  
const lineHeight = 25

const width = window.innerWidth

const doms:{
    current:HTMLElement|null,
    last:HTMLElement|null,
} = {
  current:null,
  last:null,
}
  
const total = ref()
  
const state = reactive<{
      showtotal:boolean,
      totalPage:number,
      currentPage:number,
      pages:{
        transform:string,
        innerHeight:string,
        text:string,
        zindex:number
      }[],
      transition:string
  }>({
    showtotal:true,
    totalPage:0,
    currentPage:1,
    pages:[],
    transition:''
  })
    
// state.currentPage 1 2
// i 0 0+1-2
// trans 0 -100
  
const calTotalPage = ()=>{
  const totalHeight = total.value.offsetHeight
  state.totalPage = +Math.ceil(totalHeight/height).toFixed(0)
  state.pages = new Array(state.totalPage).fill(0).map((_,i)=>{
    return {
      transform:'',
      innerHeight:height*state.totalPage+'px',
      text:i >= state.currentPage-2 && i<=state.currentPage+2 ? text : '',
      zindex:state.totalPage-i
    }
  })
  state.showtotal = false
}
  
const init = ()=>{
  [...document.querySelectorAll('.item')].forEach((el,i)=>{
    el.scrollTo(0,height*i)
  })
  setDoms()
}

const setDoms = ()=>{
  const allItem = document.querySelectorAll('.item');
  doms.current = allItem[state.currentPage-1] as HTMLElement
  doms.last = state.currentPage>1?allItem[state.currentPage-2] as HTMLElement :null
}
  
let xDown:number|null = null;
let yDown:number|null = null;
let dis = 2;
let direction:'left'|'right'|'' = ''
let lastNeedTransform:number = 0
let startTime:number = 0
  
const handleTouchStart = (event:TouchEvent)=>{
  startTime = +new Date()
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

  if (Math.abs(xDiff) < Math.abs(yDiff)) {
    if(direction){
      // 中途上下滑动
    }else{
      console.log("上下滑动 不管");
      // 一开始就上下滑动
      reset()
      return
    }
  }

  // 第一时间判断是左还是右
  if(!direction){
    if (xDiff > dis) {
      console.log("右滑");
      direction = 'right'
    } else if (xDiff < -dis) {
      console.log("左滑");
      direction = 'left'
    }
  }

  let needTransform = xDiff*100/width
  let dom;
  let res = ''


  if(direction==='left'){
    if(state.currentPage===state.totalPage){
      reset()
      return
    }
    if(needTransform>=0){
      needTransform = 0
    }
    dom = doms.current
    res = `translate3d(${needTransform}%,0,0)`
  }else{
    if(state.currentPage===1){
      reset()
      return
    }
    let fixedTransform = -100+needTransform
    if(fixedTransform>=0){
      fixedTransform = 0
    }
    dom = doms.last
    res = `translate3d(${fixedTransform}%,0,0)`
  }
  // console.log('时间太短不动')
  if(+new Date()-startTime>100){
    dom!.style.transform = res
    dom!.style.boxShadow = '5px 0 3px rgba(0, 0, 0, 0.3)'
  }

  lastNeedTransform = needTransform
  
}

watch(()=>state.currentPage,(current,prev)=>{
  console.log('currentPage change current,prev',current,prev)
  setDoms()
  state.pages.forEach((it,i)=>{
    it.text = i >= state.currentPage-2 && i<=state.currentPage+2 ? text : ''
  })
})

const newPage = ()=>{
  state.transition = 'transform .3s ease-in'
  if(direction === 'left'){
    doms.current!.style.transform = `translate3d(-100%,0,0)`
    state.currentPage++
  }
  if(direction === 'right'){
    doms.last && (doms.last!.style.transform = '')
    state.currentPage--
  }
  setTimeout(()=>{
    state.transition = 'transform .1s'
  },50)
}

const handleTouchEnd = ()=>{
  // 小于100毫秒就是快速翻页
  if(+new Date()-startTime<100){
    newPage()
    reset()
    return
  }
  // 非快速翻页
  state.transition = 'transform .1s'
  console.log(lastNeedTransform,direction,123)
  if(direction){
    if(Math.abs(lastNeedTransform)>=40){
      newPage()
    }else{
      if(direction === 'left'){
        doms.current!.style.transform = ''
      }
      if(direction === 'right'){
        doms.last && (doms.last!.style.transform = `translate3d(-100%,0,0)`)
      }
    }
  }
  reset()
}

const reset = ()=>{
  xDown = null;
  yDown = null;
  direction = ''
  lastNeedTransform = 0
  setTimeout(()=>{
    doms.current && (doms.current.style.boxShadow = '')
    doms.last && (doms.last.style.boxShadow = '')
  },300)
  startTime = 0
}
        
onMounted(()=>{
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
        height:100vh;
        overflow: hidden;
        background-color: #efddb8;
        perspective: 800px; /* 设置视角距离 */
    }
    .itembox{
        margin-top:30px;
        width:100%;
        overflow: hidden;
        position: relative;
    }
        .item{
            position: absolute;
            left: 0;
            top:0;
            width:100%;
            padding:0 10px;
            overflow: hidden;
            // border:1px solid red;
            // margin-top:30px;
            // transition: transform .1s;
            backface-visibility: hidden; /* 可以避免一些闪屏或者重影问题 */
            // box-shadow: 5px 0 3px rgba(0, 0, 0, 0.3);
            background-color: #efddb8;
            transform-style: preserve-3d;
            backface-visibility: hidden; /* 可以避免一些闪屏或者重影问题 */
        }
        .page{
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