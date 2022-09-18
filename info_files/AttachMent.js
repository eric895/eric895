/**
 * 附件管理。
 * @returns {AttachMent}
 */
if (typeof AttachMent == 'undefined') {
	AttachMent = {};
}
/**
 * 选择非直接上传附件时判断用flash还是html
 */
AttachMent.addFile=function(obj){
	AttachMent.htmlUpLoadFile(obj);
}

/**
 * 选择直接上传附件时判断用flash还是html
 */
AttachMent.directUpLoadFile=function(obj){
	AttachMent.htmlUpLoadFile(obj);
}

/**
 * flash附件非直接上传
 */
AttachMent.FlexAddFile=function(obj){
	console.log("进入FlexAddFile");
	var inputObj=$(obj);
	var fieldName=inputObj.attr("field");
	var parent=inputObj.parent().parent();

	var rights="w";
	var divName="div.attachement";
	var inputName="input[name='" +fieldName +"'],textarea[name='" +fieldName +"']";
	//获取div对象。
	var divObj=$(divName,parent);
	var inputJson=$(inputName,parent);

	var aryJson=AttachMent.getFileJsonArray(divObj);
	//文件选择器
	FlexUploadDialog({isSingle:false,callback:function (fileIds,fileNames,filePaths,extPaths){
			if(fileIds==undefined || fileIds=="") return ;
			var aryFileId=fileIds.split(",");
			var aryName=fileNames.split(",");
			var aryExtPath=extPaths.split(",");

			for(var i=0;i<aryFileId.length;i++){
				var name=aryName[i];
				AttachMent.addJson(aryFileId[i],name,aryJson);
			}
			//获取json
			var json=JSON2.stringify(aryJson);
			var html=AttachMent.getHtml(aryJson,rights);
			divObj.empty();
			divObj.append($(html));
			inputJson.text(json);
			if(typeof CustomForm != "undefined"){
				CustomForm.validate();
			}

		}});
};
/**
 * 直接附件上传
 */
AttachMent.directUpLoad=function(obj){
	console.log("进入directUpLoad");
	var inputObj=$(obj);
	var fieldName=inputObj.attr("field");
	var parent=inputObj.parent().parent();
	var rights="w";
	console.log(inputObj);
	var divName="div.attachement";
	var inputName="input[name='" +fieldName +"'],textarea[name='" +fieldName +"']";
	//获取div对象。
	var divObj=$(divName,parent);
	var inputJson=$(inputName,parent);

	var aryJson=AttachMent.getFileJsonArray(divObj);
	//文件上传
	DirectUploadDialog({callback:function (attachs){
			if(attachs==undefined || attachs==[]) return ;
			for(var i=0;i<attachs.length;i++){
				var fileId=attachs[i].fileId;
				var name=attachs[i].fileName;
				AttachMent.addJson(fileId,name,aryJson);
			}
			//获取json
			var json=JSON2.stringify(aryJson);
			var html=AttachMent.getHtml(aryJson,rights);
			divObj.empty();
			divObj.append($(html));
			inputJson.val(json);
			if(typeof CustomForm != "undefined"){
				CustomForm.validate();
			}
		}});
};

/**
 * html附件上传dialog
 * @param conf
 */

AttachMent.htmlUpLoadFile=function(obj){
	console.log("进入htmlUpLoadFile");
	var inputObj=$(obj);
	var fieldName=inputObj.attr("field");
	var parent=inputObj.parent().parent();
	var divName="div.attachement";
	var rights="w";
	var inputName="input[name='" +fieldName +"'],textarea[name='" +fieldName +"']";
	//获取div对象。
	var divObj=$(divName,parent);
	var inputJson=inputObj.prev();//获取到textarea对象

	var aryJson=AttachMent.getFileJsonArray(divObj);
	//文件选择器
	HtmlUploadDialog({max:30,callback:function (attachs){
			if(attachs[0]==undefined || attachs==[]) return ;
			for(var i=0;i<attachs.length;i++){
				var fileId=attachs[i].fileId;
				var name=attachs[i].fileName;
				AttachMent.addJson(fileId,name,aryJson);
			}
			var json=JSON2.stringify(aryJson);
			var html=AttachMent.getHtml(aryJson,rights);
			divObj.empty();
			divObj.append($(html));
			inputJson.val(json);
			inputJson.text(json);
			if(typeof CustomForm != "undefined"){
				CustomForm.validate({form:divObj.parent()});
			}

		}});
};

