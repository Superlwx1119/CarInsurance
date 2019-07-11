<template>
    <div class="offerAuto">
        <div class="reOfferCont">
            <h2>自动报价 <i @click="closeOffer" class="el-icon-close"></i></h2>
            <el-row type="flex" v-loading="loading">
                <el-col :span="10">
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
                            <!-- <td><p class="title">车险保费</p></td> -->
                            <td><p class="title">不计免赔</p></td>
                            <!-- <td><p class="title">不计免赔保费</p></td> -->
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
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
                            <!-- <td>
                                <el-input size="mini" v-if="formLeft.chesunMoney!=0" type="text" v-model="formLeft.chesun"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox v-model="formLeft.chesunFree"  v-if="formLeft.chesunMoney!=0" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini" type="text" v-if="formLeft.chesunMoney!=0&&formLeft.chesunFree" v-model="formLeft.chesunFreeMoney"></el-input>
                            </td> -->
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
                            <!-- <td>
                                <el-input size="mini" v-if="formLeft.sanzeMoney!=0" type="text" v-model="formLeft.sanze"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox v-model="formLeft.sanzeFree" v-if="formLeft.sanzeMoney!=0" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini" type="text" v-if="formLeft.sanzeMoney!=0&&formLeft.sanzeFree"  v-model="formLeft.sanzeFreeMoney"></el-input>
                            </td> -->
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
                            <!-- <td>
                                <el-input size="mini" v-if="formLeft.sijiMoney!=0" type="text" v-model="formLeft.siji"></el-input>
                                
                            </td> -->
                            <td>
                                <el-checkbox v-model="formLeft.sijiFree" v-if="formLeft.sijiMoney!=0" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini" type="text" v-if="formLeft.sijiMoney!=0&&formLeft.sijiFree" v-model="formLeft.sijiFreeMoney"></el-input>
                            </td> -->
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
                            <!-- <td>
                                <el-input size="mini" v-if="formLeft.chengkeMoney!=0" type="text" v-model="formLeft.chengke"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox v-model="formLeft.chengkeFree" v-if="formLeft.chengkeMoney!=0" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini" type="text" v-if="formLeft.chengkeMoney!=0&&formLeft.chengkeFree" v-model="formLeft.chengkeFreeMoney"></el-input>
                            </td> -->
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
                            <!-- <td>
                                <el-input size="mini" v-if="formLeft.qiangdaoMoney!=0" type="text" v-model="formLeft.qiangdao"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox v-model="formLeft.qiangdaoFree" v-if="formLeft.qiangdaoMoney!=0" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini" type="text" v-if="formLeft.qiangdaoMoney!=0&&formLeft.qiangdaoFree" v-model="formLeft.qiangdaoFreeMoney"></el-input>
                            </td> -->
                        </tr>
                        <!-- <tr>
                            <td><p class="red">交强险</p></td>
                            <td><el-input size="mini" type="text" v-model="formLeft.jiaoqiang"></el-input></td>
                        </tr>
                        <tr>
                            <td><p class="red">车船税</p></td>
                            <td><el-input size="mini" type="text" v-model="formLeft.shangye"></el-input></td>
                        </tr> -->
                    </table>
                </el-col>
                <el-col :span="14">
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
                                        placeholder="选择日期">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2"><p class="red">附加险</p></td>
                            <!-- <td><p >车险保费</p></td> -->
                            <td><p >不计免赔</p></td>
                            <!-- <td><p >不计免赔保费</p></td> -->
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
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
                            <!-- <td>
                                <el-input size="mini" v-if="formRight.huahengMoney!=0" type="text" v-model="formRight.huaheng"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox v-model="formRight.huahengFree" v-if="formRight.huahengMoney!=0" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini" type="text" v-if="formRight.huahengMoney!=0&&formRight.huahengFree"  v-model="formRight.huahengFreeMoney"></el-input>
                            </td> -->
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
                            <!-- <td>
                                <el-input  v-if="false" size="mini" type="text" v-model="formRight.boli"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox  v-if="false" v-model="formRight.boliFree" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini"  v-if="false" type="text" v-model="formRight.boliFreeMoney"></el-input>
                            </td> -->
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
                            <!-- <td>
                                <el-input size="mini" v-if="formRight.ziranMoney!=0" type="text" v-model="formRight.ziran"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox v-model="formRight.ziranFree" v-if="formRight.ziranMoney!=0" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini" type="text" v-if="formRight.ziranMoney!=0&&formRight.ziranFree" v-model="formRight.ziranFreeMoney"></el-input>
                            </td> -->
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
                            <!-- <td>
                                <el-input v-if="formRight.sheshuiMoney!=0" size="mini" type="text" v-model="formRight.sheshui"></el-input>


                            </td> -->
                            <td>
                                <el-checkbox v-if="formRight.sheshuiMoney!=0" v-model="formRight.sheshuiFree"  ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input v-if="formRight.sheshuiMoney!=0&&formRight.sheshuiFree" size="mini" type="text" v-model="formRight.sheshuiFreeMoney"></el-input>
                            </td> -->
                        </tr>
                        <tr>
                            <td><p>车损无法找到第三方险</p></td>
                            <td>
                                <el-select @change="diSanfang" v-model="formRight.sanfangMoney" size="mini" placeholder="请选择">
                                    <el-option
                                    v-for="item in formRight.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <!-- <td>
                                <el-input v-if="false" size="mini" type="text" v-model="formRight.sanfang"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox  v-if="false" v-model="formRight.sanfangFree" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input  v-if="false" size="mini" type="text" v-model="formRight.sanfangFreeMoney"></el-input>
                            </td> -->
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
                                <el-select clearable v-if="formRight.xiuliMoney!=-1" v-model="formRight.xiuli" size="mini" placeholder="请选择">
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
                            <!-- <td>
                                <el-input  v-if="false" size="mini" type="text" v-model="formRight.zhidingFreeMoney"></el-input>
                            </td> -->
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
                            <!-- <td>
                                <el-input v-if="formRight.xinMoney!=0" size="mini" type="text" v-model="formRight.xin"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox v-if="formRight.xinMoney!=0" v-model="formRight.xinFree" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini" v-if="formRight.xinMoney!=0&&formRight.xinFree" type="text" v-model="formRight.xinFreeMoney"></el-input>
                            </td> -->
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
                            <td colspan="3" class="tdSmall" >
                                <el-row type="flex" v-if="formRight.buchangMoney!=0">
                                    <el-col>
                                        <el-select v-model="formRight.buchang" size="mini" placeholder="请选择">
                                            <el-option
                                            v-for="item in formRight.xiuliMoneytype"
                                            :key="item"
                                            clearable
                                            :label="item"
                                            :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col><p style="width:30px;">元×</p></el-col>
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
                            <!-- <td>
                                <el-input v-if="false" size="mini" type="text" v-model="formRight.fanbei"></el-input>
                            </td> -->
                            <td>
                                <el-checkbox  v-if="false" v-model="formRight.fanbeiFree" ></el-checkbox>
                            </td>
                            <!-- <td>
                                <el-input size="mini"  v-if="false" type="text"  v-model="formRight.fanbeiFreeMoney"></el-input>
                            </td> -->
                        </tr>
                    </table>
                </el-col>
            </el-row>
            <div class="btn">
                <el-button class="edit" @click="saveQuote">提交报价</el-button>
            </div>
            
        </div>
        <el-dialog title="新增设备"  :modal='false' :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="设备名称" >
                <el-input v-model="form.dN1" size="small"></el-input>
                </el-form-item>
                <el-form-item label="设备数量" >
                <el-input v-model="form.dQ1" size="small"></el-input>
                </el-form-item>
                <el-form-item label="设备N1的金额小计(单价乘以数量)" >
                <el-input v-model="form.dA1" size="small"></el-input>
                </el-form-item>
                <el-form-item label="购买时间">
                    <el-date-picker
                        v-model="form.pD1"
                        size="small"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="设备类型" >
                <el-select v-model="form.dT1" size="small" placeholder="请选择活动区域">
                    <el-option label="国产" value="0"></el-option>
                    <el-option label="进口" value="1"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="实际价值(折扣价值)" >
                <el-input v-model="form.dD1" size="small"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible(false)">取 消</el-button>
                <el-button type="primary" @click="dialogVisible(true)">确 定</el-button>
            </div>
            </el-dialog>
    </div>
