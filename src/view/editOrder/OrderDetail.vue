
<template>
    <div class="detail" >
        <div class="head">
            <span class="back" @click="back"><i class="iconfont">&#xe625;</i>返回</span>
            <span>共<span class="red">{{$route.params.tableData.length}}</span>条数据</span>
        </div>
        <div class="detailCont">
            <el-row type="flex">
                <el-col :span="3">
                    <div class="orderList" @mousemove="mousemove" @mouseout="mouseout">
                        <div v-for="(item,index) of $route.params.tableData" :key="index" class="order" :class="{'orderActive': index == active}" @click="selectOrder(index)">
                            <h2>{{item.licenseNo}}</h2>
                            <p>交强险到期时间:<span class="red">{{item.jqxdqDate==''?'---':item.jqxdqDate|time}}</span></p>
                            <p>商业险到期时间:<span class="red">{{item.syxdqDate==''?'---':item.syxdqDate|time}}</span></p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="21"> 
                    <SalesDetailRigth :getdata='getdata' :textarea='textarea' v-if="detail" @reload2='getInfoCarins' @reload='getClientInfoCarins3' :id="$route.params.khid" :orderId="first?$route.params.ddid:orderId" :rebate='rebate' :khid='khid' :order="order" :data="data" :clientCarins='clientCarins' :phoneCus='phoneCus'/>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import getUrl from '@/assets/js/getUrl.js';
