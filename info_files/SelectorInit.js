$(function () {
    handSelector();
});

/**
 * 初始化选择器，根据class构建选择器HTML
 */
function init() {
    /*$('[ctlType="flowSelector"]').each(function(){
      var fieldName=$(this).attr("name");
      var lablename=$(this).attr("lablename");
      $(this).before('<input name="'+fieldName+'ID" type="hidden" class="hidden" lablename="'+lablename+'ID" value="'+$(this).attr("initvalue")+'"/>');
      $(this).after('<a href="javascript:;" class="link actInsts" atype="select" name="'+fieldName+'">选择</a>');
      $(this).after('<a href="javascript:;" class="link reset" atype="reset" name="'+fieldName+'">重置</a>');
    });*/

    $('[ctlType="selector"]').each(function () {
        var type = $(this).attr('class');
        buildSelector($(this), type);
    });

    $('[userType="selectorUser"]').each(function () {
        initSelect2($(this));
    });
}

function initSelect2($this) {
    var type = $this.attr('class');
    var multiple = type === 'users';
    $this.select2({
        width: 300,
        allowClear: false,
        multiple: multiple, // 是否多选
        placeholder: "请选择", // placeholder
        minimumInputLength: 1, // 最小数量的字符
        ajax: {
            url: __ctx + "/platform/system/sysUser/mobile/getData.ht",
            type: 'POST',
            dataType: 'json',
            quietMillis: 500,
            data: function (term, page) { // page is the one-based page number tracked by Select2
                return {
                    type: 'bmyh',
                    filterRole: false,
                    filterSearch: term,
                    zNodeId: ''
                };
            },
            results: function (data, page) {
                data = data || [];
                var selectedData = $this.select2('data') || [];
                var selectedObj = {};
                $.each(selectedData, function (i, item){
                    selectedObj[item.id] = true;
                });
                var results = [];
                $.each(data, function (i, item) {
					var id = '';
					var idList = (item.id || '').split('-');
					if (idList.length === 0) {
						id = ''
					} else if (idList.length === 1) {
						id = idList[0]
					} else {
						id = idList[1];
					}
                    if (!selectedObj[id]) {
						item.id = id;
                        item.text = item.name;
                        results.push(item);
                    }
                })
                return {results: results};
            }
        },
        formatResult: function (item) {
            return '<div>【' + item.orgName + '】（' + item.account + '）' + item.text + '</div>';
        }
    });
    // 单选框增加清空按钮
    if (!multiple) {
        $this.siblings(".select2-container").append("<div class='my-select2-clear' onclick='clearSelect2(this);' style='display: none'></div>");
    }
    // 初始化值
    var value = $this.val();
    var initValue = $this.attr("initvalue");
    changeSelect2Data($this, initValue, value);
    $this.val(value);

    // 监听select2值改变，修改
    $this.on("change", function(e){
        console.log("值改变了");
        var $t = $(this),
            dataList = $t.select2("data"),
            idList = [],
            nameList = [],
            parent = $t.parent(),
            name = $t.attr("name");
        if ($.isArray(dataList)){
            $.each(dataList, function (i, item){
                idList.push(item.id);
                nameList.push(item.text);
            });
            $("input[name='" + name + "ID']", parent).val(idList.join(','));
            $("input[name='" + name + "']", parent).val(nameList.join(','));
        } else {
            $("input[name='" + name + "ID']", parent).val(dataList.id);
            $("input[name='" + name + "']", parent).val(dataList.text);
            if (dataList) {
                $t.siblings(".select2-container").find(".my-select2-clear").show();
            } else {
                $t.siblings(".select2-container").find(".my-select2-clear").hide();
            }
        }
    });
}

function clearSelect2(obj) {
    $(obj).parents(".select2-container").siblings("input[usertype='selectorUser']").select2("data", null);
    $(obj).hide();
}

var selectField = $('<a href="javascript:;" class="link" name="" >选择</a>');
//var resetField = $('<a href="javascript:;" class="link reset" name="" >重置</a>');
var hiddenField = $('<input name="" type="hidden" lablename="" class="hidden" value="" >');

/**
 * 组建选择器
 * obj：将在此对象之前添加隐藏域，在其之后添加选择、重置按钮
 * className：选择器的class属性值
 */
