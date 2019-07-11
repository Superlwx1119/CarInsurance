<template>
    <div class="StaffManagement">
        <!-- <h2>员工管理</h2> -->
        <div class="form">
            <el-row type="flex">
                <el-col :span="24">
                    <el-form :inline="true">
                        <el-form-item>
                            <span class="keyword">关键字:</span>
                        </el-form-item>
                        <el-form-item>
                            <el-input type="test" size="small" v-model="keyword" placeholder="请输入ID或用户名"></el-input>
                        </el-form-item>
                        <!-- <el-form-item>
                            <el-select v-model="value" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <!-- <el-form-item>
                            <span class="keyword">用户状态:</span>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="staffLevelSearch" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in staffState"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <!-- <el-form-item>
                            <span class="keyword">等级:</span>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="level" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in staffLevels"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item>
                            <span class="keyword">角色:</span>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="roleNume" size="small" placeholder="请选择">
                                <el-option
                                v-for="item in roles"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search" size="small"><i class="el-icon-search"></i>查询</el-button>
                            <el-button size="small" @click="reload"><i class="el-icon-refresh"></i>刷新</el-button>
                            <!-- <el-button size="small"><i class="el-icon-setting"></i>员工准入名单</el-button> -->
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="table" v-loading="loading">
            <el-table
            fit
            :height='height'
            :data="tableData"
            size='mini'
            border
            style="width: 100%">
                <el-table-column
                type="index"
                width="40">
                </el-table-column>
                <el-table-column
                type="selection"
                width="45">
                </el-table-column>
                <el-table-column
                    prop="userid"
                    label="用户ID"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="userdptname"
                    align="center"
                    label="部门名称">
                </el-table-column>
                <el-table-column
                    prop="hcall_jobno"
                    align="center"
                    label="HCALL工号">
                </el-table-column>
                <el-table-column
                    prop="hcall_nodid"
                    align="center"
                    label="HCALL分机号">
                </el-table-column>
                <el-table-column
                    prop="hcall_queueid"
                    align="center"
                    label="HCALL队列号">
                </el-table-column>
                <el-table-column
                    prop="rolename"
                    align="center"
                    label="用户角色名">
                </el-table-column>
                <el-table-column
                    prop="superiorusername"
                    align="center"
                    label="上级用户名称">
                </el-table-column>
                <el-table-column
                    prop="post_status"
                    align="center"
                    label="岗位状态">
                </el-table-column>
                <el-table-column
                    prop="state"
                    align="center"
                    label="用户状态">
                </el-table-column>
                <el-table-column
                    prop="paidan_status"
                    align="center"
                    label="派单状态">
                </el-table-column>
                <el-table-column
                    prop="comman_total"
                    align="center"
                    label="今日派单">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        <transition name="el-fade-in" mode="out-in">
            <div class="edit" v-if="edit">
                <div class="editCont">
                    <h2>编辑员工资料<span @click="cancel">×</span></h2>
                    <table>
                        <tr>
                            <td width='140' class="textRight">用户角色:</td>
                            <td>
                                <el-select v-model="value" size="small" placeholder="请选择角色">
                                    <el-option
                                    v-for="item in roles"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td class="textRight">员工等级:</td>
                            <td>
                                <el-select v-model="staffLevelSelect" size="small" placeholder="请选择">
                                    <el-option
                                    v-for="item in staffLevels"
                                    :key="item.value"
                                    size="small"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td class="textRight">上级用户ID:</td>
                            <td>
                                <el-select v-model="leaderId" size="small" placeholder="请选择">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    size="small"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td class="textRight">用户电话节点号:</td>
                            <td>
                                <el-input size="small" type="text" v-model="phoneNode"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td class="textRight">用户电话工号:</td>
                            <td>
                                <el-input type="text" size="small" v-model="phoneId"></el-input>
                            </td>
                            <td class="textRight">用户部门名称:</td>
                            <td>
                                <el-input size="small" type="text" disabled v-model="userdptname"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td class="textRight">用户状态:</td>
                            <td>
                                <el-select v-model="state" size="small" placeholder="请选择">
                                    <el-option
                                    v-for="item in staffState"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td class="textRight">岗位状态:</td>
                            <td>
                                <el-select v-model="post_status" size="small" placeholder="请选择">
                                    <el-option
                                    v-for="item in staffState"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td class="textRight">派单状态:</td>
                            <td>
                                <el-select v-model="paidan_status" size="small" placeholder="请选择">
                                    <el-option
                                    v-for="item in orderState"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </td>
                            <td class="textRight">HCALL工号:</td>
                            <td>
                                <el-input size="small" type="text"  v-model="hcall_jobno"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td class="textRight">HCALL分机号:</td>
                            <td>
                                <el-input size="small" type="text"  v-model="hcall_nodid"></el-input>
                            </td>
                            <td class="textRight">HCALL队列号:</td>
                            <td>
                                <el-input size="small" type="text"  v-model="hcall_queueid"></el-input>
                            </td>
                        </tr>
                    </table>
                    <div class="btn">
                        <el-button type="primary" @click="changeStaff">确定</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import getUrl from '@/assets/js/getUrl.js';
