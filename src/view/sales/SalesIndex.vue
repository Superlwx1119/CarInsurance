<template>
    <div>
        
        <el-button @click="fn">销售首页</el-button>
    </div>
</template>

<script>
export default {
    name:'SalesIndex',
    methods:{
        fn(){
            this.$router.push('/SalesIndex/SalesDetail')
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>