/**
 * 删除附件
 * @param obj 删除按钮。
 */
AttachMent.delFile=function(obj){
	console.log("进入delFile");
	var inputObj=$(obj);
	var parent=inputObj.parent();
	var divObj=parent.parent().parent().parent();
	var spanObj=$("span[name='attach']",parent);
	var divContainer=divObj.parent();
	var fileId=spanObj.attr("fileId");
	var aryJson=AttachMent.getFileJsonArray(divObj);
	AttachMent.delJson(fileId,aryJson);
	var json=JSON2.stringify(aryJson);
	var inputJsonObj=$("textarea",divContainer);
	if(aryJson.length == 0)
		json = "";
	//设置json
	inputJsonObj.val(json);
	//删除span
	parent.remove();
	if(typeof CustomForm != "undefined"){
		CustomForm.validate();
	}
};

/**
 * 初始化表单的附件字段数据。
 */
AttachMent.init=function(subRights,parent){
	console.log("进入init");
	$("[ctltype='attachment']").each(function(){
		var right=$(this).attr("right")==null?"":$(this).attr("right");
		var val=$(this).val()==null?"":$(this).val();
		var div=$('<div name="div_attachment_container" right="'+right+'"></div>');
		div.append('<div class="attachement"></div>');
		var obj = $('<textarea style="display:none" controltype="attachment" name="'
			+$(this).attr("name")+'" lablename="附件" validatable="'+$(this).attr("validatable")+'">'+val+'</textarea>');
		obj.attr("validate",$(this).attr("validate"));
		div.append(obj);

		var onclick="AttachMent.addFile(this)";
		if($(this).attr("isdirectupload")=="1"){
			onclick="AttachMent.directUpLoadFile(this)";
		}
		div.append('<a href="javascript:;" field="'+$(this).attr("name")+'" class="link selectFile" atype="select" onclick="'+onclick+'">选择</a>');
		$(this).after(div);
		$(this).remove();
		//前台js解析完页面后   再对附件必填进行处理
		TablePermission.handleMainTableRequest();
	});

	if(	$.isEmpty(parent)||parent.length==0){
		parent = $("div[name='div_attachment_container']");
	}
	parent.each(function(){
		var me=$(this),
			rights=me.attr("right");
		//如果没有权限属性，可能是子表中的附件
		if(!rights){
			rights=me.closest("[type='subtable']").attr("right");
		}
		//对于弹出框的处理
		if(!$.isEmpty(subRights))
			rights = subRights;
		console.log("rights=subRights:"+rights);
		if(rights){
			rights=rights.toLowerCase();
			console.log("rights:"+rights);
		}

		if(rights=="r"||rights=="rp"){
			$("a[field]",me).remove();
		}
		var atta =$("textarea[controltype='attachment']",me);
		var jsonStr = atta.val();
		if(!$.isEmpty(jsonStr)){
			jsonStr = jsonStr.replaceAll("￥@@￥","\"").replaceAll("'","\"");
			atta.val(jsonStr);
		}
		var divAttachment=$("div.attachement",me);
		//json数据为空。
		console.log("rights最后结果:"+rights);
		AttachMent.insertHtml(divAttachment,jsonStr,rights);
	});
};

/**
 *  附件插入显示
 * @param {} div
 * @param {} jsonStr
 * @param {} rights 权限 如果不传，默认是r
 */
AttachMent.insertHtml= function(div,jsonStr,rights){
	console.log("进入insertHtml");
	if($.isEmpty(jsonStr)) {
		div.empty();
		return ;
	}
	if($.isEmpty(rights)) rights ='r';
	var jsonObj=[];
	try {
		jsonStr = jsonStr.replaceAll("￥@@￥","\"");
		jsonObj =	jQuery.parseJSON(jsonStr);
	} catch (e) {
	}
	var html=AttachMent.getHtml(jsonObj,rights);
	div.empty();
	div.append($(html));
};