export default {
    name:'StaffManagement',
    data() {
        return {
            edit:false,
            loading:false,
            userdptname:'',
            height:'',
            staffLevel:'',
            staffLevelSelect:'',
            leaderId:'',
            level:'',
            hcall_jobno:'',
            paidan_status:'',
            hcall_nodid:'',
            hcall_queueid:'',
            checkList:[],
            userstate:'',
            state:'',
            post_status:'',
            phoneId:'',
            userid:'',
            total:0,
            size:20,
            currentPage4:1,
            keyword:'',
            phoneNode:'',
            options: [],
            staffLevelSearch:'',
            staffState:[
                {label:'在岗',value:1},{label:'请假',value:2},{label:'离职',value:4},{label:'删除',value:5}
            ],
            staffLevels:[{label:'未知',value:0},{label:'高级',value:1},{label:'中级',value:2},{label:'初级',value:3}],
            role:'',
            value:'',
            orderState:[
                {label:'打开',value:1},
                {label:'关闭',value:0}
                ],
            asdL:{},
            roles:[],
            tableData: [],
            roleNume:'',
            arr2:[],
        }
    },
    methods:{
        // changeRole(){
        //     //选择员工身份
        //     let arr=[]
        //     this.checkList.forEach(item=>{
        //         if(this.checkList.indexOf('销售员')>=0){
        //             arr.push(30)
        //         }
        //         if(this.checkList.indexOf('录单员')>=0){
        //             arr.push(40)
        //         }
        //         if(this.checkList.indexOf('打款员')>=0){
        //             arr.push(50)
        //         }
        //         if(this.checkList.indexOf('管理员')>=0){
        //             arr.push(1)
        //         }
        //         if(this.checkList.indexOf('游客')>=0){
        //             arr.push(0)
        //         }
        //     })
        //     this.arr2=[]
        //     for(var i = 0; i < arr.length; i++){
        //         if(arr2.indexOf(arr[i]) == -1){
        //             arr2.push(arr[i]);
        //         }
        //     }
        // },
        reload(){
            //刷新
            this.keyword=''
            this.roleNume=''
            this.getUsers()
        },
        getDicts(){
          //字典
          this.$axios({
              method: 'get',
              url: getUrl()+'getDicts',
              params:{way:0,type:'userRole'}
          }).then(res=>{
              
            for(let i  in res.data){
                this.asdL={}
                this.asdL.label=res.data[i]
                this.asdL.value=i
                this.roles.push(this.asdL)
            }
            console.log(this.roles)
          })
        },
        handleEdit(index,e){
            //编辑
            this.edit=true
            this.userid=e.userid
            this.getUser(e.userid)
        },
        getUser(userid){
            //获取员工个人信息
            let data={
                userid:userid
            }
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'getUser',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                console.log(res)
                this.value=res.data.userrole
                if(res.data.userrole==0){
                    this.value='游客'
                }else if(res.data.userrole==1){
                    this.value='管理员'
                }else if(res.data.userrole==20){
                    this.value='销售组长'
                }else if(res.data.userrole==30){
                    this.value='销售员'
                }else if(res.data.userrole==40){
                    this.value='录单员'
                }else if(res.data.userrole==50){
                    this.value='打款员'
                }
                // this.value=res.data.userrole
                this.hcall_jobno=res.data.hcall_jobno
                this.hcall_nodid=res.data.hcall_nodid
                this.hcall_queueid=res.data.hcall_queueid
                this.paidan_status=res.data.paidan_status
                this.post_status=res.data.post_status
                this.state=res.data.state
                // if(res.data.state==1){
                //     this.state='在岗'
                // }else if(res.data.state==2){
                //     this.state='请假'
                // }else if(res.data.state==4){
                //     this.state='离职'
                // }else if(res.data.state==5){
                //     this.state='删除'
                // }
                this.phoneNode=res.datauserphnumber
                this.phoneId=res.data.userphjobno
                this.userdptname=res.data.userdptname
            })
        },
        changeStaff(){
            //修改角色信息
            if(this.value=='游客'){
                this.value=0
            }else if(this.value=='管理员'){
                this.value=1
            }else if(this.value=='销售组长'){
                this.value=20
            }else if(this.value=='销售员'){
                this.value=30
            }else if(this.value=='录单员'){
                this.value=30
            }else if(this.value=='打款员'){
                this.value=50
            }
            let data={
                userid:this.userid,
                userrole:this.value,
                hcall_jobno:this.hcall_jobno,
                hcall_nodid:this.hcall_nodid,
                hcall_queueid:this.hcall_queueid,
                paidan_status:this.paidan_status,
                post_status:this.post_status,
                userphnumber:this.phoneNode,
                userphjobno:this.phoneId,
                state:this.state,
                userdptname:this.userdptname,
            }
            // 7893136
            // jiaoiiu  7893138 renli 7893137
            this.$axios({
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                method: 'post',
                url: getUrl()+'updUser',
                data:this.$Qs.stringify(data)
            }).then(res=>{
                if(res.data=='success'){
                    this.edit=false
                    this.getUsers()
                    this.$notify({
                        title: '成功',
                        message: '员工信息修改成功!',
                        type: 'success'
                    });
                    this.getUsers();
                }else{
                    this.$notify.error({
                        title: '失败',
                        message: '员工信息修改失败!'
                    });
                }
            })
        },
        search(){
            //查询
            this.currentPage4=1
            this.getUsers()
        },
        cancel(){
            //取消修改
            this.edit=false
            this.userid='',
            this.value='',
            this.hcall_jobno=''
            this.hcall_nodid=''
            this.hcall_queueid=''
            this.paidan_status=''
            this.post_status=''
            this.state=''
            this.userdptname=''
        },
        handleSizeChange(val){
            //每页数据条数
            this.size=val
            this.getUsers()
        },
        handleCurrentChange(val){
            //选择当前页
            this.currentPage4=val
            this.getUsers()
        },
        getUsers(){
          //管理员获取员工列表
          this.loading=true
          let data={
              page:this.currentPage4,
              size:this.size,
              keyword:this.keyword,
              role:this.roleNume
          }
          this.$axios({
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            method: 'post',
            url: getUrl()+'getUsers',
            data:this.$Qs.stringify(data)
          }).then(res=>{
            //   console.log(res)
              this.loading=false
              this.tableData=res.data.rows
              this.total=res.data.total
          })
        }
    },
    mounted(){
        this.getDicts()
        this.getUsers()
        this.height=$('.page').offset().top-$('.table').offset().top
        $('.table').css('height',$('.page').offset().top-$('.table').offset().top)
    }
}
</script>

