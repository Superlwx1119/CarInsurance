<template>
    <div class="detail" >
        <div class="head">
            <!-- 顶部返回 -->
            <span class="back" @click="back"><i class="iconfont">&#xe625;</i>返回</span>
            <span v-if="$route.params.tableData">共<span class="red">{{$route.params.tableData.length}}</span>条数据</span>
        </div>
        <div class="detailCont">
            <!-- 左侧订单 -->
            <el-row type="flex">
                <el-col :span="3">
                    <div class="orderList" @mousemove="mousemove" @mouseout="mouseout">
                        <div ref="orders" v-for="(item,index) of $route.params.tableData" :key="index" class="order" :class="{'orderActive': index == active}" @click="selectOrder(index)">
                            <h2>{{item.licenseOwner}}</h2> 
                            <p>剩余跟进时间: <span class="red">{{item.remainingTime|remainingTime}}</span>天</p>
                            <!-- <p>交强险到期时间:<span class="red">{{item.jqxdqDate==''?'---':item.jqxdqDate|time}}</span></p> -->
                            <!-- <p>商业险到期时间:<span class="red">{{item.syxdqDate==''?'---':item.syxdqDate|time}}</span></p> -->
                        </div>
                    </div>
                </el-col>
                <!-- 右侧订单详情 -->
                <el-col :span="21">
                    <SalesDetailRigth ref="callIN" @callIn='callIn' v-loading="loading" @nextPage='nextPage' :getdata='getdata' :textarea='textarea' v-if="detail"      @reloadTwo='getInfoCarins' @reload='getClientInfoCarins3' :id="$route.params.khid" :orderId="first?$route.params.ddid:orderId" :rebate='rebate' :khid='khid' :order="order" :data="data" :clientCarins='clientCarins' :phoneCus='phoneCus'/>
                    <el-dialog title="查看订单" class="coming" :visible.sync="dialog">
                        <Dialog @callIn='callIn'  v-loading="loading" @nextPage='nextPage' :getdata='getdata' :textarea='textarea2'     @reloadTwo='getInfoCarins' @reload='getClientInfoCarins3' :id="$route.params.khid" :orderId="orderId2" :rebate='rebate2' :khid='khid2' :order="order2" :data="data2" :clientCarins='clientCarins2' :phoneCus='phoneCus'/>
                    </el-dialog>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import getUrl from '@/assets/js/getUrl.js';
