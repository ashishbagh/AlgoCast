// Given a string, find the shortest possible string 
//which can be achieved by adding characters to the end of initial string to make it a palindrome.

// Example

// For st = "abcdc", the output should be
// solution(st) = "abcdcba".

const solution = (st)=>{

    if(st.split('').reverse.join('') === st){
        return "";
    }

    



}