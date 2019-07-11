<template>
    <div class="GetData">
        <el-tabs v-model="activeName" type="card" class="tabs" @tab-click="handleClick">
            <el-tab-pane label="拉取率" name="first">
                <div id="myChart" :style="{width: '1000px', height: '500px'}"></div>
            </el-tab-pane>
            <el-tab-pane label="拉取总量" name="second">
                <div id="myChartToTel" :style="{width: '1000px', height: '500px'}"></div>
            </el-tab-pane>
            <el-tab-pane label="有效数据" name="third">
                <div id="myChartTrue" :style="{width: '1000px', height: '500px'}"></div>
            </el-tab-pane>
        </el-tabs>
        <div class="select">
                <el-radio-group size="small" class="tapCard" v-model="radio" @change="changeTime">
                    <el-radio-button label="实时"></el-radio-button>
                    <el-radio-button label="近7天"></el-radio-button>
                    <el-radio-button label="近30天"></el-radio-button>
                </el-radio-group>
                <el-date-picker
                v-model="selectTime"
                type="daterange"
                align="right"
                size="small"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions">
                </el-date-picker>
            </div>
    </div>
</template>

<script>
import getUrl from '@/assets/js/getUrl.js';
import store from '@/store'
export default {
    name:'GetData',
    data() {
      return {
          radio:'实时',
          activeName:'first',
          selectTime:'',
          pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
                }
            }]
          },
      }
    },
    methods: {
        changeTime(){//选择时间
            console.log(this.radio)
            this.drawLine(true)
            this.drawLineToTel(true)
            this.drawLineTrue(true)
            this.drawLine()
            this.drawLineToTel()
            this.drawLineTrue()
        },
        handleClick(tab, event) {//切换tab
            if(tab.name=='first'){
                this.drawLine(true)
                this.drawLineToTel(true)
                this.drawLineTrue(true)
                this.drawLine()
            }else if(tab.name=='second'){
                this.drawLineToTel(true)
                this.drawLine(true)
                this.drawLineTrue(true)
                this.drawLineToTel()
            }else{
                this.drawLineTrue(true)
                this.drawLine(true)
                this.drawLineToTel(true)
                this.drawLineTrue()
            }
        },
        drawLine(clear){//拉取率
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
                title: { text: '拉取率',left:'70px' },
                tooltip: {
                    trigger: 'axis',
                    
                },
                legend: {
                    data:['平安','人保','太平洋'],
                    textStyle:{
                        fontSize:14
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    },
                },
                xAxis: {
                     type : 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {},
                series: [{
                    name: '平安',
                    type: 'line',
                    smooth: true,
                    data: [5, 20, 26, 30, 10, 20,9],
                    itemStyle: {
                        normal: {
                            color:'#1890ff',
                            areaStyle: {
                                // 区域图，纵向渐变填充
                                color : '#b9ddff'
                            }
                        }
                    }
                },{
                    name: '人保',
                    type: 'line',
                    smooth: true,
                    data: [15, 40, 32, 10, 40, 22,34],
                    itemStyle: {
                        normal: {
                            color:'#e58e7a',
                            areaStyle: {
                                // 区域图，纵向渐变填充
                                color : '#ffcccc'
                            }
                        }
                    }
                },{
                    name: '太平洋',
                    type: 'line',
                    smooth: true,
                    data: [25, 50, 22, 20, 48, 32,26],
                    itemStyle: {
                        normal: {
                            color:'#009363',
                            areaStyle: {
                                // 区域图，纵向渐变填充
                                color : '#9ed6c4'
                            }
                        }
                    }
                }]
            });
            if(clear){
                myChart.clear()
            }
        },
        drawLineToTel(clear){//拉取总量
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChartToTel'))
            // 绘制图表
            myChart.setOption({
                title: { text: '拉取总量',left:'70px' },
                tooltip: {
                    trigger: 'axis',
                    
                },
                legend: {
                    data:['平安','人保','太平洋'],
                    textStyle:{
                        fontSize:14
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    },
                },
                xAxis: {
                     type : 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {},
                series: [{
                    name: '平安',
                    type: 'line',
                    smooth: true,
                    data: [5, 20, 26, 30, 10, 20,9],
                    itemStyle: {
                        normal: {
                            color:'#1890ff',
                            areaStyle: {
                                // 区域图，纵向渐变填充
                                color : '#b9ddff'
                            }
                        }
                    }
                },{
                    name: '人保',
                    type: 'line',
                    smooth: true,
                    data: [15, 40, 32, 10, 40, 22,34],
                    itemStyle: {
                        normal: {
                            color:'#e58e7a',
                            areaStyle: {
                                // 区域图，纵向渐变填充
                                color : '#ffcccc'
                            }
                        }
                    }
                },{
                    name: '太平洋',
                    type: 'line',
                    smooth: true,
                    data: [25, 50, 22, 20, 48, 32,26],
                    itemStyle: {
                        normal: {
                            color:'#009363',
                            areaStyle: {
                                // 区域图，纵向渐变填充
                                color : '#9ed6c4'
                            }
                        }
                    }
                }]
            });
            if(clear){
                myChart.clear()
            }
        },
        drawLineTrue(clear){//有效数据
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChartTrue'))
            // 绘制图表
            myChart.setOption({
                title: { text: '有效数据',left:'70px' },
                tooltip: {
                    trigger: 'axis',
                    
                },
                legend: {
                    data:['平安','人保','太平洋'],
                    textStyle:{
                        fontSize:14
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    },
                },
                xAxis: {
                     type : 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {},
                series: [{
                    name: '平安',
                    type: 'line',
                    smooth: true,
                    data: [5, 20, 26, 30, 10, 20,9],
                    itemStyle: {
                        normal: {
                            color:'#1890ff',
                            areaStyle: {
                                // 区域图，纵向渐变填充
                                color : '#b9ddff'
                            }
                        }
                    }
                },{
                    name: '人保',
                    type: 'line',
                    smooth: true,
                    data: [15, 40, 32, 10, 40, 22,34],
                    itemStyle: {
                        normal: {
                            color:'#e58e7a',
                            areaStyle: {
                                // 区域图，纵向渐变填充
                                color : '#ffcccc'
                            }
                        }
                    }
                },{
                    name: '太平洋',
                    type: 'line',
                    smooth: true,
                    data: [25, 50, 22, 20, 48, 32,26],
                    itemStyle: {
                        normal: {
                            color:'#009363',
                            areaStyle: {
                                // 区域图，纵向渐变填充
                                color : '#9ed6c4'
                            }
                        }
                    }
                }]
            });
            if(clear){
                myChart.clear()
            }
        }
    },
    mounted(){
        this.drawLine();
    }
}
</script>

<style lang="scss" scoped>
    .GetData{
        margin: 20px;
        border: 1px solid #eee;
        position: relative;
        height: 100vh;
        .select{
            position: absolute;
            top: 4px;
            right: 5%;
            .tapCard{
                margin-right: 20px;
            }
        }
    }
</style>



