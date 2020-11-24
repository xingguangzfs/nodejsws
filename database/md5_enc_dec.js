/**
 * Created by fushou on 2017/8/17.
 */

var crypto = require('crypto');

exports.encode =  function cryptmd5pwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}
