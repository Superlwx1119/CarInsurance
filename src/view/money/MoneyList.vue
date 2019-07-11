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
                        <!-- <el-form-item>
                            <div class="rows" >
                            <span>客户名称:</span>
                            <el-input type="text" size="small" v-model="name"></el-input>
                            </div>
                        </el-form-item> -->
                        <el-form-item>
                            <span>打款状态:</span>
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
                            <el-button type="primary" @click="search" size="small"><i class="el-icon-search"></i>查询</el-button>
                            <el-button size="small" @click="reset"><i class="el-icon-setting"></i>重置</el-button>
                            <el-button size="small" @click="reload"><i class="el-icon-refresh"></i>刷新订单</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <!-- <el-row class="listBtn" >
                <el-col :span="24">
                    <el-button size="small" @click="reload"><i class="el-icon-refresh"></i>刷新订单</el-button>
                </el-col>
            </el-row> -->
            <div class="table">
            <el-table
            v-loading="loading"
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
                </el-table-column>
                <el-table-column
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
                </el-table-column> -->
                <!-- <el-table-column
                    prop="cashierName"
                    align="center"
                    label="打款员">
                </el-table-column> -->
                <el-table-column
                    prop="orderStatus"
                    align="center"
                    label="订单状态">
                </el-table-column>
                <el-table-column
                    prop="remitStatus"
                    align="center"
                    label="汇款状态">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    align="center"
                    label="录单员">
                </el-table-column>
                <el-table-column
                    prop="pfTime"
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
import store from '@/store'
import call from '@/assets/js/hcall_phone.js';
export default {
    name:'MoneyList',
    data() {
      return {
        carId:'',
        loading:false,
        name:'',
        registeredDate:'',
        selectedOptions: [],
        orderStates:[],
        operation:false,
        selection:[],
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
        asdL:{},
        tableData: []
      }
    },
    methods: {
        clickTab(val,e){
            //点击标签
            console.log(val,e)
        },
        handleChange(value){
            console.log(value);
        },
        reload(){
          //刷新订单
          this.reset()
          this.search()
        },
        rowClcik(row,e){
            //选择表格行
            store.dispatch('showDetail',false)
            this.show=sessionStorage.getItem('show')
            this.$router.push({name:'打款详情',params:{khid:row.clientId,ddid:row.id,orderStatus:row.orderStatus}})
        },
        cancelOperation(){
            //取消表格操作
            this.operation=false
        },
        handleSizeChange(val){
            //每页数据条数
            this.size=val
            this.search()
        },
        handleCurrentChange(val){
            //选择当前页
            this.currentPage4=val
            this.search()
        },
        reset(){
          //重置
          this.carId=''
          this.name=''
          this.orderState=''
        },
        search(){
          //查询
          this.size=20
          this.currentPage4=1
          this.getOrders()
        },
        getOrders(){
          //打款列表
          this.loading=true
          let data={}
          if(this.$route.params.userrole){
            data={
              rows:this.size,
              page:this.currentPage4,
              licenseNo:this.carId,
              clientname:this.name,
              remitStatus:this.orderState,
              userid:this.$route.params.userrole
            }
          }else{
            data={
              rows:this.size,
              page:this.currentPage4,
              licenseNo:this.carId,
              clientname:this.name,
              statue:this.orderState,
              userid:JSON.parse(window.sessionStorage.getItem('role')).userid
            }
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
                  if(item.remitStatus){
                      if(item.remitStatus==1){
                        item.remitStatus='汇款失败'
                    }else if(item.remitStatus==0){
                        item.remitStatus='汇款成功'
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
              params:{way:0,type:'ciremitStatus'}
          }).then(res=>{
            console.log(res)
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
        this.getDicts();
        this.height=$('.page').offset().top-$('.table').offset().top
        $('.table').css('height',$('.page').offset().top-$('.table').offset().top+'px')
        this.getOrders()
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
            background: #e4f1fa !important;
            padding: 10px;
            i{
                margin-right: 5px;
            }
            // button{
            //     // border:none;
            // }
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