/**
 * 获取文件的html。
 * @param aryJson
 * @returns {String}
 */
AttachMent.getHtml=function(aryJson,rights){
	console.log("进入getHtml");
	console.log(rights);
	var str="";
	var template="";
	var title=$(".tbar-label").text();
	var head=$(".l-layout-header").text();
	try {
		var isbkflag=isbk;
	} catch (e) {
	}
	var templateB="<li style='margin-bottom: 10px;margin-top: 10px;'><span class='attachement-span'><span fileId='#fileId#' name='attach' file='#file#' ><a class='attachment' target='_blank' path='#path#' onclick='AttachMent.handleClickItem(this,\"b\")' title='#title#'>#name#</a></span><a href='javascript:;' onclick='AttachMent.download(this);' title='下载' class='download'></a>&nbsp;<a href='javascript:;' onclick='AttachMent.delFile(this);' title='删除' class='cancel'></a>&nbsp;<a href='javascript:;' onclick='AttachMent.ToPDF2(this);' title='文件签章' class='sign'></a></span></li>";
	var templateW="<li style='margin-bottom: 10px;margin-top: 10px;'><span class='attachement-span'><span fileId='#fileId#' name='attach' file='#file#' ><a class='attachment' target='_blank' path='#path#' onclick='AttachMent.handleClickItem(this,\"w\")' title='#title#'>#name#</a></span><a href='javascript:;' onclick='AttachMent.download(this);' title='下载' class='download'></a>&nbsp;<a href='javascript:;' onclick='AttachMent.delFile(this);' title='删除' class='cancel'></a></span></li>";
	var templateR="<li style='margin-bottom: 10px;margin-top: 10px;'><span class='attachement-span'><span fileId='#fileId#' name='attach' file='#file#' ><a class='attachment' target='_blank' path='#path#' onclick='AttachMent.handleClickItem(this,\"r\")' title='#title#'>#name#</a></span><a href='javascript:;' onclick='AttachMent.toDownload(this);' title='下载签章文件' class='download'></a>&nbsp;<a href='javascript:;' onclick='AttachMent.toPrint(this);' title='推送自助打印平台' class='send'></a></span></li>";
	var templateP="<li style='margin-bottom: 10px;margin-top: 10px;'><span class='attachement-span'><span fileId='#fileId#' name='attach' file='#file#' >#name#</span></span></li>";
	var templatePnospan="<li style='margin-bottom: 10px;margin-top: 10px;'><em fileId='#fileId#' name='attach' file='#file#' >#name#</em></li>";
	var templateRead="<li style='margin-bottom: 10px;margin-top: 10px;'><span class='attachement-span'><span fileId='#fileId#' name='attach' file='#file#' ><a class='attachment' target='_blank' path='#path#' onclick='AttachMent.handleClickItem(this,\"r\")' title='#title#'>#name#</a></span><a href='javascript:;' onclick='AttachMent.download(this);' title='下载' class='download'></a>&nbsp;</span></li>";
	if(rights=="w"){
		template=templateW;
		console.log("template=templateW");
	}else if(rights=="b"){
		template=templateB;
		console.log("template=templateB");
	}else if(title.indexOf("非固定模板")!=-1||head.indexOf("非固定模板")!=-1){
		template=templateR;
		console.log("非固定模板","template=templateR");
	}else if(rights=="r"){
		if(isbkflag==undefined){
			template=templateRead;
			console.log("template=templateRead");
		}else if(isbkflag==false){
			template=templatePnospan;
			console.log("打印模板不解析附件");
		}else{
			template=templateP;
			console.log("打印模板不解析附件");
		}
	}else{
		template=templateW;
		console.log("template=templateW");
	}
	for(var i=0;i<aryJson.length;i++){
		var obj=aryJson[i];
		var id=obj.id;
		var name=obj.name;
		var path =__ctx +"/platform/system/sysFile/file_" +obj.id+ ".ht";

		var file=id +"," + name ;
		var tmp=template.replace("#file#",file).replace("#path#",path).replace("#name#", AttachMent.parseName(name)).replace("#title#",name).replace("#fileId#", id);
		//附件如果是图片就显示到后面
		str+=tmp;
	}
	str = "<ul>"+str+"</ul>";	/*改为一个附件就占领一行*/
	return str;
};

