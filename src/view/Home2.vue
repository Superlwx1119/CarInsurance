<template>
	<div class="container" v-loading="loading2"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
		<el-col :span="24" class="header">
			<!-- 顶部公司名 -->
			<el-col :span="20" class="logo" >
				<div>
					<!-- <img src="../assets/images/gxcf.png"/> -->
					<span class="txt">{{sysName}}</span>
				</div>
			</el-col>
			<!-- <el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col> -->
			<el-col :span="4" class="userinfo">
				<!-- 右侧用户头像操作 -->
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img src="../assets/images/touxiang.png" />{{username}}({{userrole}})</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<!-- 左侧导航菜单栏 -->
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<div class="logo2">
					<img src="../assets/images/logo.png" alt="">
				</div>
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" :class="red?'el-submenu item red':'el-submenu item'">
						<template v-if="!item.leaf">
							<div class="el-submenu__title"  @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
							<!-- <i :class="item.iconCls"></i> -->
							<img v-if="$route.path==item.children[0].path||imgIndex==index+1" :src="item.imageActive">
							<img v-else :src="item.image" >
							<p :style="$route.path==item.children[0].path?'color:#EA9B13':''" :class="$route.path==item.children[0].path||imgIndex==index+1?'orange':''">{{item.name}}</p></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="(child,indexs) in item.children" :ref="indexs" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;"  :class="$route.path==child.path?'is-active':''" @click="changeActive(child.path,indexs)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<ul class="el-menu">
								<li class="el-submenu"  :class="$route.path==item.children[0].path?'is-active':''">
									<div class="el-submenu__title el-menu-item2" style="height: 56px;line-height: 56px;padding: 0 20px;"   @click="changeActive(item.children[0].path,index)">
									<!-- <i :class="item.iconCls"></i> -->
									<img v-if="$route.path==item.children[0].path||imgIndex==index+1" :src="item.imageActive">
									<img v-else :src="item.image" >
									<p :style="$route.path==item.children[0].path?'color:#EA9B13':''" :class="$route.path==item.children[0].path||imgIndex==index+1?'orange':''">{{item.name}}</p></div>
								</li>
							</ul>
						</template>
					</li>
				</ul>
			</aside>
			<!-- 内容部分 -->
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<!-- 面包屑 -->
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<!-- 路由 -->
					<el-col :span="24" class="content-wrapper" v-if="load">
						<transition name="el-fade-in" mode="out-in">
							<router-view  :rows='rows' :table="tableData" :totalSum='total' :roles='roles'></router-view>
						</transition>
					</el-col>
				</div>
			</section>
			<!-- 子组件引入,便于来电查订单 -->
			<SalesDetail ref="callIN" class="SalesDetail"/>
		</el-col>
		
	</div>
</template>

