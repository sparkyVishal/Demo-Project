// set dynamic values in an object from an array

const keyArray = ["name", "age", "email"]

const data = ["name"]

const result = []

const limit = 10;



for(let i = 1; i<=limit; i++){
    let userObj = {}
    for(let j =0; j<keyArray.length; j++){
        console.log({i});
        userObj[keyArray[j]] = `test ${keyArray[j]} ${i}`
        console.log({userObj});

        //using spread operator
        
        // userObj = {
        //     ...userObj,
        //     [keyArray[j]] : `test ${keyArray[j]} ${i}`,
        // }
        
    
    }
// console.log(userObj);
    result.push(userObj)
    // console.log(result);
}

console.log(result);



