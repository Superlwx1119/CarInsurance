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
                        <el-form-item style="padding-left:10px;">
                            <span>联系进度:</span>
                            <el-select clearable v-model="prograss" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in state"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="padding-left:10px;">
                          <span>销售员:</span>
                          <el-select v-model="salesMan" clearable size="small" filterable  placeholder="请选择">
                              <el-option
                              v-for="item in saler"
                              :key="item.userid"
                              :label="item.username"
                              :value="item.userid">
                              </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item>
                            <span>最后跟进时间:</span>
                            <el-date-picker
                            v-model="lastDate"
                            align="right"
                            type="daterange"
                            unlink-panels
                            value-format="yyyyMMddHHmmss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="small"
                            :picker-options="pickerOptions"
                            range-separator='至'
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            
                            <el-button type="primary" @click="search" size="small"><i class="el-icon-search"></i>查询</el-button>
                            <el-button size="small" @click="reset"><i class="el-icon-setting"></i>重置</el-button>
                            <el-button type="primary" @click="execl" size="small"><i class="el-icon-printer"></i>导出</el-button>
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
            @sort-change="sort"
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
                    prop="userId"
                    align="center"
                    label="用户ID">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    align="center"
                    label="销售员">
                </el-table-column>
                <el-table-column
                    prop="proStatu"
                    align="center"
                    label="联系进度">
                </el-table-column>
                <el-table-column
                    prop="insTime"
                    align="center"
                    sortable='custom'
                    label="最后跟进时间">
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
        <SalesDetail ref="callIN" class="SalesDetail"/>
    </div>
</template>