<script>
import store from '@/store'
import commod from '@/assets/js/commod.js';
import getUrl from '@/assets/js/getUrl.js';
import {UMO} from '@/assets/js/UniMediaAPI.js'
import SalesDetail from './sales/SalesDetail'
	export default {
		name:'Home2',
		components:{
			SalesDetail
		},
		data() {
			return {
				loading2:false,
				data:{},
				rows:0,
				load:true,
				username:'',
				userrole:'',
				roles:'',
                red:false,
				sysName:'公信诚丰车险管理系统',
				collapsed:true,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				tableData:[],
				userid:'',
				imgIndex:1,
				total:null,
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
						// console.log(status,this.cm_login)
						if(status == 0 && this.cm_login!=2){//网络判断时系统自动判断重连
							// if(window.confirm('网络异常，是否需要重新签入？')){
							//     let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
							//     let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
							//     let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
							//     this.doOprInReq(this.order.otherphone.toString(),fenji,gonghao,duilie)
							// }
						}
					},
					//来话通知
					onCallincome : (ano, bno, uud) =>{
						console.log(ano, bno, uud)
						if(uud){
							this.callNowState='正在拨号...'
						}else{
							// alert(ano)
							this.$refs.callIN.callIn(ano)
							this.calling=true
							if(uud.length<100||uud==''){
								this.callin=true
								// let min=0
								// let sec=0
								// this.timerCall=setInterval(()=>{
								// 	sec++
								// 	if(sec>=60){
								// 		sec=0
								// 		min++
								// 	}else if(sec<10){
								// 		sec='0'+Number(sec)
								// 	}else if(sec==0){
								// 		sec='00'
								// 	}
								// 	if(min<10){
								// 		min='0'+Number(min)
								// 	}
								// 	this.callingTime=min+' : '+sec
								// },1000)
								// this.callNowState='来电:'+ano
								// setTimeout(this.getcdrid(ano, bno), 1000);// 录音
							}
						}
						// $("#ano").val(ano);
						// $("#bno").val(bno);
						// setPhoneButtonStatus(true, false, true, true, true, true, "状态:通话中");
						//来电号码历史记录
						/*if(ano!=$("#aid").val()){
							//showHistoryCall(bno);
							//$("#callinhistory_btn").disabled = false;
						}*/
					},
					//呼出通话通知
					onTalked : (ano, bno, uud) =>{
						// console.log(ano, bno, uud.length)
						// this.callin=true
						// this.calling=true
						// if(uud.length<100){
						// 	this.callin=true
						// 	let min=0
						// 	let sec=0
						// 	this.timerCall=setInterval(()=>{
						// 		sec++
						// 		if(sec>=60){
						// 			sec=0
						// 			min++
						// 		}else if(sec<10){
						// 			sec='0'+Number(sec)
						// 		}else if(sec==0){
						// 			sec='00'
						// 		}
						// 		if(min<10){
						// 			min='0'+Number(min)
						// 		}
						// 		this.callingTime=min+' : '+sec
						// 	},1000)
						// 	this.callNowState='来电:'+ano
						// 	setTimeout(this.getcdrid(ano, bno), 1000);// 录音
						// }
					},
					//振铃停止通知
					onRingStoped : () =>{
						// console.log('stop')
						// this.stopHere()
					},
					// 挂机通知
					onHookChanged : (status) =>{
						//alert(status);
						let that=this
						// console.log(status)
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
								
								// that.callNowState='已挂断...'
								// clearInterval(that.timerCall)
								// this.callingTime='00 : 00'
								// if(this.callin){
								// 	that.calling=false
								// }else{
								// 	setTimeout(()=>{
								// 		that.calling=false
								// 		that.dialogFormVisible=true
								// 		that.prograssTitel='添加联系进度'
								// 		that.btnShow=true
								// 	},1000)
								// }
								
								// document.getElementById(querys.wb_OrderId).contentWindow.setCallInfo(querys);
								// $('#pStatus').val(1);// 呼入
							}
						}
						if (status == 2) {
							// var ano = that.fenji;
							// var bno = that.order.otherphone;
							// setTimeout(that.getcdrid(ano, bno), 1000);// 录音
						}
					},
					// 话务员状态通知
					onAgentChanged : (status) =>{
						// console.log(status)
						// if(status==4){
						//     //正在工作
						//     this.callNowState='等待接听...'
						// }
					},
					// 异步操作结束通知
					onAsyncFinished : (atype, taskid, ret, desc) =>{
						// console.log(atype, taskid, ret, desc)
						// let that=this
						// if(ret==0&&atype==8){
						// 	this.callNowState='正在通话...'
						// 	let min=0
						// 	let sec=0
						// 	this.timerCall=setInterval(()=>{
						// 		sec++
						// 		if(sec>=60){
						// 			sec=0
						// 			min++
						// 		}else if(sec<10){
						// 			sec='0'+Number(sec)
						// 		}else if(sec==0){
						// 			sec='00'
						// 		}
						// 		if(min<10){
						// 			min='0'+Number(min)
						// 		}
						// 		this.callingTime=min+' : '+sec
						// 	},1000)
						// 	this.callin=false
						// 	var ano = this.fenji;
						// 	var bno = this.order.otherphone;
						// 	setTimeout(that.getcdrid(ano, bno), 1000);
						// }
						// if(ret==2&&atype==8){
						// 	this.callNowState='等待接听...'
						// }
					},
				
					onAllBusy : function(status, acd, quelen) {
						// console.log(status, acd, quelen)
					},
					// 队列长度通知
					onQuelen : function(acd, quelen) {
						// console.log(acd, quelen)
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
		watch:{
			$route(to,from){
				//返回一级路由时
				if((to.name=='订单详情'&&from.name=='销售列表')||(to.name=='打款详情'&&from.name=='打款列表')||(to.name=='录单详情'&&from.name=='录单列表')){
					store.dispatch('showDetail',false)
					return
				}
				if((to.name=='销售列表'&&from.name=='订单详情')||(to.name=='打款列表'&&from.name=='打款详情')||(to.name=='录单列表'&&from.name=='录单详情')){
					// store.dispatch('showDetail',true)
					let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
					let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
					let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
					this.doOprInReq(fenji,gonghao,duilie)
					setTimeout(() => {
						this.fn();
						store.dispatch('showDetail',true)
					}, 50);
					return/////////////
					let data=window.sessionStorage.getItem('selectData')
					data=JSON.parse(data)
					this.$axios({
						headers:{'Content-Type':'application/x-www-form-urlencoded'},
						method: 'post',
						url: getUrl()+'getOrders',
						data:this.$Qs.stringify(data)
					}).then((res)=>{
						console.log(res)
						this.load=false
						this.$nextTick(()=>{
							this.load=true
							this.total=res.data.total
							this.tableData.forEach((item,index) => {
							// if(item.syxdqDate){
							// 	item.syxdqDate=commod(item.syxdqDate)
							// }
							// if(item.jqxdqDate){
							// 	item.jqxdqDate=commod(item.jqxdqDate)
							// }
							// if(item.policyStatusTime){
							// 	item.policyStatusTime=commod(item.policyStatusTime)
							// }
							// if(item.orderStatusTime){
							// 	item.orderStatusTime=commod(item.orderStatusTime)
							// }
							if(item.remitStatus){
								if(item.remitStatus==1){
									item.remitStatus='汇款失败'
								}else if(item.remitStatus==0){
									item.remitStatus='汇款成功'
								}
							}
							if(item.orderStatus){
								if(item.orderStatus==3){
								item.orderStatus='已报价'
								}else if(item.orderStatus==2){
								item.orderStatus='申请打款'
								}else if(item.orderStatus==1){
								item.orderStatus='申请核保'
								}else if(item.orderStatus==0){
								item.orderStatus='订单完成'
								}
							}
							if(item.schedule){
								if(item.schedule==0){
								item.schedule='已报价(重点跟进)'
								}else if(item.schedule==1){
								item.schedule='已报价(考虑中)'
								}else if(item.schedule==2){
								item.schedule='多次拒接'
								}else if(item.schedule==3){
								item.schedule='成功出单'
								}else if(item.schedule==4){
								item.schedule='无人接听'
								}else if(item.schedule==5){
								item.schedule='完全无意向'
								}else if(item.schedule==6){
								item.schedule='已购买'
								}else if(item.schedule==7){
								item.schedule='其他'
								}
							}
							if(item.policyStatus){
								if(item.policyStatus==''){
									item.policyStatus=''
								}else if(item.policyStatus==2){
									item.policyStatus='核保失败'
								}else if(item.policyStatus==1){
									item.policyStatus='核保成功'
								}else if(item.policyStatus==0){
									item.policyStatus='已交保费'
								}
							}
							this.tableData=res.data.rows
						});
						})
						this.tableData=res.data.rows
						this.rows=data.page
					})
					
				}
				
				
				
			},
			cm_login:''
		},
		methods: {
			handleselect(a, b) {
				
			},
			fn(){
				//导航栏变色
				let that=this
				$('.el-submenu').removeClass('red')
				 $('.el-menu').each(function(index){
                    if($(this).children('.is-active').length>=1){
						this.red=true
						$(this).parent().addClass('red')
						that.imgIndex=index
                    }
                })
			},
			handleopen() {
				////console.log('handleopen');
			},
			handleclose() {
				////console.log('handleclose');
			},
			//退出登录
			logout(){
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('role');
					window.location.href=getUrl()+'login.jsp?goto=4'
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
            },
            changeActive(path,index){//切换导航栏变色
				store.dispatch('showDetail',true)
				this.$router.push(path)
				setTimeout(()=>{
					this.fn()
				},50)
			},
			doOprInReq(fenji,gonghao,duilie,logout){//自动签入
				console.log(fenji,gonghao,duilie,logout)
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
						// console.log(result)
						if (result.errno == 0 || result.errno == -3) {
							// cm_logstart=1;
							//登出原有座席
							that.UMO.logout(aid, function(cmd, result){
								//签入座席
								that.UMO.login(aid, acd, -1, false, false, function(cmd, result) {
									// console.log(result)
									if (result.errno == 0) {
										that.cm_login=1;
										// that.$notify({
										//   title: '成功',
										//   message: '签入成功!',
										//   type: 'success'
										// });
										// that.doOprCallOutReq(phone,fenji,gonghao)//签入成功拨号
										// setPhoneButtonStatus(false, true, true, false, true, false, "状态:签入成功");
									} else {
										that.$notify.error({
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
			getUser(){
				//获取个人信息
				let userid=window.location.href.substring(window.location.href.indexOf('=')+1,window.location.href.indexOf('#')-4)
				//console.log(userid)
				this.loading2=true
				this.userid=userid
				let data={
					userid:this.userid
				}
				this.$axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: getUrl()+'getUser',
					data:this.$Qs.stringify(data)
				}).then(res=>{
					//console.log(res)
					this.data=res
					this.username=res.data.username
					this.userrole=res.data.rolename
					window.sessionStorage.setItem('role',JSON.stringify(res.data))
					store.dispatch('getRole',JSON.stringify(res.data))
					// console.log(this.$router.options.routes)
					//根据用户角色显示功能模块
						if(res.data.userrole==30){//销售
							let fenji=res.data.hcall_nodid//分机号
							let gonghao=res.data.hcall_jobno//工号
							let duilie=res.data.hcall_queueid//队列号
							this.doOprInReq(fenji,gonghao,duilie)//签入
							this.$router.options.routes.forEach(item => {
							this.$router.options.routes[5].hidden=true
							this.$router.options.routes[2].hidden=true
							this.$router.options.routes[3].hidden=true
							this.$router.options.routes[4].hidden=true
							});
							this.$router.push({name:'销售列表',params:{userrole:res.data.userid}})
						}else if(res.data.userrole==40){//录单
							this.$router.options.routes.forEach(item => {
							this.$router.options.routes[0].hidden=true
							this.$router.options.routes[2].hidden=true
							this.$router.options.routes[3].hidden=true
							this.$router.options.routes[4].hidden=true
							this.$router.options.routes[5].hidden=true
							});
							this.$router.push({name:'录单列表',params:{userrole:res.data.userid}})
							// this.$router.push('/OrderList')
						}else if(res.data.userrole==50){//打款
							this.$router.options.routes.forEach(item => {
							this.$router.options.routes[1].hidden=true
							this.$router.options.routes[0].hidden=true
							this.$router.options.routes[3].hidden=true
							this.$router.options.routes[4].hidden=true
							this.$router.options.routes[5].hidden=true
							// this.$router.push('/MoneyList')
							this.$router.push({name:'打款列表',params:{userrole:res.data.userid}})
							});
						}else if(res.data.userrole==0){//游客
							this.$router.options.routes.forEach(item => {
							this.$router.options.routes[0].hidden=true
							this.$router.options.routes[1].hidden=true
							this.$router.options.routes[2].hidden=true
							this.$router.options.routes[3].hidden=true
							this.$router.options.routes[4].hidden=true
							this.$router.options.routes[5].hidden=true
							});
						}else if(res.data.userrole==20){//销售组长
							this.$router.options.routes.forEach(item => {
							// this.$router.options.routes[0].hidden=true
							// this.$router.options.routes[1].hidden=true
							// this.$router.options.routes[2].hidden=true
							// this.$router.options.routes[3].hidden=true
							// this.$router.options.routes[4].hidden=true
							this.$router.options.routes[5].hidden=true
							});
						}else{
							this.$router.push({name:'销售列表',params:{userrole:res.data.userid}})
						}
						this.loading2=false
				})
				
				// let data={
				// 	userid:JSON.parse(window.sessionStorage.getItem('role')).userid
				// }
				// //console.log(data)
				// this.$axios({
				// 	headers:{'Content-Type':'application/x-www-form-urlencoded'},
				// 	method: 'post',
				// 	url: getUrl()+'getUser',
				// 	data:this.$Qs.stringify(data)
				// }).then(res=>{
				// 	//console.log(res)
				// 	this.data=res
				// 	this.username=res.data.username
				// 	this.userrole=res.data.rolename
				// 	// store.dispatch('getRole',JSON.stringify(res.data))
				// })
			}
		},
		created(){
			// //console.log(JSON.parse(window.sessionStorage.getItem('role')).userid)
			this.getUser();
		},
		mounted() {
			$('.el-submenu').eq(0).addClass('red')
			
			// //console.log(this.$router.options.routes.splice(0,6));
			
			// var user = sessionStorage.getItem('user');
            // $('.el-menu').each(function(index){
            //     if($(this).children('.is-active').length>=1){
            //         $('.el-submenu').eq(index-1).addClass('red')
            //     }
			// })
			
			// this.$router.push('/Saleslist')
			
		},
	}

</script>

<style scoped lang="scss">
	.SalesDetail{
		position: absolute;
		// visibility: hidden;
		left: 10000000px;
		top: 0;
		width: 100vw;
	}
	.el-submenu__title{
		img{
			width: 24px;
			height: 24px;
		}
	}
	.container {
		position: absolute;
		top: -60px;
		bottom: 0px;
		width: 100%;
		overflow: hidden;
		max-width: 1920px !important;
		.logo2{
			width: 40px !important;
			height: 40px;
			padding: 20px;
			z-index: 99;
			background: #001529 !important;
			img{
				width: 40px;
				height: 40px;
				display: block;
				// padding: 20px;
			}
		}
        .red{
            border-left: 3px solid #FFAB1A !important;
        }
		.orange{
			color:  #FFAB1A !important;
		}
		.header {
			width: 100%;
			position: absolute;
			z-index: 999;
			left: 0;
			margin-left: 80px;
			padding-right: 80px;
			top: 60px;
			box-shadow:0px 3px 6px rgba(2,34,60,0.15);
			height: 60px;
			line-height: 60px;
			background: white;
			color:#666;
			border-bottom: 1px solid #ccc;
            // box-shadow: 0px 2px 0px rgba(0,0,0,1) !important;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					font-size:14px;
					font-family:Alibaba PuHuiTi;
					font-weight:400;
					color:#000000;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
                
				img {
					width: 160px;
					// float: left;
					padding: 10px 0;
					margin-right: 10px;
					display: inline-block;
				}
				div{
					display: flex;
				}
				.txt {
					color:#02223C;
					font-family:Alibaba PuHuiTi;
					font-weight:bold;
					font-size: 20px;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:80px !important;
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					background: #001529 !important;
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:77px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f0f0f0;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				// overflow-y: scroll;
				padding: 60px 17px 0 17px;
				.breadcrumb-container {
					border-bottom: 1px solid #dddddd;
					background: white;
					padding: 10px;
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
						line-height: 22px;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>