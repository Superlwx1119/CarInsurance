
<template>
    <div class="Saleslist" v-loading="showDetali">
        <div v-if="$store.state.show">
            <transition name="fade" mode="out-in">
                <div>
        <div class="tagCont">
            <div class="doSelect">
            <el-row class="rowSpan">
                <el-col :span="24">
                    <el-form :inline="true">
                        <el-form-item style="padding-left:15px;">
                            <span>待办时间:</span>
                            <el-date-picker
                            v-model="waitTime"
                            align="right"
                            value-format="yyyy-MM-dd"
                            type="date"
                            size="small"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item style="padding-left:50px;">
                            <el-button type="primary" size="small" @click="search"><i class="el-icon-search"></i>查询</el-button>
                            <el-button size="small" @click="reset"><i class="el-icon-setting"></i>重置</el-button>
                            <!-- <span>无联系方式:</span>
                            <el-checkbox v-model="noCall"></el-checkbox> -->
                        </el-form-item>
                        
                    </el-form>
                </el-col>
            </el-row>
            </div>
            <div class="table">
            <el-table
            @selection-change="selsChange"
            @sort-change="sort"
            v-loading="loading"
            @row-click='rowClcik'
            size='mini'
            :height='heightTable'
            :data="tableData"
            border
            style="width: 95%">
            <!-- :default-sort = "{prop: sortField, order: sortWay}" -->
                <el-table-column
                    type="index"
                    fixed
                    align="center"
                    width="45">
                </el-table-column>
                <el-table-column
                    fixed
                    type="selection"
                    align="center"
                    width="45">
                </el-table-column>
                <el-table-column
                    prop="LICENSEOWNER"
                    align="center"
                    label="车主姓名">
                </el-table-column>
                <el-table-column
                    prop="TYPE"
                    align="center"
                    label="待办类型">
                </el-table-column>
                <el-table-column
                    prop="SDILEID"
                    align="center"
                    label="编号">
                    <!-- <template slot-scope="scpoe">
                      <p class="licenseNo" @click="rowClcik(scpoe.row,scpoe)">{{scpoe.row.sdileId}}</p>
                    </template> -->
                </el-table-column>
                <el-table-column
                    prop="INSTIME"
                    align="center"
                    :sort-method="sort"
                    sortable='custom'
                    label="插入时间">
                </el-table-column>
                <el-table-column
                    prop="RESTIME"
                    align="center"
                    :sort-method="sort"
                    sortable='custom'
                    label="待办时间">
                </el-table-column>
                <el-table-column
                    prop="USERNAME"
                    align="center"
                    label="销售员">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scpoe">
                        <el-button size="small" @click.stop="deleteData(scpoe.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </div>
        </div>
        <div class="page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            background
            :page-sizes="[20, 50, 100, 200]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
        </div>
            </transition>
        </div>
        <div v-if="!$store.state.show">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        <transition name="el-fade-in">
            <div class="operation" v-if="operation">
                <div class="operationCont">
                    <h2>{{operationTxt}}<span @click="cancelOperation">×</span></h2>
                    <table v-if="operationKind=='edit'">
                        <tr>
                            <td>销售员:</td>
                            <td>
                                <el-select v-model="value" filterable  placeholder="请选择">
                                    <el-option
                                    v-for="item in saler"
                                    :key="item.userid"
                                    :label="item.username"
                                    :value="item.userid">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                    </table>
                    <table v-if="operationKind=='sort'">
                        <tr>
                            <td>提示:</td>
                            <td>
                                请不要频繁同步订单!
                            </td>
                        </tr>
                    </table>
                    <table v-if="operationKind=='setting'">
                        <tr>
                            <td>订单状态:</td>
                            <td>
                                <el-select v-model="changeStates"  placeholder="请选择">
                                    <el-option
                                    v-for="item in orderStates"
                                    clearable
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                    </table>
                    <p>
                        <el-button  @click="cancelOperation">取消</el-button>
                        <el-button  type="primary" @click="update(operationKind)">确定</el-button>
                    </p>
                </div>
            </div>
        </transition>
        <SalesDetail ref="callIN" class="SalesDetail"/>
    </div>
</template>

