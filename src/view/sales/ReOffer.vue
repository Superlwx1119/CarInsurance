<template>
    <div class="reOffer">
        <div class="reOfferCont">
            <h2>重新报价 <i @click="closeOffer" class="el-icon-close"></i></h2>
            <el-row type="flex" v-loading="loading">
                <el-col :span="12">
                    <table class="leftTable">
                        <tr>
                            <td > <p>选择投保公司:</p></td>
                            <td >
                                <el-radio-group v-model="formLeft.company">
                                    <el-radio :label="2">中国平安</el-radio>
                                    <!-- <el-radio :label="6">备选项</el-radio>
                                    <el-radio :label="9">备选项</el-radio> -->
                                </el-radio-group>
                                <!-- <el-checkbox v-model="formLeft.company"  @change="selectCompany">中国平安</el-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td ><p>意愿投保公司:</p></td>
                            <td >
                                <el-radio-group v-model="formLeft.want">
                                    <el-radio :label="2">中国平安</el-radio>
                                    <!-- <el-radio :label="6">备选项</el-radio>
                                    <el-radio :label="9">备选项</el-radio> -->
                                </el-radio-group>
                                <!-- <el-checkbox v-model="formLeft.want"  @change="selectCompany">中国平安</el-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2"><p class="red">基本险</p></td>
                            <td><p class="title">车险保费</p></td>
                            <td><p class="title">不计免赔</p></td>
                            <td><p class="title">不计免赔保费</p></td>
                        </tr>
                        <tr>
                            <td><p>车辆损失险</p></td>
                            <td>
                                <el-select @change="chesun" v-model="formLeft.chesunMoney"  size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formLeft.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input size="mini" v-if="formLeft.chesunMoney!=0" type="text" v-model="formLeft.chesun"></el-input>
                            </td>
                            <td>
                                <el-checkbox v-model="formLeft.chesunFree" v-if="formLeft.chesunMoney!=0" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini" type="text" v-if="formLeft.chesunMoney!=0&&formLeft.chesunFree" v-model="formLeft.chesunFreeMoney"></el-input>
                            </td>
                        </tr>
                        <!-- <tr>
                            <td colspan="4">
                                <el-row type="flex" style="text-align:center;padding-left:15px;">
                                    <el-col><p>折旧价</p></el-col>
                                    <el-col><el-input size="mini" type="text" v-model="formLeft.depreciation"></el-input></el-col>
                                    <el-col><p>/协商价</p></el-col>
                                    <el-col><el-input size="mini" type="text" v-model="formLeft.negotiation"></el-input></el-col>
                                </el-row>
                            </td>
                        </tr> -->
                        <tr>
                            <td><p>第三者责任险</p></td>
                            <td>
                                <el-select @change="sanze" v-model="formLeft.sanzeMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formLeft.sanzeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input size="mini" v-if="formLeft.sanzeMoney!=0" type="text" v-model="formLeft.sanze"></el-input>
                            </td>
                            <td>
                                <el-checkbox v-model="formLeft.sanzeFree" v-if="formLeft.sanzeMoney!=0" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini" type="text" v-if="formLeft.sanzeMoney!=0&&formLeft.sanzeFree"  v-model="formLeft.sanzeFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>司机座位险</p></td>
                            <td>
                                <el-select @change="siji" v-model="formLeft.sijiMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formLeft.sijiOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input size="mini" v-if="formLeft.sijiMoney!=0" type="text" v-model="formLeft.siji"></el-input>
                                
                            </td>
                            <td>
                                <el-checkbox v-model="formLeft.sijiFree" v-if="formLeft.sijiMoney!=0" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini" type="text" v-if="formLeft.sijiMoney!=0&&formLeft.sijiFree" v-model="formLeft.sijiFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>乘客座位险</p></td>
                            <td>
                                <el-select @change="chengke" v-model="formLeft.chengkeMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formLeft.chengkeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input size="mini" v-if="formLeft.chengkeMoney!=0" type="text" v-model="formLeft.chengke"></el-input>
                            </td>
                            <td>
                                <el-checkbox v-model="formLeft.chengkeFree" v-if="formLeft.chengkeMoney!=0" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini" type="text" v-if="formLeft.chengkeMoney!=0&&formLeft.chengkeFree" v-model="formLeft.chengkeFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>盗抢险</p></td>
                            <td>
                                <el-select @change="qiangdao" v-model="formLeft.qiangdaoMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formLeft.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input size="mini" v-if="formLeft.qiangdaoMoney!=0" type="text" v-model="formLeft.qiangdao"></el-input>
                            </td>
                            <td>
                                <el-checkbox v-model="formLeft.qiangdaoFree" v-if="formLeft.qiangdaoMoney!=0" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini" type="text" v-if="formLeft.qiangdaoMoney!=0&&formLeft.qiangdaoFree" v-model="formLeft.qiangdaoFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p class="red">交强险</p></td>
                            <td><el-input size="mini" type="text" v-model="formLeft.jiaoqiang"></el-input></td>
                        </tr>
                        <tr>
                            <td><p class="red">车船税</p></td>
                            <td><el-input size="mini" type="text" v-model="formLeft.shangye"></el-input></td>
                        </tr>
                    </table>
                </el-col>
                <el-col :span="12">
                    <table class="rightTable">
                        <tr>
                            <td > <p>交强险:</p></td>
                            <td colspan="4">
                                <el-row type="flex">
                                    <el-col><p>交强险起保时间:</p></el-col>
                                    <el-col><el-date-picker
                                        v-model="formRight.jiaoStart"
                                        size="small"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                            </td>
                        </tr>
                        <tr>
                            <td ><p>商业险:</p></td>
                            <td  colspan="4">
                                <el-row type="flex">
                                    <el-col><p>商业险起保时间:</p></el-col>
                                    <el-col><el-date-picker
                                        v-model="formRight.shangStart"
                                        size="small"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2"><p class="red">附加险</p></td>
                            <td><p >车险保费</p></td>
                            <td><p >不计免赔</p></td>
                            <td><p >不计免赔保费</p></td>
                        </tr>
                        <tr>
                            <td><p>划痕险</p></td>
                            <td>
                                <el-select @change="huaheng" v-model="formRight.huahengMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.huahengOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input size="mini" v-if="formRight.huahengMoney!=0" type="text" v-model="formRight.huaheng"></el-input>
                            </td>
                            <td>
                                <el-checkbox v-model="formRight.huahengFree" v-if="formRight.huahengMoney!=0" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini" type="text" v-if="formRight.huahengMoney!=0&&formRight.huahengFree"  v-model="formRight.huahengFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>玻璃单独破碎险</p></td>
                            <td>
                                <el-select  v-model="formRight.boliMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.boliOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input  v-if="false" size="mini" type="text" v-model="formRight.boli"></el-input>
                            </td>
                            <td>
                                <el-checkbox  v-if="false" v-model="formRight.boliFree" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini"  v-if="false" type="text" v-model="formRight.boliFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>自燃损失险</p></td>
                            <td>
                                <el-select @change="ziran" v-model="formRight.ziranMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input size="mini" v-if="formRight.ziranMoney!=0" type="text" v-model="formRight.ziran"></el-input>
                            </td>
                            <td>
                                <el-checkbox v-model="formRight.ziranFree" v-if="formRight.ziranMoney!=0" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini" type="text" v-if="formRight.ziranMoney!=0&&formRight.ziranFree" v-model="formRight.ziranFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>涉水行驶损失险</p></td>
                            <td>
                                <el-select @change="sheshui" v-model="formRight.sheshuiMoney" size="mini" placeholder="请选择">

                                    <el-option
                                    v-for="item in formRight.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-if="formRight.sheshuiMoney!=0" size="mini" type="text" v-model="formRight.sheshui"></el-input>


                            </td>
                            <td>
                                <el-checkbox v-if="formRight.sheshuiMoney!=0" v-model="formRight.sheshuiFree"  ></el-checkbox>
                            </td>
                            <td>
                                <el-input v-if="formRight.sheshuiMoney!=0&&formRight.sheshuiFree" size="mini" type="text" v-model="formRight.sheshuiFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>车损无法找到第三方险</p></td>
                            <td>
                                <el-select v-model="formRight.sanfangMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-if="formRight.sanfangMoney!=0" size="mini" type="text" v-model="formRight.sanfang"></el-input>
                            </td>
                            <td>
                                <el-checkbox  v-if="false" v-model="formRight.sanfangFree" ></el-checkbox>
                            </td>
                            <td>
                                <el-input  v-if="false" size="mini" type="text" v-model="formRight.sanfangFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>指定修理厂险</p></td>
                            <td>
                                <el-select @change="zhiding" v-model="formRight.xiuliMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.zhidingOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select clearable v-if="formRight.xiuliMoney!=0" v-model="formRight.xiuli" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.zhidingchang"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-checkbox  v-if="false" v-model="formRight.zhidingFree" ></el-checkbox>
                            </td>
                            <td>
                                <el-input  v-if="false" size="mini" type="text" v-model="formRight.zhidingFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>新增设备损失险</p></td>
                            <td>
                                <el-select @change="xin" v-model="formRight.xinMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-if="formRight.xinMoney!=0" size="mini" type="text" v-model="formRight.xin"></el-input>
                            </td>
                            <td>
                                <el-checkbox v-if="formRight.xinMoney!=0" v-model="formRight.xinFree" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini" v-if="formRight.xinMoney!=0&&formRight.xinFree" type="text" v-model="formRight.xinFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>修理期间费用补偿险</p></td>
                            <td>
                                <el-select @change="buchang" v-model="formRight.buchangMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td colspan="3" >
                                <el-row type="flex" v-if="formRight.buchangMoney!=0">
                                    <el-col>
                                        <el-select v-model="formRight.buchang" size="mini" placeholder="请选择">
                                            <el-option
                                            v-for="item in formRight.xiuliMoneytype"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col>元×</el-col>
                                    <el-col><el-input size="mini" type="text" v-model="formRight.xiulitian"></el-input></el-col>
                                    <el-col>天</el-col>
                                </el-row>
                                
                            </td>
                            <td>
                                <el-checkbox  v-if="false" v-model="formRight.xiuliFree" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini"  v-if="false" type="text" v-model="formRight.xiuliFreeMoney"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td rowspan="2"><p>三责险附加法定节假日限额翻倍险</p></td>
                            <td>
                                <el-select v-model="formRight.fanbeiMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.fanbeiOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-if="formRight.fanbeiMoney!=0" size="mini" type="text" v-model="formRight.fanbei"></el-input>
                            </td>
                            <td>
                                <el-checkbox  v-if="false" v-model="formRight.fanbeiFree" ></el-checkbox>
                            </td>
                            <td>
                                <el-input size="mini"  v-if="false" type="text"  v-model="formRight.fanbeiFreeMoney"></el-input>
                            </td>
                        </tr>
                    </table>
                </el-col>
            </el-row>
            <div class="btn">
                <el-button class="edit" @click="saveQuote">提交报价</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import getUrl from '@/assets/js/getUrl.js';
