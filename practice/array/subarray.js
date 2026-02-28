


const subArray = (arr, target)=>{
    let result = [];
    let sum = 0
    for(let i=0; i<arr.length; i++){
        sum= arr[i]
        let temp = [arr[i]];
        if(sum === target){
              result=[i+1,i+1];
              break;
            }
        for(let j=i+1;j<arr.length;j++){
            sum = sum + arr[j];
            if(sum === target){
                result=[i+1,j+1];
                break;
            }
            temp.push(arr[j]);
        }
        if(result.length>0){
            break;
        }
    }
    if(result.length ===0){
        return [-1];
    }
    return result
}


const subArrayN = (arr, target)=>{
    let result =[];
    let sum=0;
    let pointer=0;
    for(let i=pointer; i<arr.length; i++){
        sum = sum + arr[i];
        console.log(pointer, sum);
        if(sum === target){
            result = [pointer,i];
            return result;
        }
        if(sum>target){
            sum=0;
            if(pointer<arr.length-1){
                pointer = pointer;
                i=pointer;
                pointer++;
            }
        }
    }
 return [-1];
}

console.log(subArrayN([12,18,5,11,30,5],69));