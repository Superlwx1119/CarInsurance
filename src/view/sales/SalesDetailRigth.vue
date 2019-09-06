<template>
    <div class="orderDetail" id="orderContent"  @mousemove="showPro" v-loading="loading">
        <el-collapse-transition>
            <div v-show="calling" class="calling">
                <div class="callCont">
                    <div><p><i class="iconfont call">&#58949;</i></p><p>{{callNowState}}</p>
                    <!-- <p v-if="callingTime!=''||'00 : 00'">{{callingTime}}</p> -->
                    </div>
                    <div><el-button @click="stopHere" type="danger"><i class="iconfont stop">&#59132;</i>挂断</el-button></div>
                    <div><el-button @click="hidden">隐藏</el-button></div>
                    <!-- <div><el-button @click="stopHere('stop')" type="danger"><i class="iconfont stop">&#59132;</i>挂断并签出</el-button></div> -->
                </div>
            </div>
        </el-collapse-transition>
        <transition name="slide-fade">
            <div class="prograss" v-if="showPrograss"  >
                <p @click="dialogVisible(order.phone==''?order.otherphone:order.phone)">联系进度跟进</p>
            </div>
        </transition>
        <!-- <transition name="slide-fade">
            <div class="doCall" v-if="role==30&&showPrograss"  >
                <h2>操作面板</h2>
                <p><el-button type="primary" size="small" @click="login" ><i class="el-icon-success" style="padding-right:10px;"></i>签入</el-button></p>
                <p><el-button size="small" type="danger" @click="logout"><i class="el-icon-error" style="padding-right:10px;"></i>签出</el-button></p>
            </div>
        </transition> -->
        <el-dialog  :title="prograssTitel" width="40%" :visible.sync="dialogFormVisible" >
        <el-form :model="form">
            <el-form-item label="联系电话" :label-width="formLabelWidth">
                <div>
                    <el-input class="test" v-model="form.hiddenPhone"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="联系进度" :label-width="formLabelWidth">
                <el-cascader
                style="width:100%;"
                v-model="form.prograss"
                :options="schedules"
                clearable
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"></el-cascader>
                <!-- <el-select v-model="form.prograss" placeholder="请选择联系进度">
                    <el-option :key='index' :disabled="item.disabled" v-for="(item,index) of form.state" :label="item.label" :value="item.value"></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="联系方式" :label-width="formLabelWidth">
                <el-select v-model="ways" placeholder="请选择联系方式">
                    <el-option label="电话" value="电话"></el-option>
                    <el-option label="微信" value="微信"></el-option>
                </el-select>
                <!-- <el-input type="test" v-model="ways"></el-input> -->
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="contKind"></el-input>
            </el-form-item>
            <el-form-item label="下次联系时间" :label-width="formLabelWidth">
                <el-date-picker
                v-model="form.date"
                type="datetime"
                value-format="yyyyMMddHHmmss"
                @change="time"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div v-if="btnShow" slot="footer" class="dialog-footer">
            <el-button @click="insertOrderRecord(false)">取 消</el-button>
            <el-button type="primary" @click="insertOrderRecord(true)">确 定</el-button>
        </div>
        </el-dialog>
        <div class="customerInfo" >
            <el-dialog title="查看图片" :visible.sync="showBigImg">
                <img class="bigImg" :src="BigImg">
            </el-dialog>
            <h2>客户信息  <span class="red">(剩余跟进天数:{{order.remainingTime|remainingTime}}天)</span><a href="javascript:;"  @click="updateLicenseOwner">保存</a> </h2>
            <table>
                <tr>
                    <td><p>客户电话:</p></td>
                    <td>
                    <!-- <el-input v-if="role!=30"  size="mini" readonly v-model="order.phone"></el-input> -->
                    <el-popover
                        class="popover"
                        placement="right"
                        width="300"
                        trigger="hover">
                        <el-button style="margin-left:10px;"  type="primary" @click="callOut('bd')" size="mini">{{callout}}</el-button>
                        <el-button style="margin-left:10px;"  type="primary" @click="callOut('wd')" size="mini">外地号拨出</el-button>
                        <el-button style="margin-left:10px;"  type="danger" @click="stopHere" size="mini">挂断</el-button>
                        <el-input slot="reference" size="mini" readonly v-model="phoneNew"></el-input>
                        </el-popover>
                    </td>
                    <td><p>备注电话:</p></td>
                    <td>
                        <!-- <el-input v-if="role!=30"  size="mini" v-model="order.otherphone"></el-input> -->
                        <el-popover
                            placement="right"
                            width="300"
                            trigger="hover">
                            <el-button style="margin-left:10px;"  type="primary" @click="callHere('bd')" size="mini">{{callout}}</el-button>
                            <el-button style="margin-left:10px;"  type="primary" @click="callHere('wd')" size="mini">外地号拨出</el-button>
                            <el-button style="margin-left:10px;"  type="danger" @click="stopHere" size="mini">挂断</el-button>
                            <el-input slot="reference" size="mini" readonly v-model="otherPhoneNew"></el-input>
                        </el-popover>
                    </td>
                    <td  rowspan="6" valign='top'><p>记事本:</p></td>
                    <td rowspan="6" colspan="4">
                        <div class="noteBook">
                            <div class="note" style='height:251px;width:23vw;'>
                                <div class="title">
                                    <i class="el-icon-notebook-1">记事本</i>
                                    <span @click="saveNote" >保存</span>
                                </div>
                                <!-- <div class="content"> -->
                                    <!-- ssssss -->
                                    <el-input 
                                    type="textarea"
                                    :rows="10"
                                    placeholder="请输入内容"
                                    v-model="noteBook"></el-input>
                                <!-- </div> -->
                            </div>
                            <!-- <quill-editor 
                                v-model="content" 
                                ref="myQuillEditor" 
                                :options="editorOption" 
                                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                                @change="onEditorChange($event)">
                            </quill-editor> -->
                        </div>
                        <!-- <img v-if="showPic" @click="openImg1($event)" :src="sfzzm"> -->
                    </td>
                    <!-- <td  rowspan="3">
                        <img v-if="showPic"  @click="openImg1($event)" :src="sfzfm">
                    </td> -->
                    <td></td>
                    <!-- <td><p style="text-align:left">下载证件:</p></td> -->
                </tr>
                <tr>
                    <td><p>客户名称:</p></td>
                    <td><el-input size="mini" v-model="order.licenseOwner"></el-input></td>
                    <td><p>性别:</p></td>
                    <td>
                        <el-select size="mini" disabled v-model="order.licenseSex" placeholder="请选择">
                            <el-option label="暂无" value="0"></el-option>
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </td>
                    <td></td>
                    <!-- <td rowspan="3" valign="top" >
                        <img :src="imageUrls" @click="openImg1($event)" v-show="role==30||role==1">
                        <van-uploader class="spanUP" v-show="role==40" :disabled="role==30" :after-read="onRead4" accept="image/gif, image/jpeg" multiple>
                            <img v-if="imageUrl"  :src="imageUrls" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon plus"></i>
                        </van-uploader>
                        <a href="javascript:;" id="doLoadQr" @click="doLoadQr"><el-button type="primary"  v-if="role==30||role==1" size="small">下载单据</el-button></a>
                    </td> -->
                    <td style="visibility: hidden;"><el-input size="mini" v-model="name"></el-input></td>
                </tr>
                <tr>
                    <td><p>年龄:</p></td>
                    <td><el-input size="mini" readonly v-model="order.clientAge"></el-input></td>
                    <td><p>身份证:</p></td>
                    <td><el-input size="mini" v-model="data.credentislasNum"></el-input></td>
                    
                </tr>
                <tr>
                    <td valign="top"><p>匹配电话:</p></td>
                    <td colspan="3"  class="borderPhone">
                        <ul>
                            <li v-for="(item,index) in customerMsg.note" :key="index" @mousemove="item.addShow=true" @mouseleave="item.addShow=false">
                                <b v-if="item!='无匹配结果'" @click="copyPhone(item.dh)">{{item.dh|hiddenPhone}}</b>
                                <b v-else>无匹配结果</b>
                                <el-select v-if="item!='无匹配结果'" class="result" size="mini" @change="changeType(index,item,data.carVin)" v-model="customerMsg.selectData[index]" placeholder="是否本人">
                                    <el-option
                                    v-for="item in customerMsg.selects"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-if="item!='无匹配结果'" class="result" size="mini" @change="changeType(index,item,data.carVin)" v-model="customerMsg.local[index]" placeholder="号码归属">
                                    <el-option label="本地" value="0"></el-option>
                                    <el-option label="外地" value="1"></el-option>
                                </el-select>
                                <p v-show="item.addShow&&item!='无匹配结果'" @click="dialogVisible(item.dh)">添加联系进度</p>
                            </li>
                        </ul>
                    </td>
                    <!-- <td   valign='middle'><p>行驶证:</p></td> -->
                    <!-- <td class="img" >
                        <img v-if="showPic" @click="openImg1($event)" :src="xszzm">
                    </td>
                    <td class="img"  >
                        <img v-if="showPic" @click="openImg1($event)" :src="xszfm">
                    </td> -->
                </tr>
                <!-- <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <p><a href="javascript:;" id="downLoadPic"  @click="downLoadPic"><el-button size="small"  v-if="role==40||role==1" type="primary">全部下载<i class="el-icon-download"></i></el-button></a></p>
                    </td>
                </tr> -->
                <!-- <tr>
                    <td><p>客户备注2:</p></td>
                    <td colspan="3"><el-input size="mini" v-model="name"></el-input></td>
                </tr> -->
            </table>
            <!-- <h2>补充信息  </h2>
            <table>
                <tr>
                    <td><p>姓名:</p></td>
                    <td><el-input size="mini" readonly v-model="order.sideClientName"></el-input></td>
                    <td><p>证件号:</p></td>
                    <td><el-input size="mini" readonly v-model="order.sideCardNum"></el-input></td>
                    <td><p>起保日期:</p></td>
                    <td class="position">
                        <el-input size="mini" readonly v-model="order.sideQbdate"></el-input>
                    </td>
                </tr>
                <tr>
                    <td><p>发动机号:</p></td>
                    <td><el-input size="mini" readonly v-model="order.sideEngineNo"></el-input></td>
                    <td><p>电话一:</p></td>
                    <td><el-input size="mini" readonly v-model="order.sidePhone1"></el-input></td>
                    <td><p>电话二:</p></td>
                    <td class="position">
                        <el-input size="mini" readonly v-model="order.sidePhone2"></el-input>
                    </td>
                </tr>
            </table> -->
            <h2>车辆信息 <a href="javascript:;"  @click="saveCar">保存</a> </h2>
            <table>
                <tr>
                    <td><p>车牌号:</p></td>
                    <td><el-input size="mini" readonly v-model="order.licenseNo"></el-input></td>
                    <td><p>发动机号:</p></td>
                    <td><el-input size="mini" v-model="data.engineNo"></el-input></td>
                    <td><p>车架号:</p></td>
                    <td class="position">
                        <el-input size="mini" v-model="data.carVin"></el-input>
                        <!-- <span class="poBtn">车型校验</span> -->
                    </td>
                </tr>
                <tr>
                    <td><p>注册日期:</p></td>
                    <td>
                        <el-date-picker
                        v-model="data.registerDate"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                    </td>
                    <td><p>品牌型号:</p></td>
                    <td class="position">
                        <el-input size="mini" v-model="data.modleName"></el-input>
                        <!-- <span class="poBtn">车型查询</span> -->
                    </td>
                    <td><p>车型:</p></td>
                    <td><el-input size="mini" v-model="data.models"></el-input></td>
                </tr>
                <tr>
                    <td><p>新车购置价(¥):</p></td>
                    <td><el-input size="mini" v-model="data.purchasePrice"></el-input></td>
                    <td><p>座位数:</p></td>
                    <td><el-input size="mini" v-model="data.seatCount"></el-input></td>
                    <td><p>排量(L):</p></td>
                    <td><el-input size="mini" v-model="data.exhaustScale"></el-input></td>
                </tr>
                <!-- <tr>
                    <td><p>过户车:</p></td>
                    <td>
                        <el-radio v-model="carMsg.ifchange" label="1">是</el-radio>
                        <el-radio v-model="carMsg.ifchange" label="2">否</el-radio>
                    </td>
                    <td><p>贷款车:</p></td>
                    <td>
                        <el-radio v-model="carMsg.radio" label="1">是</el-radio>
                        <el-radio v-model="carMsg.radio" label="2">否</el-radio>
                    </td>
                </tr> -->
                <tr>
                    <td><p>备注:</p></td>
                    <td colspan="3"><el-input disabled size="mini" v-model="carMsg.note"></el-input></td>
                </tr>
            </table>
        </div>
        <div class="tabsMsg">
            <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <!-- <el-tab-pane label="上年投保信息" name="first" class="proYear">
                    <h2>上年投保信息<a href="javascript:;"  @click="saveCarins">保存</a></h2>
                    <table class="table">
                        <tr>
                            <td><p>投保公司:</p></td>
                            <td><el-input size="mini" v-model="clientCarins.source"></el-input></td>
                            <td><p>车主名称:</p></td>
                            <td><el-input size="mini" v-model="data.licenseOwner"></el-input></td>
                        </tr>
                        <tr>
                            <td><p>商业险到期时间:</p></td>
                            <td><el-input size="mini" v-model="data.businessExpireDate"></el-input></td>
                            <td><p>交强险到期时间:</p></td>
                            <td><el-input size="mini" v-model="data.forceExpireDate"></el-input></td>
                        </tr>
                        <tr>
                            <td><p>被保险人:</p></td>
                            <td><el-input size="mini" v-model="data.insuredName"></el-input></td>
                            <td><p>证件类型:</p></td>
                            <td><el-input size="mini" v-model="data.insuredIdType"></el-input></td>
                            <td><p>证件号码:</p></td>
                            <td><el-input size="mini" v-model="data.holderIdCard"></el-input></td>
                        </tr>
                        <tr>
                            <td><p>商业险保单号:</p></td>
                            <td><el-input size="mini" v-model="data.bizNo"></el-input></td>
                            <td><p>交强险保单号:</p></td>
                            <td><el-input size="mini" v-model="data.forceNo"></el-input></td>
                        </tr>
                    </table>
                    <table class="table2" border="1"  cellspacing="0">
                        <thead>
                            <th>承保险种 <span class="sanjiao">三交</span></th>
                            <th>保险金额/责任限额</th>
                            <th>保险费(元)</th>
                        </thead>
                        <tbody>
                            <tr >
                                <td>机动车损失保险</td>
                                <td :class="lastYearData.cheSun==0||''?'red':''">{{lastYearData.cheSun|montyType}}</td>
                                <td>{{lastYearData.clssbe}}</td>
                            </tr>
                            <tr >
                                <td>第三者责任险</td>
                                <td :class="lastYearData.sanZhe==0||''?'red':''">{{lastYearData.sanZhe|montyType}}</td>
                                <td>{{lastYearData.dszzrxbe}}</td>
                            </tr>
                            <tr >
                                <td>车上人员责任险(司机)</td>
                                <td :class="lastYearData.siJi==0||''?'red':''">{{lastYearData.siJi|montyType}}</td>
                                <td>{{lastYearData.sjzwxbe}}</td>
                            </tr>
                            <tr>
                                <td>车上人员责任险(乘客)</td>
                                <td :class="lastYearData.chengKe==0||''?'red':''">{{lastYearData.chengKe|montyType}}</td>
                                <td>{{lastYearData.ckzwxbe}}</td>
                            </tr>
                            <tr>
                                <td>盗抢险</td>
                                <td :class="lastYearData.daoQiang==0||''?'red':''">{{lastYearData.daoQiang|montyType}}</td>
                                <td>{{lastYearData.dqxbe}}</td>
                            </tr>
                            <tr>
                                <td>机动车损失不计免赔险</td>
                                <td :class="lastYearData.buJiMianCheSun==0||''?'red':''">{{lastYearData.buJiMianCheSun|montyType2}}</td>
                                <td>{{lastYearData.buJiMianCheSun}}</td>
                            </tr>
                            <tr>
                                <td>第三者责任不计免赔险</td>
                                <td :class="lastYearData.buJiMianSanZhe==0||''?'red':''">{{lastYearData.buJiMianSanZhe|montyType2}}</td>
                                <td>{{lastYearData.buJiMianSanZhe}}</td>
                            </tr>
                            <tr>
                                <td>司机座位不计免赔险</td>
                                <td :class="lastYearData.buJiMianSiJi==0||''?'red':''">{{lastYearData.buJiMianSiJi|montyType2}}</td>
                                <td>{{lastYearData.buJiMianSiJi}}</td>
                            </tr>
                            <tr >
                                <td>乘客座位不计免赔险</td>
                                <td :class="lastYearData.buJiMianChengKe==0||''?'red':''">{{lastYearData.buJiMianChengKe|montyType2}}</td>
                                <td>{{lastYearData.buJiMianChengKe}}</td>
                            </tr>
                            <tr >
                                <td>盗抢不计免赔险</td>
                                <td :class="lastYearData.buJiMianDaoQiang==0||''?'red':''">{{lastYearData.buJiMianDaoQiang|montyType2}}</td>
                                <td>{{lastYearData.buJiMianDaoQiang}}</td>
                            </tr>
                            <tr>
                                <td>划痕险</td>
                                <td :class="lastYearData.huaHen==0||''?'red':''">{{lastYearData.huaHen|montyType}}</td>
                                <td>{{lastYearData.hhxbe}}</td>
                            </tr>
                            <tr >
                                <td>划痕不计免赔险</td>
                                <td :class="lastYearData.buJiMianHuaHen==0||''?'red':''">{{lastYearData.buJiMianHuaHen|montyType2}}</td>
                                <td>{{lastYearData.buJiMianHuaHen}}</td>
                            </tr>
                            <tr>
                                <td>玻璃单独破碎险</td>
                                <td :class="lastYearData.boLi==0||''?'red':''">{{lastYearData.boLi|montyType}}</td>
                                <td>{{lastYearData.bldwbsxtype}}</td>
                            </tr>
                            <tr >
                                <td>自燃损失险</td>
                                <td :class="lastYearData.ziRan==0||''?'red':''">{{lastYearData.ziRan|montyType}}</td>
                                <td>{{lastYearData.zrssxtype}}</td>
                            </tr>
                            <tr>
                                <td>自燃损失不计免赔险</td>
                                <td :class="lastYearData.buJiMianZiRan==0||''?'red':''">{{lastYearData.buJiMianZiRan|montyType2}}</td>
                                <td>{{lastYearData.buJiMianZiRan}}</td>
                            </tr>
                            <tr>
                                <td>涉水行驶损失险</td>
                                <td :class="lastYearData.sheShui==0||''?'red':''">{{lastYearData.sheShui|montyType2}}</td>
                                <td>{{lastYearData.ssxsssxtype}}</td>
                            </tr>
                            <tr >
                                <td>涉水行驶损失不计免赔险</td>
                                <td :class="lastYearData.buJiMianSheShui==0||''?'red':''">{{lastYearData.buJiMianSheShui|montyType2}}</td>
                                <td>{{lastYearData.buJiMianSheShui}}</td>
                            </tr>
                            <tr>
                                <td>车损无法找到第三方险</td>
                                <td :class="lastYearData.hcSanFangTeYue==0||''?'red':''">{{lastYearData.hcSanFangTeYue|montyType}}</td>
                                <td>{{lastYearData.cswfzddsfxtype}}</td>
                            </tr>
                            <tr>
                                <td>新增设备损失险</td>
                                <td :class="lastYearData.sheBeiSunShi==0||''?'red':''">{{lastYearData.sheBeiSunShi|montyType}}</td>
                                <td>{{lastYearData.xzsbssxtype}}</td>
                            </tr>
                            <tr>
                                <td>指定修理厂险</td>
                                <td :class="lastYearData.hcXiuLiChang==0||''?'red':''">{{lastYearData.hcXiuLiChang|montyType4}}</td>
                                <td>{{lastYearData.zdxlcxtype}}</td>
                            </tr>
                            <tr >
                                <td>新增设备损失失不计免赔险</td>
                                <td :class="lastYearData.bjmSheBeiSunShi==0||''?'red':''">{{lastYearData.bjmSheBeiSunShi|montyType2}}</td>
                                <td>{{lastYearData.bjmSheBeiSunShi}}</td>
                            </tr>
                            <tr >
                                <td>修理期间费用补偿险</td>
                                <td>{{lastYearData.xzsbssxtype}}元</td>
                                <td>{{lastYearData.fybcDays}}天</td>
                            </tr>
                            <tr>
                                <td>三责险附加法定节假日</td>
                                <td :class="lastYearData.sanZheJieJiaRi==0||''?'red':''">{{lastYearData.sanZheJieJiaRi|montyType}}</td>
                                <td>{{lastYearData.sanZheJieJiaRi}}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-tab-pane> -->
                <!-- <el-tab-pane label="报价信息" name="second" class="offer">
                    <h2>关系人信息 <span class="red">(温馨提示：请确认关系人信息，如有误请修改后重新报价)</span> <a href="javascript:;" @click="saveQuote" >保存</a> </h2>
                    <div>
                        <div  class="ownerMsg">
                        <p>车主信息</p>
                        <el-checkbox v-model="offerMsg.ownerSame"  @change="ownerSame">车主与被保险人一致</el-checkbox>
                        </div>
                        <table class="table">
                            <tr>
                                <td><p>车主姓名: </p></td>
                                <td><el-input size="mini" v-model="data.licenseOwner"></el-input></td>
                                <td><p>证件类型: </p></td>
                                <td>
                                    <el-select size="mini" v-model="data.idType" placeholder="请选择">
                                        <el-option
                                        v-for="item in licenseType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </td>
                                <td><p>证件号码: </p></td>
                                <td><el-input size="mini" v-model="data.credentislasNum"></el-input></td>
                            </tr>
                        </table>
                        <div  class="ownerMsg">
                        <p>被保险人信息</p>
                        </div>
                        <table class="table" >
                            <tr>
                                <td><p>被保险人姓名: </p></td>
                                <td><el-input size="mini" v-model="data.insuredName"></el-input></td>
                                <td><p>证件类型: </p></td>
                                <td>
                                    <el-select size="mini" v-model="data.insuredIdType" placeholder="请选择">
                                        <el-option
                                        v-for="item in licenseType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </td>
                                <td><p>证件号码: </p></td>
                                <td><el-input size="mini" v-model="data.insuredIdCard"></el-input></td>
                            </tr>
                        </table>
                        <div  class="ownerMsg">
                        <p>投保人信息</p>
                        <el-checkbox v-model="offerMsg.policyHolder"  @change="policyHolder">投保人信息与被保险人一致</el-checkbox>
                        </div>
                        <table class="table">
                            <tr>
                                <td><p>投保人姓名: </p></td>
                                <td><el-input size="mini" v-model="data.postedName"></el-input></td>
                                <td><p>证件类型: </p></td>
                                <td>
                                    <el-select size="mini" v-model="data.holderIdType" placeholder="请选择">
                                        <el-option
                                        v-for="item in licenseType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </td>
                                <td><p>证件号码: </p></td>
                                <td><el-input size="mini" v-model="data.holderIdCard"></el-input></td>
                            </tr>
                        </table>
                    </div>
                    <h2 style="margin-top:10px;">最新报价信息<span style="display: inline-block;margin-left:20px;font-size:12px;font-weight:bold;font-family:Helvetica Neue;line-height:22px;color:rgba(0,0,0,0.45);">报价时间：{{getdata.insTime|times}}</span></h2>
                    <table class="table">
                            <tr>
                                <td><p>上年交强出险: </p></td>
                                <td>-----</td>
                                <td><p>上年商业出险: </p></td>
                                <td>-----</td>
                                <td style="visibility: hidden;"><p>证件号码: </p></td>
                                <td style="visibility: hidden;"><el-input size="mini" v-model="name"></el-input></td>
                            </tr>
                            <tr>
                                <td><p>交强险起保时间: </p></td>
                                <td>{{order.jqxdqDate}}</td>
                                <td><p>商业险起保时间: </p></td>
                                <td>{{order.syxdqDate}}</td>
                                <td  style="visibility: hidden;"></td>
                                <td  style="visibility: hidden;"></td>
                            </tr>
                    </table>
                    <div>
                        <el-row type="flex" >
                            <el-col :span="4" class="inLeft" >
                                <div v-for="(item,index) of company" :class="{'orderActive': index == active}" @click="selectOrder(index)" class="offerMsg" :key="index" >
                                    <img src="../../assets/images/gsc.png"/>
                                    <div>
                                        <p class="insurance">平安保险<span>({{order.policyStatus|state}})</span></p>
                                        <p class="money">{{getdata.zongjine}}元</p>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="20">
                                <div class="inRight">
                                    <p class="red">温馨提示：精确价格以核保通过后的价格为准哦~</p>
                                    <p>车牌号：{{order.licenseNo}}</p>
                                    <p>报价状态：{{order.orderStatus==''?'未报价':'报价成功'}}</p>
                                    <p>报价内容：{{order.orderStatus==''?'':textarea}} </p>
                                    <p><span>无赔款优惠系数：1.0000</span><span>自主渠道系数：0.9500</span><span>自主核保系数：1.0526</span></p>
                                    <p><span>交通违法浮动系数：1.0000</span><span>折扣系数：0.9500</span></p>
                                    <p>预期赔付率：0.3302</p>
                                    <p class="carType"><span>家庭自用车</span><span>{{data.modleName}}//{{data.exhaustScale}}/{{data.seatCount}}</span></p>
                                    <table border="1"  cellspacing="0" v-if="order.orderStatus!=''">
                                        <thead>
                                            <th>承保险种</th>
                                            <th>保险金额/责任限额</th>
                                            <th>保险费（元）</th>
                                        </thead>
                                        <tbody>
                                            <tr v-if="getdata.cheSunBaoFei!=0">
                                                <td>机动车损失保险</td>
                                                <td>{{getdata.cheSunBaoE|montyType}}</td>
                                                <td>{{getdata.cheSunBaoFei}}</td>
                                            </tr>
                                            <tr  v-if="getdata.sanZheBaoFei!=0">
                                                <td>第三者责任险</td>
                                                <td>{{getdata.sanZheBaoE|montyType}}</td>
                                                <td>{{getdata.sanZheBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.siJiBaoFei!=0">
                                                <td>车上人员责任险(司机)</td>
                                                 <td>{{getdata.siJiBaoE|montyType}}</td>
                                                 <td>{{getdata.siJiBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.chengKeBaoFei!=0">
                                                <td>车上人员责任险(乘客)</td>
                                                <td>{{getdata.chengKeBaoE|montyType}}</td>
                                                <td>{{getdata.chengKeBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.daoQiangBaoFei!=0">
                                                <td>盗抢险</td>
                                                <td>{{getdata.daoQiangBaoE|montyType}}</td>
                                                <td>{{getdata.daoQiangBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.buJiMianCheSunBaoFei!=0">
                                                <td>机动车损失不计免赔险</td>
                                                <td>投保</td>
                                                <td>{{getdata.buJiMianCheSunBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.buJiMianSanZheBaoFei!=0">
                                                <td>第三者责任不计免赔险</td>
                                                <td>投保</td>
                                                <td>{{getdata.buJiMianSanZheBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.buJiMianSiJiBaoFei!=0">
                                                <td>司机座位不计免赔险</td>
                                                <td>投保</td>
                                                <td>{{getdata.buJiMianSiJiBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.buJiMianChengKeBaoFei!=0">
                                                <td>乘客座位不计免赔险</td>
                                                <td>投保</td>
                                                <td>{{getdata.buJiMianChengKeBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.buJiMianDaoQiangBaoFei!=0">
                                                <td>盗抢不计免赔险</td>
                                                <td>投保</td>
                                                <td>{{getdata.buJiMianDaoQiangBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.huaHenBaoFei!=0">
                                                <td>划痕险</td>
                                                <td>{{getdata.huaHenBaoE|montyType}}</td>
                                                <td>{{getdata.huaHenBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.buJiMianHuaHenBaoFei!=0">
                                                <td>划痕不计免赔险</td>
                                                <td>投保</td>
                                                <td>{{getdata.buJiMianHuaHenBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.boLiBaoFei!=0">
                                                <td>玻璃单独破碎险</td>
                                                <td>{{getdata.boLiBaoE|montyType}}</td>
                                                <td>{{getdata.boLiBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.ziRanBaoFei!=0">
                                                <td>自燃损失险</td>
                                                <td>{{getdata.ziRanBaoE|montyType}}</td>
                                                <td>{{getdata.ziRanBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.buJiMianZiRanBaoFei!=0">
                                                <td>自燃损失不计免赔险</td>
                                                <td>投保</td>
                                                <td>{{getdata.buJiMianZiRanBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.sheShuiBaoFei!=0">
                                                <td>涉水行驶损失险</td>
                                                <td>{{getdata.sheShuiBaoE|montyType}}</td>
                                                <td>{{getdata.sheShuiBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.buJiMianSheShuiBaoFei!=0">
                                                <td>涉水行驶损失不计免赔险</td>
                                                <td>投保</td>
                                                <td>{{getdata.buJiMianSheShuiBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.hcSanFangTeYueBaoFei!=0">
                                                <td>车损无法找到第三方险</td>
                                                <td>{{getdata.hcSanFangTeYueBaoE|montyType}}</td>
                                                <td>{{getdata.hcSanFangTeYueBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.sheBeiSunShiBaoFei!=0">
                                                <td>新增设备损失险</td>
                                                <td>{{getdata.sheBeiSunShiBaoE|montyType}}</td>
                                                <td>{{getdata.sheBeiSunShiBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.bjmSheBeiSunShiBaoFei!=0">
                                                <td>新增设备损失失不计免赔险</td>
                                                <td>投保</td>
                                                <td>{{getdata.bjmSheBeiSunShiBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.fybcBaoE!=0">
                                                <td>修理期间费用补偿险</td>
                                                <td>{{getdata.fybcBaoE}}元</td>
                                                <td>{{getdata.fybcDaysBaoFei}}天</td>
                                            </tr>
                                            <tr v-if="getdata.showSanZheJieJiaRiBaoE!=0">
                                                <td>三责险附加法定节假日</td>
                                                <td>{{getdata.showSanZheJieJiaRiBaoE|montyType}}</td>
                                                <td>{{getdata.showSanZheJieJiaRiBaoFei}}</td>
                                            </tr>
                                            <tr v-if="getdata.forceTotal!=0">
                                                <td>交强险保费合计</td>
                                                <td colspan="2">{{getdata.forceTotal|tofixed}}</td>
                                            </tr>
                                            <tr v-if="getdata.bizTotal!=0">
                                                <td>商业险保费合计</td>
                                                <td colspan="2">{{getdata.bizTotal|tofixed}}</td>
                                            </tr>
                                            <tr v-if="getdata.taxTotal!=0">
                                                <td>车船税合计</td>
                                                <td colspan="2">{{getdata.taxTotal|tofixed}}</td>
                                            </tr>
                                            <tr v-if="getdata.bjmpzonge!=0">
                                                <td>不计免赔合计</td>
                                                <td colspan="2">{{getdata.bjmpzonge|tofixed}}</td>
                                            </tr>
                                            <tr>
                                                <td>保费总金额</td>
                                                <td colspan="2">{{getdata.zongjine|tofixed}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane> -->
                <el-tab-pane label="联系进度" class="prograssTable" name="third" > 
                    <el-table
                    @row-click='rowClick'
                    :data="progressTable"
                    style="width: 80%">
                    <el-table-column
                        prop="insTime"
                        label="联系时间">
                    </el-table-column>
                    <!-- <el-table-column
                        prop="contactType"
                        label="联系类型">
                    </el-table-column> -->
                    <el-table-column
                        prop="phone"
                        label="联系电话">
                        <template slot-scope="scpoe">
                            <p >{{scpoe.row.phone|hiddenPhone}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="proStatuWithDic"
                        label="进度状态">
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="添加人">
                    </el-table-column>
                    <el-table-column
                        prop="nextContactTime"
                        label="下次联系时间">
                    </el-table-column>
                    <el-table-column
                        prop="contactType"
                        show-overflow-tooltip
                        label="备注">
                    </el-table-column>
                    <el-table-column
                        type="recording"
                        prop="recording"
                        label="通话录音">
                        <template slot-scope="scpoe">
                            <a href="javascript:;" @click="recording(scpoe.row.recordId)">调听</a>
                        </template>
                    </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- <el-tab-pane label="配送方式" class="ways"  name="four">
                    <h2>配送信息 <a href="javascript:;"  >保存</a> </h2>
                    <div>
                        <table style="width:100%;padding:10px;font-size:14px;">
                            <tr>
                                <td><p>付款方</p></td>
                                <td>
                                    <el-select size="small" placeholder="请选择付款方式" v-model="payIt">
                                        <el-option v-for="item of payWays" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                    </el-select>
                                </td>
                                <td><p>配送方式</p></td>
                                <td>
                                    <el-select size="small" placeholder="请选择配送方式" v-model="send">
                                        <el-option v-for="item of sendWays" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                    </el-select>
                                </td>
                                <td><p>通信地址</p></td>
                                <td>
                                    <el-input size="small" v-model="address" placeholder="请输入地址"></el-input>
                                </td>
                            </tr>
                        </table>
                    </div>
                </el-tab-pane> -->
            </el-tabs>
        </div>
        <div class="btn" v-show="false">
            <div >
                <el-button  class="refresh"  @click="syncOrder"><i class="el-icon-refresh"></i>刷新续保</el-button>
                <el-button  class="edit" @click="reOffer"><i class="el-icon-edit"></i>{{order.orderStatus==''?'去报价':'重新报价'}}</el-button>
                <el-button  class="printer" @click="offerAuto"><i class="el-icon-upload"></i>自动报价</el-button>
                <el-button  class="share" @click="share" :disabled="order.orderStatus==''"><i class="el-icon-share"></i>分享报价</el-button>
                <el-button  class="document" :disabled="hebao==true" @click="toHebao"><i class="el-icon-document" ></i>申请核保</el-button>
                <el-button  class="printer" :disabled="dakuan==true" @click="toDakuan"><i class="el-icon-message"></i>申请打款</el-button>
                <!-- <el-button  type="primary" @click="nextPage"><i class="el-icon-d-arrow-right"></i>下一页订单</el-button> -->
            </div>
            <div  v-if="role==40">
                <el-button  class="refresh" :disabled="order.policyStatus==''&&order.qRCodeTime!=''" @click="success"><i class="el-icon-refresh"></i>核保成功</el-button>
                <el-button  class="edit" :disabled="order.policyStatus!=''" @click="fail"><i class="el-icon-edit"></i>核保失败</el-button>
                <el-button  class="share" :disabled="order.policyStatus!=1" @click="getMoney"><i class="el-icon-share"></i>已交保费</el-button>
                <!-- <el-button  type="primary" @click="nextPage"><i class="el-icon-d-arrow-right"></i>下一页订单</el-button> -->
            </div>
        </div>
        <el-dialog title="播放录音" width="40%" :before-close="handleClose" :visible.sync="playRecording">
            <div v-html="recordingSrc">{{recordingSrc}}</div>
        </el-dialog>
        <transition name="el-fade-in">
            <ShareOffer :orderId="orderId" :clientId='id' :khid="khid" :data="order" :clientCarins='clientCarins' v-if="showShare" @close='close'/>
        </transition>
        <transition name="el-fade-in">
            <ReOffer @reloadTwo='reloadTwo' @newOffer='newOffer' v-if="showReOffer" @close='close' :khid="khid" :orderId="orderId" :licenseNo='order.licenseNo'/>
        </transition>
        <transition name="el-fade-in">
            <OfferAuto @reloadTwo='reloadTwo' @newOffer='newOffer' v-if="showOfferAuto" :lastYearData='lastYearData' @close='close'  :data='data' :khid="khid" :orderId="orderId" :order='order' :licenseNo='order.licenseNo'/>
        </transition>
    </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import ShareOffer from './ShareOffer'
import ReOffer from './ReOffer'
import OfferAuto from './OfferAuto'
import getUrl from '@/assets/js/getUrl.js';
import commod from '@/assets/js/commod.js';
import FileSaver from 'file-saver'
var JSZip = require('jszip')
import md5 from 'js-md5';
let Base64 = require('js-base64').Base64;
import call from '@/assets/js/hcall_phone.js';
import {UMO} from '@/assets/js/UniMediaAPI.js'
export default {
    name:'SalesDetailRight',
    filters:{
        remainingTime(val){
            if(val==''){
                return '--'
            }else{
                return val
            }
            
        },
        hiddenPhone(val){
            let role=JSON.parse(window.sessionStorage.getItem('role')).userrole
            if(role==30){
                if(val==''){
                    return val
                }else{
                    val=val.substring(0,3)+'****'+val.substring(7,val.length)
                    return val
                }
            }else{
                return val
            }
        },
        tofixed(val){
            return Number(val).toFixed(2)
        },
        times(val){
            if(val){
                return commod(val)
                // return val
            }else{
                return '-----'
            }
        },
        time(val){
            if(val){
                return val
            }else{
                return '-----'
            }
            
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
        montyType4(val){
            if(val==0||val==''||!val){
                return '未投保'
            }else{
                return '投保('+val*100+'%)'
            }
        },
        montyType2(val){
            if(val==0||val==''||!val){
                return '未投保'
            }else{
                return '投保'
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
        state(val){
            if(val==''){
                return '未核保'
            }else if(val==0){
                return '已交保费'
            }else if(val==1){
                return '核保成功'
            }else if(val==2){
                return '核保失败'
            }
        }
    },
    props:{
        id:String,
        data:Object,
        rebate:Object,
        clientCarins:Object,
        orderId:String,
        order:Object,
        khid:String,
        getdata:Object,
        textarea:String,
        phoneCus:String,
    },
    components:{
        ShareOffer,ReOffer,OfferAuto,quillEditor
    },
    data(){
        return{
            tanSelf:false,
            playRecording:false,
            recordingSrc:'',
            schedules:[],
            addShow:false,
            noteBook:'',
            statusNumber:'',
            content: `<p></p><p><br></p><ol><li><strong><em>Or drag/paste an image here.</em></strong></li><li><strong><em>rerew</em></strong></li><li><strong><em>rtrete</em></strong></li><li><strong><em>tytrytr</em></strong></li><li><strong><em>uytu</em></strong></li></ol>`,
            editorOption: {},
            token:'',
            payIt:'',
            payWays:[{label:"我方",value:'1'},{label:"客户",value:'0'}],
            send:'',
            sendWays:[{label:"上门收取",value:'1'},{label:"转账",value:'0'}],
            address:'',
            hiddenCall:false,
            company:[2],
            asdL:{},
            prograssTitel:'添加联系进度',
            btnShow:true,
            loading:false,
            refresh:false,
            callingTime:'',
            timerCall:null,
            showOfferAuto:false,
            showPrograss:false,
            callNowState:'正在拨号...',
            callID:'',
            gonghao:'',
            fenji:'',
            duilie:'',
            cm_callsate:0,
            newCont:'',
            otherphone:'',
            showPic:true,
            yser:false,
            phoneNew:'',
            otherPhoneNew:'',
            detail:false,
            progressTable:[],
            proState:'',
            contKind:'',
            hebao:false,
            ways:'',
            dakuan:false,
            url:'',
            callout:'拨出',
            calling:false,
            customerMsg:{
                select:'',
                selectData:[''],
                selects:[{label:'本人',value:'0'},{label:'非本人',value:'1'},{label:'停机/关机',value:'2'},{label:'拒接/未接',value:'3'}],
                note:'',
                name:'',
                phone:'',
                account:'',
                money:'',
                payWay:'支付宝',
                payWaies:['支付宝','微信','银行卡']
            },
            carMsg:{
                chassisNum:'',
                engineNum:'',
                registeredDate:'',
                models:'',
                purchasePrice:'',
                brand:'',
                power:'',
                seat:'',
                plateNum:'',
                ifchange:'2',
                radio:'2',
                note:'',
            },
            offerMsg:{
                jqxqbrq:'',
                syxqbrq:'',
                ownerSame:null,
                policyHolder:null,
                ownername:'',
                buyName:'',
                Holdername:'',
                ownerId:'',
                HolderId:'',
                buyId:'',
                documentTypeOwner:'',
                documentTypeHolder:'',
                documentTypeBuy:'',
                documentTypes:['身份证','组织机构代码','营业执照/统一社会信用代码','港澳居民来往内地通行证','港澳身份证'],

            },
            lastYear:{
                insuranceCompany:'',
                name:'',
                Holdername:'',
                businessLimit:'',
                mandatoryLimit:'',
                documentTypeHolder:'',
                businessNum:'',
                HolderId:'',
                mandatoryNum:'',
            },
            imageUrl: null,
            lastYearData:{},
            name:'',
            checked:'',
            active:'',
            activeName2:'third',
            showShare:false,
            licenseType:[],
            showReOffer:false,
            dialogTableVisible: false,
            role:'',
            dialogFormVisible: false,
            form: {
                prograss:[],
                state:[{label:'无人接听',value:0},{label:'开场白',value:1},{label:'2',value:2},{label:'3',value:3},{label:'4',value:4},{label:'5',value:5}],
                date:'',
                note:'',
                phone:'',
                hiddenPhone:''
            },
            formLabelWidth: '120px',
            showBigImg:false,
            BigImg:'',
            imageUrls:'',
            sfzzm:'',
            sfzfm:'',
            xszzm:'',
            xszfm:'',
            cm_login:'',
            callin:false,
            callIngPhone:'',
            EvtHandler:{// 就绪通知
                that:this,
                onReadyState : (status) =>{
                    //console.log(status,this.cm_login)
                    if(status == 0 && this.cm_login!=2){//网络判断时系统自动判断重连
                        // if(window.confirm('网络异常，是否需要重新签入？')){
                        //     let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
                        //     let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
                        //     let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
                        //     this.doOprInReq('9'+this.order.otherphone.toString(),fenji,gonghao,duilie)
                        // }
                    }
                },
                //来话通知
                onCallincome : (ano, bno, uud) =>{
                    // console.log(ano, bno, uud,'来话')
                    //console.log((bno.indexOf('9'),ano))
                    if(ano.length==12){
                        this.callIngPhone=ano.substring(1,ano.length)
                    }else{
                        this.callIngPhone=ano
                    }
                    if(this.role==30){
                        this.callIngPhoneHidden=this.callIngPhone.substring(0,3)+'****'+this.callIngPhone.substring(7,this.callIngPhone.length)
                        this.form.callIngPhoneHidden=this.callIngPhone.substring(0,3)+'****'+this.callIngPhone.substring(7,this.callIngPhone.length)
                    }else{
                        this.callIngPhoneHidden=this.callIngPhone
                        this.form.callIngPhoneHidden=this.callIngPhone
                    }
                    this.form.phone=this.callIngPhone
                    this.form.hiddenPhone=this.callIngPhoneHidden
                    let str=''
                    this.schedules.forEach(item=>{
                        item.children.forEach(child=>{
                            if(this.order.lifeSchedule==child.value){
                                str=item.label
                            }
                        })
                    })
                    this.form.prograss=[str,this.order.lifeSchedule]
                    if(uud&&uud!=''){
                        this.callNowState='正在拨号...'
                    }else{
                        // alert(ano)
                        // this.$notify({
                        //     title: '提示!',
                        //     message: '提示!订单电话打入,即将跳转订单!',
                        //     type: 'warning'
                        // });
                        this.$emit('callIn',ano)//查询订单 
                        if(uud.length<100||uud==''){
                            this.calling=true
                            this.callin=true
                            let min=0
                            let sec=0
                            // this.timerCall=setInterval(()=>{
                            //     sec++
                            //     if(sec>=60){
                            //         sec=0
                            //         min++
                            //     }else if(sec<10){
                            //         sec='0'+Number(sec)
                            //     }else if(sec==0){
                            //         sec='00'
                            //     }
                            //     if(min<10){
                            //         min='0'+Number(min)
                            //     }
                            //     this.callingTime=min+' : '+sec
                            // },1000)
                            this.callNowState='来电:'+ano
                            setTimeout(this.getcdrid(ano, bno), 1000);// 录音
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
                    this.doSetOprBusyReq()//示忙
                    // console.log(ano, bno, uud , uud.length,'呼出')
                    // this.callin=true
                    this.calling=true
                    if(uud.length<100){
                        this.callin=true
                        let min=0
                        let sec=0
                        // this.timerCall=setInterval(()=>{
                        //     sec++
                        //     if(sec>=60){
                        //         sec=0
                        //         min++
                        //     }else if(sec<10){
                        //         sec='0'+Number(sec)
                        //     }else if(sec==0){
                        //         sec='00'
                        //     }
                        //     if(min<10){
                        //         min='0'+Number(min)
                        //     }
                        //     this.callingTime=min+' : '+sec
                        // },1000)
                        //console.log(bno.length,bno)
                        if(bno.length==13){
                            this.callIngPhone=bno.substring(2,bno.length)
                        }else{
                            this.callIngPhone=bno.substring(1,bno.length)
                        }
                        if(this.role==30){
                            this.callIngPhoneHidden=this.callIngPhone.substring(0,3)+'****'+this.callIngPhone.substring(7,this.callIngPhone.length)
                            this.form.callIngPhoneHidden=this.callIngPhone.substring(0,3)+'****'+this.callIngPhone.substring(7,this.callIngPhone.length)
                        }else{
                            this.callIngPhoneHidden=this.callIngPhone
                            this.form.callIngPhoneHidden=this.callIngPhone
                        }
                        this.callNowState='呼出:'+this.callIngPhoneHidden
                       
                        setTimeout(this.getcdrid(ano, bno), 1000);// 录音
                    }
                },
                //振铃停止通知
                onRingStoped : () =>{
                    // //console.log('stop')
                    this.stopHere()
                },
                // 挂机通知
                onHookChanged : (status) =>{
                    // alert(status);
                    let that=this
                    that.doSetOprFreeReq();//示闲
                    // console.log(status,'挂机')
                    if (status == 1 || status == 3 || status == 4) {
                        this.cm_callsate = 0;
                        // this.that.a.doSetOprDropReq(this.that.a.gonghao);
                        // 坐席挂机
                        if (status == 1) {
                            that.callNowState='已挂断...'
                            //console.log(this.timerCall)
                            clearInterval(that.timerCall)
                            that.callingTime='00 : 00'
                            //console.log(this.callin)
                            // if(this.callin){
                            //     that.calling=false
                            // }else{
                                // setTimeout(()=>{
                                    that.calling=false
                                    that.dialogFormVisible=true
                                    
                                    that.prograssTitel='添加联系进度'
                                    that.btnShow=true
                                    that.tanSelf=true
                                    that.insertRecord()
                                // },300)
                            // }
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
                    // //console.log(status)
                    // if(status==4){
                    //     //正在工作
                    //     this.callNowState='等待接听...'
                    // }
                },
                // 异步操作结束通知
                onAsyncFinished : (atype, taskid, ret, desc) =>{
                    console.log(atype, taskid, ret, desc,'操作')
                    let that=this
                    if(ret==0&&atype==8){
                        this.callNowState='正在通话...'
                        let min=0
                        let sec=0
                        // that.timerCall=setInterval(()=>{
                        //     sec++
                        //     if(sec>=60){
                        //         sec=0
                        //         min++
                        //     }else if(sec<10){
                        //         sec='0'+Number(sec)
                        //     }else if(sec==0){
                        //         sec='00'
                        //     }
                        //     if(min<10){
                        //         min='0'+Number(min)
                        //     }
                        //     this.callingTime=min+' : '+sec
                        // },1000)
                        this.callin=false
                        var ano = this.fenji;
                        var bno = this.order.otherphone;
                        setTimeout(that.getcdrid(ano, bno), 1000);
                    }
                    if(ret==2&&atype==8){
                        this.callNowState='等待接听...'
                    }
                },
            
                onAllBusy : function(status, acd, quelen) {
                    // //console.log(status, acd, quelen)
                },
                // 队列长度通知
                onQuelen : function(acd, quelen) {
                    // //console.log(acd, quelen)
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
        }
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    },
    methods:{
        onEditorReady(editor) { // 准备编辑器
 
        },
        onEditorBlur(){}, // 失去焦点事件
        onEditorFocus(){}, // 获得焦点事件
        onEditorChange(){}, // 内容改变事件
        changeType(index,item,carVin){//标记电话类型
            // //console.log(this.customerMsg.selectData[index])
            let data={
                id:item.id,
                carVin:carVin,
                type:this.customerMsg.selectData[index],
                local:this.customerMsg.local[index]
            }
            this.$axios({
                method: 'post',
                url: getUrl()+'updPhones',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // //console.log(res)
                if(res.data=='success'){
                    this.getPhones()
                    this.$notify({
                    title: '成功!',
                    message: '标记成功!',
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '错误',
                        message: '标记失败！'
                    });
                }
            })
        },
        getNotpadByOrderid(){//获取记事本
            let data={
                // userid:JSON.parse(window.sessionStorage.getItem('role')).userid,
                orderid:this.orderId
            }
            this.$axios({
                method: 'post',
                url: getUrl()+'getNotpadByOrderid',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                this.noteBook=res.data.text
            })
        },
        handleChange(val){
            // //console.log(val)
        },
        saveNote(){//保存记事本
            let data={
                // userid:JSON.parse(window.sessionStorage.getItem('role')).userid,
                orderid:this.orderId,
                text:this.noteBook
            }
            this.$axios({
                method: 'post',
                url: getUrl()+'saveNotpad',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // //console.log(res)
                if(res.data.status=='1'){
                    this.$notify({
                    title: res.data.message,
                    message: '成功!',
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '错误',
                        message: res.data.message
                    });
                }
                
            })
            
        },
        copyPhone(item){//匹配电话赋值备注电话
            if(item=='无匹配结果'){
                return
            }
            this.order.otherphone=item
        },
        hidden(){
            //缩小通话面板
            this.calling=false
        },
        newOffer(data){
            //查看不同公司报价
            //console.log(data)
            if(this.company.indexOf(data.source)<0){
                this.company.push(data.source)
            }
        },
        schedule(schedule){//字典 联系进度下拉列表
           this.$axios({
              method: 'get',
              url: getUrl()+'getDicts',
              params:{way:0,type:schedule}
          }).then(res=>{
            for(let i  in res.data){
                this.asdL={}
                this.asdL.label=res.data[i]
                this.asdL.value=i
                this.form.state.push(this.asdL)
            }
            this.form.state[8].label='已在其他公司购买'
            this.form.state[9].label='非本人'
            this.form.state[10].label='已完成'
          }) 
        },
        rowClick(row,e){
            if(e.type=='recording'){
                return
            }
            //联系进度查看
            console.log(row,e)
            this.dialogFormVisible=true
            this.btnShow=false
            this.prograssTitel='查看联系进度'
            //console.log(row)
            if(this.role==30){
                this.form.hiddenPhone=row.phone.substring(0,3)+'****'+row.phone.substring(7,row.phone.length)
            }else{
                this.form.hiddenPhone=row.phone
            }
            this.form.prograss=row.proStatuWithDic
            this.ways=row.contactWay
            this.contKind=row.contactType
            this.form.date=row.nextContactTime
        }, 
        success(){
            //核保成功
            let data={orderId:this.orderId,index:'paymentQRCode'}
            this.$axios({
                method: 'post',
                url: getUrl()+'getPicNull',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                ////console.log(res)
                if(res.data==0){
                    this.$notify.error({
                        title: '错误',
                        message: '用户未上传图片,无法核保成功'
                    });
                }else{
                    this.orderProcedure(1)
                }
            })
            
        },
        fail(){
            //核保失败
            this.orderProcedure(2)
        },
        getMoney(){
            //已缴保费
            ////console.log(this.order.qRCodeTime)
            this.orderProcedure(0)
        },
        orderProcedure(state){
            //修改订单状态
            let data={
                id:this.orderId,
                policyStatus:state,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'orderProcedure',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                ////console.log(res)
                if(res.data=="success"){
                    let data={licenseNo:this.order.licenseNo,id:this.orderId,clientId:this.khid}
                    this.$emit('reloadTwo',data)
                    this.$emit('reload')
                    this.$notify({
                    title: '操作成功',
                    message: '成功!',
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '操作错误',
                        message: '错误!'
                    });
                }
            })
        },
        onRead4(file){
            ////console.log(file)
            // this.imageUrl=file.content
            var formData = new FormData(); 
            formData.append('qrcode', file.file);
            formData.append('orderId', this.orderId);
            formData.append('way', '2');
            formData.append('userid', JSON.parse(window.sessionStorage.getItem('role')).userid);
            $.ajax({
                url: getUrl()+'uploadClientPaperInfo',//这里是后台接口需要换掉
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                success:(res)=>{
                    ////console.log(res)
                    this.imageUrls=file.content
                    this.imageUrl = false
                    this.$nextTick(() => {this.imageUrl = true})
                    if(res=='success'){
                        this.$notify({
                        title: '成功',
                        message: '上传成功!',
                        type: 'success'
                        });
                    }
                }
            })
        },
        // request(file){
        //     //自定义上传图片
        //     ////console.log(file.file)
        //     let data={
        //         orderId:this.orderId,
        //         way:2,
        //         qrcode:file.file,
        //         userid:JSON.parse(window.sessionStorage.getItem('role')).userid
        //     }
        //     this.$axios({
        //         headers:{'Content-Type':'application/x-www-form-urlencoded'},
        //         method: 'post',
        //         url: getUrl()+'uploadClientPaperInfo',
        //         data:this.$Qs.stringify(data)
        //     }).then(res=>{
        //         ////console.log(res)
        //     })
        // },
        toHebao(){
            //申请核保
            let data={
                id:this.orderId,
                orderStatus:1,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'orderProcedure',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                if(res.data=='success'){
                    this.$notify({
                    title: '申请成功',
                    message: '请等待录单员操作!',
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '错误',
                        message: '申请失败!'
                    });
                }
            })
        },
        time(val){
            //下次联系时间
            ////console.log(val)
        },
        nextPage(){
            //下一页订单
            this.$emit('nextPage')
        },
        toDakuan(){
             //申请打款
            ////console.log(22)
            let data={
                id:this.orderId,
                orderStatus:2,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'orderProcedure',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                if(res.data=='success'){
                    this.$notify({
                    title: '申请成功',
                    message: '请等待打款员操作!',
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '错误',
                        message: '申请失败!'
                    });
                }
            })
        },
        dialogVisible(dh){
            //点击添加进度
            let str=''
            this.tanSelf=false
            this.schedules.forEach(item=>{
                item.children.forEach(child=>{
                    if(this.order.lifeSchedule==child.value){
                        str=item.label
                    }
                })
            })
            if(dh!=''&&this.role==30){
                this.form.phone=dh
                this.form.hiddenPhone=dh.substring(0,3)+'****'+dh.substring(7,dh.length)
            }else{
                this.form.phone=dh
                this.form.hiddenPhone=dh
            }
            this.dialogFormVisible=true
            this.btnShow=true
            setTimeout(()=>{this.form.prograss=[str,this.order.lifeSchedule]},100)
            this.ways='电话'
            this.contKind=''
            this.form.date=''
            this.prograssTitel='添加联系进度'
        },
        insertRecord(){//添加联系进度
            let data={
                orderId:this.orderId,
                contactWay:this.ways,
                contactType:this.contKind,
                proStatu:'',
                licenseNo:this.order.licenseNo, 
                recordId:this.callID,
                nextContactTime:this.form.date,
                recordAss:'',
                phone:this.form.phone,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'insertOrderRecord',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                    //console.log(res)
                    if(res.data.status==1){
                        this.tanSelf=true
                        this.queryOrderRecords()
                    }
            })
        },
        insertOrderRecord(e){
            //修改联系进度
            this.btnShow=true
            this.prograssTitel='添加联系进度'
            if(e){
                if(this.form.prograss.length==0){
                    this.$message.error('请选择联系进度!');
                    return
                }
                let data={
                    orderId:this.orderId,
                    contactWay:this.ways,
                    contactType:this.contKind,
                    proStatu:this.form.prograss[1],
                    licenseNo:this.order.licenseNo, 
                    recordId:this.callID,
                    nextContactTime:this.form.date,
                    recordAss:'',
                    phone:this.form.phone,
                    userid:JSON.parse(window.sessionStorage.getItem('role')).userid
                }
                if(this.tanSelf){
                    data.flag='update'
                }
                this.$axios({
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: getUrl()+'insertOrderRecord',
                    data:this.$Qs.stringify(data)
                }).then(res=>{
                    if(res.data.status==1){
                        this.order.lifeSchedule=this.form.prograss[1]
                        this.getSchedulesDicts()
                        this.queryOrderRecords()
                        this.dialogFormVisible=false
                        this.form.prograss=[]
                        this.ways=''
                        this.contKind=''
                        this.form.date=''
                        this.$notify({
                        title: '成功',
                        message: res.data.message,
                        type: 'success'
                        });
                    }else{
                        this.$notify.error({
                        title: '错误',
                        message: res.data.message,
                    });
                    }
                })
            }else{
                // if(this.form.prograss[1]==this.order.lifeSchedule){
                //     this.$message.error('请重新选择联系进度!');
                //     return
                // }
                this.dialogFormVisible=false
                
            }
        },
        openImg1(e){
            //放大照片
            this.BigImg=e.target.currentSrc
            this.showBigImg=true
        },
        saveCarins(){
            //客户车险保单信息保存
            let insuredIdType=''
            if(this.data.insuredIdType=='没有取到'){
                insuredIdType=0
            }else if(this.data.insuredIdType=='身份证'){
                insuredIdType=1
            }else if(this.data.insuredIdType=="组织机构代码证"){
                insuredIdType=2
            }else if(this.data.insuredIdType=="护照"){
                insuredIdType=3
            }else if(this.data.insuredIdType=="军官证"){
                insuredIdType=4
            }else if(this.data.insuredIdType=="港澳居民来往内地通行证"){
                insuredIdType=5
            }else if(this.data.insuredIdType=="其他"){
                insuredIdType=6
            }else if(this.data.insuredIdType=="港澳通行证"){
                insuredIdType=7
            }else if(this.data.insuredIdType=="出生证"){
                insuredIdType=8
            }else if(this.data.insuredIdType=="营业执照（社会统一信用代码）"){
                insuredIdType=9
            }else if(this.data.insuredIdType=="税务登记证"){
                insuredIdType=10
            }else if(this.data.insuredIdType=="驾驶证"){
                insuredIdType=11
            }else if(this.data.insuredIdType=="营业执照（这是三证合一之前的）"){
                insuredIdType=12
            }else if(this.data.insuredIdType=="台胞证"){
                insuredIdType=13
            }else if(this.data.insuredIdType=="港澳身份证"){
                insuredIdType=14
            }
            let data={
                licenseNo:this.order.licenseNo,
                // id:this.$route.params.khid,
                source:this.data.source,
                licenseOwner:this.data.licenseOwner,
                businessExpireDate:this.data.businessExpireDate,
                forceExpireDate:this.data.forceExpireDate,
                insuredName:this.data.insuredName,
                insuredIdType:insuredIdType,
                holderIdCard:this.data.holderIdCard,
                bizNo:this.data.bizNo,
                forceNo:this.data.forceNo,
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'saveCarins',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                ////console.log(res)
                if(res.data.status==1){
                    this.$notify({
                    title: '保存成功',
                    message: res.data.message,
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '保存错误',
                        message: res.data.message
                    });
                }
            })
        },
        saveQuote(){
            //保存报价信息
            let data={
                licenseNo:this.order.licenseNo,
                licenseOwner:this.data.licenseOwner,
                idType:this.data.idType,
                credentislasNum:this.data.credentislasNum,
                insuredName:this.data.insuredName,
                insuredIdType:this.data.insuredIdType,
                insuredIdCard:this.data.insuredIdCard,
                postedName:this.data.postedName,
                holderIdCard:this.data.holderIdCard,
                holderIdType:this.data.holderIdType
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'saveClientInfo',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                ////console.log(res)
                if(res.data.status==1){
                    this.$notify({
                    title: '保存成功',
                    message: res.data.message,
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '保存错误',
                        message: res.data.message
                    });
                }
            })
        },
        ownerSame(val){
            if(val){
                //车主与保险人一致
                this.data.insuredName=this.data.licenseOwner
                this.data.insuredIdType=this.data.idType
                this.data.insuredIdCard=this.data.credentislasNum
            }
        },
        policyHolder(val){
            if(val){
                //被保险人与保险人一致
                this.data.postedName=this.data.insuredName
                this.data.holderIdType=this.data.insuredIdType
                this.data.holderIdCard=this.data.insuredIdCard
            }
        },
        handleClick(tab){
            ////console.log(tab.name)
            if(tab.name=='first'){
                ////console.log(this.data)
                if(this.data.insuredIdType==0){
                    this.data.insuredIdType='没有取到'
                }else if(this.data.insuredIdType==1){
                    this.data.insuredIdType='身份证'
                }else if(this.data.insuredIdType==2){
                    this.data.insuredIdType="组织机构代码证"
                }else if(this.data.insuredIdType==3){
                    this.data.insuredIdType="护照"
                }else if(this.data.insuredIdType==4){
                    this.data.insuredIdType="军官证"
                }else if(this.data.insuredIdType==5){
                    this.data.insuredIdType="港澳居民来往内地通行证"
                }else if(this.data.insuredIdType==6){
                    this.data.insuredIdType="其他"
                }else if(this.data.insuredIdType==7){
                    this.data.insuredIdType="港澳通行证"
                }else if(this.data.insuredIdType==8){
                    this.data.insuredIdType="出生证"
                }else if(this.data.insuredIdType==9){
                    this.data.insuredIdType="营业执照（社会统一信用代码）"
                }else if(this.data.insuredIdType==10){
                    this.data.insuredIdType="税务登记证"
                }else if(this.data.insuredIdType==11){
                    this.data.insuredIdType="驾驶证"
                }else if(this.data.insuredIdType==12){
                    this.data.insuredIdType="营业执照（这是三证合一之前的）"
                }else if(this.data.insuredIdType==13){
                    this.data.insuredIdType="台胞证"
                }else if(this.data.insuredIdType==14){
                    this.data.insuredIdType="港澳身份证"
                }
                let data={
                    licenseNo:this.order.licenseNo,
                    lastyeartype:1
                }
                this.$axios({
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: getUrl()+'getQuoteByLicenseNo',
                    data:this.$Qs.stringify(data)
                }).then(res=>{
                    ////console.log(res)
                    this.lastYearData=res.data
                    
                })
            }else if(tab.name='third'){
                this.queryOrderRecords()
            }
        },
        getLastYear(){//获取上年投保信息
            let data={
                licenseNo:this.order.licenseNo,
                lastyeartype:1
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getQuoteByLicenseNo',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                ////console.log(res)
                this.lastYearData=res.data
                
            })
        },
        queryOrderRecords(){
            //当前订单进度
            let data={
                orderId:this.orderId,
                userid:window.sessionStorage.getItem('userid')
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'queryOrderRecords',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                // //console.log(res)
                // this.statusNumber=Number(res.data[0].proStatu)
                this.form.state.forEach(item=>{
                    if(res.data.length>0){
                        if(Number(item.value)<Number(res.data[0].proStatu)){
                            item.disabled=true
                        }
                    }
                })
                this.progressTable=res.data
            })
        },
        GetlicenseType(){
            //证件类型
            this.$axios({
                method: 'get',
                url: getUrl()+'getDicts',
                params:{way:0,type:'bihucardtype'}
            }).then(res=>{
                for(let i in res.data){
                    this.asdL={}
                    this.asdL.label=res.data[i]
                    this.asdL.value=i
                    this.licenseType.push(this.asdL)
                }
                ////console.log(this.licenseType)
            })
        },
        updateLicenseOwner(){
            //保存客户信息
            let data={
                licenseOwner:this.order.licenseOwner,
                otherphone:this.order.otherphone,
                orderId:this.orderId,
                credentislasnum:this.data.credentislasnum
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'updateLicenseOwner',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                if(res.data.status==1){
                    this.$notify({
                    title: '保存成功',
                    message: '客户信息保存成功!',
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '保存错误',
                        message: '客户信息保存失败!'
                    });
                }
            })
        },
        saveCar(){
            //保存车辆信息
            let data={
                licenseNo:this.order.licenseNo,
                engineNo:this.data.engineNo,
                carVin:this.data.carVin,
                registerDate:this.data.registerDate,
                modleName:this.data.modleName,
                licenseType:this.data.models,
                purchasePrice:this.data.purchasePrice,
                seatCount:this.data.seatCount,
                exhaustScale:this.data.exhaustScale,
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'saveClientInfo',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                ////console.log(res)
                if(res.data.status==1){
                    this.$notify({
                    title: '保存成功',
                    message: res.data.message,
                    type: 'success'
                    });
                }else{
                    this.$notify.error({
                        title: '保存错误',
                        message: res.data.message
                    });
                }
            })
        },
        callStop(){
            //挂断
            let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
            call.doSetOprDropReq(gonghao)
        },
        stopHere(stop){
            //本页挂断
            if(stop=='stop'){//签出
                let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
                let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
                let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
                this.doOprInReq('9'+this.order.otherphone.toString(),fenji,gonghao,duilie,stop)
            }
            this.callNowState='已挂断...'
            setTimeout(()=>{               
                this.calling=false               
                clearInterval(this.timerCall)
                this.callingTime='00 : 00'
                // let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
                // this.doOprOutReq(gonghao)
                this.doSetOprDropReq()
            },1000)
            
        },
        callHere(wd){
            //拨打备用电话
            this.calling=true
            // return
            let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
            let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
            let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
            if(wd=='wd'){//外地号码
                this.doOprInReq('90'+this.order.otherphone.toString(),fenji,gonghao,duilie)
            }else{
                this.doOprInReq('9'+this.order.otherphone.toString(),fenji,gonghao,duilie)
            }
            // this.doOprCallOutReq(this.order.otherphone.toString(),fenji,gonghao)
        },
        callOut(wd){
            //console.log(wd)
            this.calling=true
            this.fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
            this.gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
            this.duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
            this.danhao='danhao'
            if(wd=='wd'){//外地号码
                this.doOprInReq('90'+this.order.phone.toString(),this.fenji,this.gonghao,this.duilie)
            }else{
                this.doOprInReq('9'+this.order.phone.toString(),this.fenji,this.gonghao,this.duilie)
            }
            
            // this.doOprCallOutReq(this.order.otherphone.toString(),this.fenji,this.gonghao)
        },
        stopCall(){
            //挂断
            this.calling=false;
            call.doSetOprDropReq()
        },
        upLoad(){
            //上传图片

        },
        handleClose(){
            let audio=document.getElementById('play_wave_layout')
            audio.pause()
            this.playRecording=false
        },
        recording(recordId){//调取录音
            let data={
                callid:recordId
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: 'http://172.16.1.254:8181/play.ashx',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                if(res.data.status==0){
                    this.$message.error('该记录暂无录音!')
                    return
                }
                this.recordingSrc=res.data
                this.playRecording=true
            })
        },
        handleAvatarSuccess(res, file) {
            //上传图片
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            //上传图片
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG&&!isPNG) {
            this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG||isPNG
        },
        doLoadQr(){
            //下载缴费二维码
            $('#doLoadQr').attr('href',getUrl()+'onloadQRCodePic?orderId='+this.orderId)
            return false
            this.$axios({
                method: 'get',
                url: getUrl()+'onloadPic',
                params:{orderId:this.orderId}
            }).then(res=>{
                ////console.log(res)
                if(res.data==0){
                    this.$notify.error({
                        title: '用户未上传图片',
                        message: res.data.message
                    });
                    $('#doLoadQr').attr('href','javascript:;')
                    return false
                }else{
                    $('#doLoadQr').attr('href',getUrl()+'onloadQRCodePic?orderId='+this.orderId)
                }
                // $('#doLoadQr').attr('href',getUrl()+'onloadQRCodePic?orderId='+this.orderId)
                return false
            })
        },
        downLoadPic(){
            //下载图片
            // if(this.role==40||this.role==0||this.role==50){
            //     //仅录单员可下载
            //     return
            // }
            $('#downLoadPic').attr('href',getUrl()+'onloadPic?orderId='+this.orderId)
            return false
            this.$axios({
                method: 'get',
                url: getUrl()+'onloadPic',
                params:{orderId:this.orderId}
            }).then(res=>{
                ////console.log(res)
                if(res.data==0){
                    this.$notify.error({
                        title: '用户未上传图片',
                        message: res.data.message
                    });
                    $('#downLoadPic').attr('href','javascript:;')
                    return false
                }else{
                    this.yser=true
                    $('#downLoadPic').attr('href',getUrl()+'onloadPic?orderId='+this.orderId)
                }
                return false
            })
            if(this.yser){
                $('#downLoadPic').attr('href',getUrl()+'onloadPic?orderId='+this.orderId)
            }
            return false
            // var zip = new JSZip()
            // var imgs = zip.folder('blogTitle')
            // var baseList = []
            // var _this = this
            // var arr = ['../../assets/images/tianjiatupian_1.png','../../assets/images/tianjiatupian_1.png']
            // for (var i = 0; i < arr.length; i++) {
            //     var getBase64= Base64.encode(arr[i])
            //     let image = new Image()
            //     // 解决跨域 Canvas 污染问题
            //     image.src=getBase64;
            //     image.setAttribute('crossOrigin', 'anonymous')
            //     image.onload = function (){
            //         let canvas = document.createElement('canvas')
            //         canvas.width = image.width
            //         canvas.height = image.height
            //         let context = canvas.getContext('2d')
            //         context.drawImage(image, 0, 0, image.width, image.height)
            //         //let url = canvas.toDataURL() // 得到图片的base64编码数据
            //         let url = canvas.toDataURL('image/png')    
            //         baseList.push(url.substring(22))
            //         ////console.log(url)
            //         return
            //         if (baseList.length === arr.length) {
            //         if (baseList.length > 0) {
            //             _this.$notify({
            //             title: '成功',
            //             message: '即将下载',
            //             type: 'success'
            //             })
            //             for (let k = 0; k < baseList.length; k++) {
            //             imgs.file('photo' + k + '.png', baseList[k], {base64: true})
            //             }
            //             zip.generateAsync({type: 'blob'}).then(function (content) {
            //             // see FileSaver.js
            //             saveAs(content, 'blogTitle' + '.zip')
            //             })
            //         } else {
            //             _this.$notify.error({
            //             title: '错误',
            //             message: '暂无图片可下载'
            //             })
            //         }
            //         }
            //     }
            //     image.src = arr[i]
            // }
        },
        syncOrder(){
            //刷新续保
            if(this.refresh){
                let now=new Date()
                let y=now.getFullYear()
                let m=now.getMonth()+1
                let d=now.getDate()
                if(m<10){
                    m="0"+Number(m)
                }
                if(d<10){
                    d='0'+Number(d)
                }
                let iDays = Math.floor(Math.abs(Date.parse(y+'-'+m+'-'+d)-Date.parse(commod(this.data.updtime))) / (24 * 3600 * 1000));
                let msg=''
                if(iDays==0){
                    msg='今天已刷新,请三天后再试!'
                }else{
                    msg=iDays+'天前已刷新!'
                }
                this.$notify.error({
                    title: '错误',
                    message: msg
                });
            }else{
                this.loading=true
                let data={
                    userid:JSON.parse(window.sessionStorage.getItem('role')).userid,
                    ordersid:this.orderId
                }
                this.$axios({
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    method: 'post',
                    url: getUrl()+'syncOrder',
                    data:this.$Qs.stringify(data)
                }).then(res=>{
                    this.loading=false
                    if(res.data=="success"){
                        this.reload()
                        this.$notify({
                        title: '成功',
                        message: '刷新成功!请勿重复操作!',
                        type: 'success'
                        });
                    }else{
                        this.$notify.error({
                            title: '错误',
                            message: '刷新错误!'
                        });
                    }
                })
            }
        },
        reload(data){
            //刷新订单
            ////console.log(data)
            this.showPic=false
            // this.sfzzm=''
            // this.sfzfm=''
            // this.xszzm=''
            // this.xszfm=''
            // this.$nextTick(()=>{
            //     this.sfzzm=getUrl()+'getPicBytes?orderId='+this.orderId+'&index=sfzzm'
            //     this.sfzfm=getUrl()+'getPicBytes?orderId='+this.orderId+'&index=sfzfm'
            //     this.xszzm=getUrl()+'getPicBytes?orderId='+this.orderId+'&index=xszzm'
            //     this.xszfm=getUrl()+'getPicBytes?orderId='+this.orderId+'&index=xszfm'
            //     this.showPic=true
            // })
            this.$emit('reload',{clientId:this.khid,id:this.orderId})
            this.$emit('reloadTwo',{licenseNo:this.order.licenseNo})
            if((this.order.policyStatus==''||this.order.policyStatus=='2')&&(this.order.sharePrice==1)){
                //订单可核保
                
                this.hebao=true
            }else{
                this.hebao=false
            }
            if(this.order.orderStatus==1&&this.order.policyStatus==0){
                //订单可打款
                this.dakuan=true
            }
        },
        reloadTwo(data){
            //报价后刷新订单
            // this.$emit('reloadTwo',data)
            this.reload()
        },
        reOffer(){
            //重新报价
            this.showReOffer=true
        },
        offerAuto(){
            //自动报价
            this.showOfferAuto=true
        },
        selectOrder(index){
            //选择报价单  
            this.active = index;
        },
        close(){
            this.showShare=false
            this.showReOffer=false
            this.showOfferAuto=false
        },
        share(){
            //分享报价
            this.showShare=true
        },
        showPro(event){
            if(document.body.clientWidth-event.pageX<=100){
                this.showPrograss=true
            }else{
                this.showPrograss=false
            }
        },
        login(){
          //手动签入
          let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
          let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
          let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
          this.doOprInReq('9'+this.order.otherphone.toString(),fenji,gonghao,duilie)
        },
        logout(){
          //手动签出
        //   let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
        //   this.doOprOutReq(gonghao)
            let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
            let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
            let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
            this.doOprInReq('9'+this.order.otherphone.toString(),fenji,gonghao,duilie,'签出')
        },
        doOprOutReq(gonghao){
            //签出
            var aid = gonghao;//工号
            UMO.logout(aid, (cmd, result)=> {
                //console.log(cmd, result)
                if (result.errno == 0) {//
                    this.cm_login=2;
                    this.hcall_exit();
                    // setPhoneButtonStatus(true, true, true, true, false, true, "状态:等待签入...");
                } else {
                    // setPhoneButtonStatus(false, true, true, false, true, false, "状态:签出失败<br>原因:"+result.errmsg);
                }
            }, null);
        },
        hcall_exit(){
            //关闭
            this.cm_callsate = 0;
            // cm_logstart = 0;
            //console.log(22321)
            UMO.exit(cbResult, null)
        },
        doOprInReq2(fenji,gonghao,duilie){
            //console.log(fenji,gonghao,duilie)
            let that=this
            //签入
            var acd = duilie;//队列号（技能组）号
            var eid = "0"; //$("#eid").val();////租户ID
            var bizhost = '';
            var aid = gonghao;//工号
            var adn = aid; //$("#adn").val();//话务员分机电话号码
            var apwd = "e10adc3949ba59abbe56e057f20f883e";//工号密码
               //var apihost = 'http://cti254.csgxcf.com/IXServer';//接口地址cti254.csgxcf.com
            var apihost = 'http://172.16.1.254/IXServer';//接口地址cti254.csgxcf.com
            this.cm_callsate = 0;
                //console.log('初始化666666666666666')
            //断开连接
            this.UMO.exit(function(cmd, result){
                //启动连接
                that.UMO.start(apihost, bizhost, that.EvtHandler, eid, "", aid, apwd, adn, function(cmd, result) {
                    //0:启动成功 -3:已启动
                    //console.log(result)
                    that.token=result.token
                    // this.UMO.dataoper('calllist','user','q','calllist','calllist','','','','','',that.token)
                    if (result.errno == 0 || result.errno == -3) {
                        // cm_logstart=1;
                        //登出原有座席
                        that.UMO.logout(aid, function(cmd, result){
                            //console.log(aid,cmd,result)
                            //签入座席
                            that.UMO.login(aid, acd, -1, false, false, function(cmd, result) {
                                //console.log(result)
                                // if (result.errno == 0) {
                                //     that.cm_login=1;
                                //     //console.log(222)
                                // } else {
                                //     that.$notify.error({
                                //         title: '错误',
                                //         message: result.errmsg
                                //     });
                                //     // setPhoneButtonStatus(true, true, true, true, true, false, "状态:签入失败<br>原因:"+result.errmsg);
                                // }
                            }, null);//签入座席
                        }, null);//登出原有座席
                    }//启动连接判断
                },null);//启动连接
            },null);//断开连接
        },
        doOprInReq(phone,fenji,gonghao,duilie,logout){
      

            //console.log(phone,fenji,gonghao,duilie,logout)
            let that=this;
            //签入
            var acd = duilie;//队列号（技能组）号
            var eid = "0"; //$("#eid").val();////租户ID
            var bizhost = '';
            var aid = gonghao;//工号
            var adn = aid; //$("#adn").val();//话务员分机电话号码
            var apwd = "e10adc3949ba59abbe56e057f20f883e";//工号密码
               //var apihost = 'http://cti254.csgxcf.com/IXServer';//接口地址cti254.csgxcf.com
            var apihost = 'http://172.16.1.254/IXServer';//接口地址cti254.csgxcf.com
     
            this.cm_callsate = 0;
            // console.log("11111111111111")
            //断开连接
            this.UMO.exit(function(cmd, result){
                //  console.log("222222222")
                //  console.log(result)
                //启动连接
                that.UMO.start(apihost, bizhost, that.EvtHandler, eid, "", aid, apwd, adn, function(cmd, result) {                   
                //      console.log("3333333333333")
                //  console.log(result)
                   //0:启动成功 -3:已启动
                    //console.log(result)
                    if (result.errno == 0 || result.errno == -3) {
                        // cm_logstart=1;
                        //登出原有座席
                        that.UMO.logout(aid, function(cmd, result){
                //                console.log("4444444444444443")
                //  console.log(result)
                            //console.log('---------------------')
                            //console.log(aid,cmd,result)
                            // if(logout&&result.errno==0){
                            //     that.$notify({
                            //       title: '成功',
                            //       message: '签出成功!',
                            //       type: 'success'
                            //     });
                            //     that.cm_login=2;
                            //     return
                            // }
                            //签入座席
                            that.UMO.login(aid, acd, -1, false, false, function(cmd, result) {
                                //    console.log("55555555555555555")
                                //     console.log(result)
                                //console.log(result)
                                if (result.errno == 0) {
                                    that.cm_login=1;
                                    //console.log(222)
                                    // that.$notify({
                                    //   title: '成功',
                                    //   message: '签入成功!',
                                    //   type: 'success'
                                    // });
                                    that.doOprCallOutReq(phone,fenji,gonghao)//签入成功拨号
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
        doSetOprDropReq(){
            //挂断
            let that=this;
            clearInterval(that.timerCall)
            this.callingTime='00 : 00'
            this.UMO.onhook(
			function(cmd, result) {
                //console.log(result)
				if (result.errno == 0) {
                    that.cm_callsate = 1;
                    that.tanSelf=false
                    that.dialogFormVisible=true
					that.doSetOprFreeReq();//示闲
				} else {
                    // setPhoneButtonStatus(true, true, false, true, true, true, "状态:坐席示忙");
                    that.$notify.error({
                        title: '系统提示',
                        message: result.errmsg
                    });
				}
			}, null);
        },
        doOprCallOutReq(phone,fenji,gonghao){
            //拨出
            //console.log(phone,fenji,gonghao)
            let that=this
            var calleddn = phone;//拨出号码
            var gid = ''; //$("#agentgid").val();//中继线路 指定中继号码，或 @+租户ID 选择租户任意线路(转移会议无效)
            calleddn = calleddn.replace(/\D+/g, '');
            if (calleddn.length < 3) {
                this.$notify.error({
                    title: '系统提示',
                    message: '电话号码不能为空！'
                });
                this.stopHere()
                return;
            }
            if (this.cm_callsate == 1) {
                this.$notify.error({
                    title: '系统提示',
                    message: '话机正在操作中请示闲'
                });
                return;
            }
            if (this.cm_callsate == 0) {
                this.cm_callsate = 1;
            }
            // $('#pStatus').val(0);//呼出
            // var telephoness = $('#telephoness').val();// 节点号
            var telephoness = gonghao;// 节点号
            // var phoneverify_id = $('#phoneverify_id').val();// 单号
            // if (phoneverify_id.length<1) {
            // 	$.messager.alert('系统提示', "请选择要拨打的订单！", 'warning');
            // 	return false;
            // }
            var cur_date=this.getDateAndTime();
            var cur_time=cur_date.substring(10)+"_"+calleddn+"_"+telephoness;
            var uud="ano:" + fenji+";__RECORDDIAL__:F#\\record\\"+cur_date.substring(0,10)+"\\"+cur_time+".wav";
            // calleddn = 9 + calleddn;
            this.UMO.dialout(calleddn, gid, uud, true, function(cmd, result) {
                //console.log(cmd,result)
                if (result.errno == 0) {
                    that.callin=false
                    // $('#phoneOut_orid').val($('#phone_orid').val());// 赋值正在播出
                    // $('#phoneOutverify_id').val(phoneverify_id);// 赋值正在拨出
                    // setPhoneButtonStatus(true, false, true, true, true, true, "状态:呼出通话中");
                    that.callNowState='正在拨号...'
                } else {
                    that.callin=false
                    // setPhoneButtonStatus(false, true, true, false, true, false, "状态:呼出失败<br>原因:"+result.errmsg);
                    that.callNowState='呼出失败...'
                }
            }, null)
        },
        doSetOprBusyReq() {//示忙
            this.UMO.setbusy((cmd, result)=>{
                        if (result.errno == 0) {
                            this.cm_callsate = 1;
                            //console.log('示忙')
                            // setPhoneButtonStatus(true, true, false, true, true, true, "状态:坐席示忙");
                        }
                    }, null);
        },
        doSetOprFreeReq() {
            //示闲
            this.UMO.setidle((cmd, result) =>{
                //console.log(result)
                if (result.errno == 0) {
                    console.log('示闲')
                    this.cm_callsate = 0;
                    // setPhoneButtonStatus(false, true, true, false, true, false, "状态:坐席空闲");
                } else {
                    // setPhoneButtonStatus(true, true, false, true, true, true, "状态:示闲失败<br>原因:"+result.errmsg);
                }
            }, null);
        },
        getcdrid(){
            //获取话单ID
            this.UMO.getcdrid((cmd, result)=>{
                //console.log(result)
                if (result.errno == 0) {
                    // //console.log(result.cdrid)
                    this.callID=result.cdrid
                    // $('#cdrid').val(result.cdrid);
                }
            }, null);
        },
        getDateAndTime(){
            //通话时间
            var ndate = new Date();
            var nstrg = [];
            nstrg[nstrg.length] = ndate.getFullYear();
            nstrg[nstrg.length] = '-';
            nstrg[nstrg.length] = ("0" + (ndate.getMonth() + 1)).slice(-2);
            nstrg[nstrg.length] = '-';
            nstrg[nstrg.length] = ("0" + ndate.getDate()).slice(-2);
            nstrg[nstrg.length] = ("0" + ndate.getHours()).slice(-2);
            nstrg[nstrg.length] = ("0" + ndate.getMinutes()).slice(-2);
            nstrg[nstrg.length] = ("0" + ndate.getSeconds()).slice(-2);
            return nstrg.join('');
        },
        getSchedulesDicts(){//联系进度下拉列表
            this.$axios({
                url:getUrl()+'getSchedulesDicts',
                method:'post'
            }).then(res=>{
                //console.log(this.order.lifeSchedule)
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
                        if(Number(s)<=Number(this.order.lifeSchedule)){
                            chJson.disabled=true
                        }
                        json.children.push(chJson)
                    }
                    arr.push(json)
                }
                this.schedules=arr

            })
        },
        getPhones(){//电话全未空时查询号码
            let data={
                orderId:this.orderId
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getPhones',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                if(res.data.length==0){
                    this.customerMsg.note=['无匹配结果']
                }else{
                    let arr=[]
                    let local=[]
                    res.data.forEach((item,index)=> {
                        arr.push(item.type)
                        local.push(item.local)
                        item.addShow=false
                    });
                    this.customerMsg.note=res.data
                    this.customerMsg.selectData=arr
                    this.customerMsg.local=local
                }
            })
        }
    },
    watch:{
        order:{
            immediate:true,
            handler(val){
                this.queryOrderRecords()
                this.getNotpadByOrderid();
                if(this.role==30){
                    this.phoneNew=this.order.phone.substring(0,3)+'****'+this.order.phone.substring(7,this.order.phone.length)
                }else{
                    this.phoneNew=this.order.phone
                }
                if(this.role==30){
                    this.otherPhoneNew=this.order.otherphone.substring(0,3)+'****'+this.order.otherphone.substring(7,this.order.otherphone.length)
                }else{
                    this.otherPhoneNew=this.order.otherphone
                }
                if(this.order.orderStatus==1&&this.order.policyStatus==0){//订单可打款
                    this.dakuan=false
                }else{
                    this.dakuan=true
                }
                if((this.order.policyStatus==''||this.order.policyStatus=='2')&&(this.order.sharePrice==1)){//订单可核保
                    this.hebao=false
                }else{
                    this.hebao=true
                }
                this.getPhones();
                // if(this.order.phone==''&&this.order.otherphone==''&&this.order.sidePhone1==''&&this.order.sidePhone2==''){//电话全为空且订单改变时匹配电话
                //     this.getPhones();
                // }
            },
            deep:true
        },
        textarea:{
            immediate:true,
            handler(val){
                // ////console.log(val)
            },
            deep:true
        },
        orderId:{
            immediate:true,
            handler(val){
            },
            deep:true
        }
    },
    beforeDestroy(){
        
        clearInterval(this.timerCall)
    },
    destroyed(){
        // window.addEventListener('beforeunload', this.beforeunloadFn)
    },
    created(){
        // window.removeEventListener('beforeunload', this.beforeunloadFn)
    },
    mounted(){
        //console.log(JSON.parse(window.sessionStorage.getItem('role')))
        
        this.imageUrl=this.url+'getPicBytes?orderId='+this.orderId+'&index=paymentQRCode'
        $('.orderDetail').css('height',$(window).height()-$('.orderList').offset().top-$('.btn').height()-10+'px')
        this.url=getUrl()
        // this.schedule('schedule');//联系进度下拉列表
        this.GetlicenseType()
        this.role=JSON.parse(window.sessionStorage.getItem('role')).userrole;
        setTimeout(()=>{
            this.getSchedulesDicts();           
            let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
            let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
            let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
            //  this.doOprInReq2(fenji,gonghao,duilie)
        },100)
        // setTimeout(()=>{this.getLastYear();},200)
        if(this.role==30){
            this.phoneNew=this.order.phone.substring(0,3)+'****'+this.order.phone.substring(7,this.order.phone.length)
        }else{
            this.phoneNew=this.order.phone
        }
        
        if(this.role==30){
            this.otherPhoneNew=this.order.otherphone.substring(0,3)+'****'+this.order.otherphone.substring(7,this.order.otherphone.length)
        }else{
            this.otherPhoneNew=this.order.otherphone
        }
    }
}
</script>

<style lang="scss" scoped>
    .slide-fade-enter-active {
    transition: all .3s ease;
    }
    .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
    }
    .doCall{
        position: fixed;
        top: 250px;
        right: 0;
        width: 100px;
        background: white;
        border-radius: 5px;
        box-shadow: 0px 0px 2px 2px rgba(0,0,0,.5) !important;
        z-index: 999;
        h2{
            font-size: 16px;
            font-weight: normal;
            text-align: center;
            line-height: 40px;
        }
        p{
            line-height: 50px;
            text-align: center;
        }
    }
    .prograss{
        position: fixed;
        top: 250px;
        right: 0;
        width: 40px;
        z-index: 9999;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        background: rgba($color: #000000, $alpha: .7);
        .spanUP{
            border: 1px dashed #ccc !important;
            i{
                margin-top: 50px;
            }
        }
        p{  
            color: white;
            cursor: pointer;
            padding: 50px 0;
            line-height: 40px;
            font-weight: bold;
            -webkit-writing-mode: vertical-rl;
            writing-mode: vertical-rl;
        }
        
    }
    .orderActive{
        border: 1px solid #EA9B13 !important;
            border-left: 3px solid #EA9B13 !important;
    }
    .orderDetail::-webkit-scrollbar {/*滚动条整体样式*/
        width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    .orderDetail::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
        background: rgba(0,0,0,.5);
    }
    .orderDetail::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
        border-radius: 10px;
        background: transparent;
    }
    .red{
        color: red;
        font-weight: normal;
    }
    .calling{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        width: 270px;
        height: 100vh;
        background: rgba(0,0,0,.8);
        .callCont{
            // line-height: 100vh;
            width: 270px;
            height: 100vh;
            margin-top: 300px;
            div{
                margin: 50px 0;
                text-align: center;
                p{
                    color: white;
                }
            }
            .call{
                color: white;
                font-size: 70px;
                cursor: pointer;
            }
            .stop{
                color: white;
                display: inline-block;
                font-size: 20px;
                margin-right: 10px;
            }
        }
    }
    .orderDetail{
        padding: 10px;
        overflow-y: scroll;
        flex: 1;
        .btn{
            position: fixed;
            width: 100%;
            text-indent: 20%;
            z-index: 999;
            bottom: 0;
            background: #f0f0f0;
            box-shadow: 0px -1px 0px rgba(0,0,0,0.2);
            height: 50px;
            line-height: 50px;
        }
        .customerInfo{
            .borderPhone{
                border: 1px solid #DCDFE6;
                border-radius: 4px;
                overflow-y: auto;
                height: 132px;
                .el-popover{
                    width: 300px !important;
                }
                ul{
                    overflow-y: auto;
                    width: 100%;
                    height: 132px;
                }
                li{
                    // text-indent: 14px;
                    font-size: 14px;
                    display: flex;
                    // justify-content: space-around;
                    .result{
                        margin: 0 6px;
                    }
                    b{
                      cursor: pointer;
                      text-indent: 1em;
                      font-weight: normal;
                    }
                    p{
                        cursor: pointer;
                        text-decoration: underline;
                    }
                }
                li:hover{
                    background: #eee;
                }
            }
            .bigImg{
                min-width: 300px;
                max-width: 600px;
                
            }
            
            h2{
                font-size: 14px;
                background: #f0f0f0;
                padding: 5px;
                a{
                    float: right;
                    display: inline-block;
                    margin-right: 15px;
                    color: #bb262b;
                    font-size: 14px;
                }
            }
            
            table{
                width: 95%;
                margin: 10px 0;
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
                    line-height: 36px;
                    td{
                        min-width: 7vw;
                        position: relative;
                        img{
                            cursor: pointer;
                            // position: absolute;
                            // top: 0;
                            // left: 0;
                            width: 130px;
                            height: 120px;
                            
                        }
                        .noteBook{
                            border: 2px solid #DCDFE6;
                            border-radius: 4px;
                            width: 23vw;
                            .note{
                                display: flex;
                                flex-direction: column;
                                .title{
                                    display: flex;
                                    justify-content: space-between;
                                    i{
                                        height: 31px;
                                        line-height: 31px;
                                        text-indent: 1em;
                                        display: block;
                                        width: 100% !important;
                                        border-bottom: 2px solid #e5e5e5;
                                    }
                                    span{
                                        display: block;
                                        width: 50px;
                                        font-weight: bold;
                                        color: #bb262b;
                                        font-size: 14px;
                                        line-height: 31px;
                                        cursor: pointer;
                                    }
                                }
                                
                                .content{
                                    width: 100% !important;
                                    height: 100%;
                                    // border: 1px solid #e5e5e5;
                                    // border-top: none;
                                }
                            }
                            ul{
                                overflow-y: auto;
                                height: 251px;
                                width: 25vw;
                            }
                            li{
                            }
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
        .tabsMsg{
            h2{
                a{
                    float: right;
                    display: inline-block;
                    margin-right: 15px;
                    color: #bb262b;
                    font-size: 14px;
                }
            }
            .ways{
                margin-bottom: 20px;
                h2{
                    font-size: 14px !important;
                    background: #f0f0f0;
                    padding: 5px;
                }
            }
            .proYear{
                .table{
                    width: 95%;
                    
                    tr{
                        line-height: 36px;
                        td{
                            font-size: 12px;
                            p{
                                font-size: 12px;
                                text-align: right;
                                padding-right: 10px;
                                width: 100px;
                            }
                        }
                    }
                    
                }
                .table2{
                    margin: 20px auto;
                    margin-bottom: 50px;
                    border-color:rgb(241, 241, 241);
                    .sanjiao{
                        color: rgb(255, 64, 0);
                        border: 1px solid rgb(255, 64, 0);
                        font-size: 12px;
                        display: inline-block;
                        padding:0 3px;
                        line-height: 20px;
                        border-radius: 3px;
                    }
                    tr:hover{
                        background: #f0f0f0;
                    }
                    th{
                            font-size: 14px;
                            line-height: 30px;
                        }
                    tr{
                        line-height: 36px;
                        text-align: center;
                        font-size: 12px;
                        
                        td{
                            border-color:rgb(241, 241, 241);
                            width: 220px;
                        }
                    }
                }
                h2{
                    font-size: 14px !important;
                    background: #f0f0f0;
                    padding: 5px;
                }
                
            }
            .prograssTable{
                table{
                    width: 100%;
                    margin: 0 auto;
                    text-align: center;
                }
            }
            .offer{
                h2{
                    span{
                        font-weight: normal;
                    }
                }
                .inLeft{
                    border-left: 1px solid #ccc;
                    border-top: 1px solid #ccc;
                    font-size: 14px;
                    .offerMsg{
                        cursor: pointer;
                        display: flex;
                        // background: #f0f0f0;
                        border: 1px solid #ccc;
                        border-left: 3px solid transparent;
                        border-top: none;
                        padding: 10px 0;
                        p{
                            // line-height: 28px;
                            margin-top: 8px;
                            margin-left: 10px;
                        }
                        .insurance{
                            font-weight: bold;
                            span{
                                font-weight: normal;
                            }
                        }
                        img{
                            width: 60px;
                            height: 60px;
                            margin-left: 5px;
                            // border-radius: 50%;
                        }
                        .money{
                            color: red;
                            font-weight: bold;
                        }
                    }
                }
                .inRight{
                    font-size: 12px;
                    margin: 10px;
                    .carType{
                        border: 2px solid rgb(255, 122, 102);
                        width: 500px;
                        line-height: 30px;
                        margin-top: 30px;
                        span{
                            padding: 0 10px;
                        }
                    }
                    table{
                        margin: 20px auto;
                        margin-bottom: 50px;
                        border-color:rgb(241, 241, 241);
                        .sanjiao{
                            color: rgb(255, 64, 0);
                            border: 1px solid rgb(255, 64, 0);
                            font-size: 12px;
                            display: inline-block;
                            padding:0 3px;
                            line-height: 20px;
                            border-radius: 3px;
                        }
                        tr:hover{
                            background: #f0f0f0;
                        }
                        th{
                                font-size: 14px;
                                line-height: 30px;
                            }
                        tr{
                            line-height: 36px;
                            text-align: center;
                            font-size: 12px;
                            
                            td{
                                border-color:rgb(241, 241, 241);
                                width: 220px;
                            }
                        }
                    }
                    p{
                        line-height: 20px;
                        margin: 10px 5px;
                        span{
                            display: inline-block;
                            padding-right:20px;
                        }
                    }
                }
                .table{
                    width: 95%;
                    tr{
                        line-height: 30px;
                        td{
                            font-size: 12px;
                            p{
                                font-size: 12px;
                                text-align: right;
                                padding-right: 10px;
                                width: 100px;
                            }
                        }
                    }
                    
                }
                h2{
                    font-size: 14px;
                    background: #f0f0f0;
                    padding: 5px;
                    a{
                        float: right;
                        display: inline-block;
                        margin-right: 15px;
                        color: #bb262b;
                        font-size: 14px;
                    }
                }
                .ownerMsg{
                    display: flex;
                    margin: 10px;
                    padding-bottom: 3px;
                    border-bottom: 1px solid #ccc;
                    p{
                        background: #f0f0f0;
                        font-size: 14px;
                        margin-right: 10px;
                    }
                }
            }
        }
    }
</style>