AttachMent.parseName = function(name){
	/*if(name.length >10)
		return name.substr(0,6)+"...";*/	/*暂时去掉截取字段*/
	return name;
}

/**
 * 添加json。
 * @param fileId
 * @param name
 * @param path
 * @param aryJson
 */
AttachMent.addJson=function(fileId,name,aryJson){
	var rtn=AttachMent.isFileExist(aryJson,fileId);
	if(!rtn){
		var obj={id:fileId,name:name};
		aryJson.push(obj);
	}
};

/**
 * 删除json。
 * @param fileId 文件ID。
 * @param aryJson 文件的JSON。
 */
AttachMent.delJson=function(fileId,aryJson){
	for(var i=aryJson.length-1;i>=0;i--){
		var obj=aryJson[i];
		if(obj.id==fileId){
			aryJson.splice(i,1);
		}
	}
};

/**
 * 判断文件是否存在。
 * @param aryJson
 * @param fileId
 * @returns {Boolean}
 */
AttachMent.isFileExist=function(aryJson,fileId){
	for(var i=0;i<aryJson.length;i++){
		var obj=aryJson[i];
		if(obj.id==fileId){
			return true;
		}
	}
	return false;
};

/**
 * 取得文件json数组。
 * @param divObj
 * @returns {Array}
 */
AttachMent.getFileJsonArray=function(divObj){
	var aryJson=[];
	var arySpan=$("span[name='attach']",divObj);
	arySpan.each(function(i){
		var obj=$(this);
		var file=obj.attr("file");
		var aryFile=file.split(",");
		var obj={id:aryFile[0],name:aryFile[1]};
		aryJson.push(obj);
	});
	return aryJson;
};

/**
 * 预览
 */
AttachMent.handleClickItem = function(obj,rights){
	var _this = $(obj);
	var span = _this.closest("span");
	var fileId = span.attr("fileId");

	var url =__ctx+"/platform/system/sysFile/getJson.ht";
	var sysFile;
	$.ajax({
		url:url,
		data:{
			fileId:fileId
		},
		success:function(data){
			if(typeof(data)=="string"){
				$.ligerDialog.error('系统超时请重新登录!','提示');
				return ;
			}

			if(data.status!=1){
				$.ligerDialog.error(data.msg,'提示');
            }else{
                sysFile = data.sysFile;
                var path = _this.attr("path");
                var u = navigator.userAgent;
                var flag = navigator.userAgent.match(
                    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
                );
                var mobileFlag = flag == null ? false : true;
                if(mobileFlag){
                    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                    if (isiOS) {
                        window.location.href = path;
                    } else {
                        //path =__ctx+"/platform/system/sysFile/download.ht?fileId="+fileId;
                        window.open(path,'_blank');
                    }
                }else{
                    window.open(path,'_blank');
                }
            }
		}
	});
};

/**
 * 下载
 */
AttachMent.download	= function(obj){
	var me = $(obj);
	var	span = me.siblings("span");
	if(span.length >0)
		var	fileId = span.attr("fileId");

	var path =__ctx+"/platform/system/sysFile/file_"+fileId+".ht?download=true";

	var flag = navigator.userAgent.match(
		/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
	);
	var mobileFlag = flag == null ? false : true;
	if(mobileFlag){
        path =__ctx+"/platform/system/sysFile/download.ht?fileId="+fileId;
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS) {
            window.location.href = path;
        } else {
            window.open(path,'_blank');
        }
	}else{
        window.open(path,'_blank');
    }
};

