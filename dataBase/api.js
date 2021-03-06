/**
 * 
 * @param {*} collection 
 * @param {Object} objectArray An array constituted of multiple objects
 * @param {(res) => {}} callback Do something by res
 */
const insertManyDocuments = (collection, objectArray, callback) => {
  collection
    .insertMany(objectArray, (err, result) => callback(result));
}

/**
 * 
 * @param {*} collection 
 * @param {Object} objectOne An object
 * @param {(res) => {}} callback Do something by res
 */
const insertOneDocument = (collection, objectOne, callback) => {
  collection
    .insertOne(objectOne, (err, result) => callback(result));
}

const findAllDocuments = (collection, callback) => {
  collection.find({})
    .toArray((err, docs) => callback(docs));
}

/**
 * 
 * @param {*} collection 
 * @param {Object} object Finding a line by an object
 * @param {(res) => {}} callback Do something by res
 */
const findLineDocument = (collection, object, callback) => {
  collection
    .find(object)
    .toArray((err, docs) => callback(docs))
}

/**
 * 
 * @param {*} collection 
 * @param {object} aim Want to update aim object
 * @param {object} options poly
 * @param {(res) => {}} callback Do something by res
 */
const updateOneDocument = (collection, aim, options = {}, callback = () => {}) => {
  collection
    .updateOne(aim, options, (err, result) => callback(result))
}

const updateDocument = (collection, aim, options = {}, callback = () => {}) => {
  collection
    .updateMany(aim, options, (err, result) => callback(result))
}

/**
 * 
 * @param {*} collection 
 * @param {object} object Want to delete object
 * @param {object} options poly
 * @param {(res) => {}} callback Do something by res
 */
const removeOneDocument = (collection, object, options = {}, callback) => {
  collection
    .deleteOne(object, options, (err, res) => callback(res))
}

const createCollectionIndex = (collection, object, callback) => {
  collection
    .createIndex(object, {
        unique: true,
        background: true
      },
      (err, res) => callback(res)
    )
}

module.exports = {
  insertManyDocuments,
  findAllDocuments,
  findLineDocument,
  updateOneDocument,
  updateDocument,
  removeOneDocument,
  insertOneDocument,
  createCollectionIndex
}