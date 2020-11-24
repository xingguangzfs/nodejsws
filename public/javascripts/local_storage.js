/**
 * Created by fushou on 2019/4/26.
 */

function localStorageIsSupport() {
    var tp = typeof localStorage;
    if (tp != 'undefined' && tp != null) {
        return true;
    }
    return false;
}

function setLocalStorage(key, value) {
    /*if (!localStorageIsSupport()) {
        return ;
    }
    localStorage.setItem(key, value);*/
    store.set(key, value);
}

function getLocalStorage(key) {
    /*if (!localStorageIsSupport()) {
        return null;
    }
    return localStorage.getItem(key);*/
    return store.get(key);
}

function removeLocalStorage(key) {
    /*if (!localStorageIsSupport()) {
        return ;
    }
    localStorage.removeItem(key);*/
    store.remove(key);
}

function clearLocalStorage() {
    /*if (!localStorageIsSupport()) {
        return null;
    }
    localStorage.clear();*/
    store.clearAll();
}

function getLocalStorageCount() {
    /*if (!localStorageIsSupport()) {
        return 0;
    }
    return localStorage.length;*/
    var storage = store.forEach();
    return storage.length;
}

function foreachLocalStorage(callback) {
    /*if (!localStorageIsSupport()) {
        return ;
    }
    // 遍历缓存
    for(var idx = 0; idx < localStorage.length; idx++) {
        callback(idx, localStorage.key(idx));
    }*/

    store.each(function(value, key){
        callback(key, value);
    });
}
