
var APP_ID = 'gQxw0EF70g7NUVq1tbWcY31D-gzGzoHsz';
var APP_KEY = 'yeonIvzFjbGOzVlQh6DubYyS';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
var TestObject = AV.Object.extend('song');
var testObject = new TestObject();
testObject.save({
    name: 'test',
    singer: 'test',
    url: 'test'
}).then(function (object) {

})
var TestObject2 = AV.Object.extend('playList');
var testObject2 = new TestObject2();
testObject2.save({
    name: 'test',
    cover: 'test',
    creatorId: 'test',
    descriptoon: 'test',
    songs: ['1', '2']
}).then(function (object) {

})
