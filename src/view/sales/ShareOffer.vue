<template>
    <div class="ShareOffer">
        <div class="ShareOfferCont">
            <h2>分享报价 <i @click="closeShare" class="el-icon-close"></i></h2>
            <el-row type="flex" class="row" v-loading="loading">
                <el-col :span="13">    
                    <table class="table">
                        <tr>
                            <td><p>车牌号码:</p></td>
                            <td>{{data.licenseNo}}</td>
                            <td><p>保险公司:</p></td>
                            <td>
                                <el-select size="small" @change="change" v-model="insuranceCompany" placeholder="请选择">
                                    <el-option
                                    v-for="item in company"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td><p>交强险优惠:</p></td>
                            <td>
                                <el-select size="small" disabled @change="change" v-model="mandatory" placeholder="请选择">
                                    <el-option
                                    v-for="item in jQdiscount"
                                    :key="item"
                                    :label="item+'%'"
                                    :value="item">
                                    </el-option>
                                </el-select>
                            </td>
                            <td><p>商业险优惠:</p></td>
                            <td>
                                <el-select size="small" v-if="role!=30" @change="syxYouhui" v-model="business" placeholder="请选择">
                                    <el-option
                                    v-for="item in sYdiscount"
                                    :key="item"
                                    :label="item+'%'"
                                    :value="item">
                                    </el-option>
                                </el-select>
                                <el-select size="small" v-if="role!=20" @change="syxYouhui" v-model="business" placeholder="请选择">
                                    <el-option
                                    v-for="item in sYdiscount2"
                                    :key="item"
                                    :label="item+'%'"
                                    :value="item">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td><p>应收金额:</p></td>
                            <td><el-input size="small" @change="should" readonly v-model="shouldMoney"></el-input></td>
                            <td><p>优惠后实收:</p></td>
                            <td>
                                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
                                <el-form-item  prop="age">
                                    <el-input v-model.number="ruleForm.age" size="small" @change="submitForm('ruleForm',ruleForm.age)"></el-input>
                                </el-form-item>
                                <!-- <el-form-item>
                                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                                </el-form-item> -->
                                </el-form>
                                <!-- <el-input size="small" @input="fina" class="fina"  v-model="finallyMoney"></el-input> -->
                            </td>
                        </tr>
                        <tr>
                            <td><p>优惠活动:</p></td>
                            <td colspan="3">
                                <el-select disabled size="small" @change="change" v-model="activity" placeholder="请选择">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top"><p>报价内容:</p></td>
                            <td colspan="4" >
                                <el-input
                                type="textarea"
                                :rows="8"
                                 @change="change"
                                placeholder="请输入内容"
                                v-model="textarea">
                                </el-input>
                            </td>
                        </tr>
                        <tr>
                            <td><p>客户电话:</p></td>
                            <td colspan="2">
                                <el-input type="text" size="small" @change="change" v-model="phone"></el-input>
                            </td>
                            <td align="right">
                                <el-button type="danger" size="small">发送短信</el-button>
                            </td>
                        </tr>
                    </table>
                    
                </el-col> 
                <el-col :span="11" >
                    <div class="mobileBox">
                        <h3>报价单预览</h3>
                        <div  class="mobile" ref="mobile">
                            <!-- <div class="qrCode" > -->
                            <div class="cph">
                                <p>{{data.licenseNo}}</p>
                            </div>
                            <div class="money">
                                <van-row>
                                    <van-col span="8"><img src="../../assets/images/zgpa.png" ></van-col>
                                    <van-col span="8"><p></p></van-col>
                                    <van-col span="8"><p>实收<span>¥{{finallyMoney|tofixed}}</span></p></van-col>
                                </van-row>
                            </div>
                            <div class="carMsg">
                                <img src="../../assets/images/carMsg.png" >
                                <p><span>车牌号</span><span>{{data.licenseNo}}</span></p>
                                <p><span>车主姓名</span><span>{{data.licenseOwner}}</span></p>
                                <p><span>品牌型号</span><span>{{data.modleName}}</span></p>
                                <p><span>商业险出险</span><span>---</span></p>
                                <p><span>交强险出险</span><span>---</span></p>
                                <p><span>商业险起保时间</span><span>{{getdata.businessStartDate}}</span></p>
                                <p><span>交强险起保时间</span><span>{{getdata.forceStartDate}}</span></p>
                            </div>
                            <div class="insurMsg">
                                <img src="../../assets/images/insurDetail.png" >
                                <table>
                                    <thead>
                                        <tr>
                                            <th align='left' style="text-indent:10px;">险种名称</th>
                                            <th>保额</th>
                                            <th>不计免赔</th>
                                            <th>保费</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="getdata.sanZheBaoE!=0">
                                            <td align='left' style="text-indent:10px;">三者险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sanZheBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianSanZheBaoE}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sanZheBaoFei}}</td>
                                        </tr>
                                        <tr  v-if="getdata.cheSunBaoE!=0">
                                            <td align='left' style="text-indent:10px;">机动车损失保险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.cheSunBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianCheSunBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.cheSunBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.siJiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">司机座位险</td>
                                            <td  align='right' style="padding-right:20px;">{{getdata.siJiBaoE|montyType}}</td>
                                            <td  align='right' style="padding-right:20px;">{{getdata.buJiMianSiJiBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.siJiBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.chengKeBaoE!=0">
                                            <td align='left' style="text-indent:10px;">乘客座位险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.chengKeBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianChengKeBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.chengKeBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.daoQiangBaoE!=0">
                                            <td align='left' style="text-indent:10px;">盗抢险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.daoQiangBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianDaoQiangBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.daoQiangBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.huaHenBaoE!=0">
                                            <td align='left' style="text-indent:10px;">划痕险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.huaHenBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianHuaHenBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.huaHenBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.boLiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">玻璃单独破碎险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.boLiBaoE|montyType}}</td>
                                            <td></td>
                                            <td align='right' style="padding-right:20px;">{{getdata.boLiBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.sheShuiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">涉水行驶损失险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sheShuiBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianSheShuiBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sheShuiBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.ziRanBaoE!=0">
                                            <td align='left' style="text-indent:10px;">自燃损失险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.ziRanBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianZiRanBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.ziRanBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.hcSanFangTeYueBaoE!=0">
                                            <td align='left' style="text-indent:10px;">车损无法找到第三方险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcSanFangTeYueBaoE|montyType}}</td>
                                            <td></td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcSanFangTeYueBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.hcXiuLiChangBaoE!=0">
                                            <td align='left' style="text-indent:10px;">指定修理厂险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcXiuLiChangBaoE|montyType2}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcXiuLiChangType|montyType3}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcXiuLiChangBaoE}}</td>
                                        </tr>
                                        <tr v-if="getdata.sheBeiSunShiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">新增设备损失险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sheBeiSunShiBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.bjmSheBeiSunShiBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sheBeiSunShiBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.fybcBaoE!=0">
                                            <td align='left' style="text-indent:10px;">修理期间费用补偿</td>
                                            <td align='right' style="padding-right:20px;">投保</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.fybcBaoE}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.fybcDaysBaoFei}}天</td>
                                        </tr>
                                        <tr v-if="getdata.showSanZheJieJiaRiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">三责险附加法定节假日</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.showSanZheJieJiaRiBaoFei}}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td  align='left' style="text-indent:10px;" colspan="3">商业险合计<span>(含不计免赔)</span></td>
                                            <td>{{getdata.bizTotal|tofixed}}</td>
                                        </tr>
                                        <tr>
                                            <td align='left' style="text-indent:10px;" colspan="3">车船税合计</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.taxTotal|tofixed}}</td>
                                        </tr>
                                        <tr>
                                            <td align='left' style="text-indent:10px;" colspan="3">交强险合计</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.forceTotal|tofixed}}</td>
                                        </tr>
                                        <tr>
                                            <td align='left' style="text-indent:10px;" colspan="3">保费合计</td>
                                            <td  align='right' style="padding-right:20px;">{{getdata.zongjine|tofixed}}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="4" class="should">
                                                本次应收<b>{{getdata.zongjine|tofixed}}元</b>
                                            </td>
                                        </tr>
                                        <tr v-if="(getdata.zongjine-finallyMoney)!=0">
                                            <td colspan="4" class="youhui">
                                                本次优惠<b>{{Number(getdata.zongjine-finallyMoney).toFixed(2)}}元</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="4" class="finally">
                                                实收<b>{{Number(finallyMoney).toFixed(2)}}元</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                            </div>
                            <div  class="mobile2" ref="mobile2">
                            <!-- 截图区域 -->
                            <!-- <div class="qrCode" > -->
                            <div class="cph">
                                <p>{{data.licenseNo}}</p>
                            </div>
                            <div class="money">
                                <van-row>
                                    <van-col span="8"><img src="../../assets/images/zgpa.png" ></van-col>
                                    <van-col span="8"><p></p></van-col>
                                    <van-col span="8"><p>实收<span>¥{{finallyMoney|tofixed}}</span></p></van-col>
                                </van-row>
                            </div>
                            <div class="carMsg">
                                <img src="../../assets/images/carMsg.png" >
                                <p><span>车牌号</span><span>{{data.licenseNo}}</span></p>
                                <p><span>车主姓名</span><span>{{data.licenseOwner}}</span></p>
                                <p><span>品牌型号</span><span>{{data.modleName}}</span></p>
                                <p><span>商业险出险</span><span>---</span></p>
                                <p><span>交强险出险</span><span>---</span></p>
                                <p><span>商业险起保时间</span><span>{{getdata.businessStartDate}}</span></p>
                                <p><span>交强险起保时间</span><span>{{getdata.forceStartDate}}</span></p>
                            </div>
                            <div class="insurMsg">
                                <img src="../../assets/images/insurDetail.png" >
                                <table>
                                    <thead>
                                        <tr>
                                            <th align='left' style="text-indent:10px;">险种名称</th>
                                            <th>保额</th>
                                            <th>不计免赔</th>
                                            <th>保费</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="getdata.sanZheBaoE!=0">
                                            <td align='left' style="text-indent:10px;">三者险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sanZheBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianSanZheBaoE}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sanZheBaoFei}}</td>
                                        </tr>
                                        <tr  v-if="getdata.cheSunBaoE!=0">
                                            <td align='left' style="text-indent:10px;">机动车损失保险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.cheSunBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianCheSunBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.cheSunBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.siJiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">司机座位险</td>
                                            <td  align='right' style="padding-right:20px;">{{getdata.siJiBaoE|montyType}}</td>
                                            <td  align='right' style="padding-right:20px;">{{getdata.buJiMianSiJiBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.siJiBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.chengKeBaoE!=0">
                                            <td align='left' style="text-indent:10px;">乘客座位险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.chengKeBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianChengKeBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.chengKeBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.daoQiangBaoE!=0">
                                            <td align='left' style="text-indent:10px;">盗抢险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.daoQiangBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianDaoQiangBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.daoQiangBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.huaHenBaoE!=0">
                                            <td align='left' style="text-indent:10px;">划痕险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.huaHenBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianHuaHenBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.huaHenBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.boLiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">玻璃单独破碎险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.boLiBaoE|montyType}}</td>
                                            <td></td>
                                            <td align='right' style="padding-right:20px;">{{getdata.boLiBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.sheShuiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">涉水行驶损失险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sheShuiBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianSheShuiBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sheShuiBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.ziRanBaoE!=0">
                                            <td align='left' style="text-indent:10px;">自燃损失险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.ziRanBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.buJiMianZiRanBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.ziRanBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.hcSanFangTeYueBaoE!=0">
                                            <td align='left' style="text-indent:10px;">车损无法找到第三方险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcSanFangTeYueBaoE|montyType}}</td>
                                            <td></td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcSanFangTeYueBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.hcXiuLiChangBaoE!=0">
                                            <td align='left' style="text-indent:10px;">指定修理厂险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcXiuLiChangBaoE|montyType2}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcXiuLiChangType|montyType3}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.hcXiuLiChangBaoE}}</td>
                                        </tr>
                                        <tr v-if="getdata.sheBeiSunShiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">新增设备损失险</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sheBeiSunShiBaoE|montyType}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.bjmSheBeiSunShiBaoFei}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.sheBeiSunShiBaoFei}}</td>
                                        </tr>
                                        <tr v-if="getdata.fybcBaoE!=0">
                                            <td align='left' style="text-indent:10px;">修理期间费用补偿</td>
                                            <td align='right' style="padding-right:20px;">投保</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.fybcBaoE}}</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.fybcDaysBaoFei}}天</td>
                                        </tr>
                                        <tr v-if="getdata.showSanZheJieJiaRiBaoE!=0">
                                            <td align='left' style="text-indent:10px;">三责险附加法定节假日</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.showSanZheJieJiaRiBaoFei}}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td  align='left' style="text-indent:10px;" colspan="3">商业险合计<span>(含不计免赔)</span></td>
                                            <td>{{getdata.bizTotal|tofixed}}</td>
                                        </tr>
                                        <tr>
                                            <td align='left' style="text-indent:10px;" colspan="3">车船税合计</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.taxTotal|tofixed}}</td>
                                        </tr>
                                        <tr>
                                            <td align='left' style="text-indent:10px;" colspan="3">交强险合计</td>
                                            <td align='right' style="padding-right:20px;">{{getdata.forceTotal|tofixed}}</td>
                                        </tr>
                                        <tr>
                                            <td align='left' style="text-indent:10px;" colspan="3">保费合计</td>
                                            <td  align='right' style="padding-right:20px;">{{getdata.zongjine|tofixed}}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="4" class="should">
                                                本次应收<b>{{getdata.zongjine|tofixed}}元</b>
                                            </td>
                                        </tr>
                                        <tr v-if="(getdata.zongjine-finallyMoney)!=0">
                                            <td colspan="4" class="youhui">
                                                本次优惠<b>{{Number(getdata.zongjine-finallyMoney).toFixed(2)}}元</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="4" class="finally">
                                                实收<b>{{Number(finallyMoney).toFixed(2)}}元</b>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="tel">
                                    <van-row>
                                        <van-col span='4'><img src="../../assets/images/user.png"></van-col>
                                        <van-col span='16'>
                                            <h2>{{info.username}}</h2>
                                            <p>{{info.userphone}}</p>
                                        </van-col>
                                        <van-col span='4'>
                                            <a href="javascript:;"><img src="../../assets/images/phone.png"></a>
                                        </van-col>
                                    </van-row>
                                <!-- </div> -->
                                </div>
                            </div>
                            
                            </div>
                            <div class="tel">
                                <van-row>
                                    <van-col span='4'><img src="../../assets/images/user.png"></van-col>
                                    <van-col span='16'>
                                        <h2>{{info.username}}</h2>
                                        <p>{{info.userphone}}</p>
                                    </van-col>
                                    <van-col span='4'>
                                        <a href="javascript:;"><img src="../../assets/images/phone.png"></a>
                                    </van-col>
                                </van-row>
                            <!-- </div> -->
                            </div>
                            </div>
                            <div class="btn" v-clickoutside="handleClose">
                                <div class="qrcodePosition">
                                    <div id="qrcode" ref="qrcode"></div>
                                    <el-button size="mini" type="primary" v-clipboard:copy="txtHref"
                                    v-clipboard:success="onCopy"
                                    v-clipboard:error="onError">
                                    复制链接
                                    </el-button>
                                    <div class="triangle"></div>
                                </div>
                                <el-button style="font-size:14px;" size="small" type="danger">申请核价</el-button>
                                <span> </span>
                                <el-button size="small" type="primary"  @click="shareH5">分享H5页面</el-button>
                                <span> </span>
                                <el-button @click="getPic" size="small" type="primary">生成图片</el-button>
                                
                            </div>
                        </div>
                    <!-- <QrCode v-show="false"/> -->
                    
                </el-col>
            </el-row>
        </div>
        <div ref="test"  class="images" v-show="false" v-viewer="{movable: false}" >
            <!-- <viewer :images="outputs"  id="viewer-box" style="z-index:1999;" > -->
            <img :src="output"  width="600">
            <!-- </viewer> -->
        </div>
    </div>
