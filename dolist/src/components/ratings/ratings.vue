<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">

      <div class="rating-header">
        <div class="header-left">
          <h1>{{seller.score}}</h1>
          <div class="score">综合评分</div>
          <div class="text">{{seller.rankRate}}%</div>
        </div>
        <div class="header-right">
          <div class="star-wrapper">
            <span class="text">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="star-wrapper">
            <span class="text">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="text">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect
        :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"
        v-on:type-select="typeSelect"
        v-on:content-only="contentOnly">
      </ratingselect>

      <div class="ratings-wrapper">
          <ul>
            <li v-for="rating in ratings"  class="rating-item" v-show="needShow(rating.rateType, rating.text)">

              <div class="avatar"><!--头像-->
                <img width="28" height="28" :src="rating.avatar">
              </div>

              <div class="content"><!--内容-->
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <star :size="36" :score="rating.score">
                  </star>
                  <span class="end">{{rating.deliveryTime}}分钟送达</span>
                </div>
              </div>

              <p class="text-content">{{rating.text}}</p>

              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <i :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></i>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>

              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>

            </li>
          </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import star from 'components/star/star';
  import ratingselect  from '../ratingselect/ratingselect.vue';
  import split from  '../split/split.vue';
  import {formatDate} from '../../common/js/date';
  const Error_ok = 0;
  const ALL = 2;
  export default {
      props:{
        seller:{
            type:Object
        }
      },
      data(){
        return {
          ratings: [],
          selectType: ALL,
          onlyContent: true,
          desc:{
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        };
      },
      created(){
          this.$http.get(`api/ratings`).then((response)=> {//获取数据
            response = response.body;
            if(response.errno === Error_ok){
                this.ratings = response.data;
                console.log(this.ratings)
            }
          });
          this.$nextTick(() => {//初始化 滑动
            this._initScroll();
          });
       },
      methods:{
        _initScroll(){
          this.scroll = new BScroll(this.$refs.ratings,{
            click:true,
          });
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
            return formatDate(date,'yyyy-MM-dd hh-mm');
        }
      },
      components:{
        star,
        ratingselect,
        split
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
.ratings{
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
}

  .rating-header{
    display: flex;
    padding: 18px 0;
  }

  .header-left{
    flex: 0 0 137px;
    padding: 6px 0;
    width: 137px;
    border-right: 1px solid rgba(7, 17, 27, 0.1);
    text-align: center;
  }

   @media only screen and (max-width: 320px){
     .header-left{
       flex: 0 0 120px;
       width: 120px
     }
  }

  .header-left h1{
    margin-bottom: 6px;
    line-height: 28px;
    font-size: 24px;
    color: rgb(255, 153, 0);
  }

  .header-left .score{
    font-size: 12px;
    line-height: 12px;
    color: rgb(7,17,27);
    padding-bottom: 8px;
  }

  .header-left .text{
    font-size: 10px;
    line-height: 10px;
    color: rgb(147,157,159);
  }

  .header-right{
    display: inline-block;
    flex: 1;
    padding: 6px 0 6px 24px;
  }

    @media only screen and (max-width: 320px){
      .header-right{
        padding: 6px 0 6px 12px;
      }
    }

/*--------------星星---------------------*/
  .header-right .star-wrapper{
    margin-top: 0;
    margin-bottom: 6px;
    display: inline-block;
  }

  .header-right .star{
    display: inline-block;
    margin: 0 12px;
    vertical-align: top;
  }

  .header-right .star-wrapper .text{
    display: inline-block;
    font-size: 12px;
    line-height: 18px;
    color: rgb(7,17,27);
  }

  .header-right .star-wrapper .score{
    display: inline-block;
    line-height:18px;
    font-size: 12px;
    color: rgb(255, 153, 0);
  }

  .delivery-wrapper .text{
    display: inline-block;
    font-size: 12px;
    line-height: 18px;
    color: rgb(7,17,27);
  }

  .delivery-wrapper .delivery{
    padding-left: 12px;
    line-height: 18px;
    font-size: 12px;
    color: rgb(147,157,159);
  }


 /*--------------------评论-----------------------*/
.ratings-wrapper{
  padding: 18px ;
}

  .rating-item{
    position: relative;
  }

  .rating-item .name{
    font-size: 10px;
    line-height: 12px;
    color: rgb(7,17,27);
  }

  .rating-item .end{
    font-size: 10px;
    font-weight: 200;
    color: rgb(147,153,159);
    line-height: 12px;
  }


  .content .star-wrapper{
    margin-top: 4px;
    margin-bottom: 6px;
  }

  .content .star{
    display: inline-block;
  }

  .text-content{
    margin-bottom: 8px;
    line-height: 18px;
    color: rgb(7, 17, 27);
    font-size: 12px;
  }

  .time{
    position: absolute;
    right:18px;
    top:0;
  }

  .recommend{
    line-height: 16px;
    font-size: 0;
  }

  .recommend .icon-thumb_up, .item{
    color: rgb(0, 160, 220);
    display: inline-block;
    margin: 0 8px 4px 0;
    font-size: 9px;
  }

  .item{
    padding: 0 6px;
    border: 2px solid rgba(7, 17, 27, 0.1);
    border-radius: 1px;
    color: rgb(147, 153, 159);
    background: #fff;
  }
</style>
