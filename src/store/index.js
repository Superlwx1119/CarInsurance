import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


export default new Vuex.Store({
    state:{
        show:true,
        role:'',
        selectData:''
    },
    actions:{
        showDetail(val,show){
            val.commit('showDetail',show)
        },
        getRole(val,role){
            val.commit('getRole',role)
        },
        toSelect(val,selectData){
            val.commit('toSelect',selectData)
        }
    },
    mutations:{
        showDetail(state,show){
            state.show=show;
            window.sessionStorage.setItem('show', show);
        },
        getRole(state,role){
            state.role=role;
        },
        toSelect(state,selectData){
            state.selectData=selectData;
            JSON.parse(window.sessionStorage.setItem('selectData', selectData));
        },
    }
})