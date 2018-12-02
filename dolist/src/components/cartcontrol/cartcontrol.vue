<template>
  <div class="cartcontrol">

    <transition name="slide-fade">
      <div class="cart-decrease" v-show="food.count>0" @click.stop="decreaseCard">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>

    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>

    <div class="cart-add icon-add_circle" @click.stop="addCard">
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default{
    props: {
      food: {
        type: Object
      }
    },
    methods:{
        addCard(event){
          if (!event._constructed) {//防止点击一次变多次
            return;
          }
          if (!this.food.count) {
            //this.food.count = 1; //没效果
            /*添加新属性 才能被检测到变化*/
            Vue.set(this.food, 'count', 1);
          } else {
            this.food.count++;
          }
          //获取并把添加按钮这个ＤＯＭ元素以'cart-add'名字传递给父组件good.vue,传给父组件good.vue
            this.$emit('cart-add',event.target);
        },
        decreaseCard(event){
          /*阻止非Vue事件 与购物车冲突*/
          if (!event._constructed) {
            return;
          }
          if(this.food.count){
              this.food.count--;
            }
        }
    }
  }

</script>


<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol{
  font-size: 0;
}
  .cart-decrease{
    display: inline-block;
    padding: 6px;
    transition: all .4s linear;
  }
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active , .slide-fade-leave-active  {
  transition: all .4s linear;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform:translate3d(24px, 0, 0);
  opacity: 0;
}
/*嵌套过渡动画效果*/
.slide-fade-enter .inner, .slide-fade-leave-to .inner{
  transform: rotate(180deg);
}
  .inner{
    display: inline-block;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
    transition: all .4s linear;
  }



  .cart-count{
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cart-add{
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    color: rgb(0, 160, 220);
}


</style>