<script>
import getUrl from '@/assets/js/getUrl.js';
import store from '@/store'
import call from '@/assets/js/hcall_phone.js';
import XLSX from 'xlsx'
import Blob from '@/vendor/Blob.js'
import Export2Excel from '@/vendor/Export2Excel.js'
import SalesDetail from '../sales/SalesDetail'
export default {
    name:'Statistics',
    components:{
        SalesDetail
    },
    data() {
      return {
        carId:'',
        loading:false,
        name:'',
        salesMan:'',
        saler:[],
        registeredDate:'',
        selectedOptions: [],
        orderStates:[],
        operation:false,
        selection:[],
        orderState:'',
        operationKind:'',
        operationTxt:'批量调单',
        height:'',
        lastDate:'',
        prograss:'',
        state:[],
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
            //   const end = new Date();
            //   const start = new Date();
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime());
              end.setTime(end.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime());
              start.setTime(start.getTime() - 3600 * 1000 * 24);
            //   end.setTime(end.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
              const end = new Date(new Date(new Date().toLocaleDateString()).getTime());
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              end.setTime(end.getTime() + 3600 * 1000 * 24);
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
        currentPage4:1,
        size:20,
        checked:'',
        tabIndex: 1,
        orderState:'',
        asdL:{},
        tableData: [],
        timerTwo:null,
        sortField:'',
        sortWay:'',
      }
    },
    methods: {
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
            this.getOrderRecords()
            
        },
        execl(){
            //导出
            if(this.lastDate!=''&&(this.lastDate[0]==this.lastDate[1])){
                this.lastDate[1]=(Number(this.lastDate[1])+1000000).toString()
            }
            let data={
                userId:this.salesMan,
                insTime:this.lastDate.toString(),
                licenseNo:this.carId,
                proStatu:this.prograss,
                page:this.currentPage4,
                rows:this.size,
                sort:this.sortField,
                order:this.sortWay,
                Isexcel:1
            }
            this.$axios({
                method: 'post',
                url: getUrl()+'getOrderRecords',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                console.log(res)
                // res.data.rows.forEach((item,index)=>{
                //     if(item.proStatu){
                //         if(item.proStatu==0){
                //         item.proStatu='已报价(重点跟进)'
                //         }else if(item.proStatu==1){
                //         item.proStatu='已报价(考虑中)'
                //         }else if(item.proStatu==2){
                //         item.proStatu='多次拒接'
                //         }else if(item.proStatu==3){
                //         item.proStatu='成功出单'
                //         }else if(item.proStatu==4){
                //         item.proStatu='无人接听'
                //         }else if(item.proStatu==5){
                //         item.proStatu='完全无意向'
                //         }else if(item.proStatu==6){
                //         item.proStatu='已购买'
                //         }else if(item.proStatu==7){
                //         item.proStatu='其他'
                //         }
                //     }
                // })
                clearTimeout(this.timerTwo)
                this.timerTwo=setTimeout(()=>{
                    //导出
                    require.ensure([], () => {　　
                    const { export_json_to_excel } = require('@/vendor/Export2Excel');　　//引入文件　　　　　　 
                    const tHeader = ['车牌号','用户id','销售员','联系进度','最后跟进时间']; //将对应的属性名转换成中文 
                    const filterVal = ['licenseNo','userId','userName','proStatu','insTime'];//table表格中对应的属性名　　
                    const list = res.data.rows;　　　　　　　　 
                    const data = this.formatJson(filterVal, list);　　　　　　　　 
                    export_json_to_excel(tHeader, data, '跟进记录');　　　　　　 
                    }) 
                },200)
            })
        },
        formatJson(filterVal, jsonData) {
            //导出Exl模板
                return jsonData.map(v => filterVal.map(j => v[j]))
        },
        reload(){
          //刷新订单
          this.reset()
          this.search()
        },
        rowClcik(row,e){
            //选择表格行
            this.$refs.callIN.showOrder(row.orderId,'')
            this.$refs.callIN.showQuote(row.licenseNo)
            // store.dispatch('showDetail',false)
            // // store.dispatch('toSelect',JSON.parse(this.selectData))
            // window.sessionStorage.setItem('selectData',this.selectData)
            // this.show=sessionStorage.getItem('show')
            // this.$router.push({name:'订单详情',params:{khid:row.clientId,licenseNo:row.licenseNo,ddid:row.id,index:e.$index,page:this.currentPage4,rows:this.size,tableData:this.tableData}})
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
        getOrderRecords(){//查询列表页
            
            if(this.lastDate!=''&&(this.lastDate[0]==this.lastDate[1])){
                this.lastDate[1]=(Number(this.lastDate[1])+1000000).toString()
            }
            let data={
                userId:this.salesMan,
                insTime:this.lastDate.toString(),
                licenseNo:this.carId,
                proStatu:this.prograss,
                page:this.currentPage4,
                rows:this.size,
                sort:this.sortField,
                order:this.sortWay,
                Isexcel:0
            }
            this.$axios({
              method: 'post',
              url: getUrl()+'getOrderRecords',
              data:this.$Qs.stringify(data)
            }).then(res=>{
                // console.log(res)
                this.tableData=res.data.rows
                this.total=res.data.total
                this.size=res.data.size
                // this.tableData.forEach(item=>{
                //     if(item.proStatu){
                //         if(item.proStatu==0){
                //         item.proStatu='已报价(重点跟进)'
                //         }else if(item.proStatu==1){
                //         item.proStatu='已报价(考虑中)'
                //         }else if(item.proStatu==2){
                //         item.proStatu='多次拒接'
                //         }else if(item.proStatu==3){
                //         item.proStatu='成功出单'
                //         }else if(item.proStatu==4){
                //         item.proStatu='无人接听'
                //         }else if(item.proStatu==5){
                //         item.proStatu='完全无意向'
                //         }else if(item.proStatu==6){
                //         item.proStatu='已购买'
                //         }else if(item.proStatu==7){
                //         item.proStatu='其他'
                //         }
                //     }
                // })
            })
        },
        reset(){
          //重置
          this.carId=''
          this.prograss=''
          this.salesMan=''
          this.lastDate=''
        },
        search(){
          //查询
        //   this.size=20
        //   this.currentPage4=1
          this.getOrderRecords()
        },
        getDicts(){
          //字典
          this.$axios({
              method: 'get',
              url: getUrl()+'getDicts',
              params:{way:0,type:'ciremitStatus'}
          }).then(res=>{
            // console.log(res)
            for(let i  in res.data){
                this.asdL={}
                this.asdL.label=res.data[i]
                this.asdL.value=i
                this.orderStates.push(this.asdL)
            }
          })
        },
        getUsers(){
          //管理员获取销售员列表
          this.$axios({
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            method: 'post',
            url: getUrl()+'getUserSelect',
          }).then(res=>{
            //console.log(res)
            this.saler=res.data.filter(item=>{
              return item.userrole===30
            })
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
          }) 
        },
    },
    mounted(){
        this.getDicts();
        this.height=$('.page').offset().top-$('.table').offset().top
        $('.table').css('height',$('.page').offset().top-$('.table').offset().top+'px')
        this.getOrderRecords()
        this.getUsers();
        this.schedule('schedule');//联系进度下拉框
    }
}
</script>

<style lang="scss" scoped>
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