<style lang="scss" scoped>
    .StaffManagement{
        margin: 10px;
        form{
            line-height:0px;
            
        }
        .table{
            overflow: auto;
        }
        .edit{
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, .7);
            z-index: 999;
            .editCont{
                border-radius: 10px;
                background: white;
                width: 880px;
                position: absolute;
                left: 50%;
                font-size: 14px;
                top: 50%;
                transform: translate(-50%,-50%);
                .btn{
                    text-align: center;
                    margin: 10px 0;
                }
                h2{
                    height: 76px;;
                    line-height: 76px;
                    font-weight: 500;
                    background: #EA9B13;
                    color: white;
                    font-size:24px;
                    font-family:Alibaba PuHuiTi;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                    span{
                        float: right;
                        cursor: pointer;
                        display: inline-block;
                        margin-right: 30px;
                    }
                }
                table{
                    margin-top: 10px;
                    text-align: center;
                    width: 100%;
                    .textRight{
                        text-align: right;
                    }
                    td{
                        text-align: left;
                        padding-left: 20px;
                    }
                    tr{
                        line-height: 50px;
                    }
                }
            }
        }
        .keyword{
            display: inline-block;
            width: 100%;
            line-height: 30px;
            text-align: center
        }
        h2{
            font-size: 16px;
            text-indent: 1em;
            border-bottom: 1px solid #999999;
            line-height: 24px;
        }
        .page{
            position: absolute;
            right: 0;
            bottom: 0;
            background: white;
        }
    }
</style>


