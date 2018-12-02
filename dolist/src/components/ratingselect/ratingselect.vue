<template>
  <div class="ratingselect " >
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="positive" :class="{'active':selectType===2}">
        {{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="positive" :class="{'active':selectType===0}">
        {{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="negative" :class="{'active2':selectType===1}">
        {{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>

    <div class="switch" @click="toggleContent($event)" >
      <span class="icon-check_circle" :class="{'on':onlyContent}" ></span>
      <span class="text">只看有内容的评价</span>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  const ALL = 2;
  const POSITIVE = 0;
  const NEGATIVE = 1;
export default{
  props: {
    ratings: {
      type: Array,
      default() {//没有就返回默认值
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc:{
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  },
  computed:{
    positives(){//过滤评论的类型
      return this.ratings.filter((rating)=> {
          return rating.rateType===POSITIVE;
      })
    },
    negatives(){
      return this.ratings.filter((rating)=> {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods:{
    select(type,event){
      if (!event._constructed) {
        return;
      }
      /*this.selectType = type;*/
      this.$emit('type-select',type);//只能通知父组件来更新
    },
    toggleContent(event){
      if (!event._constructed) {
        return;
      }
      /*this.onlyContent = !this.onlyContent;*/
      this.$emit('content-only',!this.onlyContent);
    }
  },

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
 .ratingselect{
   margin-top: 18px;
   padding: 18px;
   background-color: #fff;
   border-1px(rgba(7,17,27,0.1));
   font-size: 0;
 }

   .positive{
    display: inline-block;
    padding: 8px 12px;
    background-color: rgba(0,160,220,0.2);
    font-size: 12px;
    line-height: 16px;
    color: rgb(77,85,93);
    margin-right: 8px;
    border-radius: 2px;
  }

    .rating-type .active{
      color: #fff;
      background-color: rgb(0,160,220);
   }

   .negative{
    display: inline-block;
    padding: 8px 12px;
    font-size: 12px;
    line-height: 16px;
    color: rgb(77,85,93);
    border-radius: 2px;
    background-color: rgba(77,85,93,0.2);
  }

   .rating-type .active2{
     background: rgb(77, 85, 93);
     color: #fff;
   }

  .count{
    margin-left: 2px;
  }


  /*------------*/
 .switch{
   padding: 12px 18px;
   line-height: 24px;
   border-bottom: 1px solid rgba(7, 17, 27, 0.1);
   color: rgb(147, 153, 159);
   font-size: 0;
 }

  .icon-check_circle{
    display: inline-block;
    vertical-align: top;
    color: rgb(147,153,159);
    font-size: 24px;
  }

  .switch .on{
    color: #00c850;
  }

  .text{
    display: inline-block;
    vertical-align: top;
    font-size: 12px;
    color: rgb(147,153,159);
    line-height: 24px;
  }

</style>