import commod from '@/assets/js/commod.js';
import SalesDetailRigth from '../sales/SalesDetailRigth'
export default {
    name:'OrderDetail',
    components:{
        SalesDetailRigth
    },
    filters:{
        time(val){
            if(val.length>5){
                val=val.substring(0,10)
            }
            return val
        }
    },
    data(){
        return{
            name:'',
            active:0,
            loading:false,
            order:{},
            detail:true,
            radio:'1',
            first:false,
            rebate:{}, 
            activeName2:'second',
            data:{},
            oderlist:[],
            clientCarins:{},
            orderId:'',
            khid:'',
            textarea:'',
            phoneCus:'',
            getdata:{}
        }
    },
    methods:{
        back(){
            this.$router.push('/OrderList')
            store.dispatch('showDetail',true)
        },
        getClientInfoCarins3(e){
            //本页刷新订单详情
            let data={
                clientId:e.clientId,
                orderId:e.id,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                console.log(res)
                if(res.data){
                    
                    this.khid=e.clientId
                    // this.data=res.data
                    this.data=res.data.clientInfo
                    this.orderId=e.id
                    this.clientCarins=res.data.clientCarins
                    this.order=res.data.order
                    this.rebate=res.data.rebate
                }
                
            })
        },
        handleClick(tab, event) {
            //切换tab
            // console.log(tab, event);
        },
        getQuoteByClientId2(licenseNo){
            //获取报价内容
            let data={
                licenseNo:licenseNo,
                lastyeartype:0
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getQuoteByLicenseNo',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                console.log(res)
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
                    this.textarea='尊敬的'+this.$route.params.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+syx+chesun+sanzhe+daoqiang+siji+chengke+huahen+boli+ziran+sheshui+sanfang+zhiding+buchang+bujiMian+sum
                // this.textarea='尊敬的'+res.data.licenseNo+'车主,您的车险即将到期，保险报价:交强险:'+res.data.jqx+'元,车船税'+res.data.chechuanshui+'元,商业险:'+res.data.syx+'元,其中车损'+res.data.cheSun+'元,保额'+res.data.clssbe+'元。三者'+res.data.sanZhe+'元,保额'+res.data.dszzrxbe+'元。盗抢险'+res.data.daoQiang+'元.司机座位险'+res.data.siJi+'元,保额'+res.data.sjzwxbe+'元。乘客座位险'+res.data.chengKe+'元,保额'+res.data.ckzwxbe+'元.划痕'+res.data.huaHen+'元,保额'+res.data.hhxbe+'元。玻璃'+res.data.boLi+'元。自然'+res.data.ziRan+'元。涉水险'+res.data.sheShui+'元。车损无法找到第三方险'+res.data.hcSanFangTeYue+'元。指定修理厂险'+res.data.hcXiuLiChang+'元。修理期间费用补偿险'+res.data.fybc+'元。不计免赔总额'+res.data.bjmpsum+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃)。 总计'+res.data.sum+'元。共优惠'+this.shouldMoney+'元,优惠后实交保费'+this.finallyMoney+'元元(含交强和税)。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
            })
        },
        getInfoCarins(data){
            console.log(data)
            this.getQuoteByLicenseNo(data)
        },
        getQuoteByLicenseNo(e){
            let data={
                licenseNo:e.licenseNo,
                lastyeartype:0
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getQuoteByLicenseNo',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                console.log(res.data)
                this.detail = false
                this.$nextTick(() => (this.detail = true))
                this.getdata=res.data
            })
        },
        getQuoteByClientId(){
            //获取报价内容
            let data={
                licenseNo:this.$route.params.licenseNo,
                lastyeartype:0
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getQuoteByLicenseNo',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res)
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
                    this.textarea='尊敬的'+this.$route.params.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+syx+chesun+sanzhe+daoqiang+siji+chengke+huahen+boli+ziran+sheshui+sanfang+zhiding+buchang+bujiMian+sum
                // this.textarea='尊敬的'+res.data.licenseNo+'车主,您的车险即将到期，保险报价:交强险:'+res.data.jqx+'元,车船税'+res.data.chechuanshui+'元,商业险:'+res.data.syx+'元,其中车损'+res.data.cheSun+'元,保额'+res.data.clssbe+'元。三者'+res.data.sanZhe+'元,保额'+res.data.dszzrxbe+'元。盗抢险'+res.data.daoQiang+'元.司机座位险'+res.data.siJi+'元,保额'+res.data.sjzwxbe+'元。乘客座位险'+res.data.chengKe+'元,保额'+res.data.ckzwxbe+'元.划痕'+res.data.huaHen+'元,保额'+res.data.hhxbe+'元。玻璃'+res.data.boLi+'元。自然'+res.data.ziRan+'元。涉水险'+res.data.sheShui+'元。车损无法找到第三方险'+res.data.hcSanFangTeYue+'元。指定修理厂险'+res.data.hcXiuLiChang+'元。修理期间费用补偿险'+res.data.fybc+'元。不计免赔总额'+res.data.bjmpsum+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃)。 总计'+res.data.sum+'元。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+'，联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
            })
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
            console.log(this.$route.params.tableData[index])
            this.getClientInfoCarins2(this.$route.params.tableData[index].clientId,this.$route.params.tableData[index].id)
            this.getQuoteByClientId2(this.$route.params.tableData[index].licenseNo)
            this.phoneCus=this.$route.params.tableData[index].phone.substring(0,3)+'****'+this.$route.params.tableData[index].phone.substring(7,this.$route.params.tableData[index].phone.length)
        },
        getClientInfoCarins2(khid,ddid){
            //本页重新查询订单详情
            let data={
                clientId:khid,
                orderId:ddid,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                this.loading=false
                console.log(res)
                this.khid=khid
                this.data=res.data.clientInfo
                this.orderId=ddid
                this.clientCarins=res.data.clientCarins
                this.order=res.data.order
                this.rebate=res.data.rebate
            })
        },
        getClientInfoCarins(){
            //订单详情
            this.loading=true
            let data={
                clientId:this.$route.params.khid,
                orderId:this.$route.params.ddid,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                this.loading=false
                // console.log(res)
                this.data=res.data.clientInfo
                this.clientCarins=res.data.clientCarins
                this.order=res.data.order
                this.rebate=res.data.rebate
            })
        },
        getOrders(){
          //订单列表
          let data={
              page:this.$route.params.page,
              rows:this.$route.params.rows,
              userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'getOrders',
              data:this.$Qs.stringify(data)
          }).then((res)=>{
              console.log(res)
              this.oderlist=res.data.rows
              this.oderlist.forEach(item=>{
                  item.jqxdqrq=item.jqxdqrq.substring(0,10)
                  item.syxdqrq=item.syxdqrq.substring(0,10)
              })
          })
        },
    },
    mounted(){
        
        $('.orderList').css('height',$(window).height()-$('.orderList').offset().top+'px')
        $('.orderDetail').css('height',$(window).height()-$('.orderList').offset().top-$('.btn').height()+'px')
        this.getClientInfoCarins()
        // this.getOrders()
        this.getQuoteByClientId()
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
                    margin-bottom: 30px;
                }
                p{
                    font-size: 12px;
                }
            }
        }
        
        
    }
</style>




