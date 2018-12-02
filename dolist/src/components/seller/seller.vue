<template>
  <div class="sellers" ref="hello">
    <div>
        <!--商家详情-->
        <div class="seller-header">
          <h1 class="text">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="36" :score="5"></star>
            <span class="ratingCount">({{seller.ratingCount}})</span>
            <span class="sellCount">月售{{seller.sellCount}}单</span>
          </div>
          <div class="love">
            <div class="icon-favorite" :class="{'active':favorite}" @click="loveShow"></div>
            <div class="collection">{{favoriteText}}</div>
          </div>
          <div class="fenge border-1px"></div>

          <div class="header-footer ">
            <div class="startMoney">
              <p class="text">起送价</p>
              <p class="text2">20元</p>
            </div>
            <div class="distribution">
              <p class="text">商家配送</p>
              <p class="text2">4元</p>
            </div>
            <div class="a-time">
              <p class="text">平均配送时间</p>
              <p class="text2">39分钟</p>
            </div>
          </div>
        </div>
        <split></split>
        <!--公告活动-->
        <div class="notice">
          <h1 class="text">公告与活动</h1>
          <div class="bulletin">
            <span>{{seller.bulletin}}</span>
          </div>

          <ul v-if="seller.supports" class="supports border-1px">
            <li class="support-item" v-for="(item,index) in seller.supports">
              <span class="icon2" :class="classMap[seller.supports[index].type]"></span><!--图片-->
              <span class="text3">{{seller.supports[index].description}}</span><!--内容-->
            </li>
          </ul>
        </div>
        <split></split>
        <!--商家实景-->
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrapper" ref="picWrapper">
            <ul class="pic-list" ref="picList">
              <li v-for="pic in seller.pics" class="pic-item">
                <img :src="pic" width="120" height="90">
              </li>
            </ul>
          </div>
        </div>
        <split></split>
        <!--商家信息-->
        <div class="info">
          <h1 class="title">商家信息</h1>
          <ul>
            <li v-for="item in seller.infos">
              {{item}}
            </li>
          </ul>
        </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '.././star/star.vue';
  import split from '.././split/split.vue';
  import BScroll from 'better-scroll';
  import {saveToLocal,loadFromLocal} from '../../common/js/stroe';

  export default{
    props:{
      seller:{
          type:Object
      }
    },
    data(){
      return{
          favorite:(()=> {//自动执行函数
            return loadFromLocal(this.seller.id, 'favorite', false)
          })()
      }
    },
    watch:{
        'seller'(){
          this._initScroll();
          this._initPics();
        }
    },
    mounted(){//挂载
      this._initScroll();
      this._initPics();
    },
    created(){//创建
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    computed:{
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    methods:{
      _initScroll(){
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.hello,{
            click:true,
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPics(){
        let picWidth = 120;
        let margin = 6;
        let width = (picWidth + margin) * this.seller.pics.length - margin;
        this.$refs.picList.style.width = width + 'px';

        this.$nextTick(()=> {
          if(!this.picScroll){
            this.picScroll = new BScroll(this.$refs.picWrapper,{
              scrollX: true,  //说明横向滑动
              scrollY:false
            })
          }else{
            this.picScroll.refresh();
          }
        })
      },
      loveShow(){
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
    components:{
      star,
      split
    }
  };

</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  @import "../../common/stylus/mixin.styl";
  .sellers{
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }

  .seller-header{
    padding: 18px;
    position: relative;
  }

  .sellers .text{
    font-size: 14px;
    line-height: 14px;
    color: rgb(7,17,27);
  }

  .sellers .star-wrapper{
    margin-top: 8px;
    display: flex;
    text-align: left;
  }

  .ratingCount{
    margin-left: 8px;
    margin-right: 12px;
    font-size: 10px;
    color: rgb(77,85,93);
    line-height: 18px;
  }

  .sellCount{
    font-size: 10px;
    color: rgb(77,85,93);
    line-height: 18px;
  }

  .love{
    position: absolute;
    top:18px;
    right: 18px;
    padding-left: 13px;
    text-align: center;
  }

  .love .icon-favorite{
    font-size: 24px;
    line-height: 24px;
    width: 50px;
  }

  .love .active{
    color:rgb(240,20,20);
  }

  .love .collection{
    margin-top: 4px;
  }

  .fenge{
    margin-top: 18px;
    border-1px(rgba(7,17,27,0.1));
  }

  /*-------*/
  .header-footer{
    display: flex;
    margin-top: 18px;

  }

  .header-footer .startMoney{
    flex: 1;
    text-align: center;
    margin-top: 18px;
    margin-bottom: 18px;
    border-right: 1px solid rgba(7,17,27,0.1);
  }

  .header-footer .distribution{
    flex: 1;
    text-align: center;
    margin-top: 18px;
    margin-bottom: 18px;
    border-right: 1px solid rgba(7,17,27,0.1);
  }

  .header-footer .a-time{
    flex: 1;
    text-align: center;
    margin-top: 18px;
    margin-bottom: 18px;
  }

  .header-footer .text{
    font-size: 10px;
    color: rgb(147,153,159);
    line-height: 10px;
  }

  .header-footer .text2{
    font-size: 24px;
    font-weight: 200;
    color: rgb(7,17,27);
    line-height: 24px;
  }

  /*---------Notice------------------*/
  .notice{
    padding: 18px;
  }

  .notice .bulletin{
    width: 100%;
    padding: 0 12px 16px 12px;
    font-weight: 100;
    font-size: 12px;
    color: rgb(240,20,20);
    line-height: 24px;
    border-1px(rgba(7,17,27,0.1))
  }

  .notice .supports{
    padding: 16px 12px;
    font-size: 0;
  }

  .notice .support-item{
    padding: 16px 12px 12px 0;
    border-1px(rgba(7, 17, 27, 0.1));
    font-size: 0;
  }
  .supports :last-child{
    border-none()
  }

  .notice .supports .icon2{
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: top;
    margin-right: 6px;
    background-size: 16px 16px;
    background-repeat: no-repeat;
    margin-left: 0;
  }

  .support-item
    .decrease{
      bg-image('decrease_4')
    }
  .support-item
    .discount{
      bg-image('discount_4')
    }
  .support-item
    .guarantee{
      bg-image('guarantee_4')
    }
  .support-item
    .invoice{
      bg-image('invoice_4')
    }
  .support-item
    .special{
      bg-image('special_4')
    }

  .notice .text3{
    font-size: 12px;
    font-weight: 200;
    color: rgb(7,17,27);
    line-height: 16px;
  }

/*------PIC-------*/
  .pics{
    padding: 18px;
  }

  .pics .title{
    margin-bottom: 12px;
    line-height: 14px;
    color: rgb(7, 17, 27);
    font-size: 14px;
  }

  .pic-wrapper{
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
  }

  .pic-list{
    font-size: 0;
  }

  .pic-item{
    display: inline-block;
    margin-left: 6px;
  }

  /*-------Info---------*/
  .info{
    padding: 18px 18px 0 18px;
    color:rgb(7,17,27)
  }

  .info .title{
    padding-bottom: 12px;
    border-1px(rgba(7,17,27,0.1))
  }

  .info li{
    padding: 16px 12px;
    font-size: 12px;
    font-weight: 200;
    line-height: 16px;
    border-1px(rgba(7,17,27,0.1));
  }

  .info li:last-child{
    border-none();
  }


</style>
