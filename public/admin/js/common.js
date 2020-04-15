// 处理post请求参数
function serializeToJson(arr) {
    var result = {};
    arr.forEach(function(item) {
        result[item.name] = item.value;
    });
    return result;
}