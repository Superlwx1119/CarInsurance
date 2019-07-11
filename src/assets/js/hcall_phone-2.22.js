var cm_callsate = 0;// 话机状态0是空闲1是正在通话
var cm_logstart = 0;// 0未连接1是已连接
var cm_login = 0;// 0未签入1已签入
$(function() {
	setPhoneButtonStatus(true, true, true, true, false, true, "状态:等待签入...");
});
/*// 启动
function hcall_start() {
	var eid = $("#eid").val();// //租户ID
	var bizhost = '';
	var aid = $("#aid").val();// 工号
	var adn = $("#adn").val();// 话务员分机电话号码
	var apwd = "e10adc3949ba59abbe56e057f20f883e";// 工号密码
	var apihost = 'http://cti254.csgxcf.com/IXServer';// 接口地址
	eid = "0";
	adn = aid;
	cm_callsate = 0;
	UMO.exit(function(cmd, result) {
		UMO.start(apihost, bizhost, EvtHandler, eid, "", aid, apwd, adn,
				function(cmd, result) {
					if (result.errno == 0) {
						// 可根据下面的标志刷新当前的状态
						// result.agentstatus result.hookstatus result.ringing
						// result.connected
						cm_logstart = 1;
					}
				});
	}, null);
}
*/
// 关闭
function hcall_exit() {
	cm_callsate = 0;
	cm_logstart = 0;
	UMO.exit(cbResult, null)
}
//签入
function doOprInReq() {
	var acd = $("#acd").val();//队列号（技能组）号
	var eid = "0"; //$("#eid").val();////租户ID
	var bizhost = '';
	var aid = $("#aid").val();//工号
	var adn = aid; //$("#adn").val();//话务员分机电话号码
	var apwd = "e10adc3949ba59abbe56e057f20f883e";//工号密码
	var apihost = 'http://cti254.csgxcf.com/IXServer';//接口地址cti254.csgxcf.com
	cm_callsate = 0;
	//断开连接
	UMO.exit(function(cmd, result){
		//启动连接
		UMO.start(apihost, bizhost, EvtHandler, eid, "", aid, apwd, adn, function(cmd, result) {
			//0:启动成功 -3:已启动
			if (result.errno == 0 || result.errno == -3) {
				cm_logstart=1;
				//登出原有座席
				UMO.logout(aid, function(cmd, result){
					//签入座席
					UMO.login(aid, acd, -1, false, false, function(cmd, result) {
						if (result.errno == 0) {
							cm_login=1;
							setPhoneButtonStatus(false, true, true, false, true, false, "状态:签入成功");
						} else {
							setPhoneButtonStatus(true, true, true, true, true, false, "状态:签入失败<br>原因:"+result.errmsg);
						}
					}, null);//签入座席
    			}, null);//登出原有座席
			}//启动连接判断
		},null);//启动连接
	},null);//断开连接	
}
// 签出
function doOprOutReq() {
	var aid = $("#aid").val();//工号
	UMO.logout(aid, function(cmd, result) {
		if (result.errno == 0) {//
			cm_login=2;
			hcall_exit();
			setPhoneButtonStatus(true, true, true, true, false, true, "状态:等待签入...");
		} else {
			setPhoneButtonStatus(false, true, true, false, true, false, "状态:签出失败<br>原因:"+result.errmsg);
		}
	}, null);
}
//示忙
function doSetOprBusyReq() {
	UMO.setbusy(
			function(cmd, result) {
				if (result.errno == 0) {
					cm_callsate = 1;
					setPhoneButtonStatus(true, true, false, true, true, true, "状态:坐席示忙");
				}
			}, null);
}
//示闲
function doSetOprFreeReq() {
	UMO.setidle(function(cmd, result) {
		if (result.errno == 0) {
			cm_callsate = 0;
			setPhoneButtonStatus(false, true, true, false, true, false, "状态:坐席空闲");
		} else {
			setPhoneButtonStatus(true, true, false, true, true, true, "状态:示闲失败<br>原因:"+result.errmsg);
		}
	}, null);
}
//挂断
function doSetOprDropReq() {
	UMO.onhook(
			function(cmd, result) {
				if (result.errno == 0) {
					cm_callsate = 1;
					doSetOprBusyReq();//示忙
				} else {
					setPhoneButtonStatus(true, true, false, true, true, true, "状态:坐席示忙");
				}
			}, null);
}
// 应答
function doSetOprAnswerReq() {
}

