var tab = [];
var obj = {
    "a": 1,
    "b": 2
};
var _loop_1 = function (c_1) {
    tab.push((function (x) { return c_1; }));
};
for (var c_1 in obj) {
    _loop_1(c_1);
}
console.log(tab[0]("coco"));
console.log(tab[1]("coco"));
/*
a
b
*/
tab = [];
var _loop_2 = function (c_2) {
    tab.push((function (x) { return c_2; }));
};
for (var c_2 in obj) {
    _loop_2(c_2);
}
console.log(tab[0]("coco"));
console.log(tab[1]("coco"));
/*
a
b
*/
tab = [];
// problème
var c;
for (c in obj) {
    tab.push((function (x) { return c; }));
}
console.log(tab[0]("coco"));
console.log(tab[1]("coco"));
/*
b
b
*/
//# sourceMappingURL=fermeture.js.map