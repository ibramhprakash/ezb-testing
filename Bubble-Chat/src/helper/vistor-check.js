const Vistor = require("../api/models/visitor");

/**
* this helper function check vistorId in vistor doc in db and return true/false 
* @param visitorId
* @returns {true,false}
*/
function ckeckVistor(visitorId) {
    let status =false
   Visitor.findOne({
        _id: visitorId
    })
    .exec()
    .then(visitor => {
        if(visitor){
            console.log("visitor")
            status = true
        }else{
            status = false
        }
    })
    .catch(error =>{
        status = false
    })
}

module.exports = ckeckVisitor;