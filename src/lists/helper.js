'use strict';

const RTMList = require('./list.js');
const genIndex = require('../utils/genIndex.js');


/**
 * API Call: rtm.lists.getList & update user lists
 * @param user RTMUser
 * @param callback Callback function(err, lists)
 * @private
 */
function get(user, callback) {
  user.get('rtm.lists.getList', function(resp) {
    if ( !resp.isOk ) {
      return callback(resp);
    }

    // List of lists to return
    let rtn = [];

    // Parse each of the lists
    let lists = resp.lists.list;
    for ( let i = 0; i < lists.length; i++ ) {
      rtn.push(
        new RTMList(lists[i])
      );
    }

    // Add indices to lists
    rtn = genIndex(rtn);

    // Set user lists
    user._lists = rtn;

    // Call the callback
    return callback(null, rtn);
  });
}


/**
 * API Call: rtm.lists.add & update user lists
 * @param name RTM List Name
 * @param user RTMUser
 * @param callback Callback function(err, lists)
 * @private
 */
function add(name, user, callback) {
  if ( name === 'Inbox' || name === 'Sent' ) {
    throw "Invalid List Name"
  }
  let params = {
    name: name,
    timeline: user.timeline
  };
  user.get('rtm.lists.add', params, function(resp) {
    if ( !resp.isOk ) {
      return callback(resp);
    }
    return get(user, callback);
  });
}

/**
 * API Call: rtm.lists.delete & update user lists
 * @param id RTM List ID
 * @param user RTMUser
 * @param callback Callback function(err, lists)
 * @private
 */
function remove(id, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: id
  };
  user.get('rtm.lists.delete', params,  function(resp) {
    if ( !resp.isOk ) {
      return callback(resp);
    }
    return get(user, callback);
  });
}

/**
 * API Call: rtm.lists.setName & update user lists
 * @param id RTM List ID
 * @param name New RTM List Name
 * @param user RTMUser
 * @param callback Callback function(err, lists)
 * @private
 */
function rename(id, name, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: id,
    name: name
  };
  user.get('rtm.lists.setName', params, function(resp) {
    if ( !resp.isOk ) {
      return callback(resp);
    }
    return get(user, callback);
  });
}




module.exports = {
  get: get,
  add: add,
  remove: remove,
  rename: rename
};