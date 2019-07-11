<template>
    <div class="qrCode" ref="wapper">
        <div>
        <div class="loading" v-if="loading">
            <van-loading class="loadingCont"  size='50px' type="spinner" color="white" />
        </div>
        <div class="cph">
            <p>{{order.licenseNo}}</p>
        </div>
        <div class="money">
            <van-row>
                <van-col span="8"><img src="../../assets/images/zgpa.png" ></van-col>
                <van-col span="8"><p></p></van-col>
                <van-col span="8"><p>实收<span>¥{{$route.query.finally|tofixed}}</span></p></van-col>
            </van-row>
        </div>
        <div class="carMsg">
            <img src="../../assets/images/carMsg.png" >
            <p><span>车牌号</span><span>{{order.licenseNo}}</span></p>
            <p><span>车主姓名</span><span>{{order.licenseOwner}}</span></p>
            <p><span>品牌型号</span><span>{{order.modleName}}</span></p>
            <p><span>商业险出险</span><span>--次</span></p>
            <p><span>交强险出险</span><span>--次</span></p>
            <p><span>商业险起保时间</span><span>{{order.syxdqDate}}</span></p>
            <p><span>交强险起保时间</span><span>{{order.jqxdqDate}}</span></p>
        </div>
        <div class="insurMsg">
            <img src="../../assets/images/insurDetail.png" >
            <table>
                <thead>
                    <tr>
                        <th align='left' style="text-indent:.1rem;">险种名称</th>
                        <th>保额</th>
                        <th>不计免赔</th>
                        <th>保费</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="getdata.sanZheBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">三者险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.sanZheBaoE|montyType}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.buJiMianSanZheBaoE}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.sanZheBaoFei}}</td>
                    </tr>
                    <tr  v-if="getdata.cheSunBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">机动车损失保险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.cheSunBaoE|montyType}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.buJiMianCheSunBaoFei}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.cheSunBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.siJiBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">司机座位险</td>
                        <td  align='right' style="padding-right:.15rem;">{{getdata.siJiBaoE|montyType}}</td>
                        <td  align='right' style="padding-right:.15rem;">{{getdata.buJiMianSiJiBaoFei}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.siJiBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.chengKeBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">乘客座位险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.chengKeBaoE|montyType}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.buJiMianChengKeBaoFei}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.chengKeBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.daoQiangBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">盗抢险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.daoQiangBaoE|montyType}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.buJiMianDaoQiangBaoFei}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.daoQiangBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.huaHenBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">划痕险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.huaHenBaoE|montyType}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.buJiMianHuaHenBaoFei}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.huaHenBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.boLiBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">玻璃单独破碎险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.boLiBaoE|montyType}}</td>
                        <td></td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.boLiBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.sheShuiBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">涉水行驶损失险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.sheShuiBaoE|montyType}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.buJiMianSheShuiBaoFei}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.sheShuiBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.ziRanBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">自燃损失险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.ziRanBaoE|montyType}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.buJiMianZiRanBaoFei}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.ziRanBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.hcSanFangTeYueBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">车损无法找到第三方险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.hcSanFangTeYueBaoE|montyType}}</td>
                        <td></td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.hcSanFangTeYueBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.hcXiuLiChangBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">指定修理厂险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.hcXiuLiChangBaoE|montyType2}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.hcXiuLiChangType|montyType3}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.hcXiuLiChangBaoE}}</td>
                    </tr>
                    <tr v-if="getdata.sheBeiSunShiBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">新增设备损失险</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.sheBeiSunShiBaoE|montyType}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.bjmSheBeiSunShiBaoFei}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.sheBeiSunShiBaoFei}}</td>
                    </tr>
                    <tr v-if="getdata.fybcBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">修理期间费用补偿</td>
                        <td align='right' style="padding-right:.15rem;">投保</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.fybcBaoE}}</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.fybcDaysBaoFei}}天</td>
                    </tr>
                    <tr v-if="getdata.showSanZheJieJiaRiBaoE!=0">
                        <td align='left' style="text-indent:.1rem;">三责险附加法定节假日</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.showSanZheJieJiaRiBaoFei}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td  align='left' style="text-indent:.1rem;" colspan="3">商业险合计<span>(含不计免赔)</span></td>
                        <td>{{getdata.bizTotal|tofixed}}</td>
                    </tr>
                    <tr>
                        <td align='left' style="text-indent:.1rem;" colspan="3">车船税合计</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.taxTotal|tofixed}}</td>
                    </tr>
                    <tr>
                        <td align='left' style="text-indent:.1rem;" colspan="3">交强险合计</td>
                        <td align='right' style="padding-right:.15rem;">{{getdata.forceTotal|tofixed}}</td>
                    </tr>
                    <tr>
                        <td align='left' style="text-indent:.1rem;" colspan="3">保费合计</td>
                        <td  align='right' style="padding-right:.15rem;">{{getdata.zongjine|tofixed}}</td>
                    </tr>
                    <!-- <tr>
                        <td colspan="4" class="should">
                            本次应收<b>{{getdata.zongjine|tofixed}}元</b>
                        </td>
                    </tr>
                    <tr v-if="(getdata.zongjine-$route.query.finally)!=0">
                        <td colspan="4" class="youhui">
                            本次优惠<b>{{(getdata.zongjine-$route.query.finally).toFixed(2)}}元</b>
                        </td>
                    </tr> -->
                    <tr>
                        <td colspan="4" class="finally">
                            实收<b>{{$route.query.finally|tofixed}}元</b>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="tel">
            <van-row>
                <van-col span='4'><img src="../../assets/images/user.png"></van-col>
                <van-col span='16'>
                    <h2>{{$route.query.name}}</h2>
                    <p>{{$route.query.phone}}</p>
                </van-col>
                <van-col span='4'>
                    <a :href="'tel:'+$route.query.phone"><img src="../../assets/images/phone.png"></a>
                </van-col>
            </van-row>
        </div>
        <div class="picture">
            <span >温馨提示:需上传:身份证正反面及行驶证正副页</span>
            <!-- <div class="alipay">
                <p>请提供支付宝账号:</p>
                <van-cell-group>
                    <van-field v-model="alipay" placeholder="支付宝账号" />
                </van-cell-group>
            </div> -->
            <div class="showPic">
                <van-row>
                    <van-col span='12'>
                        <p class="spanUP">
                            <!-- <img id="zheng" class="fan" :src="img1"/> -->
                            <img :src="file1[0]" v-show="file1.length==1" >
                            <span class='tip' v-show="file1.length==0">请选择身份证正面照</span>
                            <input @change="changeIMg1($event)"  type="file" id="zheng" accept="image/*"  mutiple="mutiple"  />
                            <!-- <van-uploader class="spanUP"  :after-read="onRead1" accept="image/*" capture="camera" mutiple="mutiple">
                                <img :src="file1[0]" v-show="file1.length==1" >
                                <span v-show="file1.length==0">请选择身份证正面照</span>
                            </van-uploader> -->
                        </p>
                    </van-col>
                    <van-col span='12'>
                        <p class="spanUP">
                        <!-- <img id="fan" class="fan" :src="img2"/> -->
                        <img :src="file2[0]" v-show="file2.length==1" >
                        <span class='tip' v-show="file2.length==0">请选择身份证反面照</span>
                        <input @change="changeIMg2($event)"  type="file" id="fan" accept="image/*"  mutiple="mutiple"  />
                        <!-- <van-uploader class="spanUP"  :after-read="onRead2" accept="image/*" capture="camera" mutiple="mutiple">
                            <img :src="file2[0]" v-show="file2.length==1" >
                            <span v-show="file2.length==0">请选择身份证反面照</span>
                        </van-uploader> -->
                        </p>
                    </van-col>
                </van-row>
                <van-row>
                    <van-col span='12'>
                        <p class="spanUP">
                            <!-- <img id="zhengxs" class="fan" :src="img1"/> -->
                            <img :src="file3[0]" v-show="file3.length==1" >
                            <span class='tip' v-show="file3.length==0">请选择行驶证正页照</span>
                            <input @change="changeIMg3($event)"  type="file" id="zhengxs" accept="image/*"  mutiple="mutiple"  />
                        <!-- <van-uploader class="spanUP"  :after-read="onRead3" accept="image/*" capture="camera" mutiple="mutiple">
                            <img :src="file3[0]" v-show="file3.length==1" >
                            <span v-show="file3.length==0">请选择行驶证正页照</span>
                        </van-uploader> -->
                        </p>
                    </van-col>
                    <van-col span='12'>
                        <p class="spanUP">
                            <!-- <img id="fanxs" class="fan" :src="img1"/> -->
                            <img :src="file4[0]" v-show="file4.length==1" >
                            <span class='tip' v-show="file4.length==0">请选择行驶证副页照</span>
                            <input @change="changeIMg4($event)"  type="file" id="fanxs" accept="image/*"  mutiple="mutiple" />
                        <!-- <van-uploader class="spanUP"  :after-read="onRead4" accept="image/*" capture="camera" mutiple="mutiple">
                            <img :src="file4[0]" v-show="file4.length==1" >
                            <span v-show="file4.length==0">请选择行驶证副页照</span>
                        </van-uploader> -->
                        </p>
                    </van-col>
                </van-row>
                <div class="picCont" v-if="btnShow"><p @click="upload">确认上传</p></div>
                
            </div>
            
            
            
        </div>
        </div>
        
    </div>
