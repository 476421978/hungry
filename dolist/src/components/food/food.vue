<template>
  <transition name="all">
    <div v-show="foodDetailShow" class="food-all" ref="foodall">
    <div food-content>

      <div class="food-heard">
        <div class="food-image"><!--图像-->
        <img :src="food.image">
        <div class="back"><!--返回-->
          <i class="icon-arrow_lift" @click.stop="hide"></i>
        </div>
      </div>
      </div>

      <div class="food-detail"><!--简介-->
          <span class="name">{{food.name}}</span>
          <div class="food-ratings">
            <span>月售{{food.sellCount}}份</span>
            <span>好评率{{food.rating}}%</span>
          </div>
          <div class="food-price">
            <span class="new-price">￥{{food.price}}</span>
            <!--<span class="old-price">￥30</span>-->
          </div>
          <div class="cartcontrol-wrapper" v-show="food.count>0">
            <cartcontrol :food="food" ref="cartcontrol" ></cartcontrol>
          </div>
          <transition name="fade"><!--加入动画效果 延迟消失 小球动画计算才能正确-->
            <div class="food-cart" v-show="!food.count || food.count===0" @click.stop="addFirst($event)">
              加入购物车
            </div>
          </transition>
        </div>

      <div class="food-info">
        <h1>商品介绍</h1>
        <span>{{food.info}}</span>
      </div>


      <div class="rating">
        <h1 class="title">商品评价</h1>
        <ratingselect :ratings="food.ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc"
                    v-on:type-select="typeSelect"
                    v-on:content-only="contentOnly">
        </ratingselect>
        <!--评论-->
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_down':rating.rateType===1,'icon-thumb_up':rating.rateType===0}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings|| !food.ratings.length">暂无评价</div>
        </div>
      </div>

    </div>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import Vue from 'vue';
  import ratingselect from '../ratingselect/ratingselect.vue'
  import {formatDate} from '../.././common/js/date';
  const ALL = 2;
export default{
    props:{
      food:{
            type:Object
        }
    },
    data(){
        return{
          foodDetailShow:false,
          selectType:ALL,
          onlyContent:false,
          desc:{
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        }
    },
    methods:{
      _initScroll(){
          this.scroll = new BScroll(this.$refs.foodall,{
            click:true,
          });
      },
      show(){//弹出具体商品的详情框  父组件可以调用子组件的方法
        this.foodDetailShow = true;
     /*   this.selectType = ALL;
        this.onlyContent = false;*/
        this.$nextTick(()=> {
          this._initScroll();
        });
      },
      hide(){
        this.foodDetailShow = false;
      },
      addFirst(event){//购物车第一次添加商品
        if(!event._constructed){
              return;
          }
        this.$emit('cart-add',event.target);//添加小球动画效果
        Vue.set(this.food,"count",1);
      },
      needShow(type,text){
        if(this.onlyContent && !text){
          return;
        }
        if(this.selectType===ALL){
          return true;
        }else{
          return type === this.selectType;
        }
      },
      typeSelect(target){
        this.selectType = target;
        this.$nextTick(()=> {
          this.scroll.refresh();
        });
      },
      contentOnly(target){
        this.onlyContent = target;
        this.$nextTick(()=> {
          this.scroll.refresh();
        });
      }
    },
    filters:{
      formatDate(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm');
      }

    },
    components:{
      cartcontrol,
      ratingselect
    }
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .food-all{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 48px;
    width: 100%;
    background-color: #f3f5f7;
    font-size: 0;
    overflow: hidden;
    z-index: 30;
  }

  .all-enter-active,.all-leave-active{
    transition: all 0.2s;
    transform: translate3d(0,0,0);
  }

  .all-enter,.all-leave-to{
    transform: translate3d(100%,0,0);
  }
  /*-----------------2015-12-31 发布巧用margin/padding的百分比值实现高度自适应（多用于占位，避免闪烁）---------------------*/
  .food-heard{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
  }

  .food-image img{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .back{
    position: absolute;
    left: 0;
    top:10px;
  }

  .icon-arrow_lift{
    padding: 10px;
    font-size: 20px;
    color: #fff;
  }

/*--------------商品价格介绍--------------------*/
  .food-detail{
    position: relative;
    padding: 18px;
    background-color: #fff;
  }

  .food-detail .name{
    line-height: 14px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(7, 17, 27);
  }

  .food-detail .food-ratings{
    margin-bottom: 18px;
    line-height: 10px;
    height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
    padding-top: 8px;
  }

  .food-detail .food-price{
    font-size: 14px;
    font-weight: 700;
    line-height: 24px;
    color: rgb(240, 20, 20);
    margin-right: 8px;
  }

  .food-cart{
    position: absolute;
    right: 18px;
    bottom: 18px;
    width: 74px;
    height: 24px;
    background-color: rgb(0,160,220);
    border-radius: 24px;
    font-size: 10px;
    color: rgb(255,255,255);
    text-align: center;
    line-height: 24px;
  }

  .fade-enter-active,.fade-leave-active{
    transition: all 0.2s;
    opacity: 1;
  }

  .fade-enter,.fade-leave-to{
    opacity: 0;
  }

 /*-------------------------------------------*/
  .food-info{
    margin-top: 16px;
    padding: 18px;
    background-color: #fff;
  }
  .food-info h1{
    font-size: 15px;
    color: #000;
    margin-bottom: 6px;
  }
  .food-info span{
    font-size: 12px;
    font-weight: 200;
    color: rgb(75,85,93);
    line-height: 24px;
  }
  /*--------------------------------------*/
  .rating-wrapper{
    padding: 0 18px;
  }

  .rating-item{
    position: relative;
    padding: 16px 0;
    border-1px(rgba(7, 17, 27, 0.1));
  }

  .time{
    margin-bottom: 6px;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .user{
    position: absolute;
    right: 0;
    top:16px;
    font-size: 10px;
    color: rgb(147,153,159);
    line-height: 12px;
  }

  .user .name{
    display: inline-block;
    vertical-align: top ;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .avatar{
    border-radius: 50%;
  }

  .rating-item .text{
    line-height: 16px;
    font-size: 12px;
    color: rgb(7, 17, 27);
  }

  .icon-thumb_up{
    margin-right: 4px;
    line-height: 16px;
    font-size: 12px;
    color: rgb(0, 160, 220);
  }

  .icon-thumb_down{
    margin-right: 4px;
    line-height: 16px;
    font-size: 12px;
    color: rgb(147, 153, 159)
  }

  .no-rating{
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147, 153, 159);
  }

</style>
