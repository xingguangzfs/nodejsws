/**
 * Created by fushou on 2019/7/1.
 */

var util = require('../../common/util');

var cc_buffer = function(buffer_len) {
    var write_pos_ = 0; // 数据存储起始位置
    var read_pos_ = 0; // 数据存储结束位置
    var data_length_ = 0; // 数据长度

    var data_head_length_ = 4; // 数据头长度字节数
    var read_int_method_ = 'readInt32LE';
    var write_int_method_ = 'writeInt32LE';

    // 缓存
    var buffer_length_ = buffer_len || 1024;
    var buffer_ = Buffer.alloc(buffer_len || buffer_length_, 0, 'binary');

    this.reset = function() {
        read_pos_ = 0;
        write_pos_ = 0;
        data_length_ = 0;
    };

    // 往缓冲增加数据
    this.putData = function(data, callback) {
        if (data == undefined || data == null) {
            return;
        }
        var data_start = 0;
        var data_len = data.length;

        var avaliable_len = this.getAvailableLen();
        if (avaliable_len < data_len) {
            // 缓冲剩余空间不足
            var extLength = Math.ceil((data_len + data_length_) / 1024) * 1024;
            var tempBuffer = Buffer.alloc(extLength);

            buffer_length_ = extLength;

            // 数据存储进行了循环利用空间，需要重新打包
            if (write_pos_ < read_pos_) {
                var dataTailLen = buffer_length_ - read_pos_;
                buffer_.copy(tempBuffer, 0, read_pos_, read_pos_ + dataTailLen);
                buffer_.copy(tempBuffer, dataTailLen, 0, write_pos_);
            }
            else {
                // 按照顺序是完整的
                buffer_.copy(tempBuffer, 0, read_pos_, write_pos_);
            }

            buffer_ = tempBuffer;
            tempBuffer = null;

            // 保存数据
            read_pos_ = 0;
            write_pos_ = data_length_;
            data.copy(buffer_, write_pos_, data_start, data_start + data_len);
            data_length_ = data_length_ + data_len;
            write_pos_ = write_pos_ + data_len;
        }
        else if ((write_pos_ + data_len) > buffer_length_) {
            // 分两次存储，第一次存储到缓冲尾部，第二次存储到缓存头部
            var bufferTailLen = buffer_length_ - write_pos_;
            if (bufferTailLen <= 0) {
                console.log('程序有漏洞, bufferTailLen < 0');
            }
            var data_end = data_start + bufferTailLen;
            data.copy(buffer_, write_pos_, data_start, data_end);

            write_pos_ = 0;
            data_start = data_end;

            // 未拷贝的数据长度
            var unDataCopyLen = data_len - bufferTailLen;
            data.copy(buffer_, write_pos_, data_start, data_start + unDataCopyLen);
            data_length_ = data_length_ + data_len;
            write_pos_ = write_pos_ + unDataCopyLen;
        }
        else {
            data.copy(buffer_, write_pos_, data_start, data_start + data_len);

            if (write_pos_ > buffer_length_) {
                console.log('程序有漏洞，write_pos > buffer_length');
            }

            data_length_ = data_length_ + data_len;
            write_pos_ = write_pos_ + data_len;
        }

        util.printLog('cc_buffer data length', data_length_);

        getData(callback);
    };

    function getData(callback) {
        while(true) {
            if (getDataLen() <= data_head_length_) {
                break;
            }

            // 解析包头长度
            var buffLastCanReadLen = buffer_length_ - read_pos_;
            var dataLen = 0;
            var headBuffer = Buffer.alloc(data_head_length_, 0, 'binary');
            if (buffLastCanReadLen < data_head_length_) {
                // 取出第一部分头
                buffer_.copy(headBuffer, 0, read_pos_, buffer_.length);

                // 取出第二部分头
                var unReadHeadLen = data_head_length_ - buffLastCanReadLen;
                buffer_.copy(headBuffer, buffLastCanReadLen, 0, unReadHeadLen);

                dataLen = headBuffer[read_int_method_]();
            }
            else {
                buffer_.copy(headBuffer, 0, read_pos_, read_pos_ + data_head_length_);
                dataLen = headBuffer[read_int_method_]();
            }

            var get_data_len = getDataLen();

            // 数据长度不够，直接返回
            if (getDataLen() < dataLen) {
                break;
            }
            else {
                // 读一个数据包，包含包长度
                var readData = Buffer.alloc(dataLen);
                // 数据分段存储，需要读取两次
                if (buffer_length_ - read_pos_ < dataLen) {
                    // 读第一部分
                    var firstPartLen = buffer_length_ - read_pos_;
                    buffer_.copy(readData, 0, read_pos_, firstPartLen + read_pos_);

                    // 读第二部分
                    var secondPartLen = dataLen - firstPartLen;
                    buffer_.copy(readData, firstPartLen, 0, secondPartLen);
                    read_pos_ = secondPartLen;
                }
                else {
                    buffer_.copy(readData, 0, read_pos_, read_pos_ + dataLen);
                    read_pos_ = read_pos_ + dataLen;
                }
                try {
                    if (callback) {
                        callback(null, readData);
                    }

                    data_length_ = data_length_ - dataLen;

                    // 已经读取完所有数据
                    if (read_pos_ == write_pos_) {
                        break;
                    }
                }
                catch(err) {
                    if (callback) {
                        callback(err, null);
                    }
                    console.log('cc buffer getData error: ' + JSON.stringify(err));
                }
            }
        }
        // 结束包
        if (callback) {
            callback(null, null);
        }
    }

    function getDataLen() {
        var dataLen = 0;
        // 缓存全满
        if (data_length_ == buffer_length_ && write_pos_ >= read_pos_) {
            dataLen = buffer_length_;
        }
        else if (write_pos_ >= read_pos_) {
            dataLen = write_pos_ - read_pos_;
        }
        else {
            dataLen = buffer_length_ - read_pos_ + write_pos_;
        }

        if (dataLen != data_length_) {
            console.log('程序有漏洞,data_length长度不合法');
            console.log('dataLen: ' + JSON.stringify(dataLen));
            console.log('data_length_: ' + JSON.stringify(data_length_));
            console.log('buffer_length_: ' + JSON.stringify(buffer_length_));
            console.log('read_pos_: ' + JSON.stringify(read_pos_));
            console.log('write_pos_: ' + JSON.stringify(write_pos_));
        }
        return dataLen;
    };

    // 获取buffer可用空间长度
    this.getAvailableLen = function() {
        return (buffer_length_ - data_length_);
    };

};

module.exports = cc_buffer;
