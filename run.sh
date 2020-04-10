#!/bin/bash
v_time=`date "+%Y-%m-%d %H:%M:%S"`
path="/Users/modonglin/biubiu"
log="$path/log"
echo -e "`pwd` $v_time" >> $log
cd $path
/Users/modonglin/.nvm/versions/node/v12.14.0/bin/node index.js >> "$log" 2>&1
end_time=`date "+%Y-%m-%d %H:%M:%S"`
echo -e "$end_time done \r\n" >> $log
