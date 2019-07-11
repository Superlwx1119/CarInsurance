
<template>
    <div class="Saleslist">
        <div v-if="$store.state.show">
            <transition name="fade" mode="out-in">
                <div>
        <div class="tagCont">
          
            <el-row>
                <el-col :span="24">
                    <el-form :inline="true">
                        <el-form-item>
                            <div class="rows" >
                            <span>车牌号:</span>
                            <el-input type="text" size="small" v-model="carId"></el-input>
                            </div>
                        </el-form-item>
                         <el-form-item>
                            <div class="rows" >
                            <span>车主姓名:</span>
                            <el-input type="text" size="small" v-model="name"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <span>联系进度:</span>
                            <el-select v-model="prograss" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in state"
                                :key="item"
                                :label="item"
                                :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item>
                            <span>计划回访时间:</span>
                            <el-date-picker
                                v-model="registeredDate"
                                align="right"
                                type="date"
                                size="small"
                                placeholder="选择日期"
                                :picker-options="pickerOptions1">
                            </el-date-picker>
                        </el-form-item> -->
                        <el-form-item>
                            <span>录单状态:</span>
                            <el-select v-model="orderState" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in orderStates"
                                clearable
                                :key="item.label"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search"  size="small"><i class="el-icon-search"></i>查询</el-button>
                            <el-button size="small"><i class="el-icon-setting"></i>重置</el-button>
                            <el-button size="small" @click="reload"><i class="el-icon-refresh"></i>刷新订单</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <!-- <el-row class="listBtn" justify="end" >
                <el-col :span="24">
                    <el-button size="small" @click="doOperation('setting')"><i class="el-icon-setting"></i>修改订单状态</el-button>
                    <el-button size="small" @click="reload"><i class="el-icon-refresh"></i>刷新订单</el-button>
                </el-col>
            </el-row> -->
            <div class="table">
            <el-table
            size='mini'
            :height='height'
            :data="tableData"
            border
            style="width: 94.5%">
                <el-table-column
                    type="index"
                    fixed
                    align="center"
                    width="40">
                </el-table-column>
                <el-table-column
                    fixed
                    type="selection"
                    align="center"
                    width="45">
                </el-table-column>
                <el-table-column
                    fixed
                    prop="licenseNo"
                    align="center"
                    label="车牌号">
                    <template slot-scope="scpoe">
                      <p class="cph" @click="rowClcik(scpoe.row,scpoe)">{{scpoe.row.licenseNo}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="licenseOwner"
                    align="center"
                    label="车主姓名">
                </el-table-column>
                 <!-- <el-table-column
                    prop="khmc"
                    align="center"
                    label="客户名称">
                </el-table-column> -->
                <!-- <el-table-column
                    prop="syxdqrq"
                    align="center"
                    label="打款方式">
                </el-table-column>
                <el-table-column
                    prop="jqxdqrq"
                    align="center"
                    label="打款账号">
                </el-table-column>
                <el-table-column
                    prop="lxjd"
                    align="center"
                    label="打款金额">
                </el-table-column>
                <el-table-column
                    prop="jhhfsj"
                    align="center"
                    label="打款时间">
                </el-table-column>
                <el-table-column
                    prop="xsy"
                    align="center"
                    label="打款员">
                </el-table-column> -->
                <el-table-column
                    prop="policyStatus"
                    align="center"
                    label="订单状态">
                </el-table-column>
                <el-table-column
                    prop="recorderName"
                    align="center"
                    label="录单员">
                </el-table-column>
                <el-table-column
                    prop="policyStatusTime"
                    align="center"
                    label="派发时间">
                </el-table-column>
            </el-table>
            </div>
        </div>
        <div class="page">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[20, 50, 100, 200]"
            :page-size="size"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
        </div>
            </transition>
        </div>
        <div v-if="!$store.state.show">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
        
    </div>
</template>

<script>
import getUrl from '@/assets/js/getUrl.js';
import commod from '@/assets/js/commod.js';
import store from '@/store'
import call from '@/assets/js/hcall_phone.js';
export default {
    name:'OrderList',
    props:{
      table:Array,
      totalSum:Number
    },
    data() {
      return {
        carId:'',
        orderStates:[],
        loading:false,
        name:'',
        registeredDate:'',
        selectedOptions: [],
        operation:false,
        orderState:'',
        operationKind:'',
        operationTxt:'批量调单',
        height:'',
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          },{
            text: '三十天前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
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
        state:['有意愿','犹豫','无意愿'],
        currentPage4:1,
        size:20,
        checked:'',
        tabIndex: 1,
        prograss:'',
        orderState:'',
        tableData: []
      }
    },
    methods: {
        reload(){
          //刷新列表
          this.loading=true
          let data={
            rows:this.size,
            page:1,
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
          this.$axios({
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              method: 'post',
              url: getUrl()+'getOrders',
              data:this.$Qs.stringify(data)
          }).then((res)=>{
              console.log(res)
              this.loading=false
              this.total=res.data.total
              this.tableData=res.data.rows
              this.tableData.forEach((item,index) => {
                //   if(item.policyStatusTime){
                //       item.policyStatusTime=commod(item.policyStatusTime)
                //   }
                  
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
        clickTab(val,e){
            //点击标签
            console.log(val,e)
        },
        handleChange(value){
            console.log(value);
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
            }else if(kind=='setting'){
                //修改订单状态
                this.operationKind='setting'
                this.operationTxt='修改订单状态'
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
        rowClcik(row,e){
            //选择表格行
            store.dispatch('showDetail',false)
            this.show=sessionStorage.getItem('show')
            this.$router.push({name:'录单详情',params:{khid:row.clientId,licenseNo:row.licenseNo,ddid:row.id,index:e.$index,page:this.currentPage4,rows:this.size,tableData:this.tableData}})
        },
        cancelOperation(){
            //取消表格操作
            this.operation=false
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
        search(){
          //查询
          this.currentPage4=1
          this.loading=true
          let data={
            rows:this.size,
            page:1,
            rows:this.size,
            page:this.currentPage4,
            licenseNo:this.carId,
            clientname:this.name,
            statue:this.orderState,
            schedule:this.prograss,
            registerDate:this.registeredDate,
            userid:JSON.parse(window.sessionStorage.getItem('role')).userid
          }
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
              this.tableData.forEach((item,index) => {
                //   if(item.policyStatusTime){
                //       if(item.policyStatusTime){
                //       item.policyStatusTime=commod(item.policyStatusTime)
                //   }
                //   }
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
        getOrders(){
          //订单列表
          this.loading=true
          let data={}
          if(this.$route.params.userrole){
            data={
              rows:this.size,
              page:this.currentPage4,
              licenseNo:this.carId,
              clientname:this.name,
              statue:this.orderState,
              schedule:this.prograss,
              registerDate:this.registeredDate,
              userid:this.$route.params.userrole
            }
          }else{
            data={
              rows:this.size,
              page:this.currentPage4,
              licenseNo:this.carId,
              clientname:this.name,
              statue:this.orderState,
              schedule:this.prograss,
              registerDate:this.registeredDate,
              userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
          }
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
              this.tableData.forEach((item,index) => {
                //   if(item.policyStatusTime){
                //       item.policyStatusTime=commod(item.policyStatusTime)
                //   }
                //   if(item.syxdqDate){
                //       item.syxdqDate=commod(item.syxdqDate).substring(0,10)
                //   }
                //   if(item.jqxdqDate){
                //       item.jqxdqDate=commod(item.jqxdqDate).substring(0,10)
                //   }
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
        getDicts(){
          //字典
          this.$axios({
              method: 'get',
              url: getUrl()+'getDicts',
              params:{way:0,type:'cipolicyStatus'}
          }).then(res=>{
            // console.log(res)
            for(let i  in res.data){
                this.asdL={}
                this.asdL.label=res.data[i]
                this.asdL.value=i
                this.orderStates.push(this.asdL)
            }
          })
        }
    },
    mounted(){
        // console.log(JSON.parse(window.sessionStorage.getItem('role')).userid)
        this.getDicts()
        this.height=$('.page').offset().top-$('.table').offset().top
        $('.table').css('height',$('.page').offset().top-$('.table').offset().top+'px')
        if(this.table.length==0){
          this.getOrders()
        }else{
          this.tableData=this.table
          this.total=this.totalSum
        }
    }
}
</script>

<style lang="scss" scoped>
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
                    color: #333333;
                    background: rgba(242, 242, 242, 1);
                    border-radius: 4px;
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
            // text-align: right;
            i{
                margin-right: 5px;
            }
            .el-button--small{
                font-size:14px;
                font-family:PingFang SC;
                background: white !important;
                border: 1px solid rgba(234,155,19,1) !important;
                color: #EA9B13 !important;
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
            overflow: hidden;
            width: 100vw;
            padding-left: 10px;
        }
        .rows{
            display: flex;
            span{
                display: inline-block;
                width: 100%;
                margin-right: 5px;
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



