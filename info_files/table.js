var flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
var mobileFlag = flag == null ? false : true;

$(window).load(function(){
	var currentNode = $("#currentNode").val();
	if(currentNode == "FirstTask"){
		$(".startHis").hide();
	}
	if(document.readyState && document.readyState == 'complete') {
		var currentNode = $("#currentNode").val();
		if(currentNode == "FirstTask"){
			$(".startHis").hide();
		}
		getOnload();
		setHideHeight();
	}else {
		setTimeout(function() {
			getOnload();
            setHideHeight();
		},1000)
	}
});

function setHideHeight() {
	var u = navigator.userAgent;
	var isAndroid=u.indexOf('Android')>-1||u.indexOf('Linux')>-1;//android终端
	// alert('android'+isAndroid)
	if(isAndroid){ // android统一处理，不影响ios的自身处理
		var body = document.getElementsByTagName('body')[0]; // 兼容获取body

		var regDom = document.querySelector('.panel'); // 获取页面根元素
		var content = document.querySelector('.panel-body'); // 表单内容部分

		// var scrollHeight = body.scrollHeight // 网页文档高
		// var scrollTop = body.scrollTop// 卷上去的高

		var clientHeight = body.clientHeight; //可见高
		var fixHeight = clientHeight/3; // 定位高，弹出键盘时input距浏览器上部的距离，自己定义合适的

		// 符合需弹出键盘的元素query
		var queryStr = 'input[type="text"], input[type="tel"], input[type="password"], textarea';
		var inputs = content.querySelectorAll(queryStr);

		// console.log(inputs)

		// var offsetTopArr = Array.prototype.map.call(inputs,item=>{
		// 	return this.getElementOffsetTop(item) // offsetTop只能获取到顶部距它的offsetParent的距离，需此方法获取到元素距顶部的距离
		// })

		var offsetTopArr = Array.prototype.map.call(inputs,function(item){
			return this.getElementOffsetTop(item); // offsetTop只能获取到顶部距它的offsetParent的距离，需此方法获取到元素距顶部的距离
		})

		// inputs.forEach((item, i)=>{
		// 	item.addEventListener('focus',()=>{
		// 		// 改变top上移页面
		// 		regDom.style.top = '-' + (offsetTopArr[i] - fixHeight) + 'px'
		// 	})
		//
		// 	item.addEventListener('blur',()=>{
		// 		// 恢复top
		// 		regDom.style.top = 0
		// 	})
		// })
		inputs.forEach(function(item, i){
			item.addEventListener('focus',function(){
				// 改变top上移页面
				regDom.style.top = '-' + (offsetTopArr[i] - fixHeight) + 'px';
			})

			item.addEventListener('blur',function(){
				// 恢复top
				regDom.style.top = 0;
			})
		})
	}
}

function getElementOffsetTop(el) {
	var top = el.offsetTop;
	var cur = el.offsetParent;
	while(cur != null){
		top += cur.offsetTop;
		cur = cur.offsetParent;
	}
	return top
}

function getOnload() {
	var height = $("#topNav").height();
	$("div.panel-body").css("margin", height+"px 15px 10px 15px");
}

function handRowEvent(ev,table){
	$("td.tdNo",table).each(function(i){
		$(this).text(i+1);
	});
}

/*function showMenuxs(x){
    event.stopPropagation();
	var e = x.nextElementSibling;
	if(e.style.display == 'block'){
		e.style.display = "none";
	}else{

      $(".child-menu").hide();
		e.style.display = "block";

		var t=l=0;
		if(window.screen.width <= 480) {
		  t = x.offsetTop+36;
	    	l = x.offsetLeft-58;
		}else {
			t = x.offsetTop+18;
			l = x.offsetLeft-20;
		}
		e.style.top = t + 'px';
		e.style.left = l + 'px';

       var b = x.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
		b.style.paddingBottom = "140px";

	}
}*/

function showMenuxs(x) {
    event.stopPropagation();
    var e = x.nextElementSibling;
    $(".oprate-inner .child-menu").hide();
    e.style.display = "block";
    var position = x.getBoundingClientRect();
    if (position.top > window.innerHeight * 2 / 3) {
        e.style.top = "auto";
        e.style.bottom = (window.innerHeight - position.top - 10) + "px";
    } else {
        e.style.top = (position.top + 10) + "px";
        e.style.bottom = "auto";
    }
    if (window.innerWidth <= 480) {
        e.style.left = (position.right - 110) + "px";
    } else {
        e.style.left = (position.left + 10) + "px";
    }
}

//点击空白处隐藏
$(document).click(function(e) {
   e = window.event || e; // 兼容IE7
   obj = $(e.srcElement || e.target);
   if($(obj).is(".child-menu")) {
       $('.child-menu').show();
   } else {
       $('.child-menu').hide();
       $(".table-scroll").css("padding-bottom","0px");
   }
});

