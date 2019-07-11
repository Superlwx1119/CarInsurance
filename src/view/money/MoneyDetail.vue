<template>
    <div class="cont">
        <h2>客户信息 </h2>
        <table>
            <tr>
                <td><p>客户姓名:</p></td>
                <td><el-input type="text" size="small" readonly v-model="order.licenseOwner"></el-input></td>
                <td><p>客户电话:</p></td>
                <td><el-input type="text" size="small" readonly v-model="order.phone"></el-input></td>
            </tr>
            <tr>
                <td><p>返款方式:</p></td>
                <td>
                    <el-select size="small" disabled readonly v-model="clientCarins.remitType" placeholder="请选择">
                        <el-option
                        v-for="item in getType"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </td>
                <td><p>返款账号:</p></td>
                <td><el-input type="text" size="small" readonly v-model="clientCarins.remitAccount"></el-input></td>
            </tr>
            <tr>
                <td><p>返款金额:</p></td>
                <td><el-input size="small" readonly type="text" v-model="clientCarins.remitSum"></el-input></td>
                <td style="position:relative;" rowspan="3">
                    <img @click="openImg1($event)" :src="imgUrl" alt="">
                </td>
            </tr>
            <tr>
                <td><p>打款凭证:</p></td>
                <td >
                    <van-uploader class="spanUP"  :after-read="onRead4" accept="image/gif, image/jpeg" multiple>
                        <el-button type="primary">上传打款凭证</el-button>
                    </van-uploader>
                </td>
            </tr>
            <tr>
                <td><p>确认订单完成时间:</p></td>
                <td ><el-input size="small" readonly type="text" v-model="time"></el-input></td>
            </tr>
            <tr style="line-height:150px">
                <td colspan="3" align='center'>
                    <el-button type="primary" :disabled="jinzhi" @click="sendOver">{{btnTxt}}</el-button>
                </td>
            </tr>
        </table>
        <el-dialog title="查看图片" :visible.sync="showBigImg">
            <img class="bigImg" :src="BigImg">
        </el-dialog>
    </div>
</template>

<script>
import getUrl from '@/assets/js/getUrl.js';
import commod from '@/assets/js/commod.js';
export default {
    name:'MoneyDetail',
    data(){
        return{
            name:'',
            btnTxt:'完成打款',
            fine:true,
            tel:'',
            BigImg:'',
            showBigImg:false,
            getType:['支付宝'],
            way:'支付宝',
            account:'',
            jinzhi:false,
            money:'',
            data:{},
            imgUrl:null,
            clientCarins:{},
            order:{},
            url:'',
            time:''
        }
    },
    methods:{
        openImg1(e){
            //放大照片
            this.BigImg=e.target.currentSrc
            this.showBigImg=true
        },
        onRead4(file){
            //上传凭证
            var formData = new FormData(); 
            formData.append('vpic', file.file);
            formData.append('way', '3');
            formData.append('orderId',this.$route.params.ddid);
            formData.append('userid',JSON.parse(window.sessionStorage.getItem('role')).userid);
            this.$notify({
            title: '提示',
            message: '图片上传中请稍等!',
            type: 'success'
            });
            $.ajax({
                url: getUrl()+'uploadClientPaperInfo',//这里是后台接口需要换掉
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                success:(res)=>{
                    if(res=='success'){
                        this.imgUrl=file.content
                        this.fine=false
                        this.$notify({
                        title: '成功',
                        message: '图片上传成功!',
                        type: 'success'
                        });
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '图片上传失败!'
                        });
                    }
                }
            })
            // $(document).ajaxComplete(function(res){
            //     console.log(res)
            //     this.$dialog.alert({
            //         message: '图片上传成功,可关闭此页面!'
            //         }).then(() => {
            //         // on close
            //     });
            // })
        },
        sendOver(){
            //完成打款
            if(!this.imgUrl){
                this.$notify.error({
                    title: '失败',
                    message: '需上传凭证!'
                });
                return
            }
            let data={
                id:this.$route.params.ddid,
                orderStatus:0,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'orderProcedure',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                if(res.data=='success'){
                    this.btnTxt='订单已完成'
                    this.jinzhi=true
                    this.$notify({
                    title: '打款成功',
                    message: '可关闭此订单!',
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '错误',
                        message: '打款失败!'
                    });
                }
            })
        },
        getClientInfoCarins(){
            //打款订单信息
            if(this.order.orderStatus==0){
                this.btnTxt='订单已完成'
                this.jinzhi=true
                return
            }
            let data={
                clientId:this.$route.params.khid,
                orderId:this.$route.params.ddid,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            console.log(data)
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getClientInfoCarins',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                console.log(res)
                this.data=res.data.clientInfo
                this.clientCarins=res.data.rebate
                // this.time=commod(res.data.rebate.insTime)
                this.time=res.data.rebate.insTime
                this.order=res.data.order
            })
        }
    },
    mounted(){
        if(this.$route.params.orderStatus=='订单完成'){
            this.btnTxt='订单已完成'
            this.jinzhi=true
        }
        this.url=getUrl()
        this.imgUrl=this.url+'getPicBytes?orderId='+this.$route.params.ddid+'&index=remitVoucherPic'
        this.getClientInfoCarins()
    }
}
</script>

<style lang="scss" scoped>
    .cont{
        height: 600px;
        .bigImg{
            min-width: 300px;
            max-width: 600px;
        }
        h2{
            font-size: 14px;
            background: #f0f0f0;
            margin: 15px;
        }
        .spanUP{
            p{
                text-align: center;
                background: #036BA6;
                color: white;
                font-weight: bold
            }
        }
        table{
                width: 65%;
                margin: 10px auto;
                
                img{
                    width: 300px;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                .position{
                        position: relative;
                        .poBtn{
                            display: inline-block;
                            cursor: pointer;
                            position: absolute;
                            width: 50px;
                            line-height: 18px;
                            font-size: 12px;
                            background: rgb(246, 150, 96);
                            color: white;
                            top: 10px;
                            right: -55px;
                        }
                    }
                tr{
                    line-height: 40px;
                    td{
                        min-width: 140px;
                        position: relative;
                        img{
                            cursor: pointer;
                            // position: absolute;
                            // top: 0;
                            // left: 0;
                            width: 80%;
                        }
                        .plus{
                            width: 200px;
                        }
                        p{
                            font-size: 12px;
                            text-align: right;
                            padding-right: 10px;
                            width: 100px;
                        }
                    }
                }
                
            }
    }
</style>


