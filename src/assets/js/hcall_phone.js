import {UMO} from '@/assets/js/UniMediaAPI.js'
// var UMO = require('./UniMediaAPI.js');
export default ({
    cm_callsate:0,
    cm_login:null,
    fenji:'',
    phone:'',
    gonghao:'',
    first:true,
    doOprInReq:function(phone,fenji,gonghao,duiliehao) {
        //签入
        this.phone=phone
        this.gonghao=gonghao
        var _this=this
        var acd = duiliehao;//队列号（技能组）号
        var eid = "0"; //$("#eid").val();////租户ID
        var bizhost = '';
        var aid = gonghao;//工号
        var adn = aid; //$("#adn").val();//话务员分机电话号码
        this.fenji=adn;
        var apwd = "e10adc3949ba59abbe56e057f20f883e";//工号密码
        var apihost = 'http://cti254.csgxcf.com/IXServer';//接口地址cti254.csgxcf.com
        this.cm_callsate = 0;
        
        //断开连接
        UMO.exit(function(cmd, result){
            //启动连接
            UMO.start(apihost, bizhost, _this.EvtHandler, eid, "", aid, apwd, adn, function(cmd, result) {
                //0:启动成功 -3:已启动
                console.log(result)
                if (result.errno == 0 || result.errno == -3) {
                    _this.cm_logstart=1;
                    //登出原有座席
                    UMO.logout(aid, function(cmd, result){
                        //签入座席
                        UMO.login(aid, acd, -1, false, false, function(cmd, result) {
                            if (result.errno == 0) {
                                    console.log(phone)
                                    _this.doOprCallOutReq(phone)
                                // _this.doOprCallOutReq(phone)
                                // _this.cm_login=1;
                                // setPhoneButtonStatus(false, true, true, false, true, false, "状态:签入成功");
                            } else {
                                console.log('签入失败'+result.errmsg)
                                // setPhoneButtonStatus(true, true, true, true, true, false, "状态:签入失败<br>原因:"+result.errmsg);
                            }
                        }, null);//签入座席
                    }, null);//登出原有座席
                }//启动连接判断
            },null);//启动连接
        },null);//断开连接	
    },
    doSetOprFreeReq:function () {
        //示闲
        var that=this
        UMO.setidle(function(cmd, result) {
            if (result.errno == 0) {
                that.cm_callsate = 0;
                // setPhoneButtonStatus(false, true, true, false, true, false, "状态:坐席空闲");
            } else {
                // setPhoneButtonStatus(true, true, false, true, true, true, "状态:示闲失败<br>原因:"+result.errmsg);
            }
        }, null);
    },
    doSetOprDropReq:function(gonghao){
        //挂断
        var that=this
        UMO.onhook(
        function(cmd, result) {
            if (result.errno == 0) {
                that.cm_callsate = 1;
                // that.doSetOprBusyReq();//示忙
                that.doSetOprFreeReq();
                that.doOprOutReq(gonghao)//签出
            } else {
                // setPhoneButtonStatus(true, true, false, true, true, true, "状态:坐席示忙");
            }
        }, null);
    },
    EvtHandler:{// 就绪通知
        that:this,
        onReadyState : function(status) {
            console.log(status)
            if(status == 0 && this.cm_login!=2){//网络判断时系统自动判断重连
                if(window.confirm('网络异常，是否需要重新签入？')){
                    this.doOprInReq();
                }
            }
        },
        //来话通知
        onCallincome : function(ano, bno, uud) {
            console.log(ano, bno, uud)
            $("#ano").val(ano);
            $("#bno").val(bno);
            // setPhoneButtonStatus(true, false, true, true, true, true, "状态:通话中");
            //来电号码历史记录
            /*if(ano!=$("#aid").val()){
                //showHistoryCall(bno);
                //$("#callinhistory_btn").disabled = false;
            }*/
        },
        //呼出通话通知
        onTalked : function(ano, bno, uud) {
            console.log(ano, bno, uud)
            this.that.a.getcdrid(ano, bno);
        },
        //振铃停止通知
        onRingStoped : function() {
        },
        // 挂机通知
        onHookChanged : function(status) {
            //alert(status);
            console.log(status)
            if (status == 1 || status == 3 || status == 4) {
                this.cm_callsate = 0;
                this.that.a.doSetOprDropReq(this.that.a.gonghao);
                // 坐席挂机
                if (status == 1) {
                    var aid = this.that.a.gonghao;// 工号
                    var ano = '88693050';// 主叫
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
                    console.log(querys);
                    // document.getElementById(querys.wb_OrderId).contentWindow.setCallInfo(querys);
                    // $('#pStatus').val(1);// 呼入
                }
            }
            if (status == 2) {
                console.log(this.that.a.phone)
                var ano = '88693050';
                var bno = this.that.a.phone;
                setTimeout(this.that.a.getcdrid(ano, bno), 1000);// 录音
            }
        },
        // 话务员状态通知
        onAgentChanged : function(status) {
            console.log(status)
        },
        // 异步操作结束通知
        onAsyncFinished : function(atype, taskid, ret, desc) {
            console.log(atype, taskid, ret, desc)
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
    },
    doSetOprBusyReq:function() {
        //示忙
        var that=this
        UMO.setbusy(
                function(cmd, result) {
                    if (result.errno == 0) {
                        that.cm_callsate = 1;
                        // setPhoneButtonStatus(true, true, false, true, true, true, "状态:坐席示忙");
                    }
                }, null);
    },
    getcdrid:function (ano, bno) {
        //获取话单ID
        UMO.getcdrid(function(cmd, result) {
            console.log(result,ano,bno)
            if (result.errno == 0) {
                console.log(result.cdrid)
                // $('#cdrid').val(result.cdrid);
            }
        }, null);
    },
    hcall_exit:function () {
        //关闭
        this.cm_callsate = 0;
        this.cm_logstart = 0;
        UMO.exit(this.cbResult(), null)
    },
    cbResult:function (cmd, result) {
        //结果回调
        // console.log(result)
        // if (result.errno == 0) {
        //     if (cmd == '/comm/start' || cmd == '/comm/exit') {
        //         // setPhoneButtonStatus(true, true, true, true, false, true, "状态:等待签入...");
        //     }
        // }
    },
    doOprOutReq:function (gonghao) {
        //签出
        var that=this
        var aid = gonghao;//工号
        UMO.logout(aid, function(cmd, result) {
            if (result.errno == 0) {//
                that.cm_login=2;
                that.hcall_exit();
                // setPhoneButtonStatus(true, true, true, true, false, true, "状态:等待签入...");
            } else {
                // setPhoneButtonStatus(false, true, true, false, true, false, "状态:签出失败<br>原因:"+result.errmsg);
            }
        }, null);
    },
    doOprCallOutReq:function(phone){
        // 拨出
        var that=this
        var calleddn = phone;//拨出号码
        var gid = -1; //$("#agentgid").val();//中继线路 指定中继号码，或 @+租户ID 选择租户任意线路(转移会议无效)
        calleddn = calleddn.replace(/\D+/g, '');
        if (calleddn.length < 3) {
            alert('电话号码不能为空！');
            return;
        }
        if (this.cm_callsate == 1) {
            alert('话机正在操作中请示闲');
            return;
        }
        if (this.cm_callsate == 0) {
            this.cm_callsate = 1;
        }
        // $('#pStatus').val(0);//呼出
        var telephoness = '73188693053';// 节点号
        // var phoneverify_id = $('#phoneverify_id').val();// 单号
        // if (phoneverify_id.length<1) {
        //     alert('系统提示', "请选择要拨打的订单！", 'warning');
        //     return false;
        // }
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
        var cur_date=getDateAndTime();
        var cur_time=cur_date.substring(10)+"_"+calleddn+"_"+telephoness;
        var uud="ano:" + this.fenji+";__RECORDDIAL__:F#\\record\\"+cur_date.substring(0,10)+"\\"+cur_time+".wav";
        calleddn = 9 + calleddn;
        UMO.dialout(calleddn, gid, uud, true, function(cmd, result) {
            if (result.errno == 0) {
                console.log(result.errno)
                // that.EvtHandler.onHookChanged(2)
                that.first=false
                // that.doSetOprBusyReq();
                // $('#phoneOut_orid').val($('#phone_orid').val());// 赋值正在播出
                // $('#phoneOutverify_id').val(phoneverify_id);// 赋值正在拨出
                // setPhoneButtonStatus(true, false, true, true, true, true, "状态:呼出通话中");
            } else {
                console.log(result.errmsg)
                // setPhoneButtonStatus(false, true, true, false, true, false, "状态:呼出失败<br>原因:"+result.errmsg);
            }
        }, null)
    }
})