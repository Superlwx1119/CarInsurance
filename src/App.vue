<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss'>
  *{
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
    font-family:Alibaba PuHuiTi !important;
  }
  .loginTable {
    .el-input{
      // background: transparent !important;
    }
    .el-input__inner{}
    .el-form-item__error{
      left:50% !important;
      top:85% !important;
      transform: translateX(-50%) !important;
    }
  }
  .el-radio__input.is-checked .el-radio__inner{
    background: #EA9B13 !important;
    border-color: #EA9B13 !important;
  }
  .el-radio__input.is-checked+.el-radio__label{
    color: #EA9B13 !important;
  }
  .el-message-box{
    border: none !important;
  }
  .el-message-box__header{
    background: #EA9B13 !important;
    color: white !important;
    font-weight: 500 !important;
    span{
      color: white !important;
    }
    i{
      color: white !important;
    }
  }
  .el-dialog{
    border-radius: 10px !important;
  }
  .el-dialog__header{
    text-align: left !important;
    background: #EA9B13 !important;
    border-top-left-radius: 10px !important;
    border-top-right-radius: 10px !important;
    font-weight: 500 !important;
    span{
      color: white !important;
    }
    i{
      color: white !important;
    }
  }
  .el-input-group--append .el-input__inner, .el-input-group__prepend{
      border: 1px solid  #EA9B13 !important;
      border-right: none !important;
      height: 34px !important;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background: #EA9B13 !important;
  }
  .el-button+.el-button{
    font-size:14px;
    font-family:PingFang SC;
    background: white !important;
    border: 1px solid rgba(234,155,19,1) !important;
    color: #EA9B13 !important;
  }
  .el-button+.el-button:hover{
    font-size:14px;
    font-family:PingFang SC;
    background: #EA9B13 !important;
    // border: 1px solid #EA9B13 !important;
    color: white !important;
    border:none !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #EA9B13 !important;
    border-color: #EA9B13 !important;
  }
  .el-checkbox__inner:hover{
    border-color: #EA9B13 !important;
  }
  .el-button--primary{
    font-size:14px !important;
    font-family:PingFang SC;
    background: #EA9B13 !important;
    border: 1px solid #EA9B13 !important;
  }
  .el-button--primary:hover{
    font-size:14px;
    font-family:PingFang SC;
    background: rgb(248, 192, 95) !important;
    border: 1px solid rgb(248, 192, 95) !important;
  }
  .lastsource >div{
      // min-width: 140px !important;
      max-width: 300px !important;
  } 
  .el-input-group__append .el-button, .el-input-group__append .el-input, .el-input-group__prepend .el-button, .el-input-group__prepend .el-input{
    width: 80px !important;
  }
  .coming .el-dialog{
    width: 85% !important;
    margin: 50px auto !important;
  }
  .el-radio-group{
    padding-left:10px ;
  }
  .el-menu--horizontal{
    height: 80px !important;
  }
  .container .main .menu-collapsed{
    width: 63px !important;
  }
  .container .main aside .collapsed{
    width: 80px !important;
   background: #001529 !important;
    >li{
      padding: 10px 0 !important;
      background: #001529 !important;
    }
  }

  .submenu{
    margin-top:10px !important; 
    background: transparent !important;
  }
  .submenu li{
    background:#001529 !important;
  }
  .el-menu-item.is-active{
    color: white !important;
  }
  .el-submenu__title.is-active{
    color: red !important;
  }
  .el-submenu .el-menu-item{
    min-width: 150px !important;
    line-height: 40px !important;
    height: 40px !important;
  }
  .el-submenu .el-menu-item2{
    min-width: 54px !important;
    // line-height: 40px !important;
    height: 55px !important;
    background: #001529 !important;
  }
  .btn{
    i{
      margin-right: 5px !important;
    }
    .refresh{
      background: #fca06f !important;
      color: white !important;
      border:none !important;
    }
    .edit{
      background: #d9534f !important;
      color: white !important;
      border:none !important;
    }
    .share{
      background: #f96565 !important;
      color: white !important;
      border:none !important;
    }
    .document{
      background: #ff7d6f !important;
      color: white !important;
      border:none !important;
    }
    .printer{
      background: #ff9c65 !important;
      color: white !important;
      border:none !important;
    }
  }
  
  .el-menu-item, .el-submenu__title{
    //  width: 70px !important;
     color: white !important;
     line-height:30px !important ;
     text-align: center !important;
     padding: 0 !important;
     
     i{
        color: white !important;
     }
  }
  .el-form-item{
    margin: 10px 0 !important;
    
  }
  .el-submenu .el-menu-item:hover{
    // background: #001529  !important;
    color: #FFAB1A !important;
  }
  // .el-submenu .is-active:hover{
  //   border-left: 3px solid #8e8a89 !important;
  // }
  .el-menu-item, .el-submenu__title:hover{
    // background: transparent !important;
    background: #000C17 !important;
    // color: #FFAB1A !important;
  }
  .el-submenu{
    border-left: 3px solid #001529 !important;
  }
  .StaffManagement{
    .el-input--small .el-input__inner{
      width: 160px !important;
    }
    .editCont{
      .el-input__inner{
        width: 220px !important;
      }
    }
    .el-button--mini{
      font-size:14px;
      font-family:PingFang SC;
      background: white !important;
      border: 1px solid rgba(234,155,19,1) !important;
      color: #EA9B13 !important;
    }
    .el-button--mini:hover{
      font-size:14px;
      font-family:PingFang SC;
      background: #EA9B13 !important;
      border: 1px solid #EA9B13 !important;
      color: white !important;
    }
    .el-table--border th, .el-table__fixed-right-patch{
      background:rgba(250,250,250,1) !important;
      color: black !important;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td{
      background: #ffecdc !important;
    }
    .el-table--border{
      color: black !important;
    }
    .el-table__body tr.hover-row>td{
      // text-shadow: 1px 1px 1px black;
      cursor: pointer;
    }
  }
  
  .Saleslist{
    
    .el-radio-group{
      padding-top: 7px !important;
    }
    .addLin .el-input__inner{
        border: 1px solid rgba(234,155,19,1) !important;
        border-left: none !important;
    }
    .van-uploader{
      border: 1px dashed #ccc !important;
    }
    .el-input--small .el-input__inner{
      width: 10.5vw !important;
    }
    .selectSide{
      .el-input--small .el-input__inner{
        width: 240px !important;
        height: 32px !important;
      }
      .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 240px !important;
      }
    }
    .operationCont{
      .el-input__inner{
        width: 280px !important;
      }
    }
    .reset{
      .el-button{
        font-size:14px;
        font-family:PingFang SC;
        background: white !important;
        border: 1px solid rgba(234,155,19,1) !important;
        color: #EA9B13 !important;
      }
      .el-button:hover{
        font-size:14px;
        font-family:PingFang SC;
        background: #EA9B13 !important;
        border: 1px solid #EA9B13 !important;
        color: white !important;
      }
    }
    .lastsource{
      width: 345px !important;
      .el-input--small .el-input__inner{
        width: 185px !important;
      }
      .el-select__tags{
        width: 185px !important;
      }
      .el-input--small .el-input__inner{
        width: 185px !important;
      }
    }
    .el-form-item__content{
      line-height: 30px;
    }
    .el-table--border th, .el-table__fixed-right-patch{
      background:rgba(250,250,250,1) !important;
      color: black !important;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td{
      background: #ffecdc !important;
    }
    .el-table--border{
      color: black !important;
    }
    .el-table__body tr.hover-row>td{
      // text-shadow: 1px 1px 1px black;
      cursor: pointer;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 230px !important;
    }
    .detail{
      .el-input--small .el-input__inner{
        width: 100% !important;
      }
      .el-date-editor.el-input, .el-date-editor.el-input__inner{
         width: 100% !important;
      }
    }
    .cont{
      .el-input--small .el-input__inner{
        width: 200px !important;
      }
    }
    .operationCont{
      .el-input--small .el-input__inner{
        width: 200px !important;
      }
    }
    .el-tabs__item{
      background: #eee;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
      background: white !important;
      color: #E29500 !important;
      font-family:Alibaba PuHuiTi !important;
      font-weight:500 !important;
    }
  }
  .orderDetail{
    .el-checkbox__label{
      font-weight: bold;
      color: black;
    }
    .reOffer{
      .el-checkbox__label{
        font-weight: normal;
        color: black;
      }
      .el-input--suffix .el-input__inner{
        padding-right: 20px;
      }
      .el-input--mini .el-input__inner{
        width: 80px !important;
      }
    }
    .offerAuto{
      
      .el-input--mini .el-input__icon{
        margin-right: 30px;
      }
      .el-checkbox__label{
        font-weight: normal;
        color: black;
      }
      .el-input--suffix .el-input__inner{
        padding-right: 20px;
      }
      .el-input--mini .el-input__inner{
        width: 100px !important;
      }
      .tdSmall{
        .el-input--mini .el-input__inner{
          width: 70px !important;
        }
      }
    }
    .el-input--mini .el-input__inner{
      width: 100% !important;
    }
    .el-select{
      width: 100%;
    }
    .borderPhone{
      .el-select {
        width: 120px !important;
      }
      .el-select:hover{
        width: 120px !important;
      }
    }
  }
  textarea{
    resize: none !important;
    
  }
  .el-pagination{
    float: right;
  }
  .el-checkbox-group{
    width: 80% !important;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px !important;
    height: 120px !important;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px !important;
    height: 120px;
    display: block;
  }
  .van-field__control{
    height: .4rem;
  }
  .Saleslist .tagCont .rowSpan{
    .el-cascader--small{
      width: 10.5vw !important;
    }
    .el-cascader__label{
      width: 10.5vw !important;
    }
    .el-cascader .el-input, .el-cascader .el-input__inner{
      width: 10.5vw !important;
    }
    #cascader{
      width: 10.5vw !important;
    }
  } 
  .el-cascader-node.in-active-path, .el-cascader-node.is-active, .el-cascader-node.is-selectable.in-checked-path{
      color: #EA9B13 !important;
    }
    .el-drawer{
      .el-form-item{
        margin: 0 !important;
      }
      .center{
        display: flex !important;
        justify-content: center !important;
      }
      .rows{
        display: flex !important;
        >div{
          width: 250px !important;
        }
        .titel{
          width: 120px !important;
          display: block !important;
          text-align: center !important;
        }
      }
  }
  .blacklist{
    .el-tabs__header{
      margin: 0 !important;
    }
    .el-table--border{
      height: 100%;
    }
  }
  .my-dailog   .el-dialog__header {
        background: #409EFF !important;
    }
</style>