function buildSelector(obj, className) {
    var self = $(obj);
    self.wrap('<div></div>');
    var name = self.attr('name');
    var lablename = self.attr('lablename');
    var initvalue = self.attr('initvalue');
    var selectObj = selectField.clone(true);
    var hiddenObj = hiddenField.clone(true);
    //var resetObj = resetField.clone(true);
    hiddenObj.attr('name', name + 'ID');
    hiddenObj.attr('lablename', lablename + 'ID');
    if (initvalue && initvalue != '') {
        hiddenObj.attr('value', initvalue);
    }
    self.before(hiddenObj);

    var isHidden = self.is(':hidden');
    if (isHidden) return;
    //resetObj.attr('name',name);
    //self.after(resetObj);

    selectObj.attr('name', name);
    selectObj.addClass(className);
    //按钮名称
    if (self.attr("buttoncontent")) {
        selectObj.text(self.attr("buttoncontent"));
    }

    self.after(selectObj);
}


/**
 * 显示选择器对话框。
 * obj 按钮控件
 * fieldName 字段名称
 * type :选择器类型。
 * 1.人员选择器（单选）
 * 2.人员选择器（多选）
 * 3.角色选择器（单选）
 * 4.角色选择器（多选）
 * 5.组织选择器（单选）
 * 6.组织选择器（多选）
 * 7.岗位选择器（单选）
 * 8.岗位选择器（单选）
 */
function handSelector() {
    // 初始化选择器
    init();

    //1.人员选择器（单选）
    $("body").delegate("a.link.user", "click", function () {
        selector($(this), 1);
    });
    //2.人员选择器（多选）
    $("body").delegate("a.link.users", "click", function () {
        selector($(this), 2);
    });
    //3.角色选择器（单选）
    $("body").delegate("a.link.role", "click", function () {
        selector($(this), 3);
    });
    //4.角色选择器（多选）
    $("body").delegate("a.link.roles", "click", function () {
        selector($(this), 4);
    });
    //5.组织选择器（单选）
    $("body").delegate("a.link.org", "click", function () {
        selector($(this), 5);
    });
    // 6.组织选择器（多选）
    $("body").delegate("a.link.orgs", "click", function () {
        selector($(this), 6);
    });
    //7.岗位选择器（单选）
    $("body").delegate("a.link.position", "click", function () {
        selector($(this), 7);
    });
    //8.岗位选择器（单选）
    $("body").delegate("a.link.positions", "click", function () {
        selector($(this), 8);
    });
    //9.流程实例选择器（多选）
    $("body").delegate("a.link.actInsts", "click", function () {
        selector($(this), 9);
    });
    //10.流程实例选择器（多选）
    $("body").delegate("a.link.bianhao", "click", function () {
        selector($(this), 10);
    });
    //重置选择器的值
    $("body").delegate("a.link.reset", "click", function () {
        var obj = $(this);
        var fieldName = obj.attr("name");
        var parent = obj.parent();
        var idFilter = "input[name='" + fieldName + "ID']";
        var nameFilter = "input[name='" + fieldName + "']";
        var inputId = $(idFilter, parent);
        var inputName = $(nameFilter, parent);
        inputId.val("");
        inputName.val("");
        inputName.removeAttr("refid");

    });
}

function triggerChange(inputId, inputName, oldIdVal) {
//	inputName.focus();
    inputName.trigger("blur");
    if (inputId.val() != oldIdVal) {
        inputId.trigger("change");
        inputName.trigger("change");
    }
}


/**
 * 触发选择器 obj 按钮控件对象 type :选择器类型。
 */