<script>
import getUrl from '@/assets/js/getUrl.js';
import store from '@/store'
import commod from '@/assets/js/commod.js';
import call from '@/assets/js/hcall_phone.js';
import {UMO} from '@/assets/js/UniMediaAPI.js'
import SalesDetail from '../sales/SalesDetail';
export default {
    name:'NotDo',
    components:{
        SalesDetail
    },
    props:{
      table:Array,
      totalSum:Number,
      rows:Number,
    },
    data() {
      return {
        noCall:0,
        waitTime:'',
        nextContactTime:[],
        showDetali:false,
        lastsource:[],
        telPhone:'',
        sources:[{label:'太平洋保险',value:'1'},{label:'中国平安',value:'2'},{label:'中国人保',value:'4'},{label:'中国人寿',value:'8'},{label:'其他',value:'9'}],
        currentPage:1,
        size2:20,
        total2:0,
        loading2:false,
        searchTable:[],
        showTable:true,
        selectArea:'湘',
        selectAreas:['湘','京','津','沪','渝','冀','豫','云','辽','黑','皖','鲁','新','苏','浙','赣','鄂','桂','甘','晋','蒙','陕','吉','闽','贵','粤','青','藏','川','宁','琼','使','领'],
        addCarId:'',
        cm_login:'',
        salesMan:'',
        sfState:'',
        sfStates:[{label:'未派发',value:0},{label:'已派发',value:1}],
        saler:[],
        carId:'',
        name:'',
        selection:[],
        registeredDate:[],
        jqxdqDate:[],
        syxdqDate:[],
        selectedOptions: [],
        orderStates:[],
        operation:false,
        changeStates:'',
        dialogVisible:false,
        operationKind:'',
        operationTxt:'批量调单',
        heightTable:'',
        pickerOptions: {
          shortcuts: [{
            text: '一周后',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '三十天后',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '六十天后',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 60);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '九十天后',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value2:'',
        editableTabsValue: '1',
        value:'',
        editableTabs: [{
          title: '销售列表',
          name: '1',
        }, ],
        total:0,
        state:[],
        currentPage4:1,
        size:20,
        checked:'',
        tabIndex: 1,
        prograss:'',
        asdL:{},
        role:'',
        orderState:'',
        tableData: [],
        loading:false,
        cm_callsate:0,
        cm_logstart:null,
        selectData:'',
        sortField:'insTime',
        sortWay:'descending',
        searchLin:'',
        dialogSearch:false,
        UMO : {
                _apihost : "/DeskServer",
                _bizhost : "", //Reserved
                _dom : "", //保存登录返回的企业ID
                _token : "", //保存登录返回的令牌
                _loginok : false, //登录成功
                _evtname : "msievent", //侦听事件名
                _lastInitTime : 0, //上次初始化时间
                _retrydelay : 1000, //重试延迟
                _syncmode : false, //同步模式，缺省为异步
                _running : false,
                _pingTimer : null, //ping定时器

                _evthandler : //缺省事件回调函数，用户需替换为自己的事件处理对象
                {
                    /**
                     * 连接就绪状态（仅用于东进Keygoe产品的UniMedia中间件对接）
                     * @param status 1就绪(可登录) 0未就绪
                     */
                    onReadyState : function(status) {
                    },

                    /**
                     * 来话通知
                     * @param ano  主叫号码
                     * @param bno  被叫号码
                     * @param uud  业务数据，”dialout”分机拨出，”misc:callback”分机回呼

                    */
                    onCallincome : function(ano, bno, uud) {
                    },

                    /**
                     * 通话通知
                     * @param ano  呼叫号码
                     * @param bno  被叫号码
                     * @param uud  业务数据
                     */
                    onTalked : function(ano, bno, uud) {
                    },

                    /**
                     * 振铃停止
                     */
                    onRingStoped : function() {
                    },

                    /**
                     * 话机状态变化
                     * @param status  1挂机 2摘机
                     */
                    onHookChanged : function(status) {
                    },

                    /**
                     * 话务员状态变化
                     * @param status  1未登录 2空闲 3离开 4工作
                     */
                    onAgentChanged : function(status) {
                    },

                    /**
                     * 异步操作结束通知
                     * @param atype  异步任务类型（8拨号）
                     * @param taskid 任务ID
                     * @param ret 结果（1开始2进行-1失败0成功）
                     * @param desc 描述
                     */
                    onAsyncFinished : function(atype, taskid, ret, desc) {
                    },

                    /**
                     * 话务员全忙通知（仅用于东进Keygoe产品的UniMedia中间件对接）
                     * @param status  1全忙 0非全忙
                     * @param acd 队列号
                     * @param quelen  队列长度
                     */
                    onAllBusy : function(status, acd, quelen) {
                    },

                    /**
                     * 队列长度通知
                     * @param acd  队列号
                     * @param quelen 队列长度
                     */
                    onQuelen : function(acd, quelen) {
                    },

                    /**
                     * 短信到达通知
                     * @param dtime  到达时间
                     * @param from  来源号码
                     * @param content  短信内容
                     * @param slot  短信设备槽
                     */
                    onSmsincome : function(dtime, from, content, slot) {
                    },

                    /**
                     * 操作回调通知
                     * @param flowid  流程ID
                     * @param callid  呼叫ID
                     * @param direction  方向in/out
                     * @param teleno 对端电话
                     * @param time 时间
                     * @param state 状态，0挂机1正常
                     */
                    onOperCallback : function(flowid, callid, cdrid, direction, teleno,
                            time, state) {
                    },

                    /**
                     * 速拨回调通知
                     * @param flowid  流程ID
                     * @param callid  呼叫ID
                     * @param direction  方向in/out
                     * @param teleno  对端电话
                     * @param time  时间
                     * @param state  状态 -1失败 0接通 2呼叫中 3拆线 4控制
                     * @param desc 状态描述
                     */
                    onSpeedCallback : function(flowid, callid, cdrid, direction, teleno,
                            time, state, desc, sessionid) {
                    },

                    /**
                     * 文件消息通知
                     * @param fromaid 来源工号
                     * @param chatmode 消息模式 1广播 2点对点
                     * @param text 消息内容
                     */
                    onTextMessage : function(fromaid, chatmode, text) {
                    }
                },

                //-------------------------------------- Common ------------------------------------

                /**
                 * 启动
                 * @param apiurl
                 * @param bizurl
                 * @param evthandler
                 * @param eid
                 * @param epwd
                 * @param aid
                 * @param apwd
                 * @param adn
                 * @param cb
                 * @param w
                 */
                start : (apiurl, bizurl, evthandler, eid, epwd, aid, apwd, adn, cb,
                        w)=>{
                    if (this.UMO._running == true) {
                        if ((cb != null) && (cb != undefined)) {
                            cb("/comm/start", {
                                "errno" : this.UMO.ERR_ALREADYSTART,
                                "errmsg" : this.UMO.MSG_ALREADYSTART
                            });
                        }
                        return;
                    }

                    if (this.UMO._pingTimer != null) {
                        clearTimeout(this.UMO._pingTimer);
                        this.UMO._pingTimer = null;
                    }

                    //跨站脚本
                    jQuery.support.cors = true;

                    this.UMO._apihost = apiurl;
                    this.UMO._bizhost = bizurl;
                    this.UMO._evthandler = evthandler;
                    this.UMO._dom = eid;
                    this.UMO._userid = aid;

                    var cmd = "/comm/start";
                    var args = "dom=" + eid + "&epwd=" + epwd + "&aid=" + aid + "&apwd="
                            + apwd + "&adn=" + adn;
                    this.UMO._ajaxcall(cmd, args, (cmd, result)=>{
                        //
                        if (result.errno == 0) {
                            this.UMO._running = true;
                            this.UMO._token = result.token;

                            //PushLet推送
                            this.UMO._initpush();

                            //启动ping
                            this.UMO._pinging();
                        }

                        if ((cb != null) && (cb != undefined)) {
                            cb(cmd, result);
                        }
                    }, w);
                },

                /**
                 * 退出
                 * @param cb
                 * @param w
                 */
                exit : (cb, w)=>{
                    //停止PushLet推送事件
                    this.UMO._running = false;

                    var cmd = "/comm/exit";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);

                        //清空dom
                        this.UMO._dom = "";
                        this.UMO._token = "";
                    }
                },

                /**
                 *
                 * @param cb
                 * @param w
                 */
                ping : (cb, w)=>{
                    var cmd = "/comm/ping";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                 * 查询最后一次事件
                 * @param evttype
                 * @param cb
                 * @param w
                 */
                getevent : (evttype, cb, w) =>{
                    var cmd = "/comm/getevent";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&evttype="
                            + evttype;

                    this.UMO._ajaxcall(cmd, args, (cmd, result)=> {
                        if ((cb != null) && (cb != undefined)) {
                            cb(cmd, result);
                        }
                    }, w);
                },

                /**
                 * 订阅全局事件
                 * @param evttypes
                 * @param cb
                 * @param w
                 */
                subscribe : (evttypes, cb, w) =>{
                    var cmd = "/comm/subscribe";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&evttypes="
                            + evttypes;

                    this.UMO._ajaxcall(cmd, args, (cmd, result) =>{
                        if ((cb != null) && (cb != undefined)) {
                            cb(cmd, result);
                        }
                    }, w);
                },

                /**
                 * 获取序列号
                 * @param cb
                 * @param w
                 */
                getsysid : (cb, w) =>{
                    var cmd = "/comm/getsysid";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    this.UMO._ajaxcall(cmd, args, (cmd, result) =>{
                        if ((cb != null) && (cb != undefined)) {
                            cb(cmd, result);
                        }
                    }, w);
                },

                /**
                 * 获取位置
                 * @param cb
                 * @param w
                 */
                getpos : (cb, w) =>{
                    var cmd = "/comm/getpos";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    this.UMO._ajaxcall(cmd, args, function(cmd, result) {
                        if ((cb != null) && (cb != undefined)) {
                            cb(cmd, result);
                        }
                    }, w);
                },

                /**
                 * 获取当前用户
                 * @param cb
                 * @param w
                 */
                getuser : (cb, w) =>{
                    var cmd = "/comm/getuser";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    this.UMO._ajaxcall(cmd, args, (cmd, result) =>{
                        if ((cb != null) && (cb != undefined)) {
                            cb(cmd, result);
                        }
                    }, w);
                },

                /**
                 * 获取当前版本
                 * @param cb
                 * @param w
                 */
                getversion : (cb, w)=> {
                    var cmd = "/comm/getversion";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    this.UMO._ajaxcall(cmd, args, function(cmd, result) {
                        if ((cb != null) && (cb != undefined)) {
                            cb(cmd, result);
                        }
                    }, w);
                },

                /**
                 * 设置同步模式
                 * @param flag
                 */
                setsyncmode : (flag) =>{
                    this.UMO._syncmode = flag;
                },

                //-------------------------------------- Tele ------------------------------------

                //--- Call ---

                /**
                 * 快速拨号
                 * @param teleno
                 * @param dispno
                 * @param playfile
                 * @param oper
                 * @param param
                 * @param gid
                 * @param recflag
                 * @param uud
                 * @param backurl
                 * @param cb
                 * @param w
                 */
                speeddial : (teleno, dispno, playfile, oper, param, gid, recflag,
                        uud, backurl, cb, w) =>{
                    var cmd = "/tele/call/speeddial";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&teleno="
                            + teleno + "&dispno=" + dispno + "&playfile=" + playfile
                            + "&oper=" + oper + "&param=" + param + "&gid=" + gid
                            + "&recflag=" + recflag + "&uud=" + uud + "&backurl="
                            + encodeURIComponent(backurl);
                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                 * 发送短信
                 * @param teleno
                 * @param content
                 * @param options
                 * @param slot
                 * @param cb
                 * @param w
                 */
                speedsms : (teleno, content, options, slot, cb, w)=> {
                    var cmd = "/tele/call/speedsms";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&teleno="
                            + teleno + "&content=" + encodeURIComponent(content)
                            + "&options=" + options + "&slot=" + slot;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                 * 快速放音
                 * @param callid
                 * @param playfile
                 * @param dtmfcnt
                 * @param termchars
                 * @param loop
                 * @param async
                 * @param cb
                 * @param w
                 */
                speedplay : (callid, playfile, dtmfcnt, termchars, loop, async, cb,
                        w) =>{
                    var cmd = "/tele/call/speedplay";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&callid="
                            + callid + "&playfile=" + encodeURIComponent(playfile)
                            + "&dtmfcnt=" + dtmfcnt + "&termchars=" + termchars + "&loop="
                            + loop + "&async=" + async;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                 * 快速录音
                 * @param callid
                 * @param filename
                 * @param async
                 * @param maxtime
                 * @param termchar
                 * @param append
                 * @param cb
                 * @param w
                 */
                speedrecord : (callid, filename, async, maxtime, termchar, append,
                        cb, w) =>{
                    var cmd = "/tele/call/speedrecord";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&callid="
                            + callid + "&filename=" + encodeURIComponent(filename)
                            + "&async=" + async + "&maxtime=" + maxtime + "&termchar="
                            + termchar + "&append=" + append;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                 * 快速停止
                 * @param callid
                 * @param taskid
                 * @param type
                 * @param cb
                 * @param w
                 */
                speedstop : (callid, taskid, type, cb, w) =>{
                    var cmd = "/tele/call/speedstop";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&callid="
                            + callid + "&taskid=" + taskid + "&type=" + type;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 快速挂机
                * @param callid
                * @param cb
                * @param w
                */
                speedhook : (callid, cb, w) =>{
                    var cmd = "/tele/call/speedhook";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&callid="
                            + callid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 快速前转
                * @param callid
                * @param acdno
                * @param aidplay
                * @param cb
                * @param w
                */
                speedfoward : (callid, acdno, aidplay, cb, w)=> {
                    var cmd = "/tele/call/speedfoward";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&callid="
                            + callid + "&acdno=" + acdno + "&aidplay=" + aidplay;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 快速连接
                * @param callid1
                * @param callid2
                * @param action
                * @param cb
                * @param w
                */
                speedconnect : (callid1, callid2, action, cb, w) =>{
                    var cmd = "/tele/call/speedconnect";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&callid1="
                            + callid1 + "&callid2=" + callid2 + "&action=" + action;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //--- Conf --

                /**
                * 新建会议
                * @param password
                * @param cb
                * @param w
                */
                confnew : (password, cb, w) =>{
                    var cmd = "/tele/conf/new";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&password="
                            + password;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 删除会议
                * @param confid
                * @param password
                * @param cb
                * @param w
                */
                confdelete : (confid, password, cb, w)=> {
                    var cmd = "/tele/conf/delete";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&confid="
                            + confid + "&password=" + password;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 会议邀请
                * @param confid
                * @param password
                * @param dispno
                * @param teleno
                * @param gid
                * @param attr
                * @param cb
                * @param w
                */
                confinvite : (confid, password, dispno, teleno, gid, attr, cb, w) =>{
                    var cmd = "/tele/conf/invite";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&confid="
                            + confid + "&password=" + password + "&dispno=" + dispno
                            + "&teleno=" + teleno + "&gid=" + gid + "&attr=" + attr;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 会议踢出
                * @param confid
                * @param password
                * @param callid
                * @param teleno
                * @param cb
                * @param w
                */
                confkick : function(confid, password, callid, teleno, cb, w) {
                    var cmd = "/tele/conf/kick";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&confid="
                            + confid + "&password=" + password + "&callid=" + callid
                            + "&teleno=" + teleno;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 会议属性
                * @param confid
                * @param password
                * @param callid
                * @param teleno
                * @param newattr
                * @param cb
                * @param w
                */
                confattr : function(confid, password, callid, teleno, newattr, cb, w) {
                    var cmd = "/tele/conf/attr";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&confid="
                            + confid + "&password=" + password + "&callid=" + callid
                            + "&teleno=" + teleno + "&newattr=" + newattr;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 会议列表
                * @param cb
                * @param w
                */
                conflist : function(cb, w) {
                    var cmd = "/tele/conf/list";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 会议成员
                * @param confid
                * @param password
                * @param cb
                * @param w
                */
                confmember : function(confid, password, cb, w) {
                    var cmd = "/tele/conf/member";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&confid="
                            + confid + "&password=" + password;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //--- Fax ---

                /**
                * 发送传真
                * @param teleno
                * @param faxfile
                * @param dtime
                * @param options
                * @param gid
                * @param cb
                * @param w
                */
                faxsend : (teleno, faxfile, dtime, options, gid, cb, w) =>{
                    var cmd = "/tele/fax/send";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&teleno="
                            + teleno + "&teleno=" + teleno + "&faxfile=" + faxfile
                            + "&dtime=" + dtime + "&options=" + options;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 传真列表
                * @param cb
                * @param w
                */
                faxlist : (cb, w) =>{
                    var cmd = "/tele/fax/list";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 删除传真
                * @param faxfile
                * @param cb
                * @param w
                */
                faxdelete : function(faxfile, cb, w) {
                    var cmd = "/tele/fax/delete";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&faxfile="
                            + faxfile;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //--- Voice --

                /**
                * 获取录音文件下载链接
                * @param cdrsrc
                * @param cb
                * @param w
                */
                getrecordfile : function(cdrsrc, cb, w) {
                    var cmd = "/tele/vox/getrecordfile";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&cdrsrc="
                            + cdrsrc;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * g729解码（仅用于Windows版）
                * @param srcfile
                * @param destfile
                * @param cb
                * @param w
                */
                g729decode : (srcfile, destfile, cb, w)=> {
                    var cmd = "/tele/vox/g729decode";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&srcfile="
                            + srcfile + "&destfile=" + destfile;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 文本转语音
                * @param text
                * @param destfile
                * @param option
                * @param cb
                * @param w
                */
                text2wave : (text, destfile, option, cb, w) =>{
                    var cmd = "/tele/vox/text2wave";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&text=" + text
                            + "&destfile=" + destfile + "&option=" + option;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //--- System ---

                /**
                * 队列列表
                * @param acd
                * @param cb
                * @param w
                */
                acdlist : (acd, cb, w)=> {
                    var cmd = "/tele/sys/getacdinfolist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&acdno=" + acd;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 队列排队项列表
                * @param acd
                * @param cb
                * @param w
                */
                acditemlist : (acd, cb, w) =>{
                    var cmd = "/tele/sys/getacditemlist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&acdno=" + acd;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 话务员列表
                * @param acd
                * @param cb
                * @param w
                */
                agentlist : (acd, cb, w) =>{
                    var cmd = "/tele/sys/getagentinfolist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&acdno=" + acd;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 中继列表
                * @param cb
                * @param w
                */
                trunklist : (cb, w)=> {
                    var cmd = "/tele/sys/gettrunkinfolist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 内线列表
                * @param cb
                * @param w
                */
                msilist : (cb, w)=> {
                    var cmd = "/tele/sys/getmsiinfolist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 呼叫列表
                * @param cb
                * @param w
                */
                calllist : (cb, w)=> {
                    var cmd = "/tele/sys/getcallinfolist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 流程列表
                * @param cb
                * @param w
                */
                flowlist : (cb, w)=> {
                    var cmd = "/tele/sys/getflowinfolist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 外呼任务列表
                * @param cb
                * @param w
                */
                tasklist : (cb, w)=> {
                    var cmd = "/tele/sys/gettaskinfolist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 注册列表
                * @param isall
                * @param cb
                * @param w
                */
                sipuserlist : (isall, cb, w) =>{
                    var cmd = "/tele/sys/getsipuserlist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&all=" + isall;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 系统信息
                * @param cb
                * @param w
                */
                sysinfo : (cb, w)=> {
                    var cmd = "/tele/sys/getsysteminfo";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 运行状态
                * @param cb
                * @param w
                */
                runstatelist : (cb, w)=> {
                    var cmd = "/tele/sys/getrunstatelist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 硬件通道
                * @param cb
                * @param w
                */
                hardchanlist : (cb, w)=> {
                    var cmd = "/tele/sys/gethardchanlist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //--- Agent

                /**
                * 签入
                * @param aid
                * @param acd
                * @param skill
                * @param mon
                * @param silent
                * @param cb
                * @param w
                */
                login : (aid, acd, skill, mon, silent, cb, w)=> {
                    var cmd = "/tele/agent/login";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&aid=" + aid
                            + "&acd=" + acd + "&skill=" + skill + "&mon=" + mon
                            + "&silent=" + silent;

                    this.UMO._ajaxcall(cmd, args, (cmd, result)=> {
                        if (result.errno == 0) {
                            this.UMO._loginok = true;
                        }
                        if ((cb != null) && (cb != undefined)) {
                            cb(cmd, result);
                        }
                    }, w);
                },

                /**
                * 签出
                * @param aid
                * @param cb
                * @param w
                */
                logout : (aid, cb, w) =>{
                    var cmd = "/tele/agent/logout";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&aid=" + aid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, (cmd, result)=> {
                            if (result.errno == 0) {
                                this.UMO._loginok = false;
                            }
                            if ((cb != null) && (cb != undefined)) {
                                cb(cmd, result);
                            }
                        }, w);
                    }
                },

                /**
                * 摘机（保留）
                * @param cb
                * @param w
                */
                offhook : (cb, w) =>{
                    var cmd = "/tele/agent/offhook";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 挂机
                * @param cb
                * @param w
                */
                onhook : (cb, w)=> {
                    var cmd = "/tele/agent/onhook";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 示忙
                * @param cb
                * @param w
                */
                setbusy : (cb, w)=> {
                    var cmd = "/tele/agent/setbusy";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 示闲
                * @param cb
                * @param w
                */
                setidle : (cb, w) =>{
                    var cmd = "/tele/agent/setidle";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 拨号
                * @param teleno
                * @param gid
                * @param uud
                * @param async
                * @param cb
                * @param w
                */
                dialout : (teleno, gid, uud, async, cb, w) =>{
                    var cmd = "/tele/agent/dialout";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&teleno="
                            + teleno + "&gid=" + gid + "&uud=" + uud + "&async=" + async;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 初始会议
                * @param teleno
                * @param uud
                * @param async
                * @param cb
                * @param w
                */
                initconf : (teleno, uud, async, cb, w)=> {
                    var cmd = "/tele/agent/initconf";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&teleno="
                            + teleno + "&uud=" + uud + "&async=" + async;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 完成会议
                * @param cb
                * @param w
                */
                compconf : (cb, w)=> {
                    var cmd = "/tele/agent/compconf";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 初始转移
                * @param teleno
                * @param uud
                * @param async
                * @param cb
                * @param w
                */
                inittrans : (teleno, uud, async, cb, w)=> {
                    var cmd = "/tele/agent/inittrans";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&teleno="
                            + teleno + "&uud=" + uud + "&async=" + async;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 完成转移
                * @param cb
                * @param w
                */
                comptrans : (cb, w)=> {
                    var cmd = "/tele/agent/comptrans";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 挂起（保持）
                * @param mute
                * @param cb
                * @param w
                */
                hold : (mute, cb, w)=> {
                    var cmd = "/tele/agent/hold";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&mute" + mute;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 恢复
                * @param cb
                * @param w
                */
                retrieve : (cb, w)=> {
                    var cmd = "/tele/agent/retrieve";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 放音
                * @param filename
                * @param tts
                * @param async
                * @param loop
                * @param cb
                * @param w
                */
                play : (filename, tts, async, loop, cb, w)=> {
                    var cmd = "/tele/agent/play";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&filename="
                            + filename + "&tts=" + tts + "&async=" + async + "&loop="
                            + loop;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 录音
                * @param filename
                * @param async
                * @param maxtime
                * @param termchar
                * @param append
                * @param cb
                * @param w
                */
                record : (filename, async, maxtime, termchar, append, cb, w)=> {
                    var cmd = "/tele/agent/record";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&filename="
                            + filename + "&async=" + async + "&maxtime=" + maxtime
                            + "&termchar=" + termchar + "&append=" + append;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 收码
                * @param filename
                * @param tts
                * @param loop
                * @param maxdigits
                * @param termchars
                * @param timeout
                * @param cb
                * @param w
                */
                getdtmf : (filename, tts, loop, maxdigits, termchars, timeout, cb,
                        w) =>{
                    var cmd = "/tele/agent/getdtmf";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&filename="
                            + filename + "&tts=" + tts + "&loop=" + loop + "&maxdigits="
                            + maxdigits + "&timeout=" + timeout;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 停止操作
                * @param taskid
                * @param type
                * @param cb
                * @param w
                */
                stopop : (taskid, type, cb, w) =>{
                    var cmd = "/tele/agent/stopop";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&taskid="
                            + taskid + "&type=" + type;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 设置UUD
                * @param uud
                * @param cb
                * @param w
                */
                setuud : (uud, cb, w)=> {
                    var cmd = "/tele/agent/setuud";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&uud=" + uud;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 获取当前呼叫的话单ID
                * @param cb
                * @param w
                */
                getcdrid : (cb, w)=> {
                    var cmd = "/tele/agent/getcdrid";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 获取当前呼叫的呼叫ID
                * @param cb
                * @param w
                */
                getcallid : (cb, w)=> {
                    var cmd = "/tele/agent/getcallid";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 座席之间发送文本消息
                * @param destaid
                * @param chatmode
                * @param text
                * @param cb
                * @param w
                */
                sendtextmessage : function(destaid, chatmode, text, cb, w) {
                    var cmd = "/tele/agent/sendtextmessage";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destaid="
                            + destaid + "&chatmode=" + chatmode + "&text="
                            + encodeURIComponent(text);

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 快速转移 Keygoe专用
                * @param destno
                * @param uud
                * @param failaction
                * @param failacd
                * @param cb
                * @param w
                */
                transferex : function(destno, uud, failaction, failacd, cb, w) {
                    var cmd = "/tele/agent/transferex";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destno="
                            + destno + "&uud=" + uud + "&failaction=" + failaction
                            + "&failacd=" + failacd;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 发送消息到IDE  Keygoe专用
                * @param text
                * @param cb
                * @param w
                */
                sendmessagetoide : function(text, cb, w) {
                    var cmd = "/tele/agent/sendmessagetoide";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&text="
                            + encodeURIComponent(text);

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //--- Moitor

                /**
                * 强插
                * @param destaid
                * @param mode
                * @param cb
                * @param w
                */
                interrupt : function(destaid, mode, cb, w) {
                    var cmd = "/tele/monitor/interrupt";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destaid="
                            + destaid + "&mode=" + mode;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 拦截
                * @param destaid
                * @param cb
                * @param w
                */
                intercept : function(destaid, cb, w) {
                    var cmd = "/tele/monitor/intercept";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destaid="
                            + destaid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 监听
                * @param destaid
                * @param mode
                * @param cb
                * @param w
                */
                listen : function(destaid, mode, cb, w) {
                    var cmd = "/tele/monitor/listen";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destaid="
                            + destaid + "&mode=" + mode;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 强拆
                * @param destaid
                * @param cb
                * @param w
                */
                forceonhook : function(destaid, cb, w) {
                    var cmd = "/tele/monitor/forceonhook";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destaid="
                            + destaid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 加入acd
                * @param destaid
                * @param acd
                * @param skill
                * @param cb
                * @param w
                */
                joinacd : function(destaid, acd, skill, cb, w) {
                    var cmd = "/tele/monitor/joinacd";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destaid="
                            + destaid + "&acd=" + acd + "&skill=" + skill;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 离开acd
                * @param destaid
                * @param acd
                * @param cb
                * @param w
                */
                leaveacd : function(destaid, acd, cb, w) {
                    var cmd = "/tele/monitor/leaveacd";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destaid="
                            + destaid + "&acd=" + acd;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 强制示忙
                * @param destaid
                * @param cb
                * @param w
                */
                forcebusy : function(destaid, cb, w) {
                    var cmd = "/tele/monitor/forcebusy";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destaid="
                            + destaid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 强制示闲
                * @param destaid
                * @param cb
                * @param w
                */
                forceidle : function(destaid, cb, w) {
                    var cmd = "/tele/monitor/forceidle";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&destaid="
                            + destaid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //-------------------------------------- Storage ------------------------------------

                /**
                * 新建数据表
                * @param data
                * @param flds
                * @param keyfld
                * @param indices
                * @param cb
                * @param w
                */
                datanew : function(data, flds, keyfld, indices, cb, w) {
                    var cmd = "/storage/data/new";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&data=" + data
                            + "&flds=" + flds + "&keyfld=" + keyfld + "&indices=" + indices;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 删除数据表
                * @param data
                * @param cb
                * @param w
                */
                datadelete : function(data, cb, w) {
                    var cmd = "/storage/data/delete";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&data=" + data;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 数据操作
                * @param data
                * @param realm
                * @param mode
                * @param flds
                * @param vals
                * @param where
                * @param group
                * @param order
                * @param size
                * @param idx
                * @param cb
                * @param w
                */
                dataoper : function(data, realm, mode, flds, vals, where, group, order,
                        size, idx, cb, w) {
                    var cmd = "/storage/data/oper";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&data=" + data
                            + "&realm=" + realm + "&m=" + mode + "&f="
                            + encodeURIComponent(flds) + "&v=" + encodeURIComponent(vals)
                            + "&w=" + encodeURIComponent(where) + "&g=" + group + "&o="
                            + order + "&s=" + size + "&i=" + idx;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 新建备份
                * @param appname
                * @param cb
                * @param w
                */
                backupnew : function(appname, cb, w) {
                    var cmd = "/storage/backup/new";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&appname="
                            + appname;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 还原备份
                * @param appname
                * @param backfile
                * @param cb
                * @param w
                */
                backuprestore : function(appname, backfile, cb, w) {
                    var cmd = "/storage/backup/restore";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&appname="
                            + appname + "&backfile=" + backfile;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 备份列表
                * @param appname
                * @param cb
                * @param w
                */
                backuplist : function(appname, cb, w) {
                    var cmd = "/storage/backup/list";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&appname="
                            + appname;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 删除备份
                * @param appname
                * @param backfile
                * @param cb
                * @param w
                */
                backupdelete : function(appname, backfile, cb, w) {
                    var cmd = "/storage/backup/delete";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&appname="
                            + appname + "&backfile=" + backfile;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 新建存储过程
                * @param proc
                * @param parm
                * @param code
                * @param cb
                * @param w
                */
                procnew : function(proc, parm, code, cb, w) {
                    var cmd = "/storage/proc/new";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&proc=" + proc
                            + "&parm=" + encodeURIComponent(parm) + "&code="
                            + encodeURIComponent(code);

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 删除存储过程
                * @param proc
                * @param cb
                * @param w
                */
                procdelete : function(proc, cb, w) {
                    var cmd = "/storage/proc/delete";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&proc=" + proc;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 执行存储过程
                * @param realm
                * @param proc
                * @param parms
                * @param cb
                * @param w
                */
                procexec : function(realm, proc, parms, cb, w) {
                    var cmd = "/storage/proc/exec";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&realm="
                            + realm + "&proc=" + proc + "&parms="
                            + encodeURIComponent(parms);

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 文件导入
                * @param file
                * @param data
                * @param flds
                * @param types
                * @param opt
                * @param badfile
                * @param cb
                * @param w
                */
                fileimport : function(file, data, flds, types, opt, badfile, cb, w) {
                    var cmd = "/storage/file/import";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&file=" + file
                            + "&data=" + data + "&flds=" + flds + "&types=" + types
                            + "&option=" + opt + "&badfile=" + badfile;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 文件导出
                * @param file
                * @param data
                * @param flds
                * @param where
                * @param order
                * @param limit
                * @param opt
                * @param cb
                * @param w
                */
                fileexport : function(file, data, flds, where, order, limit, opt, cb, w) {
                    var cmd = "/storage/file/export";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&file=" + file
                            + "&data=" + data + "&flds=" + encodeURIComponent(flds)
                            + "&where=" + encodeURIComponent(where) + "&order=" + order
                            + "&limit=" + limit + "&option=" + opt;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 上传文件
                *
                * @param container 上传容器
                * @param scope
                * @param object
                * @param path
                * @param exts 文件名过滤器
                * @param dest 保存到服务器的文件名，为空使用原文件名
                * @param cb
                * @param w
                */
                fileupload : function(container, scope, object, path, exts, dest, cb, w) {
                    $("#" + container).pluploadQueue({
                        // General settings
                        runtimes : 'html5,flash,silverlight,html4',
                        url : this.UMO._apihost + '/storage/file/upload',

                        height : "100%",

                        // User can upload no more then 20 files in one go (sets multiple_queues to false)
                        max_file_count : 20,

                        chunk_size : '1mb',

                        // Resize images on clientside if we can
                        resize : {
                            width : 200,
                            height : 200,
                            quality : 90,
                            crop : true
                        // crop to exact dimensions
                        },

                        filters : {
                            // Maximum file size
                            max_file_size : '1000mb',
                            // Specify what files to browse for
                            mime_types : [ {
                                title : "Image files",
                                extensions : "jpg,gif,png"
                            }, {
                                title : "Zip files",
                                extensions : "zip"
                            }, {
                                title : "Xls files",
                                extensions : "xls,xlsx"
                            } ]
                        },

                        multipart_params : {
                            dom : this.UMO._dom,
                            token : this.UMO._token,
                            scope : scope,
                            object : object,
                            path : path,
                            exts : exts,
                            dest : dest
                        },

                        // Rename files by clicking on their titles
                        rename : true,

                        // Sort files
                        sortable : true,

                        // Enable ability to drag'n'drop files onto the widget (currently only HTML5 supports that)
                        dragdrop : true,

                        // Views to activate
                        views : {
                            list : true,
                            thumbs : true, // Show thumbs
                            active : 'thumbs'
                        },

                        // Flash settings
                        flash_swf_url : 'lib/plupload/Moxie.swf',

                        // Silverlight settings
                        silverlight_xap_url : 'lib/plupload/Moxie.xap'
                    }, cb);

                    /*if (cb != null)
                    {
                        cb("/storage/file/upload", {errno:0, errmsg:""});
                    }*/
                },

                /**
                * 文件下载
                * @param scope
                * @param object
                * @param path
                * @param file
                * @param cb
                * @param w
                */
                filedownload : function(scope, object, path, file, cb, w) {
                    var cmd = "/storage/file/download";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&scope="
                            + scope + "&object=" + object + "&path=" + path + "&file="
                            + file;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 新增配置
                * @param scope
                * @param object
                * @param file
                * @param node
                * @param value
                * @param cb
                * @param w
                */
                confignew : function(scope, object, file, node, value, cb, w) {
                    var cmd = "/storage/config/new";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&scope="
                            + scope + "&object=" + object + "&file=" + file + "&node="
                            + node + "&value=" + encodeURIComponent(value);

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 添加配置
                * @param scope
                * @param object
                * @param file
                * @param node
                * @param value
                * @param cb
                * @param w
                */
                configadd : function(scope, object, file, node, value, cb, w) {
                    var cmd = "/storage/config/add";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&scope="
                            + scope + "&object=" + object + "&file=" + file + "&node="
                            + node + "&value=" + encodeURIComponent(value);

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 写入配置
                * @param scope
                * @param object
                * @param file
                * @param node
                * @param value
                * @param cb
                * @param w
                */
                configwrite : function(scope, object, file, node, value, cb, w) {
                    var cmd = "/storage/config/write";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&scope="
                            + scope + "&object=" + object + "&file=" + file + "&node="
                            + node + "&value=" + encodeURIComponent(value);

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 读取配置
                * @param scope
                * @param object
                * @param file
                * @param node
                * @param cb
                * @param w
                */
                configread : function(scope, object, file, node, cb, w) {
                    var cmd = "/storage/config/read";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&scope="
                            + scope + "&object=" + object + "&file=" + file + "&node="
                            + node;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 删除配置
                * @param scope
                * @param object
                * @param file
                * @param node
                * @param cb
                * @param w
                */
                configdelete : function(scope, object, file, node, cb, w) {
                    var cmd = "/storage/config/delete";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&scope="
                            + scope + "&object=" + object + "&file=" + file + "&node="
                            + node;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 资源列表
                * @param scope
                * @param object
                * @param path
                * @param exts
                * @param cb
                * @param w
                */
                resourcelist : function(scope, object, path, exts, cb, w) {
                    var cmd = "/storage/resource/list";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&scope="
                            + scope + "&object=" + object + "&path=" + path + "&exts="
                            + exts;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //FullTest
                //-------------------------------------- Application ------------------------------------
                /**
                * 应用下载
                * @param appname
                * @param version
                * @param cb
                * @param w
                */
                appdownload : function(appname, version, cb, w) {
                    var cmd = "/app/download";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&appname="
                            + appname + "&version=" + version;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 应用安装
                * @param appname
                * @param options
                * @param cb
                * @param w
                */
                appinstall : function(appname, options, cb, w) {
                    var cmd = "/app/install";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&appname="
                            + appname + "&options=" + options;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 安装确认
                * @param appname
                * @param action
                * @param options
                * @param cb
                * @param w
                */
                appconfirm : function(appname, action, options, cb, w) {
                    var cmd = "/app/confirm";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&appname="
                            + appname + "&action=" + action + "&options=" + options;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 应用状态
                * @param appname
                * @param cb
                * @param w
                */
                appstate : function(appname, cb, w) {
                    var cmd = "/app/state";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&appname="
                            + appname;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 应用卸载
                * @param appname
                * @param dataclean
                * @param options
                * @param cb
                * @param w
                */
                appuninstall : function(appname, dataclean, options, cb, w) {
                    var cmd = "/app/uninstall";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&appname="
                            + appname + "&dataclean=" + dataclean + "&options=" + options;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 已装应用
                * @param type
                * @param cb
                * @param w
                */
                appinstalled : function(type, cb, w) {
                    var cmd = "/app/appinstalled";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&type=" + type;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 已装组件
                * @param cb
                * @param w
                */
                widgetinstalled : function(cb, w) {
                    var cmd = "/app/widgetinstalled";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //-------------------------------------- Enterprise ------------------------------------

                /**
                * 部门列表
                * @param parentid
                * @param cb
                * @param w
                */
                entdeptlist : function(parentid, cb, w) {
                    var cmd = "/ent/deptlist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&parentid="
                            + parentid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 部门信息
                * @param deptid
                * @param cb
                * @param w
                */
                entdeptinfo : function(deptid, cb, w) {
                    var cmd = "/ent/deptinfo";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&deptid="
                            + deptid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 员工列表
                * @param deptid
                * @param cb
                * @param w
                */
                entuserlist : function(deptid, cb, w) {
                    var cmd = "/ent/userlist";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&deptid="
                            + deptid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                /**
                * 员工信息
                * @param userid
                * @param cb
                * @param w
                */
                entuserinfo : function(userid, cb, w) {
                    var cmd = "/ent/userinfo";
                    var args = "dom=" + this.UMO._dom + "&token=" + this.UMO._token + "&userid="
                            + userid;

                    if (this.UMO._tokenvalid(cmd, cb)) {
                        this.UMO._ajaxcall(cmd, args, cb, w);
                    }
                },

                //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

                //------------------------------ 以下为内部使用函数 -------------------------------------------

                //push加入
                _initpush : ()=> {
                    this.UMO._lastInitTime = new Date().getTime();
                    this.UMO.joinListen(this.UMO._evtname);
                },

                joinListen : (aSubject) =>{
                    var subject = aSubject;

                    $.ajax({
                        url : this.UMO._apihost + '/puller.srv',
                        type : "POST",
                        data : "dom=" + this.UMO._dom + "&token=" + this.UMO._token,
                        dataType : "json",
                        contentType : "application/x-www-form-urlencoded;charset=utf-8",
                        error : (xhr, ajaxOptions) =>{
                            if (this.UMO._running == true) {
                                this.UMO.onError(null);
                            }
                        },
                        success : (result) =>{
                            if (result.errno == 0) {
                                for (var i = 0; i < result.evts.length; i++) {
                                    var evt = result.evts[i];

                                    var event = new UMO.PullerEvent();
                                    console.log(event)
                                    for ( var p in evt) {
                                        event.put(p, evt[p]);
                                    }
                                    this.UMO.onData(event);
                                }
                            }

                            if ((this.UMO._running == true) && (result.errno != 100)) {
                                //如果运行中并且不是无效令牌，则继续
                                setTimeout(this.UMO.joinListen(subject), 50);
                            }
                        }
                    });
                },

                //定时请求
                _pinging : () =>{
                    this.UMO.ping((cmd, result)=> {
                        if (result.errno == 0) {
                            // this.UMO._pingTimer = setTimeout("this.UMO._pinging()", 60000); //60s间隔
                        } else {
                            if (result.error == this.UMO.ERR_AJAXERR) //网络错误
                            {
                                // this.UMO._pingTimer = setTimeout("this.UMO._pinging()", 10000); //10s重试
                            } else //应用级错误
                            {
                                if (this.UMO._evthandler.onReadyState != null) {
                                    this.UMO._evthandler.onReadyState(0);
                                }
                            }
                        }
                    });
                },

                //检测令牌
                _tokenvalid : (cmd, cb) =>{
                    if (this.UMO._token == "") {
                        if (cb != null) {
                            var result = {
                                errno : this.UMO.ERR_BADTOKEN,
                                errmsg : this.UMO.MSG_NOTLOGIN
                            };
                            cb(cmd, result);
                        }
                        return false;
                    }
                    return true;
                },

                //网络调用
                _ajaxcall : (cmd, args, cb, w)=> {
                    var params = args;
                    if (w != undefined) {
                        try {
                            var loc = w.location.href;
                            params += "&refer=" + encodeURIComponent(loc);
                        } catch (e) {
                        }
                    }
                    $.ajax({
                        url : this.UMO._apihost + cmd,
                        type : "POST",
                        data : params,
                        dataType : "json",
                        contentType : "application/x-www-form-urlencoded;charset=utf-8",
                        async : !this.UMO._syncmode,
                        error : (xhr, ajaxOptions) =>{
                            if (cb != null) {
                                var result = {
                                    errno : this.UMO.ERR_AJAXERR,
                                    errmsg : this.UMO.MSG_AJAXERR
                                };
                                cb(cmd, result);
                            }
                        },
                        success : (result)=>{
                            if (cb != null) {
                                cb(cmd, result);
                            }
                        }
                    });
                },

                _addEvent : (obj, evType, callback, useCapture) =>{
                    if (obj.addEventListener) {
                        obj.addEventListener(evType, callback, useCapture);
                        return true;
                    } else if (obj.attachEvent) {
                        return obj.attachEvent('on' + evType, callback);
                    } else {
                        obj['on' + evType] = callback;
                    }
                },

                // 拉取事件对象
                PullerEvent : ()=> {
                    // Member variable setup; the assoc array stores the N/V pairs
                    this.arr = [];

                    this.put = (name, value) =>{
                        return this.arr[name] = value;
                    };

                    this.get = (name) =>{
                        return this.arr[name];
                    };
                },

                //错误
                onError : (event)=>{
                    //alert("消息推送错误, uid=" + PLR.userId + ", 重试...")

                    var dt = new Date();
                    var diff = dt.getTime() - this.UMO._lastInitTime;
                    if (diff > 60000) //60秒以上，复位重试延迟
                    {
                        this.UMO._retrydelay = 1000;
                    }

                    //稍后重试（时间逐步延长）
                    setTimeout("this.UMO._initpush()", this.UMO._retrydelay);
                    this.UMO._retrydelay = this.UMO._retrydelay * 2;
                },

                //事件回调处理
                onData : (event)=> {
                    var evttype = event.get("evttype");
                    switch (evttype) {
                    case "readystate":
                        if (this.UMO._evthandler.onReadyState != null) {
                            var status = event.get("status");
                            this.UMO._evthandler.onReadyState(status);
                        }
                        break;

                    case "callincome":
                        if (this.UMO._evthandler.onCallincome != null) {
                            var ano = event.get("ano");
                            var bno = event.get("bno");
                            var uud = event.get("uud");
                            this.UMO._evthandler.onCallincome(ano, bno, uud, callid);
                        }
                        break;

                    case "talked":
                        if (this.UMO._evthandler.onTalked != null) {
                            var ano = event.get("ano");
                            var bno = event.get("bno");
                            var uud = event.get("uud");
                            this.UMO._evthandler.onTalked(ano, bno, uud);
                        }
                        break;

                    case "ringstop":
                        if (this.UMO._evthandler.onRingStoped != null) {
                            this.UMO._evthandler.onRingStoped();
                        }
                        break;

                    case "hookchanged":
                        if (this.UMO._evthandler.onHookChanged != null) {
                            var status = event.get("status");
                            this.UMO._evthandler.onHookChanged(status);
                        }
                        break;

                    case "agentchanged":
                        if (this.UMO._evthandler.onAgentChanged != null) {
                            var status = event.get("status");
                            this.UMO._evthandler.onAgentChanged(status);
                        }
                        break;

                    case "asyncfinished":
                        if (this.UMO._evthandler.onAsyncFinished != null) {
                            var atype = event.get("atype");
                            var taskid = event.get("taskid");
                            var ret = event.get("ret");
                            var desc = event.get("desc");
                            this.UMO._evthandler.onAsyncFinished(atype, taskid, ret, desc);
                        }
                        break;

                    case "allbusy":
                        if (this.UMO._evthandler.onAllBusy != null) {
                            var status = event.get("status");
                            var acd = event.get("acd");
                            var quelen = event.get("quelen");
                            this.UMO._evthandler.onAllBusy(status, acd, quelen);
                        }
                        break;

                    case "quelen":
                        if (this.UMO._evthandler.onQuelen != null) {
                            var acd = event.get("acd");
                            var quelen = event.get("quelen");
                            this.UMO._evthandler.onQuelen(acd, quelen);
                        }
                        break;

                    case "smsincome":
                        if (this.UMO._evthandler.onSmsincome != null) {
                            var dtime = event.get("dtime");
                            var from = event.get("from");
                            var content = event.get("content");
                            var slot = event.get("slot");
                            this.UMO._evthandler.onSmsincome(dtime, from, content, slot);
                        }
                        break;

                    case "opercallback":
                        if (this.UMO._evthandler.onOperCallback != null) {
                            var flowid = event.get("flowid");
                            var callid = event.get("callid");
                            var cdrid = event.get("cdrid");
                            var direction = event.get("direction");
                            var teleno = event.get("teleno");
                            var time = event.get("time");
                            var state = event.get("state");
                            this.UMO._evthandler.onOperCallback(flowid, callid, cdrid,
                                    direction, teleno, time, state);
                        }
                        break;

                    case "speedcallback":
                        if (this.UMO._evthandler.onSpeedCallback != null) {
                            var flowid = event.get("flowid");
                            var callid = event.get("callid");
                            var cdrid = event.get("cdrid");
                            var direction = event.get("direction");
                            var teleno = event.get("teleno");
                            var time = event.get("time");
                            var state = event.get("state");
                            var desc = event.get("desc");
                            var sessionid = event.get("sessionid");
                            this.UMO._evthandler.onSpeedCallback(flowid, callid, cdrid,
                                    direction, teleno, time, state, desc, sessionid);
                        }
                        break;

                    case "textmessage":
                        if (this.UMO._evthandler.onTextMessage != null) {
                            var fromaid = event.get("fromaid");
                            var chatmode = event.get("chatmode");
                            var text = event.get("text");
                            this.UMO._evthandler.onTextMessage(fromaid, chatmode, text);
                        }
                        break;
                    }
                },

                //错误消息常量
                ERR_AJAXERR : -1,
                ERR_BADTOKEN : -2,
                ERR_ALREADYSTART : -3,

                MSG_AJAXERR : "网络错误",
                MSG_NOTLOGIN : "无效令牌",
                MSG_ALREADYSTART : "已经启动请先停止",
                MSG_NONE : "无"
            },
        EvtHandler:{// 就绪通知
                that:this,
                onReadyState : (status) =>{
                    console.log(status)
                    if(status == 0 && this.cm_login!=2){//网络判断时系统自动判断重连
                        if(window.confirm('网络异常，是否需要重新签入？')){
                            let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
                            let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
                            let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
                            this.doOprInReq(this.order.otherphone.toString(),fenji,gonghao,duilie)
                        }
                    }
                },
                //来话通知
                onCallincome : (ano, bno, uud) =>{
                    console.log(ano, bno, uud)
                    if(uud){
                        this.callNowState='正在拨号...'
                    }
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
                onTalked : (ano, bno, uud) =>{
                    console.log(ano, bno, uud)
                    this.callin=true
                    if(uud){
                        setTimeout(this.getcdrid(ano, bno), 1000);// 录音
                    }
                },
                //振铃停止通知
                onRingStoped : () =>{
                    console.log('stop')
                },
                // 挂机通知
                onHookChanged : (status) =>{
                    //alert(status);
                    let that=this
                    console.log(status)
                    if (status == 1 || status == 3 || status == 4) {
                        this.cm_callsate = 0;
                        // this.that.a.doSetOprDropReq(this.that.a.gonghao);
                        // 坐席挂机
                        if (status == 1) {
                            // var aid = that.gonghao;// 工号
                            // var ano = '88693050';// 主叫
                            // if ("0" != $('#pStatus').val()) {
                            //     $('#pStatus').val(1);
                            //     var phoneverify_id = $('#phoneverify_id').val();// 单号
                            //     $('#phoneOut_orid').val($('#phone_orid').val());// 赋值正在播出
                            //     $('#phoneOutverify_id').val(phoneverify_id);// 赋值正在拨出
                            // }
                            // var querys = {
                            //     'wb_orid' : $('#phoneOut_orid').val(),// 当前单号
                            //     'wb_OrderId' : $('#phoneOutverify_id').val(),// 当前单号
                            //     'wb_CrPhoneUrl' : '',
                            //     'wb_CrType' : $('#pStatus').val(), // 状态
                            //     'wb_CrContent' : ano, // 主叫
                            //     'wb_CrRemark' : '',
                            //     'hcall_CdrId' : $('#cdrid').val(),
                            //     "contType" : $('#contType').val()
                            // };
                            // console.log(querys);
                            
                            that.callNowState='已挂断...'
                            if(this.callin){
                                that.calling=false
                            }else{
                                setTimeout(()=>{
                                    that.calling=false
                                    that.dialogFormVisible=true
                                },1000)
                            }
                            
                            // document.getElementById(querys.wb_OrderId).contentWindow.setCallInfo(querys);
                            // $('#pStatus').val(1);// 呼入
                        }
                    }
                    if (status == 2) {
                        var ano = that.fenji;
                        var bno = that.order.otherphone;
                        setTimeout(that.getcdrid(ano, bno), 1000);// 录音
                    }
                },
                // 话务员状态通知
                onAgentChanged : (status) =>{
                    console.log(status)
                    // if(status==4){
                    //     //正在工作
                    //     this.callNowState='等待接听...'
                    // }
                },
                // 异步操作结束通知
                onAsyncFinished : (atype, taskid, ret, desc) =>{
                    console.log(atype, taskid, ret, desc)
                    let that=this
                    if(ret==0&&atype==8){
                        this.callNowState='正在通话...'
                        var ano = this.fenji;
                        var bno = this.order.otherphone;
                        setTimeout(that.getcdrid(ano, bno), 1000);
                    }
                    if(ret==2&&atype==8){
                        this.callNowState='等待接听...'
                    }
                },
            
                onAllBusy : function(status, acd, quelen) {
                    console.log(status, acd, quelen)
                },
                // 队列长度通知
                onQuelen : function(acd, quelen) {
                    console.log(acd, quelen)
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
      }
    },
    methods: {
        deleteData(row){//删除待办
            this.$confirm('是否结束此条订单', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                let data={
                    mun:row.ID,
                }
                this.$axios({
                method: 'post',
                url: getUrl()+'delSchedule',
                data:this.$Qs.stringify(data)
                }).then(res=>{
                    console.log(res)
                    if(res.data=="success"){
                        //成功
                        this.operation=false
                        this.reload();
                        this.value=''
                        this.$notify({
                        title: '成功',
                        message: '成功!',
                        type: 'success'
                        });

                    }else{
                        this.$notify.error({
                        title: '错误',
                        message: '失败!',
                        });
                    }
                    this.reload()
                })
            })
            
        },
        searchByTel(){//通过电话查询订单
            this.$message({
            message: '正在查询请稍后...',
            type: 'success'
            });
            this.$refs.callIN.callIn(this.telPhone,true)
        },
        handleCurrentChange2(val){//查询信息翻页
            this.currentPage=val
            this.queryChepaiList(true)
        },
        queryChepaiList(show){
            if(show){//查询信息
                if(this.searchLin==''){
                    this.$message.error('请输入关键词!')
                    return
                }
                this.loading2=true
                let data={
                    keyword:this.searchLin,
                    page:this.currentPage
                }
                this.$axios({
                method: 'post',
                url: getUrl()+'queryChepaiList',
                data:this.$Qs.stringify(data)
                }).then(res=>{
                    // console.log(res)
                    this.showTable=false
                    this.loading2=false
                    this.total2=res.data.total
                    this.searchTable=res.data.rows
                })
            }else{//关闭
                this.showTable=true
                this.searchLin=''
                this.dialogSearch=false
            }
            
        },
        sort(column, prop, order){
            //排序
            if(column.prop){
                this.sortField=column.prop
            }else{
                this.sortField=''
            }
            if(column.order){
                // if(column.order=='ascending'){
                    this.sortWay=column.order
                // }else if(column.order=='descending'){
                //     this.sortWay='desc' 
                // }
            }else{
                this.sortWay='' 
            }
            this.getOrders()
            
        },
        clickTab(val,e){
            //点击标签
            //console.log(val,e)
        },
        handleChange(value){
            //console.log(value);
        },
        selsChange(selection){
            //选择订单
            this.selection=selection
        },
        doOperation(kind){
            //表格操作
            this.operation=true
            if(kind=='edit'){
                //批量调单
                this.operationKind='edit'
                this.operationTxt='批量调单'
            }else if(kind=='sort'){
                //同步订单
                this.operationKind='sort'
                this.operationTxt='同步订单'
            }else if(kind=='back'){
                //回收订单
                // this.operationKind='setting'
                // this.operationTxt='修改订单状态'
                this.operation=false
                this.$confirm('是否回收此批订单('+this.selection.length+')条', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(()=>{
                  this.updateOrderFieldNull()
                })
                
            }else if(kind=='refresh'){
                //刷新订单
                this.operationKind='refresh'
                this.operationTxt='刷新订单'
            }else if(kind=='tickets'){
                //订单记录
                this.operationKind='tickets'
                this.operationTxt='订单记录'
            }
        },
        rowClcik(row,e){
            //选择表格行
            let data={
                scheduleId:row.ID
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getSchedulesTypeOfData',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res)
                this.$refs.callIN.showOrder(res.data.id,'')
                this.$refs.callIN.showQuote(res.data.licenseNo)
                // store.dispatch('showDetail',false)
                // this.show=sessionStorage.getItem('show')
                // this.$router.push({name:'订单详情',params:{khid:res.data.clientId,licenseNo:res.data.licenseNo,ddid:res.data.id,index:e.$index,page:this.currentPage4,rows:this.size,tableData:this.tableData,sources:this.sources}})
            })
        },
        cancelOperation(){
            //取消表格操作
            this.operation=false
        },
        handleSizeChange(val){
            //每页数据条数
            this.size=val
            this.getOrders()
        },
        handleCurrentChange(val){
            //选择当前页
            this.currentPage4=val
            this.getOrders()
        },
        reset(){
          //重置 
          this.waitTime=''
        },
        timeDo(time){//时间格式
            let y=time.substring(0,4)
            let m=time.substring(4,6)
            let d=time.substring(6,8)
            let h=time.substring(8,10)
            let mm=time.substring(10,12)
            let s=time.substring(12,14)
            let newTime=y+'-'+m+'-'+d+' '+h+':'+mm+':'+s
            // let newTime=y+'-'+m+'-'+d
            return newTime.toString()
        },
        search(){
          //查询
          this.currentPage4=1
          this.loading=true
          let data={
              sort:this.sortField,
              order:this.sortWay,
              rows:this.size,
              page:this.currentPage4,
              userid:JSON.parse(window.sessionStorage.getItem('role')).userid,
              time:this.waitTime.toString()
          }
          console.log(data)
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'getSchedules',
              data:this.$Qs.stringify(data)
          }).then((res)=>{
              this.loading=false
              this.total=res.data.total
              this.tableData=res.data.rows
              this.tableData.forEach(item=>{
                  if(item.TYPE==1){
                      item.TYPE='订单'
                  }
                  if(item.INSTIME){
                      item.INSTIME=this.timeDo(item.INSTIME)
                  }
                  if(item.RESTIME){
                      item.RESTIME=this.timeDo(item.RESTIME)
                  }
              })
          })
        },
        getOrders(){
          //订单列表
          this.loading=true
          let data={
              sort:this.sortField,
              order:this.sortWay,
              rows:this.size,
              page:this.currentPage4,
              userid:JSON.parse(window.sessionStorage.getItem('role')).userid,
              time:''
          }
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'getSchedules',
              data:this.$Qs.stringify(data)
          }).then((res)=>{
              console.log(res)
              this.loading=false
              this.total=res.data.total
              this.tableData=res.data.rows
              this.tableData.forEach(item=>{
                  if(item.TYPE==1){
                      item.TYPE='订单'
                  }
                  console.log(item.INSTIME)
                  if(item.INSTIME){
                      item.INSTIME=this.timeDo(item.INSTIME)
                  }
                  if(item.RESTIME){
                      item.RESTIME=this.timeDo(item.RESTIME)
                  }
              })
          })
        },
        getDicts(ciorderstatus){
          //字典
          this.$axios({
              method: 'get',
              url: getUrl()+'getDicts',
              params:{way:0,type:ciorderstatus}
          }).then(res=>{
            for(let i  in res.data){//订单状态下拉列表
                this.asdL={}
                this.asdL.label=res.data[i]
                this.asdL.value=i
                this.orderStates.push(this.asdL)
            }
          })
        },
        schedule(scheduleType){//字典 待办类型
           this.$axios({
              method: 'get',
              url: getUrl()+'getDicts',
              params:{way:0,type:scheduleType}
          }).then(res=>{
            for(let i  in res.data){//订单状态下拉列表
                this.asdL={}
                this.asdL.label=res.data[i]
                this.asdL.value=i
                this.state.push(this.asdL)
            }
            console.log(this.state)
          }) 
        },
        update(kind){
          //弹框确认操作
          if(kind=='setting'){//修改订单状态
            this.updateOrderStatus();
          }else if(kind=='sort'){//同步订单
            this.syncOrder();
          }else if(kind=='edit'){//调单
            this.updOrder()
          }
        },
        reload(){
          //刷新订单
          this.reset()
          this.loading=true
          let data={
            sort:this.sortField,
            order:this.sortWay,
            lastsource:this.lastsource.toString(),
            rows:20,
            page:1,
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'getSchedules',
              data:this.$Qs.stringify(data)
          }).then((res)=>{
              //console.log(res)
              this.loading=false
              this.total=res.data.total
              this.tableData=res.data.rows
              this.tableData.forEach(item=>{
                  if(item.TYPE==1){
                      item.TYPE='订单'
                  }
                  if(item.INSTIME){
                      item.INSTIME=this.timeDo(item.INSTIME)
                  }
                  if(item.RESTIME){
                      item.RESTIME=this.timeDo(item.RESTIME)
                  }
              })
          })
        },
        getUser(){
          let data={
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
          this.$axios({
				  	headers:{'Content-Type':'application/x-www-form-urlencoded'},
            method: 'post',
            url: getUrl()+'getUser',
            data:this.$Qs.stringify(data)
          }).then(res=>{
            //console.log(res)
          })
        },
        getUsers(){
          //管理员获取销售员列表
          this.$axios({
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            method: 'post',
            url: getUrl()+'getUserSelect',
          }).then(res=>{
            // console.log(res)
            this.saler=res.data.filter(item=>{
              return item.userrole==30
            })
          })
        },
        login(){
          //手动签入
          let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
          let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
          let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
          this.doOprInReq(fenji,gonghao,duilie)
        },
        doOprInReq(fenji,gonghao,duilie){
            console.log(fenji,gonghao,duilie)
            let that=this
            //签入
            var acd = duilie;//队列号（技能组）号
            var eid = "0"; //$("#eid").val();////租户ID
            var bizhost = '';
            var aid = gonghao;//工号
            var adn = aid; //$("#adn").val();//话务员分机电话号码
            var apwd = "e10adc3949ba59abbe56e057f20f883e";//工号密码
            var apihost = 'http://10.254.1.155:8181/IPServer';//接口地址cti254.csgxcf.com
            this.cm_callsate = 0;
            //断开连接
            that.UMO.exit(function(cmd, result){
                //启动连接
                that.UMO.start(apihost, bizhost, that.EvtHandler, eid, "", aid, apwd, adn, function(cmd, result) {
                    //0:启动成功 -3:已启动
                    if (result.errno == 0 || result.errno == -3) {
                        // that.cm_logstart=1;
                        //登出原有座席
                        that.UMO.logout(aid, function(cmd, result){
                            //签入座席
                            that.UMO.login(aid, acd, -1, false, false, function(cmd, result) {
                                console.log(result)
                                if (result.errno == 0) {
                                    that.cm_login=1;
                                    that.$notify({
                                      title: '成功',
                                      message: '签入成功!',
                                      type: 'success'
                                    });
                                    // setPhoneButtonStatus(false, true, true, false, true, false, "状态:签入成功");
                                } else {
                                  this.$notify.error({
                                      title: '错误',
                                      message: result.errmsg
                                  });
                                    // setPhoneButtonStatus(true, true, true, true, true, false, "状态:签入失败<br>原因:"+result.errmsg);
                                }
                            }, null);//签入座席
                        }, null);//登出原有座席
                    }//启动连接判断
                },null);//启动连接
            },null);//断开连接
        },
        logout(){
          //手动签出
          let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
          this.doOprOutReq(gonghao)
        },
        doOprOutReq(gonghao){
            //签出
            var aid = gonghao;//工号
            this.UMO.logout(aid, (cmd, result)=> {
              console.log(cmd, result)
                if (result.errno == 0) {//
                    this.cm_login=2;
                    this.$notify({
                    title: '成功',
                      message: '签出成功!',
                      type: 'success'
                    });
                    this.hcall_exit();
                    // setPhoneButtonStatus(true, true, true, true, false, true, "状态:等待签入...");
                } else {
                  this.$notify.error({
                      title: '错误',
                      message: result.errmsg
                  });
                    // setPhoneButtonStatus(false, true, true, false, true, false, "状态:签出失败<br>原因:"+result.errmsg);
                }
            }, null);
        },
        hcall_exit(){
            //关闭
            this.cm_callsate = 0;
            this.cm_logstart = 0;
            this.UMO.exit(cbResult, null)
        },
    },
    created(){
        if(this.table.length==0){
            //初次进入
          let data={
                sort:this.sortField,
                order:this.sortWay,
                rows:this.size,
                lastsource:this.lastsource.toString(),
                page:this.currentPage4,
                licenseNo:this.carId,
                clientname:this.name,
                statue:this.orderState,
                schedule:this.prograss,
                username:this.salesMan,
                registerDate:this.registeredDate.toString(),
                syxdqDate:this.syxdqDate.toString(),
                jqxdqDate:this.jqxdqDate.toString(),
                sfpd:this.sfState,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
          window.sessionStorage.setItem('selectData',JSON.stringify(data))
        //   this.getOrders()
        }else{
          this.tableData=this.table
          this.total=this.totalSum
          this.currentPage4=this.rows
          let data=JSON.parse(window.sessionStorage.getItem('selectData'))
          this.carId=data.licenseNo
          this.name=data.clientname
          this.orderState=data.statue
          this.prograss=data.schedule
          this.registeredDate=data.registerDate
          this.syxdqDate=data.syxdqDate
          this.jqxdqDate=data.jqxdqDate
          this.sfState=data.sfpd
          this.sortField=data.sort
          this.sortWay=data.order
        }
    },
    mounted(){
      this.role=JSON.parse(window.sessionStorage.getItem('role')).userrole
    //   this.getUsers();
      this.getUser()
        if(JSON.parse(window.sessionStorage.getItem('role')).userrole==1){
          //管理员身份
          this.getUsers();
        }
        this.schedule('scheduleType');//联系进度下拉框
        this.getDicts('ciorderstatus');//订单状态下拉框
        this.heightTable=$('.page').offset().top-$('.table').offset().top; 
        $('.table').css('height',$('.page').offset().top-$('.table').offset().top+'px')
        if(this.table.length==0){
            //初次进入
          let data={
                sort:this.sortField,
                order:this.sortWay,
                rows:this.size,
                page:this.currentPage4,
                licenseNo:this.carId,
                clientname:this.name,
                statue:this.orderState,
                schedule:this.prograss,
                username:this.salesMan,
                registerDate:this.registeredDate.toString(),
                syxdqDate:this.syxdqDate.toString(),
                jqxdqDate:this.jqxdqDate.toString(),
                sfpd:this.sfState,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
          window.sessionStorage.setItem('selectData',JSON.stringify(data))
          this.getOrders()
        }else{
          this.tableData=this.table
          this.total=this.totalSum
          this.currentPage4=this.rows
          let data=JSON.parse(window.sessionStorage.getItem('selectData'))
          this.carId=data.licenseNo
          this.name=data.clientname
          this.orderState=data.statue
          this.prograss=data.schedule
          this.registeredDate=data.registerDate
          this.syxdqDate=data.syxdqDate
          this.jqxdqDate=data.jqxdqDate
          this.sfState=data.sfpd
          this.sortField=data.sort
          this.sortWay=data.order
        }
    }
}
</script>

<style lang="scss" scoped>
    .SalesDetail{
		position: absolute;
		// visibility: hidden;
		left: 10000000px;
		top: 0;
		width: 100vw;
	}
    .Saleslist{
        .operation{
            z-index: 999;
            background: rgba($color: #000000, $alpha: .7);
            height: 100%;
            width:100%;
            position: fixed;
            top: 0;
            left: 0;
            .operationCont{
                background: white;
                border-radius: 4px;
                width: 500px;
                left: 50%;
                top: 50%;
                position: absolute;
                transform: translate(-50%,-50%);
                table{
                    text-align: center;
                    margin: 10px auto;
                }
                h2{
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 50px;
                    text-indent: 1em;
                    color: white;
                    background: #EA9B13;
                    font-weight: 500;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                    span{
                        float: right;
                        display: inline-block;
                        margin-right: 30px;
                        cursor: pointer;
                    }
                }
                p{
                    text-align: center;
                    margin: 10px 0;
                }
            }
        }
        .listBtn{
            background: white !important;
            padding: 10px;
            margin-right: 100px;
            text-align: right;
            i{
                margin-right: 5px;
            }
            .el-input-group__append button.el-button, .el-input-group__append div.el-select .el-input__inner, .el-input-group__append div.el-select:hover .el-input__inner, .el-input-group__prepend button.el-button, .el-input-group__prepend div.el-select .el-input__inner, .el-input-group__prepend div.el-select:hover .el-input__inner{
                width: 130px !important;
            }
            .el-input-group__append button.el-button{
                font-size:14px;
                width: 100px !important;
                font-family:PingFang SC;
                background: #EA9B13 !important;
                border: 1px solid #EA9B13 !important;
                color: white !important;
            }
            .el-input-group__append button.el-button:hover{
                font-size:14px;
                font-family:PingFang SC;
                background: rgb(248, 192, 95) !important;
                border: 1px solid rgb(248, 192, 95) !important;
            }
            .el-input-group--append .el-input__inner, .el-input-group__prepend{
                width: 220px !important;
            }
            .el-input-group{
                width: 260px !important; 
            }
            .addLin .el-input-group{
                width: 100% !important; 
            }
            .addLin .el-input__inner{
                border: 1px solid rgba(234,155,19,1) !important;
            }
            .el-button--small{
                font-size:14px;
                font-family:PingFang SC;
                background: white !important;
                border: 1px solid rgba(234,155,19,1) !important;
                color: #EA9B13 !important;
            }
            .el-button--small:hover{
                font-size:14px;
                font-family:PingFang SC;
                background: #EA9B13 !important;
                border: 1px solid #EA9B13 !important;
                color: white !important;
            }
        }
        .table{
            height: 90%;
            overflow: auto;
        }
        .tagCont{
            background: #e5e5e5;
            overflow: hidden;
            width: 100vw;
            padding-left: 10px;
            .doSelect{
                background: white;
                margin: 10px 100px 10px 0px;
            }
            .rowSpan{
                span{
                    display: inline-block;
                    width: 110px !important;
                    text-align: center;
                }
            }
        }
        .rows{
            display: flex;
            span{
                // display: inline-block;
                width: 110px;
                // margin-right: 5px;
            }
        }
        .page{
            position: absolute;
            right: 0;
            z-index: 999;
            bottom: 0;
            background: white;
        }
    }
</style>





