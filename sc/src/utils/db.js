const Datastore = require('nedb');
export default {
    name :"bobi",
    db:null,
   async init(database) {
    const options = {
      filename: database,
      autoload: true,
    };
    console.log(1) 
    var db = new Datastore(options);
    this.db=db;
    var obj = { objName: "folder", objValue: {} };
    db.find({ objName: "folder" }, function(err, data) {
        console.log(data);
        if (!data.length) {
            db.insert(obj, function(err, data) {
            console.log(data);
          });
        }
      }); 
   },
  limit (offset, limit) {
    this.offset = offset || 0;
    this.limit = limit || 15;
    return this;
  },
  
   sort (orderby) {
    this.orderby = orderby;
    return this;
  },
  
    find(query, select) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.find(query || {});
      if (this.orderby !== undefined) {
        stmt.sort(this.orderby);
      }
      if (this.offset !== undefined) {
        stmt.skip(this.offset).limit(this.limit);
      }
      if (select != undefined) {
        stmt.projection(select || {});
      }
      stmt.exec((err, docs) => {
        if (err) {
          return reject(err);
        }
        resolve(docs);
      });
    });
  },
 
  findOne  (query, select) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.findOne(query || {});
      if (this.sort !== undefined) {
        stmt.sort(this.sort);
      }
      if (select != undefined) {
        stmt.projection(select || {});
      }
      stmt.exec((err, doc) => {
        if (err) {
          return reject(err);
        }
        resolve(doc);
      });
    });
  },
   
  insert  (values) {
    console.log(1 ,this.db,values) 
    return new Promise((resolve, reject) => {
        console.log(1 ,this.db) 
      this.db.insert(values, (err, newDoc) => {
        if (err) {
            console.log(err) 
          return reject(err);
        }
        resolve(newDoc);
      });
    });
  },
 
   
  update  (query, values, options) {
    return new Promise((resolve, reject) => {
      this.db.update(query || {}, values || {}, options || {}, (err, numAffected) => {
        if (err) {
          return reject(err);
        }
        resolve(numAffected);
      });
    });
  },
  remove (query, options) {
    return new Promise((resolve, reject) => {
      this.db.remove(query || {}, options || {}, (err, numAffected) => {
        if (err) {
          return reject(err);
        }
        resolve(numAffected);
      });
    });
  },
};