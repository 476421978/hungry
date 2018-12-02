<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
        <div class="tab-item">
          <router-link  to="/goods">
            商品
          </router-link>
        </div>
        <div class="tab-item">
          <router-link to="/ratings">评论</router-link>
        </div>
        <div class="tab-item">
          <router-link to="/seller">商家</router-link>
        </div>
    </div>
      <keep-alive>
        <router-view :seller="seller"></router-view>
      </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import {urlParse} from './common/js/util';
  import header from './components/header/header.vue';
  const Error_ok = 0;
  export default{
      data() {
          return{
              seller:{
                id: (() => {
                  let queryParam = urlParse();
                  return queryParam.id;
                })()
              }
           }
      },
    created() {
         this.$http.get('/api/seller?id='+this.seller.id).then((response) => {//获取数据 根据id区分商家
          response = response.body;
          if(response.errno===Error_ok){
            //此函数返回目标对象。仅可枚举自有属性从源对象复制到目标对象。可使用此函数合并或克隆对象。
            this.seller = Object.assign({}, this.seller, response.data);
          }
      });
    },
    components:{
        'v-header':header,
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/mixin.styl";
  .tab{
    display: flex;
    width:100%;
    height: 40px;
    line-height: 40px;
/*    border-bottom: 1px solid rgba(7,17,27,0.1);*/
    border-1px(rgba(7,17,27,0.1))
  }
  .tab-item{
    flex: 1;
    text-align: center;

  }

  a{
    display: block;
    font-size: 14px;
    color: rgb(77, 85, 93);
  }

  a.active{
    color: rgb(240, 20, 20);
  }

</style>
