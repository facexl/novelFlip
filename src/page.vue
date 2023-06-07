<template>
  <div
    class="app"
    @click="cal"
  >
    <div
      id="last"
      class="item last"
    >
      <div
        class="page"
        :style="{
          height:height*3+'px'
        }"
      >
        <b>1</b>{{ text }}
      </div>
    </div>
    <div
      id="current"
      class="item current"
    >
      <div
        class="page"
        :style="{
          height:height*3+'px'
        }"
      >
        <b>1</b>{{ text }}
      </div>
    </div>
    <div
      id="next"
      class="item next"
    >
      <div
        class="page"
        :style="{
          height:height*3+'px'
        }"
      >
        <b>1</b>{{ text }}
      </div>
    </div>
  </div>
</template>
      
<script lang='ts' setup>
const text = new Array(1000).fill('开冲').map((it,i)=>i+it).join()
  
const currentPage = ref(1)
  
const height = window.innerHeight
  

const cal = ()=>{
  document.getElementById('current')!.style.transform = 'translateX(-100%)';
  document.getElementById('next')!.style.transform = 'translateX(0)'
}
      
onMounted(()=>{
  const last = document.getElementById('last') as any
  const current = document.getElementById('current') as any
  const next = document.getElementById('next') as any
  next.scrollTo(0,667)
})
      
</script>
      
  <style lang='less' scoped>
  *{
      box-sizing: border-box;
      transition: all .3s;
  }
  .app{
      height:100vh;
      overflow: hidden;
  }
      .item{
            position: absolute;
            left: 0;
            top:0;
          width:100%;
          height:100vh;
          overflow: hidden;
          line-height: 18px;
          background-color: #efddb8;
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
      .page{
          overflow: hidden;
      }
      .page1{
          border:1px solid red;
          // height:667px;
      }
      .page2{
          border:1px solid blue;
          // height:1334px;
      }
      .page3{
          border:1px solid green;
          // height:2001px;
      }
   </style>