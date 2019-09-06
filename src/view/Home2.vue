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
							<router-view :schedules='schedules' :rows='rows' :table="tableData" :totalSum='total' :roles='roles'></router-view>
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
				schedules:[],
				loading2:false,
				data:{},
				rows:0,
				load:true,
				username:'',
				userrole:'',
				roles:'',
                red:false,
				sysName:'寿险管理系统',
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
					sessionStorage.removeItem('userid');
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
				UMO.exit(function(cmd, result){
					//启动连接
					UMO.start(apihost, bizhost, that.EvtHandler, eid, "", aid, apwd, adn, function(cmd, result) {
						//0:启动成功 -3:已启动
						// console.log(result)
						if (result.errno == 0 || result.errno == -3) {
							// cm_logstart=1;
							//登出原有座席
							UMO.logout(aid, function(cmd, result){
								//签入座席
								UMO.login(aid, acd, -1, false, false, function(cmd, result) {
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
			getSchedulesDicts(){//联系进度下拉列表
				this.$axios({
					url:getUrl()+'getSchedulesDicts',
					method:'post'
				}).then(res=>{
					let arr=[]
					for(let i in res.data){
						let json={}
						json.label=i
						json.value=i
						json.children=[]
						for(let s in res.data[i]){
							let chJson={}
							chJson.label=res.data[i][s]
							chJson.value=s
							json.children.push(chJson)
						}
						arr.push(json)
					}
					this.schedules=arr
					console.log(arr)
				})
			},
			getUser(){
				//获取个人信息
				let str1=window.location.href.indexOf('userid')
				let str2=window.location.href.indexOf('.jsp')
				let str3=window.location.href.substring(0,str1)
				let str4=window.location.href.substring(str1+7,str2)
				let userid=window.sessionStorage.getItem('userid')
				this.loading2=true
				this.userid=userid
				let data={
					userid:userid
				}
				console.log(data)
				this.$axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: getUrl()+'getUser',
					data:this.$Qs.stringify(data)
				}).then(res=>{
					console.log(res)
					this.data=res
					res.data.userid=userid
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
							// this.$router.options.routes[5].hidden=true
							this.$router.options.routes[2].hidden=true
							this.$router.options.routes[3].hidden=true
							this.$router.options.routes[4].hidden=true
							});
							this.$router.push({name:'销售列表',params:{userrole:res.data.userrole,userid:res.data.userid}})
						}else if(res.data.userrole==40){//录单
							this.$router.options.routes.forEach(item => {
							this.$router.options.routes[0].hidden=true
							this.$router.options.routes[2].hidden=true
							this.$router.options.routes[3].hidden=true
							this.$router.options.routes[4].hidden=true
							// this.$router.options.routes[5].hidden=true
							});
							this.$router.push({name:'录单列表',params:{userrole:res.data.userrole,userid:res.data.userid}})
							// this.$router.push('/OrderList')
						}else if(res.data.userrole==50){//打款
							this.$router.options.routes.forEach(item => {
							this.$router.options.routes[1].hidden=true
							this.$router.options.routes[0].hidden=true
							this.$router.options.routes[3].hidden=true
							this.$router.options.routes[4].hidden=true
							// this.$router.options.routes[5].hidden=true
							// this.$router.push('/MoneyList')
							this.$router.push({name:'打款列表',params:{userrole:res.data.userrole,userid:res.data.userid}})
							});
						}else if(res.data.userrole==0){//游客
							this.$router.options.routes.forEach(item => {
							this.$router.options.routes[0].hidden=true
							this.$router.options.routes[1].hidden=true
							this.$router.options.routes[2].hidden=true
							this.$router.options.routes[3].hidden=true
							this.$router.options.routes[4].hidden=true
							// this.$router.options.routes[5].hidden=true
							});
						}else if(res.data.userrole==20){//销售组长
							this.$router.options.routes.forEach(item => {
							// this.$router.options.routes[0].hidden=true
							// this.$router.options.routes[1].hidden=true
							this.$router.options.routes[2].hidden=true
							this.$router.options.routes[3].hidden=true
							this.$router.options.routes[4].hidden=true
							// this.$router.options.routes[5].hidden=true
							});
							this.$router.push({name:'销售列表',params:{userrole:res.data.userrole,userid:res.data.userid}})
						}else{
							this.$router.push({name:'销售列表',params:{userrole:res.data.userrole,userid:res.data.userid}})
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
			this.getSchedulesDicts();
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