// 拨出
function doOprCallOutReq() {
	var calleddn = $("#CustomerID").val();//拨出号码
	var gid = -1; //$("#agentgid").val();//中继线路 指定中继号码，或 @+租户ID 选择租户任意线路(转移会议无效)
	calleddn = calleddn.replace(/\D+/g, '');
	if (calleddn.length < 3) {
		$.messager.alert('系统提示', "电话号码不能为空！", 'warning');
		return;
	}
	if (cm_callsate == 1) {
		$.messager.alert('系统提示', "话机正在操作中请示闲", 'warning');
		return;
	}
	if (cm_callsate == 0) {
		cm_callsate = 1;
	}
	$('#pStatus').val(0);//呼出
	var telephoness = $('#telephoness').val();// 节点号
	var phoneverify_id = $('#phoneverify_id').val();// 单号
	if (phoneverify_id.length<1) {
		$.messager.alert('系统提示', "请选择要拨打的订单！", 'warning');
		return false;
	}
	var cur_date=getDateAndTime();
	var cur_time=cur_date.substring(10)+"_"+calleddn+"_"+telephoness;
	var uud="ano:" + $('#adn').val()+";__RECORDDIAL__:F#\\record\\"+cur_date.substring(0,10)+"\\"+cur_time+".wav";
	calleddn = 9 + calleddn;
	UMO.dialout(calleddn, gid, uud, true, function(cmd, result) {
		if (result.errno == 0) {
			$('#phoneOut_orid').val($('#phone_orid').val());// 赋值正在播出
			$('#phoneOutverify_id').val(phoneverify_id);// 赋值正在拨出
			setPhoneButtonStatus(true, false, true, true, true, true, "状态:呼出通话中");
		} else {
			setPhoneButtonStatus(false, true, true, false, true, false, "状态:呼出失败<br>原因:"+result.errmsg);
		}
	}, null)
}
//获取话单ID
function getcdrid(ano, bno) {
	UMO.getcdrid(function(cmd, result) {
		if (result.errno == 0) {
			$('#cdrid').val(result.cdrid);
		}
	}, null);
}
//结果回调
function cbResult(cmd, result) {
	if (result.errno == 0) {
		if (cmd == '/comm/start' || cmd == '/comm/exit') {
			setPhoneButtonStatus(true, true, true, true, false, true, "状态:等待签入...");
		}
	}
}
function setPhoneButtonStatus(b1, b2, b3, b4, b5, b6, m1) {
	document.getElementById("callout_btn").disabled = b1;
	document.getElementById("drop_btn").disabled = b2;
	document.getElementById("setfree_btn").disabled = b3;
	document.getElementById("setbusy_btn").disabled = b4;
	document.getElementById("oprin_btn").disabled = b5;
	document.getElementById("oprout_btn").disabled = b6;
	$("#oprStatusSpan").html(m1);
}
// 输出事件
function showEvent(msg) {
	$("#oprStatusSpan").html(msg)
}
// 事件处理
var EvtHandler = {// 就绪通知
	onReadyState : function(status) {
		if(status == 0 && cm_login!=2){//网络判断时系统自动判断重连
			if(window.confirm('网络异常，是否需要重新签入？')){
            	doOprInReq();
            }
		}
	},
	//来话通知
	onCallincome : function(ano, bno, uud) {
		$("#ano").val(ano);
		$("#bno").val(bno);
		setPhoneButtonStatus(true, false, true, true, true, true, "状态:通话中");
		//来电号码历史记录
		/*if(ano!=$("#aid").val()){
			//showHistoryCall(bno);
			//$("#callinhistory_btn").disabled = false;
		}*/
	},
	//呼出通话通知
	onTalked : function(ano, bno, uud) {
		
	},
	//振铃停止通知
	onRingStoped : function() {
	},
	// 挂机通知
	onHookChanged : function(status) {
		//alert(status);
		if (status == 1 || status == 3 || status == 4) {
			cm_callsate = 0;
			doSetOprDropReq();
			// 坐席挂机
			if (status == 1) {
				var aid = $("#aid").val();// 工号
				var ano = $("#ano").val();// 主叫
				if ("0" != $('#pStatus').val()) {
					$('#pStatus').val(1);
					var phoneverify_id = $('#phoneverify_id').val();// 单号
					$('#phoneOut_orid').val($('#phone_orid').val());// 赋值正在播出
					$('#phoneOutverify_id').val(phoneverify_id);// 赋值正在拨出
				}
				var querys = {
					'wb_orid' : $('#phoneOut_orid').val(),// 当前单号
					'wb_OrderId' : $('#phoneOutverify_id').val(),// 当前单号
					'wb_CrPhoneUrl' : '',
					'wb_CrType' : $('#pStatus').val(), // 状态
					'wb_CrContent' : ano, // 主叫
					'wb_CrRemark' : '',
					'hcall_CdrId' : $('#cdrid').val(),
					"contType" : $('#contType').val()
				};
				//console.log(querys);
				document.getElementById(querys.wb_OrderId).contentWindow.setCallInfo(querys);
				$('#pStatus').val(1);// 呼入
			}
		}
		if (status == 2) {
			var ano = $("#ano").val();
			var bno = $("#bno").val();
			setTimeout(getcdrid(ano, bno), 1000);// 录音
		}
	},
	// 话务员状态通知
	onAgentChanged : function(status) {
	},
	// 异步操作结束通知
	onAsyncFinished : function(atype, taskid, ret, desc) {
	},

	onAllBusy : function(status, acd, quelen) {
	},
	// 队列长度通知
	onQuelen : function(acd, quelen) {
		showEvent("onQuelen: acd=" + acd + " quelen=" + quelen);
	},
	// 短信到达通知
	onSmsincome : function(dtime, from, content, slot) {
		showEvent("onSmsincome: dtime=" + dtime + " from=" + from + " content="
				+ content + " slot=" + slot);
	},
	// 操作回调通知
	onOperCallback : function(flowid, callid, cdrid, direction, teleno, time,
			state) {
		showEvent("onOperCallback: : flowid=" + flowid + " callid=" + callid
				+ " cdrid=" + cdrid + " direction=" + direction + " teleno="
				+ teleno + " time=" + time + " state=" + state)
	},
	// 快速拨号回调通知
	onSpeedCallback : function(flowid, callid, cdrid, direction, teleno, time,
			state, desc, sessionid) {
		showEvent("onSpeedCallback: flowid=" + flowid + " callid=" + callid
				+ " cdrid=" + cdrid + " direction=" + direction + " teleno="
				+ teleno + " time=" + time + " state=" + state + " desc="
				+ desc + " sessionid=" + sessionid);
	},

	onTextMessage : function(fromaid, chatmode, text) {
		showEvent("onTextMessage: fromaid=" + fromaid + " chatmode=" + chatmode
				+ " content=" + text);
	}
}

function getDateAndTime() {
	var ndate = new Date();
	var nstrg = [];
	nstrg[nstrg.length] = ndate.getFullYear();
	nstrg[nstrg.length] = '-';
	nstrg[nstrg.length] = ("0" + (ndate.getMonth() + 1)).slice(-2);
	nstrg[nstrg.length] = '-';
	nstrg[nstrg.length] = ("0" + ndate.getDate()).slice(-2);
	nstrg[nstrg.length] = ("0" + ndate.getHours()).slice(-2);
	nstrg[nstrg.length] = ("0" + ndate.getMinutes()).slice(-2);
	nstrg[nstrg.length] = ("0" + ndate.getSeconds()).slice(-2);
	return nstrg.join('');
}
//来电历史记录 
function showcallhistory(){
	$("#dlg_History").dialog("open");
}
// 载入时自动启动
//UMO._addEvent(window, 'load', hcall_start, false);
UMO._addEvent(window, 'beforeunload', hcall_exit, false);