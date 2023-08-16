// module.exports=getDate;
//to return more than one function
exports.getDate = function () {
    var today = new Date();
    var currDay = today.getDay();
    var options = {
        weekday: 'long',
        // year: 'numeric', 
        month: 'long',
        day: 'numeric'
    };

    return today.toLocaleDateString("en-US", options);

}

module.exports.getDay = getDay;
function getDay() {
    var today = new Date();
    var currDay = today.getDay();
    var options = {
        weekday: 'long',
    };

    var day = today.toLocaleDateString("en-US", options);
    return day;
}