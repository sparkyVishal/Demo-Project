// get dynamic value in object from an array by ites key

const keyArray = ["name", "age", "email"]

const data = ["name"]

const result = []

const limit = 10;


let userObj = {}
for(let i = 1; i<=limit; i++){
    for(let j =0; j<keyArray.length; j++){
        userObj[keyArray[j]] = `test ${keyArray[j]} ${i}`
    //     userObj = {
    //        // name: `test name ${i}`,
    //        // age: `test age ${i}`,
    //        // email: `test email ${i}`,
        
    //        keyArray[j] : i
    //    }
    }
console.log(userObj);
    result.push(userObj)
}

console.log(result);