export default {
    name:'ReOffer',
    props:{
        licenseNo:String,
        orderId:String,
        khid:String
    },
    data(){
        return{
            map:{},
            loading:false,
            formLeft:{
                jiaoqiang:'',
                shangye:'',
                company:2,
                want:2,
                depreciation:'',
                negotiation:'',
                chesun:'0',
                chesunMoney:'',
                chesunFree:false,
                chesunFreeMoney:'',
                sanzeFreeMoney:'',
                sanzeFree:false,
                sanze:'0',
                sanzeMoney:'',
                siji:'0',
                sijiMoney:'',
                sijiFree:false,
                sijiFreeMoney:'',
                chengke:'0',
                chengkeMoney:'',
                chengkeFree:false,
                chengkeFreeMoney:'',
                qiangdao:'0',
                qiangdaoMoney:'',
                qiangdaoFree:false,
                qiangdaoFreeMoney:'',
                options:[
                    {label:'投保',value:'1'},{label:'不投保',value:'0'}
                ],
                chengkeOptions:[
                    {label:'不投保',value:'0'},
                    {label:'1万',value:'10000'},
                    {label:'2万',value:'20000'},
                    {label:'3万',value:'30000'},
                    {label:'4万',value:'40000'},
                    {label:'5万',value:'50000'},
                    {label:'10万',value:'100000'},
                    {label:'20万',value:'200000'},
                    {label:'50万',value:'500000'},
                    {label:'100万',value:'1000000'},
                ],
                sijiOptions:[
                    {label:'不投保',value:'0'},
                    {label:'1万',value:'10000'},
                    {label:'2万',value:'20000'},
                    {label:'3万',value:'30000'},
                    {label:'4万',value:'40000'},
                    {label:'5万',value:'50000'},
                    {label:'10万',value:'100000'},
                    {label:'20万',value:'200000'},
                    {label:'50万',value:'500000'},
                    {label:'100万',value:'1000000'},
                ],
                sanzeOptions:[
                    {label:'不投保',value:'0'},
                    {label:'5万',value:'50000'},
                    {label:'10万',value:'100000'},
                    {label:'15万',value:'150000'},
                    {label:'20万',value:'200000'},
                    {label:'30万',value:'300000'},
                    {label:'50万',value:'500000'},
                    {label:'100万',value:'1000000'},
                    {label:'150万',value:'1500000'},
                    {label:'200万',value:'2000000'},
                    {label:'250万',value:'2500000'},
                    {label:'300万',value:'3000000'},
                    {label:'500万',value:'5000000'},
                ]
            },
            formRight:{
                jiaoStart:'',
                shangStart:'',
                options:[
                    {label:'投保',value:'1'},{label:'不投保',value:'0'}
                ],
                zhidingchang:[
                    {label:'15%',value:'0.15'},
                    {label:'20%',value:'0.2'},
                    {label:'30%',value:'0.3'},
                    {label:'40%',value:'0.4'},
                    {label:'50%',value:'0.5'},
                    {label:'60%',value:'0.6'},
                ],
                huaheng:'0',
                huahengMoney:'',
                boliMoney:'',
                huahengFree:false,
                huahengFreeMoney:'',
                huahengOptions:[
                    {label:'不投保',value:'0'},
                    {label:'2000元',value:'2000'},
                    {label:'5000元',value:'5000'},
                    {label:'1万',value:'10000'},
                    {label:'2万',value:'20000'},
                ],
                boli:'0',
                boli:'',
                zdxlcxtype:'',
                boliFree:false,
                boliFreeMoney:'',
                boliOptions:[
                    {label:'不投保',value:'0'},
                    {label:'国产',value:'1'},
                    {label:'进口',value:'2'},
                ],
                ziran:'0',
                ziranMoney:'',
                ziranFree:false,
                ziranFreeMoney:'',
                sheshui:'0',
                sheshuiMoney:'',
                sheshuiFree:false,
                sheshuiFreeMoney:'',
                sanfang:'0',
                sanfangMoney:'',
                sanfangFree:false,
                sanfangFreeMoney:'',
                zhiding:'0',
                zhidingMoney:'0',
                zhidingFree:false,
                zhidingFreeMoney:'',
                zhidingOptions:[
                    {label:'不投保',value:'0'},
                    {label:'国产',value:'1'},
                    {label:'进口',value:'2'},
                ],
                xin:'0',
                xinMoney:'',
                xinFree:false,
                xinFreeMoney:'',
                xiuli:'0',
                xiuliMoney:'',
                xiuliMoneytype:[100,200,300],
                buchang:'',
                buchangMoney:'',
                xiulitian:'',
                xiuliFree:false,
                xiuliFreeMoney:'',
                fanbei:'',
                fanbeiMoney:'0',
                fanbeiFree:false,
                fanbeiFreeMoney:'',
                fanbeiOptions:[
                    {label:'不投保',value:'0'},{label:'投保',value:'1'}
                ]
            }
        }
    },
    methods:{
        closeOffer(){
            //关闭
            this.$emit('close',false)
        },
        sheshui(val){
            //console.log(val)
            if(val==0){
                this.formRight.sheshuiMoney=''
                this.formRight.sheshuiFreeMoney=''
            }
        },
        sanze(val){
            //console.log(val)
            if(val==0){
                this.formLeft.sanze=''
                this.formLeft.sanzeFreeMoney=''
            }
        },
        xin(val){
            //console.log(val)
            if(val==0){
                this.formRight.xinFreeMoney=''
                this.formRight.xin=''
            }
        },
        ziran(val){
            //console.log(val)
            if(val==0){
                this.formRight.ziranFreeMoney=''
                this.formRight.ziran=''
            }
        },
        huaheng(val){
            //console.log(val)
            if(val==0){
                this.formRight.huahengFreeMoney=''
                this.formRight.huaheng=''
            }
        },
        buchang(val){
            //console.log(val)
            if(val==0){
                this.formRight.buchang=''
                this.formRight.xiulitian=''
            }
        },
        siji(val){
            //console.log(val)
            if(val==0){
                this.formLeft.siji=''
                this.formLeft.sijiFreeMoney=''
            }
        },
        qiangdao(val){
            //console.log(val)
            if(val==0){
                this.formLeft.qiangdao=''
                this.formLeft.qiangdaoFreeMoney=''
            }
        },
        zhiding(val){
            //console.log(val)
            if(val==-1){
                this.formRight.xiuli=''
            }
        },
        chengke(val){
            //console.log(val)
            if(val==0){
                this.formLeft.chengke=''
                this.formLeft.chengkeFreeMoney=''
            }
        },
        chesun(val){
            //console.log(val)
            if(val==0){
                this.formLeft.chesun=''
                this.formLeft.chesunFreeMoney=''
            }
        },
        selectCompany(val){
            //选择保险公司
            //console.log(val)
        },
        saveQuote(){
            //报价信息保存
            // //console.log(!this.formRight.jiaoStart||!this.formRight.shangStart)
            if(!this.formRight.jiaoStart||!this.formRight.shangStart){
                this.$notify.error({
                    title: '报价失败',
                    message: '请填写交强险和商业险起保时间'
                });
                return
            }
            let data={
                id:'',
                quoteBadge:'1',
                clientInfoId:this.$route.params.khid,
                licenseNo:this.licenseNo,
                source:this.formLeft.company.toString(),
                fybc:this.formRight.buchangMoney,
                cheSunBaoFei:this.formLeft.chesun,
                sanZheBaoFei:this.formLeft.sanze,
                daoQiangBaoFei:this.formLeft.qiangdao,
                siJiBaoFei:this.formLeft.siji,
                fybcBaoE:this.formRight.buchang,
                fybcDaysBaoFei:this.formRight.xiulitian,
                chengKeBaoFei:this.formLeft.chengke,
                boLiBaoFei:this.formRight.boli,
                huaHenBaoFei:this.formRight.huaheng,
                buJiMianCheSunBaoFei:this.formLeft.chesunFreeMoney,
                buJiMianSanZheBaoFei:this.formLeft.sanzeFreeMoney,
                buJiMianDaoQiangBaoFei:this.formLeft.qiangdaoFreeMoney,
                sheShuiBaoFei:this.formRight.sheshui,
                ziRanBaoFei:this.formRight.ziran,
                buJiMianChengKeBaoFei:this.formLeft.chengkeFreeMoney,
                buJiMianSiJiBaoFei:this.formLeft.sijiFreeMoney,
                buJiMianHuaHenBaoFei:this.formRight.huahengFreeMoney,
                buJiMianSheShuiBaoFei:this.formRight.sheshuiFreeMoney,
                buJiMianZiRanBaoFei:this.formRight.ziranFreeMoney,
                hcSanFangTeYueBaoFei:this.formRight.sanfang,
                hcXiuLiChangBaoFei:this.formRight.xiuli,
                hcXiuLiChangType:this.formRight.xiuliMoney,
                showSanZheJieJiaRiBaoE:this.formRight.fanbeiMoney,
                showSanZheJieJiaRiBaoFei:this.formRight.fanbei,
                sheBeiSunShiBaoFei:this.formRight.xin,
                bjmSheBeiSunShiBaoFei:this.formRight.xinFreeMoney,
                forceTotal:this.formLeft.jiaoqiang,
                taxTotal:this.formLeft.shangye,
                cheSunBaoE:this.formLeft.chesunMoney,
                sanZheBaoE:this.formLeft.sanzeMoney,
                siJiBaoE:this.formLeft.sijiMoney,
                chengKeBaoE:this.formLeft.chengkeMoney,
                daoQiangBaoE:this.formLeft.qiangdaoMoney,
                huaHenBaoE:this.formRight.huahengMoney,
                boLiBaoE:this.formRight.boliMoney,
                ziRanBaoE:this.formRight.ziranMoney,
                sheShuiBaoE:this.formRight.sheshuiMoney,
                hcSanFangTeYueBaoE:this.formRight.sanfangMoney,
                hcSanFangTeYueBaoFei:this.formRight.sanfang,
                zdxlcxtype:this.formRight.zhiding,
                sheBeiSunShiBaoE:this.formRight.xinMoney,
                forceStartDate:this.formRight.jiaoStart,
                businessStartDate:this.formRight.shangStart
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'saveQuote',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                //console.log(res)
                if(res.data.status==1){
                    // this.updateOrderStatus()
                    let data={licenseNo:this.licenseNo}
                    let source={source:this.formLeft.company}
                    this.$emit('close')
                    this.$emit('reloadTwo',data)
                    this.$emit('newOffer',source)
                    this.$emit('reload')
                    this.$notify({
                    title: '报价提交成功',
                    message: res.data.message,
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '报价提交错误',
                        message: res.data.message
                    });
                }
            })
        },
        updateOrderStatus(){
          //修改订单状态
          let data={
            orderId:this.orderId,
            status:3,
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'updateOrderStatus',
              data:this.$Qs.stringify(data)
          }).then(res=>{
            //console.log(res)
            if(res.data.status==1){
              //成功
            }
          })
        },
        getQuoteByClientId(){
            //获取已报价
            // alert(this.licenseNo)
            this.loading=true
            let data={
                licenseNo:this.licenseNo,
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
                this.formRight.xin=res.data.sheBeiSunShiBaoFei
                this.formRight.xinMoney=res.data.sheBeiSunShiBaoE
                if(res.data.sheBeiSunShiBaoE==''||res.data.sheBeiSunShiBaoE=='0'||!res.data.sheBeiSunShiBaoE){
                    this.formRight.xinMoney='0'
                }else{
                    this.formRight.xinMoney='1'
                }
                this.formRight.boli=res.data.boLiBaoFei
                this.formRight.boliMoney=res.data.boLiBaoE
                if(res.data.boLiBaoE==''||res.data.boLiBaoE=='0'||!res.data.boLiBaoE){
                    this.formRight.boliMoney='0'
                }else{
                    this.formRight.boliMoney=res.data.boLiBaoE
                }
                this.formLeft.chesunFreeMoney=res.data.buJiMianCheSunBaoFei
                if(res.data.buJiMianCheSunBaoFei==''||res.data.buJiMianCheSunBaoFei=='0'||!res.data.buJiMianCheSunBaoFei){
                    this.formLeft.chesunFree=false
                }else{
                    this.formLeft.chesunFree=true
                }
                this.formLeft.chengkeFreeMoney=res.data.buJiMianChengKeBaoFei
                if(res.data.buJiMianChengKeBaoFei==''||res.data.buJiMianChengKeBaoFei=='0'||!res.data.buJiMianChengKeBaoFei){
                    this.formLeft.chengkeFree=false
                }else{
                    this.formLeft.chengkeFree=true
                }
                this.formRight.xinFreeMoney=res.data.bjmSheBeiSunShiBaoFei
                if(res.data.bjmSheBeiSunShiBaoFei==''||res.data.bjmSheBeiSunShiBaoFei=='0'||!res.data.bjmSheBeiSunShiBaoFei){
                    this.formRight.xinFree=false
                }else{
                    this.formRight.xinFree=true
                }
                this.formLeft.qiangdaoFreeMoney=res.data.buJiMianDaoQiangBaoFei
                if(res.data.buJiMianDaoQiangBaoFei==''||res.data.buJiMianDaoQiangBaoFei=='0'||!res.data.buJiMianDaoQiangBaoFei){
                    this.formLeft.qiangdaoFree=false
                }else{
                    this.formLeft.qiangdaoFree=true
                }
                this.formRight.huahengFreeMoney=res.data.buJiMianHuaHenBaoFei
                if(res.data.buJiMianHuaHenBaoFei==''||res.data.buJiMianHuaHenBaoFei=='0'||!res.data.buJiMianHuaHenBaoFei){
                    this.formRight.huahengFree=false
                }else{
                    this.formRight.huahengFree=true
                }
                this.formLeft.sanzeFreeMoney=res.data.buJiMianSanZheBaoFei
                if(res.data.buJiMianSanZheBaoFei==''||res.data.buJiMianSanZheBaoFei=='0'||!res.data.buJiMianSanZheBaoFei){
                    this.formLeft.sanzeFree=false
                }else{
                    this.formLeft.sanzeFree=true
                }
                // this.formRight.sheshuiFreeMoney=res.data.buJiMianSheShuiBaoFei
                this.formLeft.sijiFreeMoney=res.data.buJiMianSiJiBaoFei
                if(res.data.buJiMianSiJiBaoFei==''||res.data.buJiMianSiJiBaoFei=='0'||!res.data.buJiMianSiJiBaoFei){
                    this.formLeft.sijiFree=false
                }else{
                    this.formLeft.sijiFree=true
                }
                this.formRight.ziranFreeMoney=res.data.buJiMianZiRanBaoFei
                if(res.data.buJiMianZiRanBaoFei==''||res.data.buJiMianZiRanBaoFei=='0'||!res.data.buJiMianZiRanBaoFei){
                    this.formRight.ziranFree=false
                }else{
                    this.formRight.ziranFree=true
                }
                // this.formRight.buchangMoney=res.data.fybc
                if(res.data.fybcBaoE==''||res.data.fybcBaoE=='0'||!res.data.fybcBaoE){
                    this.formRight.buchangMoney='0'
                }else{
                    this.formRight.buchangMoney='1'
                }
                this.formRight.buchang=res.data.fybcBaoE
                this.formRight.xiulitian=res.data.fybcDaysBaoFei
                this.formLeft.chesun=res.data.cheSunBaoFei
                this.formLeft.chesunMoney=res.data.cheSunBaoE
                if(res.data.cheSunBaoE==''||res.data.cheSunBaoE=='0'||!res.data.cheSunBaoE){
                    this.formLeft.chesunMoney='0'
                }else{
                    this.formLeft.chesunMoney='1'
                }
                this.formLeft.chengke=res.data.chengKeBaoFei
                this.formLeft.chengkeMoney=res.data.chengKeBaoE
                if(res.data.chengKeBaoE==''||res.data.chengKeBaoE=='0'||!res.data.chengKeBaoE){
                    this.formLeft.chengkeMoney='0'
                }else{
                    this.formLeft.chengkeMoney=res.data.chengKeBaoE
                }
                // this.formLeft.company=res.data.source
                this.formLeft.qiangdao=res.data.daoQiangBaoFei
                this.formLeft.qiangdaoMoney=res.data.daoQiangBaoE
                if(res.data.daoQiangBaoE==''||res.data.daoQiangBaoE=='0'||!res.data.daoQiangBaoE){
                    this.formLeft.qiangdaoMoney='0'
                }else{
                    this.formLeft.qiangdaoMoney='1'
                }
                this.formRight.huaheng=res.data.huaHenBaoFei
                this.formRight.huahengMoney=res.data.huaHenBaoE
                if(res.data.huaHenBaoE==''||res.data.huaHenBaoE=='0'||!res.data.huaHenBaoE){
                    this.formRight.huahengMoney='0'
                }else{
                    this.formRight.huahengMoney=res.data.huaHenBaoE
                }
                this.formLeft.sanze=res.data.sanZheBaoFei
                this.formLeft.sanzeMoney=res.data.sanZheBaoE
                if(res.data.sanZheBaoE==''||res.data.sanZheBaoE=='0'||!res.data.sanZheBaoE){
                    this.formLeft.sanzeMoney='0'
                }else{
                    this.formLeft.sanzeMoney=res.data.sanZheBaoE
                }
                this.formRight.fanbei=res.data.showSanZheJieJiaRiBaoFei
                if(res.data.showSanZheJieJiaRiBaoFei==''||res.data.showSanZheJieJiaRiBaoFei=='0'||!res.data.showSanZheJieJiaRiBaoFei){
                    this.formRight.fanbeiMoney='0'
                }else{
                    this.formRight.fanbeiMoney='1'
                }
                this.formRight.sanfang=res.data.hcSanFangTeYueBaoFei
                this.formRight.sanfangMoney=res.data.hcSanFangTeYueBaoE
                if(res.data.hcSanFangTeYueBaoE==''||res.data.hcSanFangTeYueBaoE=='0'||!res.data.hcSanFangTeYueBaoE){
                    this.formRight.sanfangMoney='0'
                }else{
                    this.formRight.sanfangMoney='1'
                }
                this.formRight.xiuli=res.data.hcXiuLiChangBaoFei
                this.formRight.xiuliMoney=res.data.hcXiuLiChangType
                if(res.data.hcXiuLiChangType==''||res.data.hcXiuLiChangType=='0'||!res.data.hcXiuLiChangType){
                    this.formRight.xiuliMoney='0'
                }else{
                    this.formRight.xiuliMoney=res.data.hcXiuLiChangType
                }
                // this.formRight.xin=res.data.sheBeiSunShi
                // if(res.data.sheBeiSunShi==''){
                //     this.formRight.xinMoney='0'
                // }else{
                //     this.formRight.xinMoney='1'
                // }
                this.formRight.sheshui=res.data.sheShuiBaoFei
                this.formRight.sheshuiMoney=res.data.sheShuiBaoE
                if(res.data.sheShuiBaoE==''||res.data.sheShuiBaoE=='0'||!res.data.sheShuiBaoE){
                    this.formRight.sheshuiMoney='0'
                }else{
                    this.formRight.sheshuiMoney='1'
                }
                this.formRight.sheshuiFreeMoney=res.data.buJiMianSheShuiBaoFei
                if(res.data.buJiMianSheShuiBaoFei==''||res.data.buJiMianSheShuiBaoFei=='0'||!res.data.buJiMianSheShuiBaoFei){
                    this.formRight.sheshuiFree=false
                }else{
                    this.formRight.sheshuiFree=true
                }
                this.formLeft.siji=res.data.siJiBaoFei
                this.formLeft.sijiMoney=res.data.siJiBaoE
                if(res.data.siJiBaoE==''||res.data.siJiBaoE=='0'||!res.data.siJiBaoE){
                    this.formLeft.sijiMoney='0'
                }else{
                    this.formLeft.sijiMoney=res.data.siJiBaoE
                }
                this.formRight.ziran=res.data.ziRanBaoFei
                this.formRight.ziranMoney=res.data.ziRanBaoE
                if(res.data.ziRanBaoE==''||res.data.ziRanBaoE=='0'||!res.data.ziRanBaoE){
                    this.formRight.ziranMoney='0'
                }else{
                    this.formRight.ziranMoney=res.data.ziRanBaoE
                }
                this.formLeft.jiaoqiang=res.data.forceTotal,
                this.formLeft.shangye=res.data.taxTotal,
                this.formRight.jiaoStart=res.data.forceStartDate
                this.formRight.shangStart=res.data.businessStartDate
            })
        }
    },
    mounted(){
        this.getQuoteByClientId()
    }
}
</script>

<style lang="scss" scoped>
    .reOffer{
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba($color: #000000, $alpha: .7);
        .reOfferCont{
            background: white;
            width: 900px;
            border-radius: 5px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            h2{
                height: 60px;
                line-height: 60px;
                padding: 0 15px;
                box-sizing: border-box;
                font-size: 16px;
                border-bottom: 1px solid #ccc;
                font-weight: 700;
                i{
                    float: right;
                    line-height:60px;
                    cursor: pointer;
                    height: 60px;
                    display: inline-block;
                }
            }
            table{
                width: 100%;
                text-align: center;
                font-size: 12px;
                padding:  10px;
                .red{
                    color: red;
                    text-align: center !important;
                    font-weight: bold;
                }
                tr{
                    line-height: 34px;
                    td{
                        max-width: 120px;
                        .title{
                            min-width: 80px;
                        }
                    }
                }
                tr td:first-child{
                    text-align: right;
                }
            }
            .btn{
                text-align: center;
                margin: 10px 0 20px;
            }
        }
    }
</style>


