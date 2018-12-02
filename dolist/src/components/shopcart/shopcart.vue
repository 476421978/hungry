<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left">
          <!--购物车图标-->
          <div class="logo-wrapper"  @click="shopcartDeal">
            <div class="logo" :class="{'highLightLogo':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highLightImage':totalCount>0}"></i>
            </div>
            <div class="num" :class="{'numShow':totalCount<=0}">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highLightPrice':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click="pay">
           {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group
          name="bar"
          v-on:before-enter="beforeEnter"
          v-on:enter="enter"
          v-on:afterEnter="afterEnter"
          >
          <div  v-for="(ball,index) in balls" :key="index" v-show="ball.show" class="ball">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <!--购物车详情-->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
            <div class="list-header">    <!--头部-->
              <h1 class="title">购物车</h1>
              <span class="empty" @click="empty">清除</span>
            </div>
            <div class="list-content" ref="listcontent">    <!--内容-->
              <ul>
                <li class="food" v-for="food in selectFoods">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>{{food.price * food.count}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </li>
              </ul>
            </div>
        </div>
      </transition>
    </div>
    <transition name="mask">
      <div class="list-mask" v-show="listShow" @click="hideList">
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from "../cartcontrol/cartcontrol.vue"
  import BScroll from 'better-scroll';
  export default{
    props:{
      selectFoods:{
        type:Array,
/*        default(){//测试
            return [//返回的是一个对象数组
              {
                price:1,
                count:1
              }
            ]
        }*/
      },
      deliveryPrice:{
        type:Number,
        dafault:0
      },
      minPrice:{
        type:Number,
        default:0
      }
    },
    data() {
      return{
          balls:[
            {
              show:false
            },
            {
              show:false
            },
            {
              show:false
            },
            {
              show:false
            },
            {
              show:false
            }
          ],
          dropBalls:[],
          fold: true
      };
    },
    computed:{
      totalCount(){
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      totalPrice(){
          let price = 0;
          this.selectFoods.forEach((food)=> {
             price += food.count * food.price;
          });
          return price;
      },
      payDesc(){
          if(this.totalPrice === 0){
            return `还差${this.minPrice}元起送`;
          }else if(this.minPrice > this.totalPrice){
            let deff =this.minPrice - this.totalPrice ;
            return `还差${deff}元起送`;
          }else{
            return "去结算";
          }
      },
      payClass(){
          if(this.totalPrice >= this.minPrice){
              return 'enough';
          }else{
              return 'not-enough';
          }
      },
      listShow() {//每一次商品更新 都会触发
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(()=> {
              if(!this.scroll){//避免每次数据更新都要初始化  避免点击一次变十次的问题
                this.scroll = new BScroll(this.$refs.listcontent,{
                click:true
                });
              }else{
                  this.scroll.refresh();//重新初始化
              }
          });
        }
        return show;
      }
    },
    methods:{
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {//小球动画效果
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el,done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done)
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      cartDealShow(){
          if(this.cartShow){
            this.cartShow = false;
          }else{
            this.cartShow = true;
          }
         if (this.cartShow) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listcontent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return cartShow;
      },
      shopcartDeal(){
         if(!this.totalCount){
             return;
         }else{
           this.fold = !this.fold;
         }
      },
      empty(){
          this.selectFoods.forEach((food)=> {
              food.count=0;
          });
      },
      hideList(){
          this.fold = !this.fold;
      },
      pay(){
          if(this.totalPrice<this.minprice){
              return;
          }
          window.alert(`支付${this.totalPrice +4}`);
      }
    },
    components:{
      cartcontrol,
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.shopcart{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
}
  .shopcart .content{
    display: flex;
    background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, 0.4);
    margin-left: 0;
  }

  .content-left{
    flex: 1;
  }

  .logo-wrapper{
    display: inline-block;
    vertical-align: top;
    position: relative;
    top: -10px;
    margin: 0 12px;
    padding: 6px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    border-radius: 50%;
    background: #141d27;
  }
  .logo{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    text-align: center;
    background: #2b343c;
  }

  .highLightLogo{
    background: rgb(0,160,220);
  }


  .icon-shopping_cart{
    line-height: 44px;
    font-size: 24px;
    color: #80858a;
  }

  .highLightImage{
    color:#fff;
  }

  /*购物车右上角数量*/
  .num{
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 16px;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background: rgb(240, 20, 20);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
  }

  .numShow{
    display: none;
  }

  .content-left .price{
    display: inline-block;
    vertical-align: top;
    margin-top: 12px;
    line-height: 24px;
    padding-right: 12px;
    box-sizing: border-box;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 16px;
    font-weight: 700;
  }

  .highLightPrice{
    color:#fff;
  }

  .content-left .desc{
    display: inline-block;
    font-size: 10px;
    margin: 12px 0 0 12px;
    font-weight: 700;
    line-height: 24px;
  }


  /*---------结算按钮----------*/
.content-right{
  flex: 0 0 105px;
  width: 105px;
}

.pay{
  font-size: 12px;
  line-height: 48px;
  text-align: center;
  font-weight: 700;
  background-color: #2b333b ;
}

.not-enough{
  background: #2b333b;
}

.enough{
  background: #00b43c;
  color: #fff;
}

  /*-------------------*/
  .ball-container{
    position: fixed;
    width: 80px;
    left: 32px;
    bottom: 22px;
    color: #f3f5f7;
  }

    .ball{
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
    }

.bar-enter-active{
  transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
}

.ball-container .inner{
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(0, 160, 220);
  transition: all 0.4s linear;

}


  /*--------------购物车详情----------------*/
.shopcart-list{
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  background-color:#fff ;
  width: 100%;
  transform: translate3d(0,-100%,0);
}

.fold-enter-active,.flod-leave-active{
  transition: all 0.4s linear;
}

.fold-enter, .fold-leave-to{
  transition: all 0.4s linear;
  transform: translate3d(0,0,0);
}

.list-header{
  height: 40px;
  line-height: 40px;
  padding: 0 18px;
  background: #f3f5f7;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}

.list-header .title{
float: left;
font-size: 14px;
color: rgb(7, 17, 27);
}

.list-header .empty{
  float: right;
  font-size: 12px;
  color: rgb(0, 160, 220);
}

.list-content{
  max-height: 217px;
  width: 100%;
  overflow: hidden;
  background: #fff;
}

.list-content .food{
  position: relative;
  padding: 12px 0;
  box-sizing: border-box;
}

.list-content .name{
  line-height: 24px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}

.list-content .price{
  position: absolute;
  right: 90px;
  bottom: 12px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(240, 20, 20);
}

.list-content .cartcontrol-wrapper{
  position: absolute;
  right: 0;
  bottom: 6px;
}

.list-mask{
  position: fixed;
  left:0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  background-color: rgba(7,17,27,0.6);
}

  .mask-enter-active,.mask-leave-active{
    transition: all 0.5s linear;
  }

  .mask-enter,.mask-leave-to{
    transition: all 0.5s linear;
    opacity: 0;
  }



</style>