</template>

<script>
import getUrl from '@/assets/js/getUrl.js';
import commod from '@/assets/js/commod.js';
export default {
    name:'OfferAuto',
    props:{
        licenseNo:String,
        orderId:String,
        khid:String,
        order:Object,
        data:Object,
        lastYearData:Object
    },
    data(){
        return{
            UserInfo:{},
            localData:{},
            map:{},
            formLabelWidth: '120px',
            form:{
                dN1:'',
                dQ1:'',
                dA1:'',
                pD1:'',
                dT1:'',
                dD1:''
            },
            dialogTableVisible: false,
            dialogFormVisible: false,
            loading:false,
            formLeft:{
                jiaoqiang:'',
                shangye:'',
                company:2,
                want:2,
                depreciation:'',
                negotiation:'',
                chesun:'0',
                chesunMoney:'0',
                chesunFree:false,
                chesunFreeMoney:'',
                sanzeFreeMoney:'',
                sanzeFree:false,
                sanze:'0',
                sanzeMoney:'0',
                siji:'0',
                sijiMoney:'0',
                sijiFree:false,
                sijiFreeMoney:'',
                chengke:'0',
                chengkeMoney:'0',
                chengkeFree:false,
                chengkeFreeMoney:'',
                qiangdao:'0',
                qiangdaoMoney:'0',
                qiangdaoFree:false,
                qiangdaoFreeMoney:'0',
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
                huahengMoney:'0',
                boliMoney:'0',
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
                zdxlcxtype:'',
                boliFree:false,
                boliFreeMoney:'',
                boliOptions:[
                    {label:'不投保',value:'0'},
                    {label:'国产',value:'1'},
                    {label:'进口',value:'2'},
                ],
                ziran:'0',
                ziranMoney:'0',
                ziranFree:false,
                ziranFreeMoney:'',
                sheshui:'0',
                sheshuiMoney:'0',
                sheshuiFree:false,
                sheshuiFreeMoney:'',
                sanfang:'0',
                sanfangMoney:'0',
                sanfangFree:false,
                sanfangFreeMoney:'',
                zhiding:'0',
                zhidingMoney:'0',
                zhidingFree:false,
                zhidingFreeMoney:'',
                zhidingOptions:[
                    {label:'不投保',value:'-1'},
                    {label:'国产',value:'0'},
                    {label:'进口',value:'1'},
                ],
                xin:'0',
                xinMoney:'0',
                xinFree:false,
                xinFreeMoney:'',
                xiuli:'',
                xiuliMoney:'-1',
                xiuliMoneytype:[100,200,300],
                buchang:'',
                buchangMoney:'0',
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
        dialogVisible(close){
            //新增设备险
            if(close){
                this.dialogFormVisible=false
                this.formRight.xinMoney='1'
            }else{
                this.dialogFormVisible=false
                this.formRight.xinMoney='0'
                this.form.dN1=''
                this.form.dQ1=''
                this.form.dA1=''
                this.form.dT1=''
                this.form.dD1=''
                this.form.pD1=''
            }
        },
        closeOffer(){
            //关闭
            this.$emit('close',false)
        },
        diSanfang(val){
            if(this.formLeft.chesunMoney=='0'&&val==1){
                this.$message.error('请先选择投保车损险!');
                this.formRight.sanfangMoney='0'
                return false
            }
        },
        sheshui(val){
            //console.log(val)
            if(val==0){
                this.formRight.sheshuiMoney=''
                this.formRight.sheshuiFree=false
            }
        },
        sanze(val){
            //console.log(val)
            if(val==0){
                this.formLeft.sanze=''
                this.formLeft.sanzeFree=false
            }
        },
        xin(val){
            //console.log(val)
            if(val==0){
                this.formRight.xinFree=false
                this.formRight.xin=''
            }else{
                this.dialogFormVisible=true
            }
        },
        ziran(val){
            //console.log(val)
            if(val==0){
                this.formRight.ziranFree=false
                this.formRight.ziran=''
            }
        },
        huaheng(val){
            //console.log(val)
            if(val==0){
                this.formRight.huahengFree=false
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
                this.formRight.sijiFree=false
            }
        },
        qiangdao(val){
            //console.log(val)
            if(val==0){
                this.formLeft.qiangdao=''
                this.formRight.qiangdaoFree=false
            }
        },
        zhiding(val){
            //console.log(val)
            if(val==-1){
                this.formRight.xiuli=''
                this.formRight.xiuliFree=false
            }else if(val==1){
                this.formRight.zhidingchang=[
                    {label:'15%',value:'0.15'},
                    {label:'20%',value:'0.2'},
                    {label:'30%',value:'0.3'},
                    {label:'40%',value:'0.4'},
                    {label:'50%',value:'0.5'},
                    {label:'60%',value:'0.6'},
                ]
            }else if(val==0){
                this.formRight.zhidingchang=[
                    {label:'10%',value:'0.1'},
                    {label:'15%',value:'0.15'},
                    {label:'20%',value:'0.2'},
                    {label:'25%',value:'0.25'},
                    {label:'30%',value:'0.3'},
                ]
            }
        },
        chengke(val){
            //console.log(val)
            if(val==0){
                this.formLeft.chengke=''
                this.formLeft.chengkeFree=false
            }
        },
        chesun(val){
            //console.log(val)
            if(val==0){
                this.formLeft.chesun=''
                this.formLeft.chesunFree=false
            }
        },
        selectCompany(val){
            //选择保险公司
            // console.log(val)
        },
        saveQuote(){
            //报价信息保存
            
            let chesunFree=''
            let qiangdaoFree=''
            let sanzeFree=''
            let sijiFree=''
            let chengkeFree=''
            let huahengFree=''
            let sheshuiFree=''
            let ziranFree=''
            let xinFree=''
            let forceTax=''
            if(this.formLeft.chesunFree){//不计免车损
                chesunFree='1'
            }else{
                chesunFree='0'
            }
            if(this.formLeft.qiangdaoFree){//不计免盗抢
                qiangdaoFree='1'
            }else{
                qiangdaoFree='0'
            }
            if(this.formLeft.sanzeFree){//不计免三者
                sanzeFree='1'
            }else{
                sanzeFree='0'
            }
            if(this.formLeft.sijiFree){//不计免司机
                sijiFree='1'
            }else{
                sijiFree='0'
            }
            if(this.formLeft.chengkeFree){//不计免乘客
                chengkeFree='1'
            }else{
                chengkeFree='0'
            }
            if(this.formRight.huahengFree){//不计免划痕
                huahengFree='1'
            }else{
                huahengFree='0'
            }
            if(this.formRight.sheshuiFree){//不计免涉水
                sheshuiFree='1'
            }else{
                sheshuiFree='0'
            }
            console.log(this.formRight.ziranFree)
            if(this.formRight.ziranFree){//不计免自然
                ziranFree='1'
            }else{
                ziranFree='0'
            }
            if(this.formRight.xinFree){//不计免设备
                xinFree='1'
            }else{
                xinFree='0'
            }
            // if(this.formLeft.sanzeMoney!=0||this.formLeft.qiangdaoMoney!=0||this.formLeft.sijiMoney!=0||this.formLeft.chengkeMoney!=0||this.formRight.huahengMoney!=0||this.formRight.ziranMoney!=0||this.formRight.boliMoney!=0){
            //     forceTax='0'
            // }else if(){
            //     forceTax='1'
            // }
            if(this.formRight.shangStart==''||this.formRight.jiaoStart==''){
                this.$message.error('请先选择保险起保时间!');
                return 
            }
            this.loading=true
            let data={
                licenseNo:this.licenseNo,
                carOwnersName:this.data.licenseOwner,
                idCard:this.data.credentislasNum,
                ownerIdCardType:this.data.idType,
                quoteGroup:'2',
                submitGroup:'2',
                insuredName:this.data.insuredName,
                insuredIdCard:this.data.insuredIdCard,
                insuredIdType:'1',
                holderIdCard:this.data.holderIdCard,
                holderName:this.data.postedName,
                holderIdType:this.data.holderIdType,
                cityCode:'54',
                engineNo:this.data.engineNo,
                carVin:this.data.carVin,
                registerDate:this.data.registerDate,
                moldName:this.data.modleName,
                forceTax:'1',
                bizTimeStamp:Math.round(new Date(this.formRight.shangStart) / 1000),
                forceTimeStamp:Math.round(new Date(this.formRight.jiaoStart) / 1000),
                boLi:this.formRight.boliMoney,
                buJiMianCheSun:chesunFree,
                buJiMianDaoQiang:qiangdaoFree,
                buJiMianSanZhe:sanzeFree,
                buJiMianChengKe:chengkeFree,
                buJiMianSiJi:sijiFree,
                buJiMianHuaHen:huahengFree,
                buJiMianSheShui:sheshuiFree,
                buJiMianZiRan:ziranFree,
                buJiMianJingShenSunShi:'0',
                sheShui:this.formRight.sheshuiMoney,
                huaHen:this.formRight.huahengMoney,
                siJi:this.formLeft.sijiMoney,
                chengKe:this.formLeft.chengkeMoney,
                cheSun:this.formLeft.chesunMoney,
                daoQiang:this.formLeft.qiangdaoMoney,
                sanZhe:this.formLeft.sanzeMoney,
                ziRan:this.formRight.ziranMoney,
                quoteParalelConflict:'0',
                hcSanFangTeYue:this.formRight.sanfangMoney,
                hcXiuLiChang:this.formRight.xiuli,
                hcXiuLiChangType:this.formRight.xiuliMoney,
                fybc:this.formRight.buchang,
                fybcDays:this.formRight.xiulitian,
                sheBeiSunShi:this.formRight.xinMoney,
                bjmSheBeiSunShi:xinFree,
                sanZheJieJiaRi:this.formRight.sanfangMoney,
                dN1:this.form.dN1,
                dQ1:this.form.dQ1,
                dA1:this.form.dA1,
                pD1:this.form.pD1,
                dT1:this.form.dT1,
                dD1:this.form.dD1,userid:JSON.parse(window.sessionStorage.getItem('role')).userid,
                purchasePrice:this.data.purchasePrice
            }
            if(data.hcXiuLiChang.indexOf('%')>0){
                data.hcXiuLiChang=((data.hcXiuLiChang.substring(data.hcXiuLiChang.length-3,data.hcXiuLiChang.length-1))/100).toString()
            }
            // console.log(data)
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'precisePrice',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res)
                
                if(res.data.BusinessStatus==1){
                    this.getPrecisePrice()
                }else{
                    this.loading=false
                    this.$notify.error({
                    title: '错误',
                    message: res.data.StatusMessage
                    });
                }
            })
        },
        getPrecisePrice(){
            //获取报价
            let data={
                licenseNo:this.licenseNo,
                quoteGroup:'2',
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
                // timeFormat:'1',
                // showEmail:'1',
                // showXiuLiChangType:'1',
                // showVehicleInfo:'1',
                // showCarInfo:'1',
                // showFybc:'1',
                // showSheBei:'1',
                // renewalCarType:'0',
                // showTotalRate:'1',
                // showRepeatSubmit:'1',
                // showEndDate:'1',
                // showAnXinYanChe:'1',
                // showSanZheJieJiaRi:'1',
                // showBuJiMianFuJia:'1'
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getPrecisePrice',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                console.log(res)
                this.loading=false
                if(res.data.BusinessStatus==1&&res.data.Item.QuoteStatus>0){
                    this.localData=res.data.Item
                    this.UserInfo=res.data.UserInfo
                    // this.closeOffer()
                    this.saveQuoteLocal()
                    this.$notify({
                    title: '成功',
                    message: res.data.StatusMessage,
                    type: 'success'
                    });
                }
                if(res.data.BusinessStatus==1&&res.data.Item.QuoteStatus==0){
                    this.quotePramsAdjust(res.data.Item.QuoteResult)
                    this.$message({
                    message: res.data.Item.QuoteResult,
                    type: 'warning'
                    });
                }
            })
        },
        quotePramsAdjust(str){//返回报价错误,重新赋值时间
            let data={
                quoteResult:str
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'quotePramsAdjust',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                console.log(res)
                if(res.data!='error'){
                    
                    this.formRight.jiaoStart=res.data.endTime
                    this.formRight.shangStart=res.data.endTime
                }
            })
        },
        saveQuoteLocal(){
            //报价信息储存本地
            let data={
                id:'',
                quoteBadge:'1',
                clientInfoId:this.$route.params.khid,
                licenseNo:this.licenseNo,
                source:this.localData.source,
                fybc:'',
                cheSunBaoFei:this.localData.CheSun.BaoFei,
                sanZheBaoFei:this.localData.SanZhe.BaoFei,
                daoQiangBaoFei:this.localData.DaoQiang.BaoFei,
                siJiBaoFei:this.localData.SiJi.BaoFei,
                fybcBaoE:'',
                fybcDaysBaoFei:'',
                chengKeBaoFei:this.localData.ChengKe.BaoFei,
                boLiBaoFei:this.localData.BoLi.BaoFei,
                huaHenBaoFei:this.localData.HuaHen.BaoFei,
                buJiMianCheSunBaoFei:this.localData.BuJiMianCheSun.BaoFei,
                buJiMianSanZheBaoFei:this.localData.BuJiMianSanZhe.BaoFei,
                buJiMianDaoQiangBaoFei:this.localData.BuJiMianDaoQiang.BaoFei,
                sheShuiBaoFei:this.localData.SheShui.BaoFei,
                ziRanBaoFei:this.localData.ZiRan.BaoFei,
                buJiMianChengKeBaoFei:this.localData.BuJiMianChengKe.BaoFei,
                buJiMianSiJiBaoFei:this.localData.BuJiMianSiJi.BaoFei,
                buJiMianHuaHenBaoFei:this.localData.BuJiMianHuaHen.BaoFei,
                buJiMianSheShuiBaoFei:this.localData.BuJiMianSheShui.BaoFei,
                buJiMianZiRanBaoFei:this.localData.BuJiMianZiRan.BaoFei,
                hcSanFangTeYueBaoFei:this.localData.HcSanFangTeYue.BaoFei,
                hcXiuLiChangBaoFei:this.localData.HcXiuLiChang.BaoFei,
                hcXiuLiChangType:this.localData.HcXiuLiChang.BaoE,
                showSanZheJieJiaRiBaoE:'',
                showSanZheJieJiaRiBaoFei:'',
                sheBeiSunShiBaoFei:this.localData.HcSheBeiSunshi.BaoFei,
                bjmSheBeiSunShiBaoFei:'',
                forceTotal:this.localData.ForceTotal,
                taxTotal:this.localData.TaxTotal,
                cheSunBaoE:this.localData.CheSun.BaoE,
                sanZheBaoE:this.localData.SanZhe.BaoE,
                siJiBaoE:this.localData.SiJi.BaoE,
                chengKeBaoE:this.localData.ChengKe.BaoE,
                daoQiangBaoE:this.localData.DaoQiang.BaoE,
                huaHenBaoE:this.localData.HuaHen.BaoE,
                boLiBaoE:this.localData.BoLi.BaoE,
                ziRanBaoE:this.localData.ZiRan.BaoE,
                sheShuiBaoE:this.localData.SheShui.BaoE,
                hcSanFangTeYueBaoE:this.localData.HcSanFangTeYue.BaoE,
                zdxlcxtype:'',
                sheBeiSunShiBaoE:this.localData.HcSheBeiSunshi.BaoE,
                forceStartDate:this.UserInfo.ForceStartDate,
                businessStartDate:this.UserInfo.BusinessStartDate
            }
            
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'saveQuote',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res)
                // if(res.data.status==1){
                    let data={licenseNo:this.licenseNo}
                    let source={source:this.formLeft.company}
                    this.$emit('newOffer',source)
                    this.$emit('close')
                    this.$emit('reloadTwo',data)
                    this.$emit('reload')
                // }
            })
        },
        // getAgentNewSource(){
        //     let data={
        //         citycode:'54'
        //     }
        //     this.$axios({
        //         headers:{'Content-Type':'application/x-www-form-urlencoded'},
        //         method: 'post',
        //         url: getUrl()+'getAgentNewSource',
        //         data:this.$Qs.stringify(data)
        //     }).then(res=>{
        //         // console.log(res)
        //     })
        // },
        getlastYearData(){//上年投保信息
             
            
            if(this.lastYearData.cheSun==0||this.lastYearData.cheSun==''){
                this.formLeft.chesunMoney='0'
            }else{
                this.formLeft.chesunMoney='1'
            }
            
            if(this.lastYearData.sanZhe==0||this.lastYearData.sanZhe==''){
                this.formLeft.sanzeMoney='0'
            }else{
                this.formLeft.sanzeMoney=this.lastYearData.sanZhe
            }
            
            if(this.lastYearData.siJi==0||this.lastYearData.siJi==''){
                this.formLeft.sijiMoney='0'
            }else{
                this.formLeft.sijiMoney=this.lastYearData.siJi
            }
            
            if(this.lastYearData.chengKe==0||this.lastYearData.chengKe==''){
                this.formLeft.chengkeMoney='0'
            }else{
                this.formLeft.chengkeMoney=this.lastYearData.chengKe
            }
            // this.formLeft.qiangdaoMoney=this.lastYearData.daoQiang
            if(this.lastYearData.daoQiang==0||this.lastYearData.daoQiang==''){
                this.formLeft.qiangdaoMoney='0'
            }else{
                this.formLeft.qiangdaoMoney='1'
            }
            
            if(this.lastYearData.huaHen==0||this.lastYearData.huaHen==''){
                this.formLeft.huahengMoney='0'
            }else{
                this.formRight.huahengMoney=this.lastYearData.huaHen
            }
            
            if(this.lastYearData.boLi==0||this.lastYearData.boLi==''){
                this.formLeft.boliMoney='0'
            }else{
                this.formRight.boliMoney=this.lastYearData.boLi
            }
            // this.formRight.ziranFree=this.lastYearData.ziRan
            if(this.lastYearData.ziRan==0||this.lastYearData.ziRan==''){
                this.formRight.ziranFree='0'
            }else{
                this.formRight.ziranFree='1'
            }
            // this.formRight.sheshuiFree=this.lastYearData.sheShui
            if(this.lastYearData.sheShui==0||this.lastYearData.sheShui==''){
                this.formRight.sheshuiFree='0'
            }else{
                this.formRight.sheshuiFree='1'
            }
            // this.formRight.sanfangMoney=this.lastYearData.hcSanFangTeYue
            if(this.lastYearData.hcSanFangTeYue==0||this.lastYearData.hcSanFangTeYue==''){
                this.formRight.sanfangMoney='0'
            }else{
                this.formRight.sanfangMoney='1'
            }
            // this.formRight.xinMoney=this.lastYearData.sheBeiSunShi
            if(this.lastYearData.sheBeiSunShi==0||this.lastYearData.sheBeiSunShi==''){
                this.formRight.xinMoney='0'
            }else{
                this.formRight.xinMoney='1'
            }
            
            if(this.lastYearData.hcXiuLiChangType==0||this.lastYearData.hcXiuLiChangType==''){
                this.formRight.xiuliMoney='-1'
            }else{
                this.formRight.xiuliMoney=this.lastYearData.hcXiuLiChangType
            }
            if(this.lastYearData.hcXiuLiChang==0||this.lastYearData.hcXiuLiChang==''){
                this.formRight.xiuli=''
            }else{
                this.formRight.xiuli=this.lastYearData.hcXiuLiChang*100+'%'
            }
            this.formRight.buchang=this.lastYearData.xzsbssxtype
            this.formRight.xiulitian=this.lastYearData.fybcDays
            // this.formRight.fanbeiMoney=this.lastYearData.sanZheJieJiaRi
            if(this.lastYearData.sanZheJieJiaRi==0||this.lastYearData.sanZheJieJiaRi==''){
                this.formRight.fanbeiMoney='0'
            }else{
                this.formRight.fanbeiMoney='1'
            }
            // console.log(this.data)
            let date1=new Date(this.data.forceExpireDate)
            let date2=new Date(this.data.businessExpireDate)
            let time1 = date1.getTime(date1)+86400000;
            let time2 = date2.getTime(date2)+86400000;
            function timestampToTime(timestamp) {//报价时间自动加一天
                var date = new Date(timestamp);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                return Y+M+D+h+m+s;
            }
            this.formRight.jiaoStart=timestampToTime(time1)
            this.formRight.shangStart=timestampToTime(time2)
            if(this.lastYearData.buJiMianCheSun=='1'){
                this.formLeft.chesunFree=true
            }else{
                this.formLeft.chesunFree=false
            }
            if(this.lastYearData.buJiMianSanZhe=='1'){
                this.formLeft.sanzeFree=true
            }else{
                this.formLeft.sanzeFree=false
            }
            if(this.lastYearData.buJiMianSiJi=='1'){
                this.formLeft.sijiFree=true
            }else{
                this.formLeft.sijiFree=false
            }
            if(this.lastYearData.buJiMianChengKe=='1'){
                this.formLeft.chengkeFree=true
            }else{
                this.formLeft.chengkeFree=false
            }
            if(this.lastYearData.buJiMianDaoQiang=='1'){
                this.formLeft.qiangdaoFree=true
            }else{
                this.formLeft.qiangdaoFree=false
            }
            if(this.lastYearData.buJiMianHuaHen=='1'){
                this.formRight.huahengFree=true
            }else{
                this.formRight.huahengFree=false
            }
            if(this.lastYearData.buJiMianSheShui=='1'){
                this.formRight.sheshuiFree=true
            }else{
                this.formRight.sheshuiFree=false
            }
            if(this.lastYearData.bjmSheBeiSunShi=='1'){
                this.formRight.xinFree=true
            }else{
                this.formRight.xinFree=false
            }
            if(this.lastYearData.buJiMianZiRan=='1'){
                this.formRight.ziranFree=true
            }else{
                this.formRight.ziranFree=false
            }
            if(this.lastYearData.xzsbssxtype==''){
                this.formRight.buchangMoney='0'
            }else{
                this.formRight.buchangMoney='1'
            }
            console.log(this.lastYearData)
            // console.log(this.formLeft.chengkeMoney,this.formLeft.sanzeMoney,this.formLeft.sijiMoney,this.formLeft.chengkeMoney, this.formLeft.qiangdaoMoney,  this.formRight.huahengMoney,this.formRight.boliMoney,this.formRight.ziranFree,this.formRight.sheshuiFree, this.formRight.sanfangMoney,        this.formRight.xinMoney,      this.formRight.xiuliMoney,      this.formRight.buchang,     this.formRight.xiulitian,  this.formRight.fanbeiMoney,        this.formRight.jiaoStart, this.formRight.shangStart)
        }
    },
    mounted(){
        // this.getAgentNewSource()
        this.getlastYearData()
    }
}
</script>

<style lang="scss" scoped>
    .offerAuto{
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