function selector(obj, type) {

    //1毫秒内同时打开两次不允许 by xg
    if ($(obj).data("hasInited")) return;
    $(obj).data("hasInited", true);
    window.setTimeout(function () {
        $(obj).data("hasInited", false);
    }, 1);

    var fieldName = obj.attr("name"),
        parent = obj.parent(),
        idFilter = "input[name='" + fieldName + "ID']",
        nameFilter = "input[name='" + fieldName + "']",
        linkFielter = "a[name='" + fieldName + "ID']",
        inputId = $(idFilter, parent),
        inputName = $(nameFilter, parent),
        link = $(linkFielter, parent),
        oldIdVal = inputId.val(),
        idStr = inputId.val(),
        nameStr = inputName.val(),
        scope = inputName.attr("scope"),
        arguments = [];

    if (idStr) {
        var ids = idStr.split(','), names = nameStr.split(','), size = ids.length;
        for (var i = 0; i < size; i++) {
            arguments.push({
                id: ids[i],
                name: names[i]
            });
        }
    }

    switch (type) {
        // 人员选择器(单选)
        case 1 :
            UserDialog({
                isSingle: true,
                selectUsers: arguments,
                scope: scope,
                callback: function (ids, names) {
                    changeSelect2Data(inputName, ids, names);
                    if (inputId.length > 0) {
                        inputId.val(ids);
                    }
                    inputName.val(names);
                    triggerChange(inputId, inputName, oldIdVal);
                }
            });
            break;
        // 人员选择器(多选)
        case 2 :
            UserDialog({
                isSingle: false,
                selectUsers: arguments,
                scope: scope,
                callback: function (ids, names) {
                    changeSelect2Data(inputName, ids, names);
                    if (inputId.length > 0) {
                        inputId.val(ids);
                    }
                    inputName.val(names);
                    triggerChange(inputId, inputName, oldIdVal);
                }
            });
            break;
        // 3.角色选择器(单选)
        case 3 :
            RoleDialog({
                isSingle: true,
                arguments: arguments,
                callback: function (ids, names) {
                    if (inputId.length > 0) {
                        inputId.val(ids);
                    }
                    inputName.val(names);

                    triggerChange(inputId, inputName, oldIdVal);
                }
            });
            break;
        // 4.角色选择器（多选）
        case 4 :
            RoleDialog({
                arguments: arguments,
                callback: function (ids, names) {
                    if (inputId.length > 0) {
                        inputId.val(ids);
                    }
                    inputName.val(names);

                    triggerChange(inputId, inputName, oldIdVal);
                }
            });
            break;
        // 5.组织选择器(单选)
        case 5 :
            OrgDialog({
                arguments: arguments,
                isSingle: true,
                scope: scope,
                callback: function (ids, names) {
                    if (inputId.length > 0) {
                        inputId.val(ids);
                    }
                    inputName.val(names);

                    triggerChange(inputId, inputName, oldIdVal);
                }
            });
            break;

        // 6.组织选择器（多选）
        case 6 :
            OrgDialog({
                arguments: arguments,
                scope: scope,
                callback: function (ids, names) {
                    if (inputId.length > 0) {
                        inputId.val(ids);
                    }
                    inputName.val(names);

                    triggerChange(inputId, inputName, oldIdVal);
                }
            });
            break;

        // 岗位选择器(单选)
        case 7 :
            PosDialog({
                isSingle: true,
                arguments: arguments,
                scope: scope,
                callback: function (ids, names) {
                    if (inputId.length > 0) {
                        inputId.val(ids);
                    }
                    inputName.val(names);

                    triggerChange(inputId, inputName, oldIdVal);
                }
            });
            break;
        // 岗位选择器（多选）
        case 8 :
            PosDialog({
                arguments: arguments,
                scope: scope,
                callback: function (ids, names) {
                    if (inputId.length > 0) {
                        inputId.val(ids);
                    }
                    inputName.val(names);

                    triggerChange(inputId, inputName, oldIdVal);
                }
            });
            break;
        // 流程引用选择器（多选）
        case 9 :
            var defId = $("[name='defId']").val();
            if (!defId) {
                defId = 0;
            }
            ActInstDialog({
                defId: defId,
                isSingle: 2,
                arguments: arguments,
                callback: function (data) {
                    if (!data) {
                        return;
                    }
                    if (inputId.length > 0) {
                        inputId.val(data.ids);
                    }
                    inputName.val(data.names);
                    inputName.attr("refid", data.ids);


                    triggerChange(inputId, inputName, oldIdVal);
                }
            });
            break;
        // 编号设置器
        case 10 :
            var defId = $("[name='defId']").val();
            $.post(url = __ctx + "/platform/ueditor/bianhao/set.ht?defId=" + defId, function (data) {
                inputName.val(data);
            });

    }

}

function changeSelect2Data(inputName, ids, names) {
    if (ids.indexOf(',') > -1) {
        ids = ids.split(',');
        names = names.split(',');
        var list = [];
        var length = ids.length;
        for (var i = 0; i < length; i++) {
            list.push({
                id: ids[i],
                text: names[i]
            });
        }
        inputName.select2('data', list);
    } else if (ids) {
        inputName.select2('data', {
            id: ids,
            text: names
        });
        inputName.siblings(".select2-container").find('.my-select2-clear').show();
    } else {
        inputName.siblings(".select2-container").find('.my-select2-clear').hide();
    }
}