</template>

<script>
    const clickoutside = {
	  bind(el, binding, vnode) {
	    function documentHandler(e) {
	  // 这里判断点击的元素是否是本身，是本身，则返回
	      if (el.contains(e.target)) {
	        return false;
	  }
	  // 判断指令中是否绑定了函数
	      if (binding.expression) {
	  // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
	        binding.value(e);
	      }
	 }
	 // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
	    el.__vueClickOutside__ = documentHandler;
	    document.addEventListener('click', documentHandler);
	  },
	  update() {},
	  unbind(el, binding) {
	 // 解除事件监听
	    document.removeEventListener('click', el.__vueClickOutside__);
	    delete el.__vueClickOutside__;
	  },
	};
import QrCode from './QrCode'
import QRCode from 'qrcodejs2'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import Vue from 'vue'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import BScroll from 'better-scroll'
import getUrl from '@/assets/js/getUrl.js';
Vue.use(Viewer);
Viewer.setDefaults({
  zIndexInline: 2017,
  
})
export default {
    name:'ShareOffer',
    directives: {clickoutside},
    props:{
        orderId:String,
        clientId:String,
        data:Object,
        clientCarins:Object,
        khid:String,
        map:Object
    },
    components:{
        QrCode
    },
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
        var checkAge = (rule, value, callback) => {
            if (!value) {
            return callback(new Error('金额不能为空'));
            }
            setTimeout(() => {
            if (typeof(value)!='number') {
                callback(new Error('请输入数字值'));
            } else {
                if (value > this.shouldMoney) {
                callback(new Error('金额过大'));
                } else {
                callback();
                }
            }
            }, 500);
        };
        return{
            role:'',
            rules: {
                age: [
                    { validator: checkAge, trigger: 'change' }
                ]
            },
            ruleForm:{
                age: ''
            },
            getdata:{},
            company:[
                {label:'中国平安',value:'中国平安'}
            ],
            shouldMoney:'',
            jQdiscount:[],
            finallyMoney:'',
            sYdiscount:[],
            sYdiscount2:[],
            outputs:[],
            picShow:false,
            licenseNumber:'湘A55L90',
            insuranceCompany:'中国平安',
            mandatory:'',
            activityMoney:'3',
            business:'',
            activity:'暂无',
            preferential:'6',
            phone:'',
            textarea:'',
            options: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
                }],
            value: '',
            share:false,
            output: null,
            viewer:null,
            timer:null,
            youhui:'',
            youhuihou:'',
            loading:false,
            time:'',
            shangyexian:'',
            info:{},
            txtHref:null
        }
    },
    methods:{
        submitForm(formName,val) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.fina(val)
            } else {
                // console.log('error submit!!');
                return false;
            }
            });
        },
        syxYouhui(val){
            //商业险优惠
            // console.log(val)
            this.finallyMoney=Number(Number(this.shouldMoney-(this.shangyexian*0.01*val)).toFixed(2))
            this.ruleForm.age=Number(Number(this.shouldMoney-(this.shangyexian*0.01*val)).toFixed(2))
        },
        should(val){
            //应收金额
            // this.finallyMoney=val
            this.finallyMoney=Number(val-(val*0.01*this.business))
            this.ruleForm.age=Number(val-(val*0.01*this.business))
        },
        getPic(){
            //生成图片
            // this.picShow=true
            let self = this
            let ref = this.$refs.mobile2 // 截图区域
            this.$html2canvas(ref, {
                backgroundColor: 'white'
            }).then((canvas) => {
                let dataURL = canvas.toDataURL("image/png")
                // Viewer.setDefaults({
                // Options: { "inline": false, "button": false, "navbar": false, "title": false, "toolbar": false, "tooltip": false, "movable": true, "zoomable": false, "rotatable": false, "scalable": false, "transition": false, "fullscreen": false, "keyboard": false, "url": dataURL }
                // })
                self.output = dataURL
                self.outputs.push(dataURL)
            }).then(()=>{
                clearTimeout(this.timer)
                let num=parseInt(Math.random()*5+2)
                // //console.log(num)
                this.timer=setTimeout(()=>{
                    self.viewer = self.$el.querySelector('.images').$viewer
                    self.viewer.show()
                },100)
            })
            
        },
        getQuoteByClientId(){
            //获取报价内容
            this.loading=true
            let data={
                licenseNo:this.data.licenseNo,
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
                // this.getdata=res.data
                this.shangyexian=Number(res.data.bizTotal).toFixed(2)
                this.shouldMoney=(Number(res.data.bizTotal)+Number(res.data.forceTotal)+Number(res.data.taxTotal)).toFixed(2)
                this.finallyMoney=(Number(res.data.bizTotal)+Number(res.data.forceTotal)+Number(res.data.taxTotal)).toFixed(2)
                this.ruleForm.age=Number((Number(res.data.bizTotal)+Number(res.data.forceTotal)+Number(res.data.taxTotal)).toFixed(2))
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
                    this.textarea='尊敬的'+this.data.licenseNo+'车主,您的车险即将到期，保险报价:'+jqx+chechuan+syx+chesun+sanzhe+daoqiang+siji+chengke+huahen+boli+ziran+sheshui+sanfang+zhiding+buchang+bujiMian+sum
                // this.textarea='尊敬的'+this.data.licenseNo+'车主,您的车险即将到期，保险报价:交强险:'+res.data.jqx+'元,车船税'+res.data.taxTotal+'元,商业险:'+res.data.syx+'元,其中车损'+res.data.cheSunBaoE+'元。三者'+res.data.sanZheBaoE+'元,保额'+res.data.sanZheBaoFei+'元。盗抢险'+res.data.daoQiangBaoE+'元.司机座位险'+res.data.siJiBaoE+'元,保额'+res.data.siJiBaoFei+'元。乘客座位险'+res.data.chengKeBaoE+'元,保额'+res.data.chengKeBaoFei+'元.划痕'+res.data.huaHenBaoE+'元,保额'+res.data.huaHenBaoFei+'元。玻璃'+res.data.boLiBaoE+'元。自然'+res.data.ziRanBaoE+'元。涉水险'+res.data.sheShuiBaoE+'元。车损无法找到第三方险'+res.data.hcSanFangTeYueBaoE+'元。指定修理厂险'+res.data.hcXiuLiChangBaoE+'元。修理期间费用补偿险'+res.data.fybcBaoE+'元。不计免赔总额'+res.data.bizTotal+'元(车损、三者、司机、乘客、盗抢、划痕、涉水、自燃)。本次应收保费共'+this.shouldMoney+'元,优惠后实交保费'+this.finallyMoney+'元(含交强和税)。联系人：'+JSON.parse(window.sessionStorage.getItem('role')).username+',联系电话：'+JSON.parse(window.sessionStorage.getItem('role')).userphone
            })
        },
        handleClose(){
            //隐藏二维码
            // this.qrcode.clear();
            $('#qrcode').html("")
            this.share=false
            $('.qrcodePosition').css('display','none')
        },
        closeShare(){
            //关闭分享
            this.$emit('close',false)
        },
        change(){
            //报价信息改动
            this.share=false
        },
        oCopy(obj){  
            //复制链接
            var Url2=document.getElementById("txtUrl");
            Url2.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            alert("复制成功!");  
        },
        qrcode () {
            var host = window.location.host;
            this.txtHref='http://cai2019.csgxcf.com:9666/dist/#/QrCode?finally='+this.finallyMoney+'&licenseNo='+this.data.licenseNo+'&orderId='+this.orderId+'&clientId='+this.clientId+'&name='+JSON.parse(window.sessionStorage.getItem('role')).username+'&phone='+JSON.parse(window.sessionStorage.getItem('role')).userphone+'&userid='+JSON.parse(window.sessionStorage.getItem('role')).userid
            
            // this.txtHref='http://'+host+'/#/QrCode?finally='+this.finallyMoney+'&licenseNo='+this.data.licenseNo+'&orderId='+this.orderId+'&clientId='+this.clientId+'&name='+JSON.parse(window.sessionStorage.getItem('role')).username+'&phone='+JSON.parse(window.sessionStorage.getItem('role')).userphone+'&userid='+JSON.parse(window.sessionStorage.getItem('role')).userid
            
            let qrcode = new QRCode('qrcode',{
            width: 130, // 设置宽度，单位像素
            height: 130, // 设置高度，单位像素
            id:'canvas',
            text: 'http://cai2019.csgxcf.com:9666/dist/#/QrCode?finally='+this.finallyMoney+'&licenseNo='+this.data.licenseNo+'&orderId='+this.orderId+'&clientId='+this.clientId+'&name='+JSON.parse(window.sessionStorage.getItem('role')).username+'&phone='+JSON.parse(window.sessionStorage.getItem('role')).userphone+'&userid='+JSON.parse(window.sessionStorage.getItem('role')).userid// 设置二维码内容或跳转地址
            })

            // let qrcode = new QRCode('qrcode',{
            // width: 130, // 设置宽度，单位像素
            // height: 130, // 设置高度，单位像素
            // id:'canvas',
            // text: 'http://'+host+'/#/QrCode?finally='+this.finallyMoney+'&licenseNo='+this.data.licenseNo+'&orderId='+this.orderId+'&clientId='+this.clientId+'&name='+JSON.parse(window.sessionStorage.getItem('role')).username+'&phone='+JSON.parse(window.sessionStorage.getItem('role')).userphone+'&userid='+JSON.parse(window.sessionStorage.getItem('role')).userid// 设置二维码内容或跳转地址
            // })
        },
        onCopy () {//复制二维码链接
        this.$message({
            message: `复制成功！`,
            type: 'success'
        });
        // this.snackBar.info(this.$t('prompt.copySuccess'))
        },
        onError () {
            this.$message.error(this.$t('prompt.copyFail'))
        },  
        fina(val){//实收金额输入
            var reg=/^\d+$/; //判断字符串是否为数字
            if(Number(val)>=Number(this.shouldMoney)||!reg.test(val)){
                // console.log(111)
                return false
            }
            if(val!=this.shouldMoney){
                this.business=Number(((val-this.shouldMoney)/this.shouldMoney)*-100).toFixed(2)+'%'
            }
        } ,
        shareH5(){
            //生成二维码
            if(this.share){
                return
            }
            this.$nextTick(() => {
                $('#qrcode').html("")
                this.qrcode()
                this.share=true
                let way=2;
                let data={
                    orderId:this.orderId,
                    way:way,
                    rebate:this.business,
                    money:this.finallyMoney,
                    content:this.textarea,
                    image:this.outputs,
                    userid:JSON.parse(window.sessionStorage.getItem('role')).userid
                }
                this.$axios({
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: getUrl()+'insertQuoteRecord',
                    data:this.$Qs.stringify(data)
                }).then(res=>{
                    //console.log(res)
                })
            })
            $('.qrcodePosition').css('display','block')
        }
    },
    mounted(){
        this.info=JSON.parse(window.sessionStorage.getItem('role'))
        this.role=JSON.parse(window.sessionStorage.getItem('role')).userrole
        // this.finallyMoney=this.should
        $('.qrCode').css('height',$('.row').height()-$('.btn').height()-$('h3').height())
        $('.mobile').css('height',$('.row').height()-$('.btn').height()-$('h3').height())
        $('.mobileBox').css('height',$('.row').height()-$('h3').height())
        this.getQuoteByClientId()
        let time= new Date()
        let year=time.getFullYear()
        let mon=time.getMonth()+1
        let day=time.getDate()
        this.time=year+'-'+mon+'-'+day
        for(let i=0;i<=20;i++){
            this.jQdiscount.push(i),
            this.sYdiscount.push(i)
        }
        for(let i=0;i<=10;i++){
            this.sYdiscount2.push(i)
        }
        // this.scroll= new BScroll (this.$refs.mobile, {click: true})
    }
}
</script>

