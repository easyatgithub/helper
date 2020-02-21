const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')


// Set some defaults (required if your JSON file is empty)
// 第一層 對象
// db.defaults({ posts: [], user: {}, count: 0 }).write()

// Add a post
// db.get('posts').push({ id: 1, title: 'lowdb is awesome'}).write()

// Set a user using Lodash shorthand syntax
// db.set('user.name', {}).write()
  
// Increment count
// db.update('count', n => n + 1).write()
  

  export default {
      name:"lowdb",
       db :low(adapter) ,
       set(key,value){
        this.db.set(key,value) .write()
       },
       get(key){
        var s = this.db.get(key).value()
        console.log(s)
        return s;
       },
  }