import SalesDetailRigth from './SalesDetailRigth'
import Dialog from './Dialog'
import commod from '@/assets/js/commod.js';
export default {
    name:'SalesDetail',
    components:{
        SalesDetailRigth,Dialog
    },
    filters:{
        time(val){//左侧订单时间格式
            if(val){
                if(val.length>5){
                    val=val.substring(0,10)
                }
            }
            return val
        },
        remainingTime(val){
            if(val==''){
                return '--'
            }else{
                return val
            }
            
        }
    },
    data(){
        return{
            fromName:null,
            textarea2:'',
            khid2:'',
            data2:'',
            orderId2:'',
            clientCarins2:{},
            order2:'',
            rebate2:'',
            name:'',
            active:0,
            dialog:false,
            detail:true,
            loading:false,
            order:{},
            radio:'1',
            rebate:{},
            licenseNo:this.$route.params.licenseNo,
            getdata:{},
            textarea:'',
            first:false,
            activeName2:'second',
            data:{},
            oderlist:[],
            clientCarins:{},
            orderId:'',
            phoneCus:'',
            khid:''
        }
    },
    methods:{
        nextPage(){
            //查询下一页
            
        },
        callIn(tel,wait){//通过电话查询订单
            let data={
                phone:tel,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getOrders',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                console.log(res)
                if(res.data.rows.length==0){
                    this.$alert('此号码无订单', '提示', {
                    confirmButtonText: '确定',
                    });
                }else{
                    this.getClientInfoCarinsThree(res.data.rows[0].clientId,res.data.rows[0].id)
                    // this.getQuoteRecordByOrderidThree(res.data.rows[0].id)
                    // this.getQuoteByClientIdThree(res.data.rows[0].licenseNo)
                    if(wait){
                        this.dialog=true
                    }else{
                        setTimeout(()=>{this.dialog=true},2000)
                    }
                    
                    
                }
            })
            
        },
        showQuote(licenseNo){//跟进进度页面查看进度
            this.loading=true
            let data={
                licenseNo:licenseNo,
                lastyeartype:0
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getLastTimeQuote',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res)
                this.loading=false
                if(res){//报价内容
                    res.data.forceTotal=Number(res.data.forceTotal).toFixed(2)
                    res.data.bizTotal=Number(res.data.bizTotal).toFixed(2)
                    res.data.taxTotal=Number(res.data.taxTotal).toFixed(2)
                    res.data.zongjine=Number(res.data.zongjine).toFixed(2)
                    res.data.bjmpzonge=Number(res.data.bjmpzonge).toFixed(2)
                    this.getdata=res.data
                    let jqx=''
                    if(res.data.forceTotal!=0){
                        jqx='交强险:'+Number(res.data.forceTotal).toFixed(2)+'元,'
                    }
                    let chechuan=''
                    if(res.data.taxTotal!=0){
                        chechuan='车船税'+Number(res.data.taxTotal).toFixed(2)+'元,'
                    }
                    let syx=''
                    if(res.data.bizTotal!=0){
                        syx='商业险'+Number(res.data.bizTotal).toFixed(2)+'元,'
                    } 
                    let chesun=''
                    if(res.data.cheSunBaoFei!=0){
                        chesun='车损'+res.data.cheSunBaoFei+'元,'
                    } 
                    let sanzhe=''
                    if(res.data.sanZheBaoFei!=0){
                        sanzhe='三者'+res.data.sanZheBaoFei+'元,保额'+res.data.sanZheBaoE+'元,'
                    } 
                    let daoqiang=''
                    if(res.data.daoQiangBaoFei!=0){
                        daoqiang='盗抢险'+res.data.daoQiangBaoFei+'元.'
                    }
                    let siji=''
                    if(res.data.siJiBaoFei!=0){
                        siji='司机座位险'+res.data.siJiBaoFei+'元,保额'+res.data.siJiBaoE+'元,'
                    }
                    let chengke=''
                    if(res.data.chengKeBaoFei!=0){
                        chengke='乘客座位险'+res.data.chengKeBaoFei+'元,保额'+res.data.chengKeBaoE+'元'
                    }
                    let huahen=''
                    if(res.data.huaHenBaoFei!=0){
                        huahen='划痕'+res.data.huaHenBaoFei+'元,保额'+res.data.huaHenBaoE+'元.'
                    }
                    let boli=''
                    if(res.data.boLiBaoFei!=0){
                        boli='玻璃'+res.data.boLiBaoFei+'元,'
                    }
                    let ziran=''
                    if(res.data.ziRanBaoFei!=0){
                        ziran='自燃'+res.data.ziRanBaoFei+'元,'
                    }
                    let sheshui=''
                    if(res.data.sheShuiBaoFei!=0){
                        sheshui='涉水险'+res.data.sheShuiBaoFei+'元,'
                    }
                    let sanfang=''
                    if(res.data.hcSanFangTeYueBaoFei!=0){
                        sanfang='车损无法找到第三方险'+res.data.hcSanFangTeYueBaoFei+'元,'
                    }
                    let zhiding=''
                    if(res.data.hcXiuLiChangBaoFei!=0){
                        zhiding='指定修理厂险'+res.data.hcXiuLiChangBaoFei+'元,'
                    }
                    let buchang=''
                    if(res.data.fybcDaysBaoFei!=0){
                        buchang='修理期间费用补偿险'+res.data.fybcBaoE+'元/'+res.data.fybcDaysBaoFei+'天'
                    }
                    let bujiMian=''
                    if(res.data.bjmpzonge!=0){
                        bujiMian='不计免赔总额'+Number(res.data.bjmpzonge).toFixed(2)+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃).'
                    }
                    let sum='总计'+Number(res.data.zongjine).toFixed(2)+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                    this.textarea2='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+syx+chesun+sanzhe+daoqiang+siji+chengke+huahen+boli+ziran+sheshui+sanfang+zhiding+buchang+bujiMian+sum
                    // this.textarea='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+',商业险:'+res.data.syx+'元,其中车损'+res.data.cheSun+'元,三者'+res.data.sanZhe+'元,保额'+res.data.dszzrxbe+'元。盗抢险'+res.data.daoQiang+'元.司机座位险'+res.data.siJi+'元,保额'+res.data.sjzwxbe+'元。乘客座位险'+res.data.chengKe+'元,保额'+res.data.ckzwxbe+'元.划痕'+res.data.huaHen+'元,保额'+res.data.hhxbe+'元。玻璃'+res.data.boLi+'元。自然'+res.data.ziRan+'元。涉水险'+res.data.sheShui+'元。车损无法找到第三方险'+res.data.hcSanFangTeYue+'元。指定修理厂险'+res.data.hcXiuLiChang+'元。修理期间费用补偿险'+res.data.fybc+'元。不计免赔总额'+res.data.bjmpsum+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃)。 总计'+res.data.sum+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                }
                
            })
        },
        showOrder(ddid,khid){//跟进进度页面查看订单
            this.loading=true
            let data={
                // clientId:khid,
                orderId:ddid,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                // console.log(res)
                this.loading=false
                if(res.data){
                    this.detail = false
                    this.$nextTick(() => (this.detail = true))
                    // this.khid2=khid
                    this.data2=res.data.clientInfo
                    this.orderId2=ddid
                    this.clientCarins2=res.data.clientCarins
                    if(this.clientCarins2.source==1){
                        this.clientCarins2.source='太平洋保险'
                    }else if(this.clientCarins2.source==2){
                        this.clientCarins2.source='中国平安'
                    }else if(this.clientCarins2.source==4){
                        this.clientCarins2.source='中国人保'
                    }else if(this.clientCarins2.source==8){
                        this.clientCarins2.source='中国人寿'
                    }
                    this.order2=res.data.order
                    this.rebate2=res.data.rebate
                    this.dialog=true
                    // this.getLastTimeQuote()
                }
            })
        },
        back(){//返回一级路由
            if(window.sessionStorage.getItem('fromName')=='我的待办'){
                this.$router.push('/NotDo')
            }else{
                this.$router.push('/Saleslist')
            }
            store.dispatch('showDetail',true)
        },
        handleClick(tab, event) {
            //切换tab
            // //console.log(tab, event);
        },
        mousemove(){
            $('.orderList').css('overflow-y','scroll')
        },
        mouseout(){
            $('.orderList').css('overflow-y','hidden')
        },
        selectOrder(index){
            //选择订单  
            this.active = index;
            this.licenseNo=this.$route.params.tableData[index].licenseNo
            this.first=false
            let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
            let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
            let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
            this.$refs.callIN.doOprInReq2(fenji,gonghao,duilie)
            this.getClientInfoCarins2(this.$route.params.tableData[index].clientId,this.$route.params.tableData[index].id)
            // this.getQuoteRecordByOrderid2(this.$route.params.tableData[index].id)
            // this.getQuoteByClientId2(this.$route.params.tableData[index].licenseNo)
            // this.phoneCus=this.$route.params.tableData[index].phone.substring(0,3)+'****'+this.$route.params.tableData[index].phone.substring(7,this.$route.params.tableData[index].phone.length)
            
        },
        getInfoCarins(data){
            // this.getQuoteByLicenseNo(data)
            // this.getClientInfoCarins3(data)
            this.selectOrder(this.active)
        },
        getQuoteByClientId2(licenseNo){
            //获取报价内容
            this.loading=true
            let data={
                licenseNo:licenseNo,
                lastyeartype:0
            }
            //console.log(data)
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getLastTimeQuote',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                this.loading=false
                // console.log(res)
                if(res){
                    res.data.forceTotal=Number(res.data.forceTotal).toFixed(2)
                    res.data.bizTotal=Number(res.data.bizTotal).toFixed(2)
                    res.data.taxTotal=Number(res.data.taxTotal).toFixed(2)
                    res.data.zongjine=Number(res.data.zongjine).toFixed(2)
                    res.data.bjmpzonge=Number(res.data.bjmpzonge).toFixed(2)
                    this.getdata=res.data
                    let jqx=''
                    if(res.data.forceTotal!=0){
                        jqx='交强险:'+Number(res.data.forceTotal).toFixed(2)+'元,'
                    }
                    let chechuan=''
                    if(res.data.taxTotal!=0){
                        chechuan='车船税'+Number(res.data.taxTotal).toFixed(2)+'元,'
                    }
                    let syx=''
                    if(res.data.bizTotal!=0){
                        syx='商业险'+Number(res.data.bizTotal).toFixed(2)+'元,'
                    } 
                    let chesun=''
                    if(res.data.cheSunBaoFei!=0){
                        chesun='车损'+res.data.cheSunBaoFei+'元,'
                    } 
                    let sanzhe=''
                    if(res.data.sanZheBaoFei!=0){
                        sanzhe='三者'+res.data.sanZheBaoFei+'元,保额'+res.data.sanZheBaoE+'元,'
                    } 
                    let daoqiang=''
                    if(res.data.daoQiangBaoFei!=0){
                        daoqiang='盗抢险'+res.data.daoQiangBaoFei+'元.'
                    }
                    let siji=''
                    if(res.data.siJiBaoFei!=0){
                        siji='司机座位险'+res.data.siJiBaoFei+'元,保额'+res.data.siJiBaoE+'元,'
                    }
                    let chengke=''
                    if(res.data.chengKeBaoFei!=0){
                        chengke='乘客座位险'+res.data.chengKeBaoFei+'元,保额'+res.data.chengKeBaoE+'元'
                    }
                    let huahen=''
                    if(res.data.huaHenBaoFei!=0){
                        huahen='划痕'+res.data.huaHenBaoFei+'元,保额'+res.data.huaHenBaoE+'元.'
                    }
                    let boli=''
                    if(res.data.boLiBaoFei!=0){
                        boli='玻璃'+res.data.boLiBaoFei+'元,'
                    }
                    let ziran=''
                    if(res.data.ziRanBaoFei!=0){
                        ziran='自燃'+res.data.ziRanBaoFei+'元,'
                    }
                    let sheshui=''
                    if(res.data.sheShuiBaoFei!=0){
                        sheshui='涉水险'+res.data.sheShuiBaoFei+'元,'
                    }
                    let sanfang=''
                    if(res.data.hcSanFangTeYueBaoFei!=0){
                        sanfang='车损无法找到第三方险'+res.data.hcSanFangTeYueBaoFei+'元,'
                    }
                    let zhiding=''
                    if(res.data.hcXiuLiChangBaoFei!=0){
                        zhiding='指定修理厂险'+res.data.hcXiuLiChangBaoFei+'元,'
                    }
                    let buchang=''
                    if(res.data.fybcDaysBaoFei!=0){
                        buchang='修理期间费用补偿险'+res.data.fybcBaoE+'元/'+res.data.fybcDaysBaoFei+'天'
                    }
                    let bujiMian=''
                    if(res.data.bjmpzonge!=0){
                        bujiMian='不计免赔总额'+Number(res.data.bjmpzonge).toFixed(2)+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃).'
                    }
                    let sum='总计'+Number(res.data.zongjine).toFixed(2)+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                    this.textarea2='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+syx+chesun+sanzhe+daoqiang+siji+chengke+huahen+boli+ziran+sheshui+sanfang+zhiding+buchang+bujiMian+sum
                    // this.textarea='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+',商业险:'+res.data.syx+'元,其中车损'+res.data.cheSun+'元,三者'+res.data.sanZhe+'元,保额'+res.data.dszzrxbe+'元。盗抢险'+res.data.daoQiang+'元.司机座位险'+res.data.siJi+'元,保额'+res.data.sjzwxbe+'元。乘客座位险'+res.data.chengKe+'元,保额'+res.data.ckzwxbe+'元.划痕'+res.data.huaHen+'元,保额'+res.data.hhxbe+'元。玻璃'+res.data.boLi+'元。自然'+res.data.ziRan+'元。涉水险'+res.data.sheShui+'元。车损无法找到第三方险'+res.data.hcSanFangTeYue+'元。指定修理厂险'+res.data.hcXiuLiChang+'元。修理期间费用补偿险'+res.data.fybc+'元。不计免赔总额'+res.data.bjmpsum+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃)。 总计'+res.data.sum+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                }
            })
        },
        getQuoteByClientIdThree(){
            //获取报价内容
            this.loading=true
            let data={
                licenseNo:this.$route.params.licenseNo,
                lastyeartype:0
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getLastTimeQuote',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res)
                this.loading=false
                if(res){
                    res.data.forceTotal=Number(res.data.forceTotal).toFixed(2)
                    res.data.bizTotal=Number(res.data.bizTotal).toFixed(2)
                    res.data.taxTotal=Number(res.data.taxTotal).toFixed(2)
                    res.data.zongjine=Number(res.data.forceTotal).toFixed(2)
                    res.data.bjmpzonge=Number(res.data.bjmpzonge).toFixed(2)
                    this.getdata=res.data
                    let jqx=''
                    if(res.data.forceTotal!=0){
                        jqx='交强险:'+Number(res.data.forceTotal).toFixed(2)+'元,'
                    }
                    let chechuan=''
                    if(res.data.taxTotal!=0){
                        chechuan='车船税'+Number(res.data.taxTotal).toFixed(2)+'元,'
                    }
                    let syx=''
                    if(res.data.bizTotal!=0){
                        syx='商业险'+Number(res.data.bizTotal).toFixed(2)+'元,'
                    } 
                    let chesun=''
                    if(res.data.cheSunBaoFei!=0){
                        chesun='车损'+res.data.cheSunBaoFei+'元,'
                    } 
                    let sanzhe=''
                    if(res.data.sanZheBaoFei!=0){
                        sanzhe='三者'+res.data.sanZheBaoFei+'元,保额'+res.data.sanZheBaoE+'元,'
                    } 
                    let daoqiang=''
                    if(res.data.daoQiangBaoFei!=0){
                        daoqiang='盗抢险'+res.data.daoQiangBaoFei+'元.'
                    }
                    let siji=''
                    if(res.data.siJiBaoFei!=0){
                        siji='司机座位险'+res.data.siJiBaoFei+'元,保额'+res.data.siJiBaoE+'元,'
                    }
                    let chengke=''
                    if(res.data.chengKeBaoFei!=0){
                        chengke='乘客座位险'+res.data.chengKeBaoFei+'元,保额'+res.data.chengKeBaoE+'元'
                    }
                    let huahen=''
                    if(res.data.huaHenBaoFei!=0){
                        huahen='划痕'+res.data.huaHenBaoFei+'元,保额'+res.data.huaHenBaoE+'元.'
                    }
                    let boli=''
                    if(res.data.boLiBaoFei!=0){
                        boli='玻璃'+res.data.boLiBaoFei+'元,'
                    }
                    let ziran=''
                    if(res.data.ziRanBaoFei!=0){
                        ziran='自燃'+res.data.ziRanBaoFei+'元,'
                    }
                    let sheshui=''
                    if(res.data.sheShuiBaoFei!=0){
                        sheshui='涉水险'+res.data.sheShuiBaoFei+'元,'
                    }
                    let sanfang=''
                    if(res.data.hcSanFangTeYueBaoFei!=0){
                        sanfang='车损无法找到第三方险'+res.data.hcSanFangTeYueBaoFei+'元,'
                    }
                    let zhiding=''
                    if(res.data.hcXiuLiChangBaoFei!=0){
                        zhiding='指定修理厂险'+res.data.hcXiuLiChangBaoFei+'元,'
                    }
                    let buchang=''
                    if(res.data.fybcDaysBaoFei!=0){
                        buchang='修理期间费用补偿险'+res.data.fybcBaoE+'元/'+res.data.fybcDaysBaoFei+'天'
                    }
                    let bujiMian=''
                    if(res.data.bjmpzonge!=0){
                        bujiMian='不计免赔总额'+Number(res.data.bjmpzonge).toFixed(2)+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃).'
                    }
                    let sum='总计'+Number(res.data.zongjine).toFixed(2)+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                    this.textarea2='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+syx+chesun+sanzhe+daoqiang+siji+chengke+huahen+boli+ziran+sheshui+sanfang+zhiding+buchang+bujiMian+sum
                    // this.textarea='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+',商业险:'+res.data.syx+'元,其中车损'+res.data.cheSun+'元,三者'+res.data.sanZhe+'元,保额'+res.data.dszzrxbe+'元。盗抢险'+res.data.daoQiang+'元.司机座位险'+res.data.siJi+'元,保额'+res.data.sjzwxbe+'元。乘客座位险'+res.data.chengKe+'元,保额'+res.data.ckzwxbe+'元.划痕'+res.data.huaHen+'元,保额'+res.data.hhxbe+'元。玻璃'+res.data.boLi+'元。自然'+res.data.ziRan+'元。涉水险'+res.data.sheShui+'元。车损无法找到第三方险'+res.data.hcSanFangTeYue+'元。指定修理厂险'+res.data.hcXiuLiChang+'元。修理期间费用补偿险'+res.data.fybc+'元。不计免赔总额'+res.data.bjmpsum+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃)。 总计'+res.data.sum+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                }
                
            })
        },
        Three(){
            //获取报价内容
            this.loading=true
            let data={
                licenseNo:this.$route.params.licenseNo,
                lastyeartype:0
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getLastTimeQuote',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res)
                this.loading=false
                if(res){
                    res.data.forceTotal=Number(res.data.forceTotal).toFixed(2)
                    res.data.bizTotal=Number(res.data.bizTotal).toFixed(2)
                    res.data.taxTotal=Number(res.data.taxTotal).toFixed(2)
                    res.data.zongjine=Number(res.data.zongjine).toFixed(2)
                    res.data.bjmpzonge=Number(res.data.bjmpzonge).toFixed(2)
                    this.getdata=res.data
                    let jqx=''
                    if(res.data.forceTotal!=0){
                        jqx='交强险:'+Number(res.data.forceTotal).toFixed(2)+'元,'
                    }
                    let chechuan=''
                    if(res.data.taxTotal!=0){
                        chechuan='车船税'+Number(res.data.taxTotal).toFixed(2)+'元,'
                    }
                    let syx=''
                    if(res.data.bizTotal!=0){
                        syx='商业险'+Number(res.data.bizTotal).toFixed(2)+'元,'
                    } 
                    let chesun=''
                    if(res.data.cheSunBaoFei!=0){
                        chesun='车损'+res.data.cheSunBaoFei+'元,'
                    } 
                    let sanzhe=''
                    if(res.data.sanZheBaoFei!=0){
                        sanzhe='三者'+res.data.sanZheBaoFei+'元,保额'+res.data.sanZheBaoE+'元,'
                    } 
                    let daoqiang=''
                    if(res.data.daoQiangBaoFei!=0){
                        daoqiang='盗抢险'+res.data.daoQiangBaoFei+'元.'
                    }
                    let siji=''
                    if(res.data.siJiBaoFei!=0){
                        siji='司机座位险'+res.data.siJiBaoFei+'元,保额'+res.data.siJiBaoE+'元,'
                    }
                    let chengke=''
                    if(res.data.chengKeBaoFei!=0){
                        chengke='乘客座位险'+res.data.chengKeBaoFei+'元,保额'+res.data.chengKeBaoE+'元'
                    }
                    let huahen=''
                    if(res.data.huaHenBaoFei!=0){
                        huahen='划痕'+res.data.huaHenBaoFei+'元,保额'+res.data.huaHenBaoE+'元.'
                    }
                    let boli=''
                    if(res.data.boLiBaoFei!=0){
                        boli='玻璃'+res.data.boLiBaoFei+'元,'
                    }
                    let ziran=''
                    if(res.data.ziRanBaoFei!=0){
                        ziran='自燃'+res.data.ziRanBaoFei+'元,'
                    }
                    let sheshui=''
                    if(res.data.sheShuiBaoFei!=0){
                        sheshui='涉水险'+res.data.sheShuiBaoFei+'元,'
                    }
                    let sanfang=''
                    if(res.data.hcSanFangTeYueBaoFei!=0){
                        sanfang='车损无法找到第三方险'+res.data.hcSanFangTeYueBaoFei+'元,'
                    }
                    let zhiding=''
                    if(res.data.hcXiuLiChangBaoFei!=0){
                        zhiding='指定修理厂险'+res.data.hcXiuLiChangBaoFei+'元,'
                    }
                    let buchang=''
                    if(res.data.fybcDaysBaoFei!=0){
                        buchang='修理期间费用补偿险'+res.data.fybcBaoE+'元/'+res.data.fybcDaysBaoFei+'天'
                    }
                    let bujiMian=''
                    if(res.data.bjmpzonge!=0){
                        bujiMian='不计免赔总额'+Number(res.data.bjmpzonge).toFixed(2)+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃).'
                    }
                    let sum='总计'+Number(res.data.zongjine).toFixed(2)+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                    this.textarea2='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+syx+chesun+sanzhe+daoqiang+siji+chengke+huahen+boli+ziran+sheshui+sanfang+zhiding+buchang+bujiMian+sum
                    // this.textarea='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+',商业险:'+res.data.syx+'元,其中车损'+res.data.cheSun+'元,三者'+res.data.sanZhe+'元,保额'+res.data.dszzrxbe+'元。盗抢险'+res.data.daoQiang+'元.司机座位险'+res.data.siJi+'元,保额'+res.data.sjzwxbe+'元。乘客座位险'+res.data.chengKe+'元,保额'+res.data.ckzwxbe+'元.划痕'+res.data.huaHen+'元,保额'+res.data.hhxbe+'元。玻璃'+res.data.boLi+'元。自然'+res.data.ziRan+'元。涉水险'+res.data.sheShui+'元。车损无法找到第三方险'+res.data.hcSanFangTeYue+'元。指定修理厂险'+res.data.hcXiuLiChang+'元。修理期间费用补偿险'+res.data.fybc+'元。不计免赔总额'+res.data.bjmpsum+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃)。 总计'+res.data.sum+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                }
                
            })
        },
        getQuoteByLicenseNo(somedata){
            this.loading=true
            let data={
                licenseNo:somedata.licenseNo,
                lastyeartype:0
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getLastTimeQuote',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res.data)
                this.loading=false
                if(res.data){
                    res.data.forceTotal=Number(res.data.forceTotal).toFixed(2)
                    res.data.bizTotal=Number(res.data.bizTotal).toFixed(2)
                    res.data.taxTotal=Number(res.data.taxTotal).toFixed(2)
                    res.data.zongjine=Number(res.data.zongjine).toFixed(2)
                    res.data.bjmpzonge=Number(res.data.bjmpzonge).toFixed(2)
                    this.getdata=res.data
                    let jqx=''
                    if(res.data.forceTotal!=0){
                        jqx='交强险:'+res.data.forceTotal+'元,'
                    }
                    let chechuan=''
                    if(res.data.taxTotal!=0){
                        chechuan='车船税'+res.data.taxTotal+'元,'
                    }
                    let syx=''
                    if(res.data.bizTotal!=0){
                        syx='商业险'+res.data.bizTotal+'元,'
                    } 
                    let chesun=''
                    if(res.data.cheSunBaoFei!=0){
                        chesun='车损'+res.data.cheSunBaoFei+'元,'
                    } 
                    let sanzhe=''
                    if(res.data.sanZheBaoFei!=0){
                        sanzhe='三者'+res.data.sanZheBaoFei+'元,保额'+res.data.sanZheBaoE+'元,'
                    } 
                    let daoqiang=''
                    if(res.data.daoQiangBaoFei!=0){
                        daoqiang='盗抢险'+res.data.daoQiangBaoFei+'元.'
                    }
                    let siji=''
                    if(res.data.siJiBaoFei!=0){
                        siji='司机座位险'+res.data.siJiBaoFei+'元,保额'+res.data.siJiBaoE+'元,'
                    }
                    let chengke=''
                    if(res.data.chengKeBaoFei!=0){
                        chengke='乘客座位险'+res.data.chengKeBaoFei+'元,保额'+res.data.chengKeBaoE+'元'
                    }
                    let huahen=''
                    if(res.data.huaHenBaoFei!=0){
                        huahen='划痕'+res.data.huaHenBaoFei+'元,保额'+res.data.huaHenBaoE+'元.'
                    }
                    let boli=''
                    if(res.data.boLiBaoFei!=0){
                        boli='玻璃'+res.data.boLiBaoFei+'元,'
                    }
                    let ziran=''
                    if(res.data.ziRanBaoFei!=0){
                        ziran='自燃'+res.data.ziRanBaoFei+'元,'
                    }
                    let sheshui=''
                    if(res.data.sheShuiBaoFei!=0){
                        sheshui='涉水险'+res.data.sheShuiBaoFei+'元,'
                    }
                    let sanfang=''
                    if(res.data.hcSanFangTeYueBaoFei!=0){
                        sanfang='车损无法找到第三方险'+res.data.hcSanFangTeYueBaoFei+'元,'
                    }
                    let zhiding=''
                    if(res.data.hcXiuLiChangBaoFei!=0){
                        zhiding='指定修理厂险'+res.data.hcXiuLiChangBaoFei+'元,'
                    }
                    let buchang=''
                    if(res.data.fybcDaysBaoFei!=0){
                        buchang='修理期间费用补偿险'+res.data.fybcBaoE+'元/'+res.data.fybcDaysBaoFei+'天'
                    }
                    let bujiMian=''
                    if(res.data.bjmpzonge!=0){
                        bujiMian='不计免赔总额'+res.data.bjmpzonge+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃).'
                    }
                    let sum='总计'+res.data.zongjine+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                    this.textarea='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+syx+chesun+sanzhe+daoqiang+siji+chengke+huahen+boli+ziran+sheshui+sanfang+zhiding+buchang+bujiMian+sum
                    // this.textarea='尊敬的'+this.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+',商业险:'+res.data.syx+'元,其中车损'+res.data.cheSun+'元,三者'+res.data.sanZhe+'元,保额'+res.data.dszzrxbe+'元。盗抢险'+res.data.daoQiang+'元.司机座位险'+res.data.siJi+'元,保额'+res.data.sjzwxbe+'元。乘客座位险'+res.data.chengKe+'元,保额'+res.data.ckzwxbe+'元.划痕'+res.data.huaHen+'元,保额'+res.data.hhxbe+'元。玻璃'+res.data.boLi+'元。自然'+res.data.ziRan+'元。涉水险'+res.data.sheShui+'元。车损无法找到第三方险'+res.data.hcSanFangTeYue+'元。指定修理厂险'+res.data.hcXiuLiChang+'元。修理期间费用补偿险'+res.data.fybc+'元。不计免赔总额'+res.data.bjmpsum+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃)。 总计'+res.data.sum+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
                }
                this.detail = false
                this.$nextTick(() => (this.detail = true))
            })
        },
        getClientInfoCarins3(somedata){
            //本页刷新订单详情
            this.loading=true
            let data={
                // clientId:somedata.clientId,
                orderId:somedata.id,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                // console.log(res)
                this.loading=false
                this.detail = false
                this.$nextTick(() => (this.detail = true))
                if(res.data){
                    this.khid=somedata.clientId
                    this.data=res.data.clientInfo
                    this.orderId=somedata.id
                    this.clientCarins=res.data.clientCarins
                    if(this.clientCarins.source==1){
                        this.clientCarins.source='太平洋保险'
                    }else if(this.clientCarins.source==2){
                        this.clientCarins.source='中国平安'
                    }else if(this.clientCarins.source==4){
                        this.clientCarins.source='中国人保'
                    }else if(this.clientCarins.source==8){
                        this.clientCarins.source='中国人寿'
                    }
                    this.order=res.data.order
                    this.rebate=res.data.rebate
                    // this.getLastTimeQuote()
                }
                
            })
        },
        getClientInfoCarinsThree(khid,ddid){
            //来电重新查询订单详情
            this.loading=true
            let data={
                // clientId:khid,
                orderId:ddid,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            console.log(data)
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                // console.log(res)
                this.loading=false
                if(res.data){
                    this.detail = false
                    this.$nextTick(() => (this.detail = true))
                    this.khid2=khid
                    this.data2=res.data.clientInfo
                    this.orderId2=ddid
                    this.clientCarins2=res.data.clientCarins
                    if(this.clientCarins2.source==1){
                        this.clientCarins2.source='太平洋保险'
                    }else if(this.clientCarins2.source==2){
                        this.clientCarins2.source='中国平安'
                    }else if(this.clientCarins2.source==4){
                        this.clientCarins2.source='中国人保'
                    }else if(this.clientCarins2.source==8){
                        this.clientCarins2.source='中国人寿'
                    }
                    this.order2=res.data.order
                    this.rebate2=res.data.rebate
                    // this.getLastTimeQuote()
                }
                
            })
        },
        getClientInfoCarins2(khid,ddid){
            //本页重新查询订单详情
            this.loading=true
            let data={
                // clientId:khid,
                orderId:ddid,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                // console.log(res)
                this.loading=false
                if(res.data){
                    this.detail = false
                    this.$nextTick(() => (this.detail = true))
                    this.khid=khid
                    this.data=res.data.clientInfo
                    this.orderId=ddid
                    this.clientCarins=res.data.clientCarins
                    if(this.clientCarins.source==1){
                        this.clientCarins.source='太平洋保险'
                    }else if(this.clientCarins.source==2){
                        this.clientCarins.source='中国平安'
                    }else if(this.clientCarins.source==4){
                        this.clientCarins.source='中国人保'
                    }else if(this.clientCarins.source==8){
                        this.clientCarins.source='中国人寿'
                    }
                    this.order=res.data.order
                    this.rebate=res.data.rebate
                    // this.getLastTimeQuote()
                }
                
            })
        },
        getClientInfoCarins(){
            //订单详情
            this.loading=true
            let data={
                // clientId:this.$route.params.khid,
                orderId:this.$route.params.ddid,
                userid:window.sessionStorage.getItem('userid')
            }
            //console.log(data)
            if(!this.$route.params.ddid){
                return//防止列表页引入调用报错
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                this.loading=false
                //console.log(res)
                if(res.data){
                    this.data=res.data.clientInfo
                    
                    this.clientCarins=res.data.clientCarins
                    if(this.clientCarins.source==1){
                        this.clientCarins.source='太平洋保险'
                    }else if(this.clientCarins.source==2){
                        this.clientCarins.source='中国平安'
                    }else if(this.clientCarins.source==4){
                        this.clientCarins.source='中国人保'
                    }else if(this.clientCarins.source==8){
                        this.clientCarins.source='中国人寿'
                    }
                    this.order=res.data.order
                    this.rebate=res.data.rebate
                    // this.getLastTimeQuote()
                }
                
            })
        },
        // getOrders(){
        //   //订单列表
        //   let data={
        //       page:this.$route.params.page,
        //       rows:this.$route.params.rows,
        //       userid:JSON.parse(window.sessionStorage.getItem('role')).userid
        //   }
        //   this.$axios({
        //       headers:{'Content-Type':'application/x-www-form-urlencoded'},
        //       method: 'post',
        //       url: getUrl()+'getOrders',
        //       data:this.$Qs.stringify(data)
        //   }).then((res)=>{
        //       //console.log(res)
        //       this.oderlist=res.data.rows
        //       this.oderlist.forEach(item=>{
        //           item.jqxdqDate=item.jqxdqDate.substring(0,10)
        //           item.syxdqDate=item.syxdqDate.substring(0,10)
        //       })
        //   })
        // },
        getQuoteRecordByOrderid(){
            //报价记录信息
            let data={
                orderId:this.$route.params.ddid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getQuoteRecordByOrderid',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                //console.log(res)
            })
        },
        getQuoteRecordByOrderid2(ddid){
            //本页报价记录信息
            let data={
                orderId:ddid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getQuoteRecordByOrderid',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                //console.log(res)
            })
        },
        getQuoteRecordByOrderidThree(ddid){
            //来电报价记录信息
            let data={
                orderId:ddid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getQuoteRecordByOrderid',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                //console.log(res)
            })
        },
        getLastTimeQuote(){//查看上次报价信息
            let data={
                licenseNo:this.licenseNo
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getLastTimeQuote',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                //console.log(res)
            })
        }
    },
    watch:{
        $route(to,from){
            if(from.name=='我的待办'&&to.name=='订单详情'){
                window.sessionStorage.setItem('fromName','我的待办')
            }else{
                window.sessionStorage.setItem('fromName','null')
                // alert(this.fromName)
            }
        }
    },
    created(){
        // this.getClientInfoCarins()
    },
    mounted(){
        $('.orderList').css('height',$(window).height()-$('.orderList').offset().top+'px')
        $('.orderDetail').css('height',$(window).height()-$('.orderList').offset().top-$('.btn').height()+'px')
        // this.getLastTimeQuote()
        // this.getQuoteRecordByOrderid()
        // this.getOrders()
        this.getClientInfoCarins()
        // this.Three()
        this.first=true
        this.active=this.$route.params.index
        $('.orderList').scrollTop($('.order').height()*this.active)//左侧滚动条距离
    }
}
</script>

