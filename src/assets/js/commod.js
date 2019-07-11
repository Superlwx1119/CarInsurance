export default function commod(time){
    let y=time.substring(0,4)
    let m=time.substring(4,6)
    let d=time.substring(6,8)
    let h=time.substring(8,10)
    let mm=time.substring(10,12)
    let s=time.substring(12,14)
    // let newTime=y+'-'+m+'-'+d+' '+h+':'+mm+':'+s
    let newTime=y+'-'+m+'-'+d
    newTime.toString()
    return newTime
}