var storage = window.localStorage;
AttachMent.ToPDF2 = function(obj){
	a = true;
	console.log("进入非固定模板签章接口");
	var account = $("input[name=account]").val();
	console.log(account);
	var querydata = "{'f_gh':'account'}",
		condition = {alias:"eqbzhcx",page:1,pagesize:10,querydata:querydata};
	DoQuery(condition,function(data){
		console.log("查询返回data");
		if(data.list.length != 0){
			console.log("有相关权限，进行签章！");
			var eqbjgid = data.list[0].F_EQBJGID;
			var eqbzhid = data.list[0].F_EQBZHID;
			console.log(eqbjgid);
			console.log(eqbzhid);
			var me = $(obj);
			var	span = me.siblings("span");
			if(span.length >0)
				var	fileId = span.attr("fileId");
			var account = $("input[name=account]").val();
			var url = __ctx+"/platform/bpm/processRun/LyformToPDF2.ht?fileId="+fileId+"&eqbjgid="+eqbjgid+"&eqbzhid="+eqbzhid
			$.get(url,function(data){
				if(data != null && data != ""){
					console.log("data:"+data);
					var path = data.url;
					console.log("path:"+path);
					flowId = data.flowId;
					console.log("flowId:"+flowId);
					storage.setItem("flowId",flowId);
					window.open(path)
				}else{
					$.ligerDialog.warn("签章失败！","提示信息");
				}
			});
		}else{
			console.log("不存在此账号相关签章权限，请对本账号进行权限维护！");
			$.ligerDialog.alert("不存在此账号相关签章权限，请对本账号进行权限维护！","提示信息");
		}
	})
};

AttachMent.toPrint = function(obj){
	console.log("进入ToResult");
	var me = $(obj);
	var	span = me.siblings("span");
	if(span.length >0)
		var	fileId = span.attr("fileId");
	a = true;
	var url = __ctx +"/platform/bpm/processRun/resultNot.ht?runId="+runId+"&fileId="+fileId
	$.get(url,function(data,status){
		if(status == "success"){
			if(data != null && data != ""){
				var path = data.printPath
				console.log("path="+path);
				var xgh = data.xgh
				var fileName = data.fileNames
				var title = data.title
				var url = __ctx +"/platform/bpm/processRun/ToPrint.ht?path="+path+"&xgh="+xgh+"&fileName="+fileName+"&title="+title
				console.log("进入ToPrint");
				$.get(url,function(data,status){
					if(status == "success"){
						console.log(data);
						if(data != null && data != ""){
							console.log(JSON.parse(data).resultCode);
							if(JSON.parse(data).resultCode == 0){
								$.ligerDialog.warn("已成功推送到自助打印系统，请携带证件到自助打印机查询打印","提示信息");
							}else{
								$.ligerDialog.warn(JSON.parse(data).result,"提示信息");
							}
						}else{
							$.ligerDialog.warn(JSON.parse(data).result,"提示信息");
						}
					}else{
						$.ligerDialog.warn(JSON.parse(data).result,"提示信息");

					}
				});
			}else{
				$.ligerDialog.warn("文件不存在！请联系管理员！","提示信息");
			}
		}else{
			$.ligerDialog.warn("推送到自助打印系统失败！","提示信息");
		}
	});
};

AttachMent.toDownload = function(obj){
	console.log("进入ToDownload");
	a = true;
	var me = $(obj);
	var	span = me.siblings("span");
	if(span.length >0)
		var	fileId = span.attr("fileId");
	var url = __ctx + "/platform/bpm/processRun/downloadPDF.ht?fileId="+fileId
	$.get(url,function(data,status){
		if(data != null && data != ""){
			var path = data.path
			var xmlHttp;
			if(window.ActiveXObject){
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}else if(window.XMLHttpRequest){
				xmlHttp = new XMLHttpRequest();
			}
			xmlHttp.open("post",path,false);
			xmlHttp.send();
			console.log(xmlHttp.status);
			if(xmlHttp.status==404){
				$.ligerDialog.warn("签章文件不存在！请先签章","提示信息");
			}else{
				window.open(path)
			}

			// if(xmlHttp.readyStatus==4){
			// }else{
			// 	$.ligerDialog.warn("xmlHttp.readyStatus!=4签章文件不存在！请先签章","提示信息");
			// }
		}else{
			$.ligerDialog.warn("下载失败！请联系管理员！","提示信息");
		}
	});
};