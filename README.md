# productSku
一个用于处理商品规格sku选择操作的插件，处理各规格状态等，无限规格组合

init数据格式

 * SkuData格式:
 
  {"SkuId": "294_19_0_15", //可根据需求添加参数在callback中处理,SkuId、Price、Stock必须
 
    "Color": "黄色",

    "Stock": 10,

    "Price": 13,

    "Size": "",

    "Version": "100"}
  
 
 
 可配置的参数：
 
 var defautls = {
 
    data : {},   // ajax请求data
    
    productId : null,   // 商品id,选填，默认为data第一个参数值
    
    spec:'.spec',       //sku组父级
    
    itemClass:'.itemSku',  //每个sku选项
    
    resultClass:{
    
      price:null,
      
      stock:null,
      
      chose:null
      
    },    //选择数据返回对象
    
    ajaxType : 'GET',   //ajax请求类型
    
    ajaxUrl:'',
    
    skuPosition:null,  //sku数据所处属性名
    
    callBack : function() {}  // 选择回调方法，已输出选中sku相关数据 };
    
    
    
  
  
