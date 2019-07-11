<--!<template>
    <div class="home">
        
        <div class="head">
            <el-row type="flex">
                <el-col :span="5"><div class="logo"><img src="../assets/logo.png" /><h2>车险业务系统</h2></div></el-col>
                <el-col :span="15" class="nav">
                    <el-menu
                    :default-active="activeIndex2"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item index="1"><p><i class="el-icon-phone-outline"></i>车险销售</p></el-menu-item>
                    <el-menu-item index="2"><p><i class="el-icon-edit-outline"></i>工作台</p></el-menu-item>
                    <!-- <el-menu-item index="3"><p><i class="el-icon-service"></i>工作中台页面被动接电话</p></el-menu-item> -->
                    <el-menu-item index="3"><p><i class="el-icon-document"></i>员工管理</p></el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="4">
                    <div class="user">
                        <el-row type="flex" >
                            <el-col :span="8"><img src="../assets/images/touxiang.png"></el-col>
                            <el-col :span="14"><p>角色名：用户名</p><a href="javascript:;">退出/重新登录</a></el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>
        <transition name="el-fade-in" mode="out-in">
          <div class="backTop" v-if="backtop">
            <i class="el-icon-upload2"></i>
          </div>
        </transition>
        <transition name="el-fade-in" mode="out-in">
              <div class="nav_cont">
							<router-view></router-view>
              </div>
        </transition>
        
    </div>
</template>

<script>
export default {
    name:'Home',
    data() {
      return {
        top:'',
        activeIndex: '1',
        activeIndex2: '1',
        backtop:false,
        editableTabsValue: '2',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }],
        tabIndex: 2
      }
    },
    methods: {
      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      },
      handleSelect(key, keyPath) {
        // console.log(this.$router.options)
        // console.log(key, keyPath);
        this.$router.push(this.$router.options.routes[key].children[0].path)
      },
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      },
      scrollToTop() { 
          //置顶
          if($('.table').offset().top+14==this.top){
            this.backtop=false
          }else{
            this.backtop=true
          }
      　　console.log($('tbody').offset().top)
      },
    },
    mounted(){
      // console.log(this.$router.options)
      this.$router.push('/Saleslist')
      this.top=$('.table').offset().top
      $('.nav_cont').css('height',$(window).height()- $('.nav_cont').offset().top)
      window.addEventListener('scroll', this.scrollToTop ,true)
    }
}
</script>

<style lang="scss" scoped>
    .home{
        .head{
            background: rgb(84, 92, 100);
            color: white;
            height: 80px;
            .nav{
                p{
                    cursor: pointer;
                }
                i{
                    font-size: 22px;
                    margin-right: 5px;
                }
            }
            
            .user{
                text-align: center;
                p{
                    line-height: 30px;
                    margin-top: 10px;
                    text-align: center;
                }
                a{
                    color: white;
                }
                img{
                    width: 50px;
                    height: 50px;
                    margin-top: 15px;
                    border-radius: 50%;
                }
            }
            img{
                width: 100px;
                height: 80px;
            }
            .logo{
                display: flex;
                img{
                    display: inline;
                }
                h2{
                    display: inline-block;
                    line-height: 80px;
                    text-indent: 1em;
                }
                
            }
            p{
                width: 100%;
                line-height: 80px;
                font-weight: bold;
                text-align: center;
            }
        }
        .backTop{
          position: fixed;
          right: 100px;
          bottom: 100px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: white;
          text-align: center;
          line-height: 50px;
          z-index: 9999;
          cursor: pointer;
          box-shadow:1px 2px 2px 1px #108EE9;
          i{
            color: #108EE9;
            font-size: 26px;
            font-weight: bold;
          }
        }
        .nav_cont{
          overflow: hidden;
        }
    }
</style>

