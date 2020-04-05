'use strict'

var db = (function(){
	//open database
	var _db = new PouchDB('MTPO_taxApp');

	//This function will be responsible for creating/up[dating doc]
	var _updateDoc = function(key,data){
		//Promise
		return new Promise(function(resolve,reject){
			//check if already exist
			_db.get(key).then(function(doc){
				//update revision property
				data._rev = doc._rev;
				//update key, if not exist
				data._id = doc._id;
				//update
				_db.put(data).then(function(response){
					//Added. now return
					resolve(true);
				}).catch(function(error){
					//return with error
					reject(error);
				});
			}).catch(function(error){
				//Not found so add new
				data._id = key;
				_db.put(data).then(function(response){
					//Added. now return
					resolve(true);
				}).catch(function(error){
					//return with error
					reject(error);
				});
			});
		});
	};

	//This function will be responsible for getting data from doc
	var _getDoc = function(key){
		//promise
		return new Promise(function(resolve,reject){
			_db.get(key).then(function(doc){
				//remove _id & _rev
				delete doc._id;
				delete doc._rev;
				//return doc
				resolve(doc);
			}).catch(function(error){
				//Error while getting doc
				console.log('Error while getting doc');
				reject(error);
			});
		});
	};

	//
	var _deleteDoc = function(docId){
		//Promise
		return new Promise(function(resolve,reject){
			_db.get(docId).then(function(doc){
				return _db.remove(doc);
			}).then(function(success){
				resolve();
			}).catch(function(error){
				console.log('Error While deleting document: '+docId);
				console.error(error);
				reject(error);
			});
		});
	}

	//
	var _query = function(queryOptions){
		//promise
		return new Promise(function(resolve,reject){
			//
			_db.allDocs(queryOptions).then(function(data){
				//
				var _list = [];
				//
				for(var index in data.rows){
					_list.push(data.rows[index].id);
				}
				//
				resolve(_list);
			});
		}).catch(function(error){
			console.log('Error while getting data from pouchDB through allDocs');
			console.error(error);
			reject(error);
		});
	}

	return{
		updateDoc : _updateDoc,
		getDoc : _getDoc,
		deleteDoc: _deleteDoc,
		query : _query
	};

})();