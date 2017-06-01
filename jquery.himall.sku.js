/*
 * Description:商品规格SKU处理
 * 2016.6.14--five(673921852)
 * SkuData格式:{"SkuId": "294_19_0_15", //可根据需求添加参数在callback中处理,SkuId、Price、Stock必须
			"Color": "黄色",
			"Stock": 10,
			"Price": 13，
			"Size": "",
			"Version": "100"}
 */

var SKUDATA = null;
;(function($){
	$.fn.himallSku=function(options){
		
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
			callBack : function() {}  // 选择回调方法，已输出选中sku相关数据
		};
		var params = $.extend({}, defautls, options || {});
		
		if(!params.productId){
			for(var k in params.data) {
				params.productId=params.data[k];
				break;
			}
		}
		
		var _this=$(this),
			skuLen = $(params.spec,_this).length,
			skuId = [0, 0, 0],
			checkTodo = function (data, skuId) {
			    var items = [];
			    for (var i in data) {
			        items.push(data[i]);
			    }
			    _this.find(params.spec).each(function (index) {
			        index = parseInt($(this).find(params.itemClass).attr("st"));
			        var temp = ["\\d+", "\\d+", "\\d+", "\\d+"];
			        for (var i = 0; i < skuLen; i++) {
			            if (i == index) continue;
			            if (skuId[i] > 0) temp[i+1] = skuId[i];
			        }
			        $(this).find(params.itemClass).each(function () {
			            temp[index + 1] = $(this).attr('cid');
			            var reg = new RegExp(temp.join("_"));
			            if (!items.any(function (i) {
                            var result =reg.test(i.SkuId);//判断规格合法性
                            if (result) 
                                    result = i.Stock > 0 || i.BaseStock > 0;//判断是否含有库存
                            return result;
			            })) {
			                $(this).removeClass('enabled').addClass('disabled');
			            }
			            else {
			                $(this).removeClass('disabled').addClass('enabled');
			            }
			        });
			    });
			},
			getProperty=function(el,data){
				if(el){
					if($(el).length>1){
						$(el,_this).html(data);
					}else{
						$(el).html(data);
					}
				}
			};
		
		$.ajax({
	        type: params.ajaxType,
	        url: params.ajaxUrl,
	        data: params.data,
	        dataType: 'json',
	        success: function (data) {
	            
	        	if(!params.skuPosition){
	        		SKUDATA=data;
	        	}else{
	        		SKUDATA = data[params.skuPosition]
	        	}
	        	
	        	//sku重组
	        	var skuArr={};
	        	for(var i=0; i<SKUDATA.length; i++){
	        		skuArr[SKUDATA[i].SkuId]=SKUDATA[i];
	        	}
				
				//选择公用操作
				_this.on('click', '.enabled', function () {
				    if ($(this).hasClass('selected')) {
				        $(this).removeClass('selected');
				        skuId[parseInt($(this).attr('st'))] = 0;
				    }
				    else {
				        $(this).addClass('selected').siblings().removeClass('selected');
				        skuId[parseInt($(this).attr('st'))] = $(this).attr('cid');
				    }
				    checkTodo(skuArr, skuId);

					var len = $('.selected',_this).length;
					if (len == skuLen) {
					    for (var i = 0; i < len; i++) {
					        skuId[parseInt($('.selected', _this).eq(i).attr('st'))] = $('.selected', _this).eq(i).attr('cid');
						}
						var select = skuArr[params.productId + '_' + skuId.join('_')];
						params.callBack(select,_this);  //回调方法，返回当前选中sku、 当前对象
						
						getProperty(params.resultClass.price, select.Price.toFixed(2));
						getProperty(params.resultClass.stock, select.Stock);
						
                        //预处理了已选择规格显示，可自行在回调中处理
						if(params.resultClass.chose){
						    if ($(params.resultClass.chose).length > 1) {
						        $(params.resultClass.chose, _this).html('已选择：' +
									(select.Color != '' && select.Color != null ? '<em class="red">"' + select.Color + '"</em>&nbsp;&nbsp;' : '') +
									(select.Size != '' && select.Size != null ? '<em class="red">"' + select.Size + '"</em>&nbsp;&nbsp;' : '') +
									(select.Version != '' && select.Version != null ? '<em class="red">"' + select.Version + '"</em>' : '')
								);
						    } else {
						        $(params.resultClass.chose).html('已选择：' +
									(select.Color != '' && select.Color != null ? '<em class="red">"' + select.Color + '"</em>&nbsp;&nbsp;' : '') +
									(select.Size != '' && select.Size != null ? '<em class="red">"' + select.Size + '"</em>&nbsp;&nbsp;' : '') +
									(select.Version != '' && select.Version != null ? '<em class="red">"' + select.Version + '"</em>' : '')
								);
						    }
						}
					}
				});
				//加载初始化
				if (skuLen != 0) {
					$(params.spec,_this).each(function() {
						$(this).find('.enabled').first().trigger("click");
					});
				} else if (skuLen == 0) {
				    getProperty(params.resultClass.price, SKUDATA[0].Price.toFixed(2));
				    getProperty(params.resultClass.stock, SKUDATA[0].Stock);
				}
				
			}
		});
	}
})(jQuery);


	
	



