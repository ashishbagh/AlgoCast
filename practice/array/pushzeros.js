const pushZero =(arr)=>{
        let counter =0;
        for(let i=0;i<arr.length;i++){
            if(arr[i] ===0){
                arr.splice(i,1);
                counter = counter+1;
                i=i-1
            }
        }
       // console.log(counter);
        while(counter>0){
            arr.push(0);
            counter--
        }
        return arr;
}

console.log(pushZero([3,5,0,0,4]));