<style lang="scss" scoped>
    .ShareOffer{
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba($color: #000000, $alpha: .7);
        .picBox{
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba($color: #000000, $alpha: .7);
            .pic{
                position: absolute;
                left: 50%;
                top:50%;
                // transform: translateX(-50%,-50%) !important;
                margin: -25%;
            }
        }
        .ShareOfferCont{
            background: white;
            width: 900px;
            border-radius: 5px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .row{
                height: 450px;
            }
            .mobile2{
                position: fixed;
                top: 0;
                left: -1000%;
                width: 380px;
                // .qrCode{
                    font-size: 12px;
                    background: #F2F2F2;
                    .cph{
                        background-image: url('../../assets/images/banner.png');
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                        position: relative;
                        height: 157px !important;
                        p{
                            position: absolute;
                            left: 160px !important;
                            bottom: 17px;
                            font-size: 12px;
                            color: #036BA6;
                            font-weight: bold;
                        }
                    }
                    .money{
                        height: 50px;
                        background: white;
                        padding:5px;
                        img{
                            width: 100px;
                            height: 50px;
                        }
                        p{
                            color: #CF1D0F;
                            text-align: right;
                            height: 50px;
                            line-height: 44px;
                            font-size: 12px;
                            span{
                                font-size: 18px;
                            }
                            
                        }
                    }
                    .insurMsg{
                        background: white;
                        margin: 10px;
                        padding-bottom: 10px;
                        table{
                            width: 100%;
                            text-align: center;
                            line-height: 17px;
                            font-size: 14px;
                            color: #333333;
                            span{
                                color: #999999;
                            }
                            .youhui{
                                text-align: right;
                                padding-right:15px;
                                line-height:20px;
                                b{
                                    color: #ccc !important;
                                    font-size: 12px;
                                    font-weight: normal;
                                    
                                }
                            }
                            .should{
                                text-align: right;
                                padding-right:15px;  
                                text-decoration: line-through;
                                line-height: 24px;
                                b{
                                    color: rgb(226, 145, 39) !important;
                                    font-size: 14px;
                                    font-weight: normal;
                                }
                            }
                            .finally{
                                text-align: right;
                                padding-right:15px;
                                line-height: 24px;
                                b{
                                    color: #CF1D0F;
                                    font-size: 18px;
                                    font-weight: normal;
                                }
                            }
                            
                        }
                        img{
                            margin: 10px 0 0 10px;
                            width: 102px;
                        }
                        p{
                            display: flex;
                            margin: 0 10px;
                            line-height: 17px;
                            font-size: 14px;
                            color: #333333;
                            justify-content: space-between;
                        }
                    }
                    .carMsg{
                        background: white;
                        margin: 10px;
                        padding-bottom: 10px;
                        img{
                            margin: 10px 0 0 10px;
                            width: 102px;
                        }
                        p{
                            display: flex;
                            margin: 0 10px;
                            line-height: 17px;
                            font-size: 14px;
                            color: #333333;
                            justify-content: space-between;
                        }
                    }
                    .tel{
                        background: white;
                        margin: 10px;
                        height: 50px;
                        img{
                            width: 26px;
                            margin-top: 10px;
                            margin-left: 20px;
                        }
                        h2{
                            color: #333333;
                            font-size: 15px;
                            margin-top: 5px;
                            height: 20px;
                            border:none;
                            line-height: 20px !important;
                        }
                        p{
                            color: #999999;
                            font-size: 14px;
                            height: 20px;
                            line-height: 20px !important;
                        }
                    // }
                        
                    // }
                }
            }
            .mobile{
                position: relative;
                // .qrCode{
                    font-size: 12px;
                    // height: 100%;
                    overflow: auto;
                    background: #F2F2F2;
                    .cph{
                        background-image: url('../../assets/images/banner.png');
                        background-size: 100% 100%;
                        background-repeat: no-repeat;
                        position: relative;
                        height: 157px !important;
                        p{
                            position: absolute;
                            left: 167px;
                            bottom: 17px;
                            font-size: 12px;
                            color: #036BA6;
                            font-weight: bold;
                        }
                    }
                    .money{
                        height: 50px;
                        background: white;
                        padding:5px;
                        img{
                            width: 100px;
                            height: 50px;
                        }
                        p{
                            color: #CF1D0F;
                            text-align: right;
                            height: 50px;
                            line-height: 44px;
                            font-size: 12px;
                            span{
                                font-size: 18px;
                            }
                            
                        }
                    }
                    .insurMsg{
                        background: white;
                        margin: 10px;
                        padding-bottom: 10px;
                        table{
                            width: 100%;
                            text-align: center;
                            line-height: 17px;
                            font-size: 14px;
                            color: #333333;
                            span{
                                color: #999999;
                            }
                            .should{
                                text-align: right;
                                text-decoration: line-through;
                                padding-right:15px;
                                line-height: 24px;
                                b{
                                    color: rgb(226, 145, 39) !important;
                                    font-size: 14px;
                                    font-weight: normal;
                                }
                            }
                            .youhui{
                                text-align: right;
                                padding-right:15px;
                                line-height:20px;
                                b{
                                    color: #ccc !important;
                                    font-size: 12px;
                                    font-weight: normal;
                                    
                                }
                            }
                            .finally{
                                text-align: right;
                                padding-right:15px;
                                line-height: 24px;
                                b{
                                    color: #CF1D0F;
                                    font-size: 18px;
                                    font-weight: normal;
                                }
                            }
                        }
                        img{
                            margin: 10px 0 0 10px;
                            width: 102px;
                        }
                        p{
                            display: flex;
                            margin: 0 10px;
                            line-height: 17px;
                            font-size: 14px;
                            color: #333333;
                            justify-content: space-between;
                        }
                    }
                    .carMsg{
                        background: white;
                        margin: 10px;
                        padding-bottom: 10px;
                        img{
                            margin: 10px 0 0 10px;
                            width: 102px;
                        }
                        p{
                            display: flex;
                            margin: 0 10px;
                            line-height: 17px;
                            font-size: 14px;
                            color: #333333;
                            justify-content: space-between;
                        }
                    }
                    .tel{
                        background: white;
                        margin: 10px;
                        height: 50px;
                        img{
                            width: 26px;
                            margin-top: 10px;
                            margin-left: 20px;
                        }
                        h2{
                            color: #333333;
                            font-size: 15px;
                            margin-top: 5px;
                            height: 20px;
                            border:none;
                            line-height: 20px !important;
                        }
                        p{
                            color: #999999;
                            font-size: 14px;
                            height: 20px;
                            line-height: 20px !important;
                        }
                    // }
                        
                    // }
                }
            }
            .mobileBox{
                position: relative;
            }
            .btn{
                position: absolute;
                text-align: center;
                bottom: -10px;
                left:50%;
                width: 100%;
                margin-left: -50%;
                
            }
            .qrcodePosition{
                background: white;
                padding: 10px;
                display: none;
                position: absolute;
                left:20%;
                top:-160px;
                .triangle{
                    width:0;
                    height:0;
                    border-width:10px 10px 0;
                    border-style:solid;
                    border-color:white transparent transparent;/*黄 透明 透明 */
                    position:absolute;
                    bottom:-10px;
                    left:50%;
                    transform: translateX(-50%);
                }
                
            }
            h3{
                font-size: 12px;
                line-height: 20px;
            }
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
            .table{
                padding: 20px 10px;
                box-sizing: border-box;
                width: 100%;
                tr{
                    line-height: 40px;
                    td{
                        font-size: 12px;
                        p{
                            font-size: 12px;
                            text-align: right;
                            padding-right: 10px;
                            width: 80px;
                        }
                    }
                }
                
            }
        }
        
    }
</style>


