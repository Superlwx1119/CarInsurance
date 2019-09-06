<template>
    <div id="Saleslist" class="Saleslist" @mousemove="showPro" v-loading="showDetali">
        <div v-if="$store.state.show">
            <transition name="fade" mode="out-in">
                <div>
        <div class="tagCont">
            <!-- 上部条件搜索框 -->
            <div class="doSelect" v-if="screenWidth>=1800">
            <el-row class="rowSpan">
                    <el-form :inline="true">
                        <el-form-item>
                            <div class="rows" >
                                <span>品牌搜索:</span>
                                <el-autocomplete
                                class="inline-input"
                                v-model="brand"
                                size="small"
                                :fetch-suggestions="querySearch"
                                placeholder="请输入内容"
                                @select="handleSelect"
                                ></el-autocomplete>
                                <!-- <el-input autocomplete='on' @blur='lostBlur' v-model="brand" size="small" placeholder="支持模糊搜索"></el-input> -->
                            </div>
                        </el-form-item>
                        <el-form-item >
                            <div class="rows" >
                            <span>订单号:</span>
                            <div>
                                <el-input type="text" size="small" v-model="orid"></el-input>
                            </div>
                            </div>
                        </el-form-item>
                        <el-form-item v-if="role==1||role==20" >
                            <span>派发状态:</span>
                            <el-select clearable v-model="sfState" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in sfStates"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item >
                            <div class="rows">
                                <span>联系进度:</span>
                                <el-cascader
                                id="cascader"
                                v-model="prograss"
                                :options="schedules"
                                clearable
                                size="small"
                                :props="{ expandTrigger: 'hover' }"
                                @change="handleChange"></el-cascader>
                            </div>
                            
                        </el-form-item>
                        <!-- <el-form-item>
                            <div class="rows">
                                <span>年龄范围:</span>
                                <el-select clearable v-model="ageRange" size="small" placeholder="请选择">
                                    <el-option
                                    v-for="item in ageRanges"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item> -->
                        <el-form-item style="padding-left:50px;">
                            <el-button type="primary" size="small" @click="search"><i class="el-icon-search"></i>查询</el-button>
                        </el-form-item>
                        
                    </el-form>
            </el-row>
            <el-row  class="rowSpan">
              <el-form :inline="true">
                    <el-form-item >
                        <div class="rows" >
                        <span>车主姓名:</span>
                        <div><el-input type="text" size="small" v-model="name"></el-input></div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="rows" >
                        <span>身份证:</span>
                        <div>
                            <el-input type="text" size="small" v-model="credentislasnum"></el-input>
                        </div>
                        </div>
                    </el-form-item>
                    
                    <el-form-item  v-if="role==1||role==20">
                        <span>销售员:</span>
                        <el-select v-model="salesMan"  clearable size="small" filterable  placeholder="请选择">
                            <el-option
                            v-for="item in saler"
                            :key="item.userid"
                            :label="item.username"
                            :value="item.username">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-form-item>
                        <div class="rows" >
                        <span>批次号:</span>
                        <div>
                            <el-input type="text" size="small" v-model="batch"></el-input>
                        </div>
                        </div>
                    </el-form-item>
                    <!-- <el-form-item>
                        <div class="rows">
                            <span>无联系方式:</span>
                            <el-radio-group class="noCall" v-model="noCall">
                                <el-radio :label="1">无</el-radio>
                                <el-radio :label="2">有</el-radio>
                                <el-radio :label="0">全选</el-radio>
                            </el-radio-group>
                        </div>
                    </el-form-item> -->
                    <el-form-item style="padding-left:50px;" class="reset">
                        <!-- <el-button type="primary" size="small" @click="search"><i class="el-icon-search"></i>查询</el-button> -->
                        <el-button size="small"  @click="reset"><i class="el-icon-setting"></i>重置</el-button>
                    </el-form-item>
              </el-form>
            </el-row>
            <!-- <el-row class="rowSpan">
                <el-form :inline="true">
                    <el-form-item>
                        <div class="rows">
                            <span>下次联系时间:</span>
                            <el-date-picker
                            unlink-panels
                            v-model="nextContactTime"
                            value-format="yyyy-MM-dd"
                            align="right"
                            :picker-options="pickerOptions"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            type="daterange"
                            size="small"
                            range-separator='至'
                            placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                </el-form>
            </el-row> -->
            </div>
            <!-- 右侧条件搜索框 -->
            <div class='doSelectSmall' v-else>
                <transition name="slide-fade">
                    <div  @click="showSearch" class="prograss" v-if="selectSearch"  >
                        <p><i class="el-icon-menu"></i>操作</p>
                    </div>
                </transition>
            </div>
            
            <el-drawer
            title="操作列表"
            :visible.sync="selectSide"
            direction="rtl"
            :before-close="showSearch">
            <el-form :inline="true">
                <el-form-item>
                    <div class="rows" >
                    <span class="titel">车主姓名:</span>
                    <div><el-input type="text" size="small" v-model="name"></el-input></div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="rows" >
                    <span class="titel">联系进度:</span>
                    <el-cascader
                    v-model="prograss"
                    id="cascader"
                    :options="schedules"
                    clearable
                    size="small"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange"></el-cascader>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="rows" v-if="role==1||role==20">
                    <span class="titel">销售员:</span>
                    <el-select v-model="salesMan" clearable size="small" filterable  placeholder="请选择">
                        <el-option
                        v-for="item in saler"
                        :key="item.userid"
                        :label="item.username"
                        :value="item.username">
                        </el-option>
                    </el-select>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="rows" >
                    <span class="titel">身份证:</span>
                    <div>
                        <el-input type="text" size="small" v-model="credentislasnum"></el-input>
                    </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="rows" v-if="role==1||role==20">
                        <span class="titel">派发状态:</span>
                        <el-select clearable v-model="sfState" size="small" placeholder="请选择">
                            <el-option
                            v-for="item in sfStates"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="rows" >
                    <span class="titel">订单状态:</span>
                    <el-select clearable v-model="orderState" size="small" placeholder="请选择">
                        <el-option
                        v-for="item in orderStates"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    </div>
                </el-form-item>
                <el-form-item>
                    <div class="rows" >
                    <span class="titel">品牌搜索:</span>
                    <el-autocomplete
                    class="inline-input"
                    v-model="brand"
                    size="small"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入内容"
                    @select="handleSelect"
                    ></el-autocomplete>
                    <!-- <el-input clearable v-model="brand" size="small" placeholder="支持模糊搜索"></el-input> -->
                    </div>
                </el-form-item>
                <el-form-item class="center">
                    <el-button type="primary" size="small" @click="search"><i class="el-icon-search"></i>查询</el-button>
                    <el-button size="small"  @click="reset"><i class="el-icon-setting"></i>重置</el-button>
                    <el-button size="small" @click="showSearch" >取消</el-button>
                </el-form-item>
            </el-form>
            </el-drawer>
            <!-- 表格操作 -->
            <el-row class="listBtn" type="flex" justify="end">
                  <el-col :span="2" >
                      <el-button size="small" @click="addMine" >
                          <!-- <i class="el-icon-circle-plus-outline"></i> -->
                          添加至待办
                      </el-button>
                  </el-col>
                  <el-col v-if="role==1||role==20" :span="2">
                      <el-button size="small"  @click="doOperation('edit')">
                      <!-- <i class="el-icon-edit"></i> -->
                      批量调单
                      </el-button>
                  </el-col>
                  <el-col v-if="role==1||role==20" :span="2">
                      <el-button size="small"  @click="doOperation('back')">
                          <!-- <i class="el-icon-document"></i> -->
                          回收订单
                          </el-button>
                  </el-col>
                  <!-- <el-col :span="2"><el-button size="small" @click="doOperation('sort')"><i class="el-icon-sort"></i>同步订单</el-button></el-col> -->
                  <el-col :span="2">
                      <el-button size="small" @click="reload">
                          <!-- <i class="el-icon-refresh"></i> -->
                          刷新订单
                      </el-button>
                  </el-col>
                  <!-- <el-col :span="2"><el-button size="small" ><i class="el-icon-tickets"></i>订单记录</el-button></el-col> -->
                  <!-- <el-col :span="2" v-if="role==1">
                    <el-upload
                        class="upload-demo"
                        action="1"
                        ref="upload"
                        :show-file-list='false'
                        :limit="1"
                        :before-upload="beforeUpload">
                        <el-button size="small" >导入Excel</el-button>
                    </el-upload>
                  </el-col>
                  <el-col :span="2" >
                      <el-button size="small" @click="dialogVisible = true" >
                          添加车牌
                      </el-button>
                  </el-col>
                  <el-col :span="2" v-if="role==1">
                      <el-button size="small" @click="dialogSearch = true" >
                          查询信息
                      </el-button>
                  </el-col> -->
                  <el-col :span="2" v-if="role==1">
                      <el-button size="small" @click="Isexcel" >
                          导出订单
                      </el-button>
                  </el-col>
                  <el-col :span="5" >
                      <el-input placeholder="请输入手机号" size="small" v-model="telPhone" class="input-with-select">
                          <el-button slot="append" @click="searchByTel" size="small" icon="el-icon-search">搜索</el-button>
                      </el-input>
                      <!-- <el-input placeholder="请输入内容" size="small" v-model="input3" class="input-with-select">
                        <el-select v-model="select" slot="prepend" placeholder="请选择">
                        <el-option label="餐厅名" value="1"></el-option>
                        <el-option label="订单号" value="2"></el-option>
                        <el-option label="用户电话" value="3"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input> -->
                  </el-col>
                  <el-dialog
                    title="查询信息"
                    @close='queryChepaiList(false)'
                    :visible.sync="dialogSearch"
                    width="50%">
                    <div v-if="showTable" v-loading="loading2" @keyup.enter="queryChepaiList(true)">
                        <el-input placeholder="请输入关键词" v-model="searchLin" ></el-input>
                        <span style="text-align:right;display:block;margin-top:20px;" slot="footer" class="dialog-footer">
                            <el-button @click="queryChepaiList(false)">取 消</el-button>
                            <el-button type="primary" @click="queryChepaiList(true)">确 定</el-button>
                        </span>
                    </div>
                    <div v-else>
                        <el-table
                        :data="searchTable"
                        v-loading='loading2'
                        height="500"
                        style="width: 100%">
                        <el-table-column
                            type="index"
                            align="center"
                            width="40">
                        </el-table-column>
                        <el-table-column
                            prop="xm"
                            label="姓名">
                        </el-table-column>
                        <el-table-column
                            prop="dh"
                            label="电话">
                        </el-table-column>
                        <el-table-column
                            prop="sfz"
                            label="身份证">
                        </el-table-column>
                        </el-table>
                        <el-pagination
                        @current-change="handleCurrentChange2"
                        :current-page="currentPage"
                        :page-sizes="[20, 50, 100, 200]"
                        :page-size="size2"
                        layout="total, prev, pager, next, jumper"
                        :total="total2">
                        </el-pagination>
                    </div>
                  </el-dialog>
                  <el-dialog
                    title="添加车牌"
                    class="addLin"
                    :visible.sync="dialogVisible"
                    width="30%">
                    <el-input placeholder="请输入内容" v-model="addCarId" class="input-with-select">
                        <el-select v-model="selectArea" slot="prepend" >
                            <el-option v-for="(item,index) of selectAreas" :label="item" :key="index" :value="item"></el-option>
                        </el-select>
                    </el-input>
                    <!-- <el-input type="text" v-model="addCarId" placeholder="请输入车牌"></el-input> -->
                    <span slot="footer" class="dialog-footer">
                        <el-button  @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="insertOneCarnum">确 定</el-button>
                    </span>
                  </el-dialog>
            </el-row>
            <div class="table">
            <el-table
            @selection-change="selsChange"
            @sort-change="sort"
            v-loading="loading"
            @row-click='rowClcik'
            :row-class-name="tableRowClassName"
            ref="tables"
            size='mini'
            :height="heightTable"
            :data="tableData"
            border
            style="width: 95%">
            <!-- :default-sort = "{prop: sortField, order: sortWay}" -->
                <el-table-column
                    type="index"
                    fixed
                    align="center"
                    width="45">
                </el-table-column>
                <el-table-column
                    fixed
                    type="selection"
                    align="center"
                    width="45">
                </el-table-column>
                <!-- <el-table-column
                    fixed
                    prop="licenseNo"
                    align="center"
                    label="车牌号">
                    <template slot-scope="scpoe">
                      <p class="licenseNo" >{{scpoe.row.licenseNo}}</p>
                    </template>
                </el-table-column> -->
                <el-table-column
                    prop="orid"
                    align="center"
                    label="订单号">
                </el-table-column>
                <el-table-column
                    prop="licenseOwner"
                    align="center"
                    label="车主">
                </el-table-column>
                <el-table-column
                    prop="licenseSex"
                    align="center"
                    label="性别">
                    <template slot-scope="scpoe">
                      <p >{{scpoe.row.licenseSex|sex}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="phone"
                    align="center"
                    label="电话"
                >
                    <template slot-scope="scpoe">
                      <p >{{scpoe.row.phone|hiddenPhone}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="clientAge"
                    align="center"
                    label="年龄"
                >
                </el-table-column>
                <el-table-column
                    prop="credentislasnum"
                    align="center"
                    label="身份证"
                >
                </el-table-column>
                 <el-table-column
                    prop="modlename"
                    align="center"
                    label="品牌">
                </el-table-column>
                <el-table-column
                    prop="lifeSchedule"
                    align="center"
                    label="联系进度">
                </el-table-column>
                <el-table-column
                    v-if="role!=30"
                    prop="sfpd"
                    align="center"
                    label="派单状态">
                </el-table-column>
                <el-table-column
                    prop="lifeDistributeTime"
                    align="center"
                    sortable='custom'
                    label="派单时间">
                    <template slot-scope="scpoe">
                      <p >{{scpoe.row.lifeDistributeTime|time}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="lifeFollowTime"
                    align="center"
                    sortable='custom'
                    label="跟进时间">
                    <template slot-scope="scpoe">
                      <p >{{scpoe.row.lifeFollowTime}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="text"
                    align="center"
                    show-overflow-tooltip
                    label="记事本">
                </el-table-column>
                <el-table-column
                    v-if="role!=30"
                    prop="lifeUserName"
                    align="center"
                    label="销售员">
                </el-table-column>
                <el-table-column
                    prop="remainingTime"
                    align="center"
                    label="剩余跟进时间">
                </el-table-column>
                <el-table-column
                    prop="orderBatch"
                    align="center"
                    label="批次号">
                </el-table-column>
            </el-table>
            </div>
        </div>
        <div class="page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            background
            :page-sizes="[20, 50, 100, 200 ,500 ,1000]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
        </div>
            </transition>
        </div>
        <div v-if="!$store.state.show">
            <transition name="fade" mode="out-in">
                <router-view :schedules='schedules'></router-view>
            </transition>
        </div>
        <!-- 弹窗操作 -->
        <transition name="el-fade-in">
            <div class="operation" v-if="operation">
                <div class="operationCont">
                    <h2>{{operationTxt}}<span @click="cancelOperation">×</span></h2>
                    <table v-if="operationKind=='edit'">
                        <tr>
                            <td>销售员:</td>
                            <td>
                                <el-select v-model="value" multiple filterable clearable placeholder="请选择">
                                    <el-option
                                    v-for="item in saler"
                                    :key="item.userid"
                                    :label="item.username"
                                    :value="item.userid">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                    </table>
                    <table v-if="operationKind=='sort'">
                        <tr>
                            <td>提示:</td>
                            <td>
                                请不要频繁同步订单!
                            </td>
                        </tr>
                    </table>
                    <table v-if="operationKind=='setting'">
                        <tr>
                            <td>订单状态:</td>
                            <td>
                                <el-select v-model="changeStates"  placeholder="请选择">
                                    <el-option
                                    v-for="item in orderStates"
                                    clearable
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                    </table>
                    <p>
                        <el-button  @click="cancelOperation">取消</el-button>
                        <el-button  type="primary" @click="update(operationKind)">确定</el-button>
                    </p>
                </div>
            </div>
        </transition>
        <!-- 子组件引入,以便来电查询订单 -->
        <SalesDetail  ref="callIN" class="SalesDetail"/>
    </div>
</template>

<script>
import getUrl from '@/assets/js/getUrl.js';
import store from '@/store'
import commod from '@/assets/js/commod.js';
import time from '@/assets/js/time.js';
import call from '@/assets/js/hcall_phone.js';
import {UMO} from '@/assets/js/UniMediaAPI.js'
import XLSX from 'xlsx'
import Blob from '@/vendor/Blob.js'
import Export2Excel from '@/vendor/Export2Excel.js'
import SalesDetail from './SalesDetail';
export default {
    name:'Saleslist',
    components:{
        SalesDetail
    },
    filters:{
        time(val){
            return time(val)
        },
        sex(val){
            if(val==1){
                return '男'
            }else if(val==2){
                return '女'
            }else{
                return '暂无'
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
    },
    props:{
      table:Array,
      totalSum:Number,
      rows:Number,
      schedules:Array
    },
    data() {
      return {
        credentislasnum:'',
        brands:[],
        ageRange:'',
        ageRanges:[{label:'20-30',value:1},{label:'31-40',value:2},{label:'41-50',value:3},{label:'51-70',value:4}],
        brand:'',
        selectSide:false,
        selectSearch:false,
        noCall:0,
        nextContactTime:[],
        showDetali:false,
        lastsource:[],
        telPhone:'',
        sources:[{label:'太平洋保险',value:'1'},{label:'中国平安',value:'2'},{label:'中国人保',value:'4'},{label:'中国人寿',value:'8'},{label:'其他',value:'9'}],
        currentPage:1,
        size2:20,
        total2:0,
        loading2:false,
        searchTable:[],
        showTable:true,
        selectArea:'湘',
        selectAreas:['湘','京','津','沪','渝','冀','豫','云','辽','黑','皖','鲁','新','苏','浙','赣','鄂','桂','甘','晋','蒙','陕','吉','闽','贵','粤','青','藏','川','宁','琼','使','领'],
        addCarId:'',
        cm_login:'',
        orid:'',
        salesMan:'',
        sfState:'',
        sfStates:[{label:'未派发',value:0},{label:'已派发',value:1}],
        saler:[],
        batch:'',
        name:'',
        timerTwo:null,
        selection:[],
        registeredDate:[],
        jqxdqDate:[],
        syxdqDate:[],
        selectedOptions: [],
        orderStates:[],
        operation:false,
        changeStates:'',
        dialogVisible:false,
        operationKind:'',
        operationTxt:'批量调单',
        heightTable:'',
        pickerOptions: {
          shortcuts: [{
            text: '一周后',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '三十天后',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '六十天后',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 60);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '九十天后',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value2:'',
        editableTabsValue: '1',
        value:'',
        editableTabs: [{
          title: '销售列表',
          name: '1',
        }, ],
        total:0,
        state:[{label:'无人接听',value:0},{label:'开场白',value:1},{label:'2',value:2},{label:'3',value:3},{label:'4',value:4},{label:'5',value:5}],
        currentPage4:1,
        size:20,
        checked:'',
        tabIndex: 1,
        prograss:[],
        asdL:{},
        role:'',
        orderState:'',
        tableData: [],
        loading:false,
        cm_callsate:0,
        cm_logstart:null,
        selectData:'',
        sortField:'lifeFollowTime',
        sortWay:'descending',
        searchLin:'',
        dialogSearch:false,
        timer:null,
        screenWidth: document.body.clientWidth,
        EvtHandler:{// 就绪通知
                that:this,
                onReadyState : (status) =>{
                    console.log(status)
                    if(status == 0 && this.cm_login!=2){//网络判断时系统自动判断重连
                        if(window.confirm('网络异常，是否需要重新签入？')){
                            let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
                            let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
                            let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
                            this.doOprInReq(this.order.otherphone.toString(),fenji,gonghao,duilie)
                        }
                    }
                },
                //来话通知
                onCallincome : (ano, bno, uud) =>{
                    console.log(ano, bno, uud)
                    if(uud){
                        this.callNowState='正在拨号...'
                    }
                    $("#ano").val(ano);
                    $("#bno").val(bno);
                    // setPhoneButtonStatus(true, false, true, true, true, true, "状态:通话中");
                    //来电号码历史记录
                    /*if(ano!=$("#aid").val()){
                        //showHistoryCall(bno);
                        //$("#callinhistory_btn").disabled = false;
                    }*/
                },
                //呼出通话通知
                onTalked : (ano, bno, uud) =>{
                    console.log(ano, bno, uud)
                    this.callin=true
                    if(uud){
                        setTimeout(this.getcdrid(ano, bno), 1000);// 录音
                    }
                },
                //振铃停止通知
                onRingStoped : () =>{
                    console.log('stop')
                },
                // 挂机通知
                onHookChanged : (status) =>{
                    //alert(status);
                    let that=this
                    console.log(status)
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
                            
                            that.callNowState='已挂断...'
                            if(this.callin){
                                that.calling=false
                            }else{
                                setTimeout(()=>{
                                    that.calling=false
                                    that.dialogFormVisible=true
                                },1000)
                            }
                            
                            // document.getElementById(querys.wb_OrderId).contentWindow.setCallInfo(querys);
                            // $('#pStatus').val(1);// 呼入
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
                    console.log(status)
                    // if(status==4){
                    //     //正在工作
                    //     this.callNowState='等待接听...'
                    // }
                },
                // 异步操作结束通知
                onAsyncFinished : (atype, taskid, ret, desc) =>{
                    console.log(atype, taskid, ret, desc)
                    let that=this
                    if(ret==0&&atype==8){
                        this.callNowState='正在通话...'
                        var ano = this.fenji;
                        var bno = this.order.otherphone;
                        setTimeout(that.getcdrid(ano, bno), 1000);
                    }
                    if(ret==2&&atype==8){
                        this.callNowState='等待接听...'
                    }
                },
            
                onAllBusy : function(status, acd, quelen) {
                    console.log(status, acd, quelen)
                },
                // 队列长度通知
                onQuelen : function(acd, quelen) {
                    console.log(acd, quelen)
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
    watch: {
          screenWidth (val) {
                // if (!this.timer) {
                //     this.screenWidth = val
                //     this.timer = true
                //     let that = this
                //     setTimeout(function () {
                //         // that.screenWidth = that.$store.state.canvasWidth
                //         console.log(that.screenWidth)
                //         // that.init()
                //         that.timer = false
                //     }, 400)
                // }
            }
    },
    methods: {
        handleSelect(item) {
            // this.brands.push(item.value)
            // document.cookie="brands="+this.brands+';'
            // console.log(document.cookie);
        },
        createFilter(queryString) {
            return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        querySearch(queryString, cb) {//聚焦获取cookie
            this.getCookie()
            let arr=[]
            this.brands.forEach((item,index)=>{
                arr.push({value:item})
            })
            var restaurants = arr;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        Isexcel(){//导出订单
            this.currentPage4=1
            this.loading=true
            let data={
                Isexcel:'1',
                rows:this.size,
                existPhone:this.noCall,
                orid:this.orid,
                nextContactTime:this.nextContactTime.toString(),
                page:this.currentPage4,
                credentislasnum:this.credentislasnum,
                modlename:this.brand,
                lastsource:this.lastsource.toString(),
                clientname:this.name,
                statue:this.orderState,
                orderBatch:this.batch,
                lifeSchedule:this.prograss[1],
                username:this.salesMan,
                registerDate:this.registeredDate.toString(),
                syxdqDate:this.syxdqDate.toString(),
                jqxdqDate:this.jqxdqDate.toString(),
                sfpd:this.sfState,
                sort:this.sortField,
                order:this.sortWay,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            console.log(data)
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getOrders',
                data:this.$Qs.stringify(data)
            }).then((res)=>{
                this.loading=false
                console.log(res)
                clearTimeout(this.timerTwo)

                this.timerTwo=setTimeout(()=>{
                    //导出Excel
                    require.ensure([], () => {　　
                    const { export_json_to_excel } = require('@/vendor/Export2Excel');　　//引入文件　　　　　　 
                    let tHeader = ['车牌号','批次号','销售员','部门','上年投保','联系进度','最后跟进时间']; //将对应的属性名转换成中文 
                    tHeader=tHeader.concat(this.arrDate)
                    // console.log(tHeader,arrDate)
                    let filterVal = ['licenseNo','orderBatch','userName','userDeptName','source','proStatu','insTime'];//table表格中对应的属性名　　
                    filterVal=filterVal.concat(this.arrDate)
                    // console.log(this.getSchedule)
                    let list = res.data.rows;　　　　　　　　 
                    let data = this.formatJson(filterVal, list);　　　　　　　　 
                    export_json_to_excel(tHeader, data, '跟进记录');　　　　　　 
                    }) 
                },200)
            })
        },
        formatJson(filterVal, jsonData) {
            //导出Exl模板
                return jsonData.map(v => filterVal.map(j => v[j]))
        },
        lostBlur(){//  缓存品牌
            if(this.brands.indexOf(this.brand)<0){
                this.brands.unshift(this.brand)
                if(this.brands.length>6){
                    this.brands.pop()
                }
                document.cookie="brands="+this.brands+';'
            }
        },
        getCookie(){//获取品牌cookie
            let brands=document.cookie.split(";")[0].split("=")[1]; 
            let arr=[]
            if(brands){
                brands.split(',').forEach(item=>{
                    // let json={}
                    // json.value=item
                    arr.push(item)
                })
                this.brands=arr
            }
            

            // var date=new Date(); //清除cookie
            // date.setTime(date.getTime()-10000); 
            // document.cookie="brands=v; expires="+date.toGMTString();
        },
        
        showSearch(){//小窗口条件查询框
            this.selectSide=!this.selectSide
        },
        showPro(event){//小窗口菜单按钮
            if(document.body.clientWidth-event.pageX<=100){
                this.selectSearch=true
            }else{
                this.selectSearch=false
            }
        },
        addMine(){//添加至我的待办
            let id=[]
          this.selection.filter(item => {
            id.push(item.id)
          });
          if(id.length<=0){
            this.$alert('未选择订单', '提示', {
              confirmButtonText: '确定',
            });
            return
          }
          this.$confirm('是否添加此批订单('+id.length+')条到我的待办', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(()=>{
                    this.loading=true
                    let data={
                        muns:id.toString(),
                        userid:JSON.parse(window.sessionStorage.getItem('role')).userid,
                    }
                    this.$axios({
                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                        method: 'post',
                        url: getUrl()+'saveSchedule',
                        data:this.$Qs.stringify(data)
                    }).then(res=>{
                        console.log(res)
                        this.loading=false
                        if(res.data=="success"){
                            //成功
                            this.operation=false
                            this.reload();
                            this.value=''
                            this.$notify({
                            title: '成功',
                            message: '添加成功',
                            type: 'success'
                            });

                        }else{
                            this.$notify.error({
                            title: '错误',
                            message: '添加失败',
                            });
                        }
                    })
                })
          
        },
        searchByTel(){//通过电话查询订单
            if(this.telPhone==''){
                this.$message.error('电话号码不能为空!')
                return
            }
            this.$message({
            message: '正在查询请稍后...',
            type: 'success'
            });
            this.$refs.callIN.callIn(this.telPhone,true)
        },
        handleCurrentChange2(val){//查询信息翻页
            this.currentPage=val
            this.queryChepaiList(true)
        },
        queryChepaiList(show){
            if(show){//查询信息
                if(this.searchLin==''){
                    this.$message.error('请输入关键词!')
                    return
                }
                this.loading2=true
                let data={
                    keyword:this.searchLin,
                    page:this.currentPage
                }
                this.$axios({
                method: 'post',
                url: getUrl()+'queryChepaiList',
                data:this.$Qs.stringify(data)
                }).then(res=>{
                    // console.log(res)
                    this.showTable=false
                    this.loading2=false
                    this.total2=res.data.total
                    this.searchTable=res.data.rows
                })
            }else{//关闭
                this.showTable=true
                this.searchLin=''
                this.dialogSearch=false
            }
            
        },
        insertOneCarnum(){//添加车牌
            var xreg=/^[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
            var creg=/^[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
            var reg=/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
            let pass
            if(reg.test(this.selectArea+this.addCarId)){
                pass=true
            }else{
                pass=false
            }
            // if(this.addCarId.length == 5){
            //     if(creg.test(this.addCarId)){
            //         pass=true
            //     }else{
            //         pass=false
            //     }
                
            // } else if(this.addCarId.length == 6){
            //     if(xreg.test(this.addCarId)){
            //         pass=true
            //     }else{
            //         pass=false
            //     }
            // } else{
            //     this.$alert('请输入正确的车牌号!', '提示!', {
            //         confirmButtonText: '确定',
            //     });
            //     return false;
            // }
            if(!pass){
                this.$alert('请输入正确的车牌号!', '提示!', {
                    confirmButtonText: '确定',
                });
                return false;
            }
            let data={
                carnum:this.selectArea+this.addCarId
            }
            this.$axios({
              method: 'post',
              url: getUrl()+'insertOneCarnum',
              data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res)
                if(res.data.status==1){
                    this.dialogVisible=false
                    this.addCarId=''
                    this.$notify({
                    title: '成功',
                    message: res.data.message,
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
        sort(column, prop, order){
            //排序
            if(column.prop){
                this.sortField=column.prop
            }else{
                this.sortField=''
            }
            if(column.order){
                // if(column.order=='ascending'){
                    this.sortWay=column.order
                // }else if(column.order=='descending'){
                //     this.sortWay='desc' 
                // }
            }else{
                this.sortWay='' 
            }
            // this.tableData=this.table
            // this.total=this.totalSum
            // this.currentPage4=this.rows
            // let data=JSON.parse(window.sessionStorage.getItem('selectData'))
            // this.carId=data.licenseNo
            // this.name=data.clientname
            // this.orderState=data.statue
            // this.prograss=data.schedule
            // this.registeredDate=data.registerDate
            // this.syxdqDate=data.syxdqDate
            // this.jqxdqDate=data.jqxdqDate
            // this.sfState=data.sfpd
            // this.sortField=data.sort
            // this.sortWay=data.order
            this.getOrders()
            
        },
        fn(){
          //console.log(this.syxdqDate)
        },
        clickTab(val,e){
            //点击标签
            //console.log(val,e)
        },
        handleChange(value){
            console.log(value);
        },
        selsChange(selection){
            //选择订单
            this.selection=selection
        },
        doOperation(kind){
            //表格操作
            this.operation=true
            if(kind=='edit'){
                //批量调单
                this.operationKind='edit'
                this.operationTxt='批量调单'
            }else if(kind=='sort'){
                //同步订单
                this.operationKind='sort'
                this.operationTxt='同步订单'
            }else if(kind=='back'){
                //回收订单
                // this.operationKind='setting'
                // this.operationTxt='修改订单状态'
                this.operation=false
                this.$confirm('是否回收此批订单('+this.selection.length+')条', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(()=>{
                  this.updateOrderFieldNull()
                })
                
            }else if(kind=='refresh'){
                //刷新订单
                this.operationKind='refresh'
                this.operationTxt='刷新订单'
            }else if(kind=='tickets'){
                //订单记录
                this.operationKind='tickets'
                this.operationTxt='订单记录'
            }
        },
        updateOrderFieldNull(){
          //回收订单
          let id=[]
          this.selection.filter(item => {
            id.push(item.id)
          });
          if(id.length<=0){
            this.$alert('未选择订单', '提示', {
              confirmButtonText: '确定',
            });
            return
          }
          this.loading=true
          let data={
            orderIds:id.toString(),
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'updateOrderFieldNull',
              data:this.$Qs.stringify(data)
          }).then(res=>{
              //console.log(res)
              this.loading=false
              if(res.data.status=='1'){
                this.reload()
                this.$notify({
                    title: '成功',
                    message: res.data.message,
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
        tableRowClassName({row, rowIndex}){//索引表格行
            row.index = rowIndex;
        },
        rowClcik(row,e){
            //选择表格行
            if(e.type=='selection'){
                return
            }
            store.dispatch('showDetail',false)
            // store.dispatch('toSelect',JSON.parse(this.selectData))
            window.sessionStorage.setItem('selectData',this.selectData)
            this.show=sessionStorage.getItem('show')
            this.$router.push({name:'订单详情',params:{khid:row.clientId,licenseNo:row.licenseNo,ddid:row.id,index:row.index,page:this.currentPage4,rows:this.size,tableData:this.tableData}})
        },
        cancelOperation(){
            //取消表格操作
            this.operation=false
            this.value=''
        },
        handleSizeChange(val){
            //每页数据条数
            this.size=val
            this.getOrders()
        },
        handleCurrentChange(val){
            //选择当前页
            this.currentPage4=val
            this.getOrders()
        },
        reset(){
          //重置 
          this.salesMan=''
          this.credentislasnum=''
          this.noCall=0
          this.batch=''
          this.name=''
          this.orid=''
          this.nextContactTime=''
          this.lastsource=[]
          this.orderState=''
          this.prograss=[]
          this.registeredDate=''
          this.syxdqDate=''
          this.jqxdqDate=''
          this.sfState=''
          this.telPhone=''
        },
        search(){
          //查询
          if(this.brand!=''){
              this.lostBlur()//缓存品牌
          }
          this.currentPage4=1
          this.loading=true
          let data={
            rows:this.size,
            existPhone:this.noCall,
            orid:this.orid,
            nextContactTime:this.nextContactTime.toString(),
            page:this.currentPage4,
            credentislasnum:this.credentislasnum,
            modlename:this.brand,
            lastsource:this.lastsource.toString(),
            clientname:this.name,
            statue:this.orderState,
            orderBatch:this.batch,
            lifeSchedule:this.prograss[1],
            username:this.salesMan,
            registerDate:this.registeredDate.toString(),
            syxdqDate:this.syxdqDate.toString(),
            jqxdqDate:this.jqxdqDate.toString(),
            sfpd:this.sfState,
            sort:this.sortField,
            order:this.sortWay,
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
        //   if(this.noCall){
        //       data.existPhone='1'
        //   }
          console.log(data)
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'getOrders',
              data:this.$Qs.stringify(data)
          }).then((res)=>{
              this.loading=false
              this.total=res.data.total
              this.tableData=res.data.rows
          })
        },
        getOrders(){
          //订单列表
          this.loading=true
          let data={}
          if(this.$route.params.userrole){
            data={
              sort:this.sortField,
              order:this.sortWay,
              modlename:this.brand,
              lastsource:this.lastsource.toString(),
              rows:this.size,
              page:this.currentPage4,
              credentislasnum:this.credentislasnum,
              clientname:this.name,
              orderBatch:this.batch,
              username:this.salesMan,
              statue:this.orderState,
              sfpd:this.sfState,
              lifeSchedule:this.prograss[1],
              syxdqDate:this.syxdqDate.toString(),
              nextContactTime:this.nextContactTime.toString(),
              existPhone:this.noCall,
              jqxdqDate:this.jqxdqDate.toString(),
              registerDate:this.registeredDate,
              userid:this.$route.params.userid
            }
          }else{
            data={
              lastsource:this.lastsource.toString(),
              nextContactTime:this.nextContactTime.toString(),
              sort:this.sortField,
              existPhone:this.noCall,
              modlename:this.brand,
              order:this.sortWay,
              rows:this.size,
              page:this.currentPage4,
              credentislasnum:this.credentislasnum,
              orderBatch:this.batch,
              username:this.salesMan,
              sfpd:this.sfState,
              clientname:this.name,
              statue:this.orderState,
              lifeSchedule:this.prograss[1],
              syxdqDate:this.syxdqDate.toString(),
              jqxdqDate:this.jqxdqDate.toString(),
              registerDate:this.registeredDate.toString(),
              userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
          }
        //   console.log(JSON.stringify(data))
            // if(this.noCall){
            //   data.existPhone='1'
            // }
            
          this.selectData=JSON.stringify(data)//储存查询条件
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'getOrders',
              data:this.$Qs.stringify(data)
          }).then((res)=>{
            //   console.log(res)
              this.loading=false
              this.total=res.data.total
              this.tableData=res.data.rows
          })
        },
        getDicts(ciorderstatus){
          //字典
          this.$axios({
              method: 'get',
              url: getUrl()+'getDicts',
              params:{way:0,type:ciorderstatus}
          }).then(res=>{
            for(let i  in res.data){//订单状态下拉列表
                this.asdL={}
                this.asdL.label=res.data[i]
                this.asdL.value=i
                this.orderStates.push(this.asdL)
            }
          })
        },
        schedule(schedule){//字典 联系进度下拉列表
           this.$axios({
              method: 'get',
              url: getUrl()+'getDicts',
              params:{way:0,type:schedule}
          }).then(res=>{
            for(let i  in res.data){//订单状态下拉列表
                this.asdL={}
                this.asdL.label=res.data[i]
                this.asdL.value=i
                this.state.push(this.asdL)
            }
            
            this.state[8].label='已在其他公司购买'
            this.state[9].label='非本人'
            this.state[10].label='已完成'
            console.log(this.state)
          }) 
        },
        syncOrder(){
          //同步数据
          let id=[]
          this.selection.filter(item => {
            id.push(item.id)
          });
          if(id.length<=0){
            this.$alert('未选择订单', '提示', {
              confirmButtonText: '确定',
            });
            return
          }
          let data={
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid,
            ordersid:id.toString()
          }
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'syncOrder',
              data:this.$Qs.stringify(data)
          }).then(res=>{
              if(res.data=="success"){
                  this.reload()
                  this.$notify({
                  title: '成功',
                  message: '同步成功!',
                  type: 'success'
                  });
              }else{
                  this.$notify.error({
                      title: '错误',
                      message: '同步错误!'
                  });
              }
          })
        },
        update(kind){
          //弹框确认操作
          if(kind=='setting'){//修改订单状态
            this.updateOrderStatus();
          }else if(kind=='sort'){//同步订单
            this.syncOrder();
          }else if(kind=='edit'){//调单
            this.updOrder()
          }
        },
        reload(){
          //刷新订单
          this.reset()
          this.loading=true
          let data={
            sort:this.sortField,
            order:this.sortWay,
            lastsource:this.lastsource.toString(),
            rows:20,
            page:1,
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'getOrders',
              data:this.$Qs.stringify(data)
          }).then((res)=>{
              //console.log(res)
              this.loading=false
              this.total=res.data.total
              this.tableData=res.data.rows
              this.tableData.forEach((item,index) => {
                // if(item.syxdqDate){
                //     item.syxdqDate=commod(item.syxdqDate)
                //   }
                //   if(item.jqxdqDate){
                //     item.jqxdqDate=commod(item.jqxdqDate)
                //   }
                // if(item.orderStatusTime){
                //     item.orderStatusTime=commod(item.orderStatusTime)
                //   }
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
                        if(item.schedule==11){
                        item.schedule="已在其他公司购买"
                        }else if(item.schedule==12){
                        item.schedule="非本人"
                        }else if(item.schedule==13){
                        item.schedule="已完成"
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
              });
          })
        },
        beforeUpload(file){
            //导入订单
            this.files = file;
            const extension2 = file.name.split('.')[1] === 'xlsx'
            if (!extension2) {
            this.$message.warning('上传模板只能是xlsx格式!')
            return
            }
            let fileFormData = new FormData();
            fileFormData.append('upfile', this.files);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
            fileFormData.append('userid', JSON.parse(window.sessionStorage.getItem('role')).userid)
            let requestConfig = {
                headers: {
                'Content-Type': 'multipart/form-data'
                },
            }
            this.$axios({
                headers:{'Content-Type': 'multipart/form-data'},
                method: 'post',
                url: getUrl()+'leadingCarNum',
                data:fileFormData,
            }).then(res=>{
                //console.log(res)
                this.reload();
            }) 
        },
        updOrder(){
          //调单
          let id=[]
          this.selection.filter(item => {
            id.push(item.id)
          });
          if(id.length<=0){
            this.$alert('未选择订单', '提示', {
              confirmButtonText: '确定',
            });
            return
          }
          if(this.value.length==1){//指定派单
            this.loading=true
            let data={
                orderids:id.toString(),
                zd_userid:this.value.toString(),
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'updOrder',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                this.loading=false
                if(res.data.status==1){
                    //成功
                    this.cancelOperation()
                    this.getOrders()
                    // this.reload();
                    this.value=''
                    this.$notify({
                    title: '成功',
                    message: '派单成功!',
                    type: 'success'
                    });

                }else{
                    this.$notify.error({
                    title: '错误',
                    message: '派单失败!',
                    });
                }
            })
          }else if(this.value.length>1){//多人随机派单
                this.$confirm('选择多人将随机派发订单', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(()=>{
                    this.loading=true
                    let data={
                        orderids:id.toString(),
                        usersids:this.value.toString(),
                        userid:JSON.parse(window.sessionStorage.getItem('role')).userid
                    }
                    this.$axios({
                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                        method: 'post',
                        url: getUrl()+'updOrderRandom',
                        data:this.$Qs.stringify(data)
                    }).then(res=>{
                        this.loading=false
                        console.log(res)
                        if(res.data=='success'){
                            //成功
                            this.cancelOperation()
                            this.reload();
                            this.value=''
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
                })
                
          }
          
          
        },
        updateOrderStatus(){
          //修改订单状态
          let id=[]
          this.selection.filter(item => {
            id.push(item.ddid)
          });
          let data={
            orderId:id.toString(),
            status:this.changeStates,
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
              this.reload()
            }
          })
        },
        getUser(){
          let data={
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
          this.$axios({
				  	headers:{'Content-Type':'application/x-www-form-urlencoded'},
            method: 'post',
            url: getUrl()+'getUser',
            data:this.$Qs.stringify(data)
          }).then(res=>{
            //console.log(res)
          })
        },
        getUsers(){
          //管理员获取销售员列表
          this.$axios({
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            method: 'post',
            url: getUrl()+'getUserSelect',
          }).then(res=>{
            // console.log(res)
            this.saler=res.data.filter(item=>{
              return item.userrole==30
            })
          })
        },
        login(){
          //手动签入
          let fenji=JSON.parse(window.sessionStorage.getItem('role')).hcall_nodid//分机号
          let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
          let duilie=JSON.parse(window.sessionStorage.getItem('role')).hcall_queueid//队列号
          this.doOprInReq(fenji,gonghao,duilie)
        },
        doOprInReq(fenji,gonghao,duilie){
            console.log(fenji,gonghao,duilie)
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
                    if (result.errno == 0 || result.errno == -3) {
                        // that.cm_logstart=1;
                        //登出原有座席
                        UMO.logout(aid, function(cmd, result){
                            //签入座席
                            UMO.login(aid, acd, -1, false, false, function(cmd, result) {
                                console.log(result)
                                if (result.errno == 0) {
                                    that.cm_login=1;
                                    that.$notify({
                                      title: '成功',
                                      message: '签入成功!',
                                      type: 'success'
                                    });
                                    // setPhoneButtonStatus(false, true, true, false, true, false, "状态:签入成功");
                                } else {
                                  this.$notify.error({
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
        logout(){
          //手动签出
          let gonghao=JSON.parse(window.sessionStorage.getItem('role')).hcall_jobno//工号
          this.doOprOutReq(gonghao)
        },
        doOprOutReq(gonghao){
            //签出
            var aid = gonghao;//工号
            UMO.logout(aid, (cmd, result)=> {
              console.log(cmd, result)
                if (result.errno == 0) {//
                    this.cm_login=2;
                    this.$notify({
                    title: '成功',
                      message: '签出成功!',
                      type: 'success'
                    });
                    this.hcall_exit();
                    // setPhoneButtonStatus(true, true, true, true, false, true, "状态:等待签入...");
                } else {
                  this.$notify.error({
                      title: '错误',
                      message: result.errmsg
                  });
                    // setPhoneButtonStatus(false, true, true, false, true, false, "状态:签出失败<br>原因:"+result.errmsg);
                }
            }, null);
        },
        hcall_exit(){
            //关闭
            this.cm_callsate = 0;
            this.cm_logstart = 0;
            UMO.exit(cbResult, null)
        },
    },
    created(){
        if(this.table.length==0){
            //初次进入
          let data={
                sort:this.sortField,
                order:this.sortWay,
                rows:this.size,
                lastsource:this.lastsource.toString(),
                page:this.currentPage4,
                credentislasnum:this.credentislasnum,
                orderBatch:this.batch,
                clientname:this.name,
                statue:this.orderState,
                schedule:this.prograss[1],
                username:this.salesMan,
                registerDate:this.registeredDate.toString(),
                syxdqDate:this.syxdqDate.toString(),
                jqxdqDate:this.jqxdqDate.toString(),
                sfpd:this.sfState,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
          window.sessionStorage.setItem('selectData',JSON.stringify(data))
        //   this.getOrders()
        }else{
          this.tableData=this.table
          this.total=this.totalSum
          this.currentPage4=this.rows
          let data=JSON.parse(window.sessionStorage.getItem('selectData'))
          this.credentislasnum=data.credentislasnum
          this.batch=data.orderBatch
          this.name=data.clientname
          this.orderState=data.statue
          this.prograss=data.schedule
          this.registeredDate=data.registerDate
          this.syxdqDate=data.syxdqDate
          this.jqxdqDate=data.jqxdqDate
          this.sfState=data.sfpd
          this.sortField=data.sort
          this.sortWay=data.order
        }
    },
    mounted(){
        const that = this
        window.onresize = () => {
        return (() => {
            window.screenWidth = document.body.clientWidth
            that.screenWidth = window.screenWidth
        })()}
        this.role=JSON.parse(window.sessionStorage.getItem('role')).userrole
        this.getUser()
        this.getUsers();
        this.getCookie()//获取品牌缓存
        this.getDicts('ciorderstatus');//订单状态下拉框
        this.heightTable=$('.page').offset().top-$('.table').offset().top; 
        $('.table').css('height',$('.page').offset().top-$('.table').offset().top+'px')
        if(this.table.length==0){
            //初次进入
          let data={
                sort:this.sortField,
                order:this.sortWay,
                rows:this.size,
                page:this.currentPage4,
                credentislasnum:this.credentislasnum,
                orderBatch:this.batch,
                clientname:this.name,
                statue:this.orderState,
                schedule:this.prograss[1],
                username:this.salesMan,
                registerDate:this.registeredDate.toString(),
                syxdqDate:this.syxdqDate.toString(),
                jqxdqDate:this.jqxdqDate.toString(),
                sfpd:this.sfState,
                userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
          window.sessionStorage.setItem('selectData',JSON.stringify(data))
          this.getOrders()
        }else{
          this.tableData=this.table
          this.total=this.totalSum
          this.currentPage4=this.rows
          let data=JSON.parse(window.sessionStorage.getItem('selectData'))
          this.credentislasnum=data.credentislasnum
          this.batch=data.orderBatch
          this.name=data.clientname
          this.orderState=data.statue
          this.prograss=data.schedule
          this.registeredDate=data.registerDate
          this.syxdqDate=data.syxdqDate
          this.jqxdqDate=data.jqxdqDate
          this.sfState=data.sfpd
          this.sortField=data.sort
          this.sortWay=data.order
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
    .SalesDetail{
		position: absolute;
		// visibility: hidden;
		left: 10000000px;
		top: 0;
		width: 100vw;
	}
    .Saleslist{
        
        .operation{
            z-index: 999;
            background: rgba($color: #000000, $alpha: .7);
            height: 100%;
            width:100%;
            position: fixed;
            top: 0;
            left: 0;
            .operationCont{
                background: white;
                border-radius: 4px;
                width: 500px;
                left: 50%;
                top: 50%;
                position: absolute;
                transform: translate(-50%,-50%);
                table{
                    text-align: center;
                    margin: 10px auto;
                }
                h2{
                    font-size: 16px;
                    font-weight: 700;
                    line-height: 50px;
                    text-indent: 1em;
                    color: white;
                    background: #EA9B13;
                    font-weight: 500;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                    span{
                        float: right;
                        display: inline-block;
                        margin-right: 30px;
                        cursor: pointer;
                    }
                }
                p{
                    text-align: center;
                    margin: 10px 0;
                }
            }
        }
        .listBtn{
            background: white !important;
            padding: 10px;
            margin-right: 100px;
            text-align: right;
            i{
                margin-right: 5px;
            }
            .el-input-group__append button.el-button, .el-input-group__append div.el-select .el-input__inner, .el-input-group__append div.el-select:hover .el-input__inner, .el-input-group__prepend button.el-button, .el-input-group__prepend div.el-select .el-input__inner, .el-input-group__prepend div.el-select:hover .el-input__inner{
                width: 130px !important;
            }
            .el-input-group__append button.el-button[data-v-4b7a97b6]{
                font-size:14px;
                width: 100px !important;
                font-family:PingFang SC;
                background: #EA9B13 !important;
                border: 1px solid #EA9B13 !important;
                color: white !important;
            }
            .el-input-group__append button.el-button[data-v-4b7a97b6]:hover{
                font-size:14px;
                font-family:PingFang SC;
                background: rgb(248, 192, 95) !important;
                border: 1px solid rgb(248, 192, 95) !important;
            }
            .el-input-group--append .el-input__inner, .el-input-group__prepend{
                width: 10vw !important;
            }
            .el-input-group{
                width: 15.5vw !important; 
            }
            .addLin .el-input-group{
                width: 100% !important; 
            }
            .addLin .el-input__inner{
                border: 1px solid rgba(234,155,19,1) !important;
            }
            .el-button--small{
                font-size:14px;
                font-family:PingFang SC;
                background: white !important;
                border: 1px solid rgba(234,155,19,1) !important;
                color: #EA9B13 !important;
                width: 7vw;
            }
            .el-button--small:hover{
                font-size:14px;
                font-family:PingFang SC;
                background: #EA9B13 !important;
                border: 1px solid #EA9B13 !important;
                color: white !important;
            }
        }
        .table{
            height: 90%;
            overflow: auto;
        }
        .tagCont{
            background: #e5e5e5;
            overflow: hidden;
            width: 100vw;
            padding-left: 10px;
            .doSelect{
                background: white;
                margin: 10px 100px 10px 0px;
            }
            .selectSide{
                height: 90vh;
                position: fixed;
                width: 390px;
                top: 60px;
                right: 0;
                z-index: 99;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
                // background: rgba($color: #000000, $alpha: .8);
                background: #eeeeee;
                box-shadow: -1px 2px 5px 0px black;
                padding-top: 50px;
                box-sizing: border-box;
                li{
                    line-height: 35px;
                    span{
                        display: inline-block;
                        width: 120px;
                        padding-left: 20px;
                    }
                    
                }
            }
            .doSelectSmall{
                height: 100%;
                .prograss{
                    cursor: pointer;
                    color: white;
                    width: 30px;
                    position: fixed;
                    top: 250px;
                    right: 0;
                    z-index: 99;
                    padding: 20px;
                    padding-right: 0px;
                    border-top-left-radius: 10px;
                    border-bottom-left-radius: 10px;
                    background: rgba($color: #000000, $alpha: .8);
                }
            }
            .rowSpan{
                span{
                    display: inline-block;
                    width: 110px !important;
                    text-align: center;
                }
            }
        }
        .rows{
            display: flex;
            align-items: center;
            span{
                // display: inline-block;
                width: 110px !important;
                // margin-right: 5px;
            }
            .noCall{
                margin-left: 4px;
            }
        }
        .page{
            position: absolute;
            right: 0;
            z-index: 999;
            bottom: 0;
            background: white;
        }
    }
</style>