/*function showMenu(x){
	var e = x.nextElementSibling;
	e.style.display = "block";
	var t=l=0;
	if(window.screen.width <= 480) {
	  t = x.offsetTop+36;
    	l = x.offsetLeft-58;
	}else {
		t = x.offsetTop+18;
		l = x.offsetLeft-20;
	}
	e.style.top = t + 'px';
	e.style.left = l + 'px';
}*/

function showMenu(x){
    var e = x.nextElementSibling;
    e.style.display = "block";
    var position = x.getBoundingClientRect();
    if (position.top>window.innerHeight*2/3){
        e.style.top = "auto";
        e.style.bottom = (window.innerHeight - position.top - 20) + "px";
    } else {
        e.style.top = (position.top + 10) + "px";
        e.style.bottom = "auto";
    }
    if(window.innerWidth <= 480) {
        e.style.left = (position.right - 110) + "px";
    } else {
        e.style.left = (position.left + 10) + "px";
    }
}

function hideMenu(y){
	var e = y.nextElementSibling;
	e.style.display = "none";
}

function showContent(a){
	var e = a;
	e.style.display = "block";
}

function hideContent(b){
	var e = b;
	e.style.display = "none";
}

//阻止移动端时间控件弹出输入法
function jzEvent(){
	document.activeElement.blur();
}

//子表单删除（序号问题解决）
function delSub(i,status){
	$.ligerDialog.confirm("是否删除？","提示信息",function(rtn) {
		if (rtn) {
			var row = $(i).parents("tr");
			if(row.length == 0){
				row = $(i).parents("tr");
			}
			if($(i).parents("div.block").length > 0){
				row = $(i).parents("div.block");
			}
			if($(i).parents("div.block-oneline").length > 0){
				row = $(i).parents("div.block-oneline");
			}
			var table = row.closest('div[type=subtable]');
			var brother = row.next('[formtype]').length?row.next('[formtype]'):row.prev('[formtype]');
			row.remove();

			CustomForm.handRow('del',table);
			if(brother){
				FormUtil.InitMathfunction(brother);
			}
			$(".table-scroll").css("padding-bottom","0px");
		}
	});
}

// 子表单编辑（弹出框）
function editSub(i){
	var row = $(i).parents("tr");
	if($(i).parents("div.block").length > 0){
		row = $(i).parents("div.block");
	}
	if($(i).parents("div.block-oneline").length > 0){
		row = $(i).parents("div.block-oneline");
	}
	var table = $(i).parents('div[type=subtable]');
	CustomForm.edit(table, row);
}

// 子表删除当前行(旧)
function edit(i){
	$.ligerDialog.confirm("是否删除？","提示信息",function(rtn) {
		if (rtn) {
			var row = $(i).parents("tr");
			if(row.length == 0){
				row = $(i).parents("tr");
			}
			if($(i).parents("div.block").length > 0){
				row = $(i).parents("div.block");
			}
			if($(i).parents("div.block-oneline").length > 0){
				row = $(i).parents("div.block-oneline");
			}
			var table = row.closest('div[type=subtable]');
			var brother = row.next('[formtype]').length?row.next('[formtype]'):row.prev('[formtype]');
			row.remove();

			CustomForm.handRow('del',table);
			if(brother){
				FormUtil.InitMathfunction(brother);
			}
			$(".table-scroll").css("padding-bottom","0px");
		}
	});
}

// 子表单上移下移
function upAndDownSub(i,status){
	var row = $(i).parents("tr");
	if($(i).parents("div.block").length > 0){
		row = $(i).parents("div.block");
	}
	if($(i).parents("div.block-oneline").length > 0){
		row = $(i).parents("div.block-oneline");
	}
	var table = $(i).parents('div[type=subtable]');
	if(status == 1){
		//TODO 向上移动
		var prev = row.prev('[formType]:visible');
		if (prev.length > 0) {
			prev.before(row);
			CustomForm.handRow('add',table);
		}else{
			$.ligerDialog.warn("无法上移，已经是第一行!", '提示');
			return;
		}
	}else if(status == 2){
		//TODO 向下移动
		var next = row.next('[formType]:visible');
		if (next.length > 0) {
			next.after(row);
			CustomForm.handRow('add',table);
		}else{
			$.ligerDialog.warn("无法下移，已经是最后一行!", '提示');
			return;
		}
	}else if(status == 3){
		//TODO 前插入行
		CustomForm.add(table, row);
		CustomForm.subSelectorInit();
		CustomForm.initSubQuery();
		CustomForm.handRow('add',table);
	}else if(status == 4){
		//TODO 后插入行
		row = row.next('[formType]:visible');
		if (row.length == 0) {
			row = null;
		}
		CustomForm.add(table, row);
		CustomForm.subSelectorInit();
		CustomForm.initSubQuery();
		CustomForm.handRow('add',table);
	}
}