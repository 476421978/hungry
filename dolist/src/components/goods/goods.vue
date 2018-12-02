<template >
  <div>
  <div class="goods">
    <!--菜单-->
    <div class="menu-wrapper" ref="menuwrapper">
      <ul v-if="goods">
        <li  v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}"
        @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!--菜谱-->
    <div class="foods-wrapper" ref="foodwrapper">
      <ul>
        <li v-for="item in goods" class="food-list-hook"  >
          <h1 class="title">{{item.name}}</h1><!--标题-->
          <ul>
            <li v-for="food in item.foods" class="food-item last-child" @click.stop="selectFood(food,$event)">
              <div class="icon"><!--图片-->
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content"><!--内容-->
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
               <!-- 数量-->
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--购物车-->
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice">
    </shopcart>
  </div>
    <food :food="selectedFood" ref="food" v-on:cart-add="cartAdd"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food.vue';


  const Error_ok = 0;
  export default {
     props:{
       seller:Object
     },
     data(){
       return{
         goods:[],
         scrollY:0,
         listHeight:[],
         selectedFood:{}
       }
     },
     created(){
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        this.$http.get('/api/goods').then((response) => {
         response = response.body;
         if (response.errno === Error_ok) {
           this.goods = response.data;
           this.$nextTick(() => {//在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
             this._initScroll();
             this._calculateHeight();
           });
         }
       });
     },
     methods:{
       selectFood(food,event){
         if(!event.constructor){//预防PC端点击会连续响应两次
           return;
         }
         this.selectedFood = food;
         this.$refs.food.show();
       },
       selectMenu(index,event){//点击菜单 菜谱滚到相应的位置
         if(!event.constructor){//预防PC端点击会连续响应两次
          return;
          }
         let foodlist = this.$refs.foodwrapper.getElementsByClassName('food-list-hook');
         let el = foodlist[index];
         this.foodScroll.scrollToElement(el,300);//el 滚动到的目标元素

       },
       cartAdd(target){//小球动画效果
         this.$nextTick(()=> {//体验优化
           this.$refs.shopcart.drop(target);
         });
       },
       _initScroll(){//初始化滑动
         this.meunScroll = new BScroll(this.$refs.menuwrapper, {
           click: true
         });
         this.foodScroll = new BScroll(this.$refs.foodwrapper,{
           click:true,
           probeType: 3
           //有时候我们需要知道滚动的位置。
           // 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
           // 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
           // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
         });
         //实时监听scroll的位置获取Y的坐标
         this.foodScroll.on('scroll',(pos)=>{
            this.scrollY  = Math.abs(Math.round(pos.y))
         });
       },
       _calculateHeight(){//计算每一个food-list-hook的高度
         let foodlist =  this.$refs.foodwrapper.getElementsByClassName("food-list-hook");
         let height = 0;
         this.listHeight.push(height);
         for(let i=0;i<foodlist.length;i++){
            let item = foodlist[i];
            height += item.clientHeight;//累加
            this.listHeight.push(height);
         }
       },
     },
     computed:{
       currentIndex(){//确定Y坐标的范围 来确定下标i 高亮对应的菜单
          for (let i=0;i<=this.listHeight.length;i++){
              let height1 = this.listHeight[i];
              let height2 = this.listHeight[i+1];
              if(this.scrollY >= height1 && this.scrollY < height2){
                  return i;
              }
          }
        },
       selectFoods(){
            let foods=[];
            this.goods.forEach((good)=> {
              good.foods.forEach((food)=> {
                    if(food.count){//数量不唯零  count属性是自己在cartcontrol中添加的
                      foods.push(food);
                    }
                });
            });
            return foods;
       }
     },
     components:{
       'cartcontrol':cartcontrol,
       'shopcart':shopcart,
       'food':food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .goods{
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
  }

  /*----------左侧菜单------------*/
  .menu-wrapper{
    flex: 0 0 80px;
    width: 80px;
    background-color: #f3f5f7;
  }

  .menu-item{
    display: table;
    height: 54px;
    width: 56px;
    padding: 0 12px;
    line-height: 14px;
    font-size: 12px;
  }


  .menu-wrapper .current{
    position: relative;
    z-index: 10;
    margin-top: -1px;
    background: #fff;
    font-weight: 700;
  }


  /*----图标----*/
  .menu-item .icon{
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
  }
  .menu-item decrease{
    bg-image('decrease_3')
  }
  .menu-item discount{
  bg-image('discount_3')
  }
  .menu-item guarantee{
  bg-image('guarantee_3')
  }
  .menu-item invoice{
  bg-image('invoice_3')
  }
  .menu-item special{
  bg-image('special_3')
  }

  .menu-item .text{
    display: table-cell;
    width: 56px;
    vertical-align: middle;
    border-1px(rgba(7, 17, 27, 0.1));
    font-size: 10px;
  }

  /*----------右边菜谱----------*/
  .foods-wrapper{
    flex: 1;
  }
  .foods-wrapper .title{
    background-color:#f3f5f7;
    height:26px;
    line-height: 26px;
    padding-left: 10px;
    border-left: 2px solid #d9dde1;
    border-top: rgba(7,17,27,0.1);
    font-size: 12px;
    color: rgb(147, 153, 159);
  }
  .food-item{
    display: flex;
    margin: 18px;
    padding-bottom: 18px;
    border-1px(rgba(7, 17, 27, 0.1));
  }
  .food-item :last-child{
    border-none()
    margin-bottom: 0
  }

  .food-item .icon{
    flex: 0 0 57px;
    margin-right: 10px;
    width: 57px;
    height:57px;
  }

  .content{
    flex: 1;
  }
  .food-item .name{
    margin: 2px 0 8px 0;
    height: 14px;
    line-height: 14px;
    font-size: 14px;
    color: rgb(7, 17, 27);
  }

  .desc,.extra{
    line-height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }
  .desc{
    line-height: 12px;
    margin-bottom: 8px;
  }

  .extra .count{
    margin-right: 12px;
  }

  .price{
    font-weight: 700;
    line-height: 24px;
  }

  .now{
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240, 20, 20);
  }

  .old{
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cartcontrol-wrapper{
    position: absolute;
    right: 0;
    bottom: 12px;
  }

</style>