</template>

<script>
// import '@/assets/css/reset.css';
import getUrl from '@/assets/js/getUrl.js';
import BScroll from 'better-scroll'
import commod from '@/assets/js/commod.js';
export default {
    name:'QrCode',
    filters:{
        tofixed(val){
            return Number(val).toFixed(2)
        },
        montyType3(val){
            if(val==-1){
                return '不投保'
            }else if(val==0){
                return '国产'
            }else if(val==1){
                return '进口'
            }else{
                return val
            }
        },
        index(val){
            if(val==0){
                return '身份证正面照'
            }else if(val==1){
                return '身份证反面照'
            }else if(val=2){
                return '行驶证正页'
            }else{
                return '行驶证副页'
            }
        },
        time(val){
            if(val){
                // return commod(val)
                return val
            }else{
                return val
            }
        },
        montyType2(val){
            if(val==1){
                return '国产'
            }else if(val==0){
                return '不投保'
            }else if(val==2){
                return '进口'
            }else{
                return val
            }
        },
        montyType(val){
            if(val==1){
                return '投保'
            }else if(val==0){
                return '未投保'
            }else{
                return val
            }
        },
    },
    data(){
        return{
            alipay:'',
            loading:false,
            err:'',
            img1:'',
            img2:'',
            img3:'',
            img4:'',
            getdata:{},
            file1:[],
            file2:[],
            btnShow:true,
            file3:[],
            file4:[],
            fileList1:[],
            fileList2:[],
            fileList3:[],
            fileList4:[],
            data:{},
            order:{},
            clientCarins:{},
            eventOjb1:'',
            eventOjb2:'',
            eventOjb3:'',
            eventOjb4:''
        }
    },
    methods:{
        changeIMg1(e){
            //console.log(e)
            let that=this
            let reads= new FileReader();
            let f=document.getElementById('zheng').files[0];
            reads.readAsDataURL(f);
            reads.onload=function (e) {
                //console.log(e)
                // document.getElementById('zheng').src=e.target.result;
                var url=e.target.result;
                that.fileList1=[]
                that.file1=[]
                that.fileList1.push(that.eventOjb1.target.files[0])
                that.file1.push(url)
            };
            this.eventOjb1=e
            //console.log(this.file1)
        },
        changeIMg2(e){
            let that=this
            let reads= new FileReader();
            let f=document.getElementById('fan').files[0];
            reads.readAsDataURL(f);
            reads.onload=function (e) {
                // document.getElementById('fan').src=e.target.result;
                var url=e.target.result;
                that.fileList2=[]
                that.file2=[]
                that.fileList2.push(that.eventOjb2.target.files[0])
                that.file2.push(url)
            };
            this.eventOjb2=e
        },
        changeIMg3(e){
            let that=this
            let reads= new FileReader();
            let f=document.getElementById('zhengxs').files[0];
            reads.readAsDataURL(f);
            reads.onload=function (e) {
                // document.getElementById('zhengxs').e.target.result;
                var url=e.target.result;
                that.fileList3=[]
                that.file3=[]
                that.fileList3.push(that.eventOjb3.target.files[0])
                that.file3.push(url)
            };
            this.eventOjb3=e
        },
        changeIMg4(e){
            let that=this
            let reads= new FileReader();
            let f=document.getElementById('fanxs').files[0];
            reads.readAsDataURL(f);
            reads.onload=function (e) {
                // document.getElementById('fanxs').src=e.target.result;
                var url=e.target.result;
                that.fileList4=[]
                that.file4=[]
                that.fileList4.push(that.eventOjb4.target.files[0])
                that.file4.push(url)
            };
            this.eventOjb4=e
        },
        upload(){
            //上传图片
            let that=this
            var formData = new FormData(); 
            formData.append('sfzzm', this.fileList1[0]);
            formData.append('sfzfm', this.fileList2[0]);
            formData.append('xszzm', this.fileList3[0]);
            formData.append('xszfm', this.fileList4[0]);
            formData.append('orderId', this.$route.query.orderId);
            formData.append('alipay', this.alipay);
            formData.append('way', '1');
            formData.append('userid',this.$route.query.userid);
            // if(this.alipay==''){
            //     this.$dialog.alert({
            //         message: '支付宝账号不能为空!',
            //         }).then(() => {
            //         // on close
            //     });
            //     return
            // }else 
            if(this.file2.length==0||this.file3.length==0||this.file4.length==0||this.file1.length==0){
                this.$dialog.alert({
                    message: '请上传身份证正反面及行驶证正副页!'
                    }).then(() => {
                    // on close
                });
                return
            }
            this.loading=true
            $.ajax({
                url: getUrl()+'uploadClientPaperInfo',//这里是后台接口需要换掉
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                success:(res)=>{
                    //console.log(res)
                    if(res=='success'){
                        this.loading=false
                        this.btnShow=false
                        this.$dialog.alert({
                            message: '图片上传成功,可关闭此页面!'
                            }).then(() => {
                            // on close
                        });
                    }
                }
            })
        },
        getQuoteByClientId(){
            //投保信息
            let data={
                licenseNo:this.$route.query.licenseNo,
                lastyeartype:0
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getLastTimeQuote',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                //console.log(res)
                this.getdata=res.data
            })
        },
        getMsg(){
            //获取报价信息
            let data={
                clientId:this.$route.query.clientId,
                orderId:this.$route.query.orderId,
                userid:this.$route.query.userid,
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                // console.log(res)
                this.data=res.data.clientInfo
                this.clientCarins=res.data.clientCarins
                this.order=res.data.order
            })
        },
        onRead1(file) {
            //sfzzm
            this.fileList1=[]
            this.file1=[]
            this.fileList1.push(file.file)
            this.file1.push(file.content)
        },
        onRead2(file) {
            //sfzfm
            this.fileList2=[]
            this.file2=[]
            this.fileList2.push(file.file)
            this.file2.push(file.content)
        },
        onRead3(file) {
            //xszzm
            this.fileList3=[]
            this.file3=[]
            this.fileList3.push(file.file)
            this.file3.push(file.content)
        },
        onRead4(file) {
            //xszfm
            this.fileList4=[]
            this.file4=[]
            this.fileList4.push(file.file)
            this.file4.push(file.content)
        },
    },
    mounted(){
        (function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if(clientWidth>=375){
                    // $('.qrCode').css('font-size','100px')
                    docEl.style.fontSize = '100px';
                }else{
                    // $('.qrCode').css('font-size',100 * (clientWidth / 375) + 'px')
                    docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
                }
            };
  
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
        // $('input[type=file]').attr('capture','camera')
        this.getMsg();
        // //console.log(this.$route.query.name)
        this.getQuoteByClientId();
        // this.scroll= new BScroll (this.$refs.wapper, {click: true})
    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/reset.css';
    .qrCode{
        font-size: .12rem;
        // height: 100vh;
        // overflow: hidden;
        background: #F2F2F2;
        .loading{
            z-index: 999;
            position: fixed;
            background: rgba(0, 0, 0, .6);
            width: 100%;
            height: 100%;
            .loadingCont{
                position: absolute;
                left: 50%;
                top: 50%;
                margin: -25px -25px;
            }
        }
        .cph{
            background-image: url('../../assets/images/banner.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            position: relative;
            height: 1.57rem;
            p{
                position: absolute;
                left: 1.58rem;
                bottom: .17rem;
                font-size: .12rem;
                color: #036BA6;
                font-weight: bold;
            }
        }
        .money{
            height: .5rem;
            background: white;
            padding: .05rem;
            img{
                width: 1rem;
                height: .4rem;
            }
            p{
                color: #CF1D0F;
                text-align: right;
                height: .5rem;
                line-height: .44rem;
                font-size: .12rem;
                span{
                    font-size: .18rem;
                }
                
            }
        }
        .insurMsg{
            background: white;
            margin: .1rem;
            padding-bottom: .1rem;
            table{
                width: 100%;
                text-align: center;
                line-height: .17rem;
                font-size: .12rem;
                color: #333333;
                span{
                    color: #999999;
                }
                .should{
                    text-align: right;
                    padding-right:.15rem;
                    line-height:.24rem;
                    text-decoration: line-through;
                    b{
                        color: rgb(226, 145, 39) !important;
                        font-size: .14rem;
                        font-weight: normal;
                        
                    }
                }
                .youhui{
                    text-align: right;
                    padding-right:.15rem;
                    line-height:.2rem;
                    b{
                        color: #ccc !important;
                        font-size: .12rem;
                        font-weight: normal;
                        
                    }
                }
                .finally{
                    text-align: right;
                    padding-right:.15rem;
                    line-height: .24rem;
                    b{
                        color: #CF1D0F;
                        font-size: .18rem;
                        font-weight: normal;
                    }
                }
                
            }
            img{
                margin: .1rem 0 0 .1rem;
                width: 1.01rem;
            }
            p{
                display: flex;
                margin: 0 .1rem;
                line-height: .17rem;
                font-size: .14rem;
                color: #333333;
                justify-content: space-between;
            }
        }
        .carMsg{
            background: white;
            margin: .1rem;
            padding-bottom: .1rem;
            img{
                margin: .1rem 0 0 .1rem;
                width: 1.01rem;
            }
            p{
                display: flex;
                margin: 0 .1rem;
                line-height: .17rem;
                font-size: .14rem;
                color: #333333;
                justify-content: space-between;
            }
        }
        .tel{
            background: white;
            margin: .1rem;
            height: .5rem;
            img{
                width: .26rem;
                margin-top: .1rem;
                margin-left: .2rem;
            }
            h2{
                color: #333333;
                font-size: .15rem;
                margin-top: .05rem;
            }
            p{
                color: #999999;
                font-size: .14rem;
            }
        }
        .picture{
            width: 100%;
            padding-bottom: .2rem;
            .showPic{
                input{
                    z-index: 1999;
                    position: absolute;
                    top: 0;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                }
                .tip{
                    color: #ccc !important;
                    display: inline-block;
                    text-align: center;
                    line-height: 1.5rem;
                }
                img{
                    width: 1.5rem;
                    height: 1.5rem;
                }
                p{
                    position: relative;
                    margin: .1rem auto;
                    width: 1.5rem;
                    height: 1.5rem;
                    border: 1px dashed #ccc;
                    .spanUP{
                        display: inline-block;
                        height: 1.5rem;
                        line-height: 1.5rem;
                        text-align: center;
                        position: absolute;
                        
                        img{
                            width: 1.5rem;
                        }
                        
                        span{
                            
                            color: #ccc !important;
                        }
                    }
                }

            }
            .alipay{
               margin: .1rem; 
            }
            .show{
                margin: 0 auto;
                img{
                    width: 2rem;
                    margin: 0 auto;
                }
            }
            span{
                color: red;
                margin:0 .1rem;
                display: inline-block;
            }
            .picCont{
                margin: 0 auto;
                text-align: center;
                p{
                    margin: 0 auto;
                    border: none;
                    width: 3.17rem;
                    height: .44rem;
                    border-radius: .05rem;
                    line-height: .44rem;
                    font-size: .16rem;
                    font-weight: 400;
                    text-align: center;
                    background: #19A5C4;
                    color: white;
                }
            }
            
            
        }
    }
</style>