<style lang="scss" scoped>
    .detail{
        overflow-x: scroll;
        .red{
            color: red;
        }
        .orderActive{
            border: 1px solid #EA9B13 !important;
            border-left: 3px solid #EA9B13 !important;
            // background: #f0f0f0;
        }
        .head{
            height: 48px;
            line-height: 48px;
            border-bottom: 1px solid #ccc;
            padding: 0 10px;
            font-size: 12px;
            box-shadow: 0px 1px 0px rgba(0, 0, 0, .3) !important;
            i{
                font-size: 12px;
            }
            .back{
                cursor: pointer;
                display: inline-block;
                margin-right: 10px;
            }
            
        }
        .orderList::-webkit-scrollbar {/*滚动条整体样式*/
                width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
                height: 1px;
            }
        .orderList::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
                background: rgba(0,0,0,.5);
            }
        .orderList::-webkit-scrollbar-track {/*滚动条里面轨道*/
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
                border-radius: 10px;
                background: transparent;
            }
        
        .orderList{

            overflow-y: scroll;
            // width: 200px;
            .order{
                padding: 10px;
                border: 1px solid #999999;
                border-bottom: none;
                border-right: none;
                border-left:3px solid transparent; 
                box-sizing: border-box;
                cursor: pointer;
                h2{
                    font-size: 14px;
                    margin-bottom: 24px;
                    font-family:Alibaba PuHuiTi;
                }
                p{
                    font-size: 12px;
                    font-family:Alibaba PuHuiTi;
                }
            }
        }
        
        
    }
</style>


