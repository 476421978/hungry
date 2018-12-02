<template>
      <div class="star" :class="starType">
        <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
      </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';//全星
  const CLS_HALF = 'half';//半星
  const CLS_OFF = 'off';//无星
  export default {
      props:{
          size:{
              type:Number
          },
          score:{
              type:Number
          }
      },
      computed:{
          starType(){
              return "star-" + this.size;
          },
         itemClasses() {/*-------计算评分来选择星星的展示------*/
            let result = [];
            let score = Math.floor(this.score * 2) / 2;/*判断是否有全星*/
            let hasDecimal = score % 1 !== 0; /*判断是否有半星*/
            let integer = Math.floor(score);
            for (let i = 0; i < integer; i++) {
              result.push(CLS_ON);
            }
            if (hasDecimal) {
              result.push(CLS_HALF);
            }
            while (result.length < LENGTH) {/*剩下全是没星的*/
              result.push(CLS_OFF);
            }
            return result;
          }
       }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .star{
    font-size:0;
  }
  .star-item{
    display: inline-block;
    background-repeat: no-repeat;
  }
  /*-------------星星样式--------------*/
  .star-48
    .star-item.on{
      width: 20px;
      height: 20px;
      margin-right: 22px;
      background-size: 20px 20px;
      bg-image('star48_on');
    }

  .star-48
    .star-item.half{
      width: 20px;
      height: 20px;
      margin-right: 22px;
      background-size: 20px 20px;
      bg-image('star48_half');
    }

  .star-48
    .star-item.off{
      width: 20px;
      height: 20px;
      margin-right: 22px;
      background-size: 20px 20px;
      bg-image('star48_off');
    }
/*----------------------------*/
  .star-36
    .star-item.on{
      width: 15px;
      height: 15px;
      margin-right: 6px;
      background-size: 15px 15px;
      bg-image('star36_on');
    }
  .star-36
    .star-item.half{
      width: 15px;
      height: 15px;
      margin-right: 6px;
      background-size: 15px 15px;
      bg-image('star36_half');
  }
  .star-36
    .star-item.off{
      width: 15px;
      height: 15px;
      margin-right: 6px;
      background-size: 15px 15px;
      bg-image('star36_off');
  }

  /*---------------------------------*/
 .star-24
  .star-item.on{
    width: 10px;
    height: 10px;
    margin-right: 3px;
    background-size: 10px 10px;
    bg-image('star24_on');
  }
  .star-24
    .star-item.half{
      width: 10px;
      height: 10px;
      margin-right: 3px;
      background-size: 10px 10px;
      bg-image('star24_half');
  }
  .star-24
    .star-item.off{
      width: 10px;
      height: 10px;
      margin-right: 3px;
      background-size: 10px 10px;
      bg-image('star24_off');
  }
</style>
