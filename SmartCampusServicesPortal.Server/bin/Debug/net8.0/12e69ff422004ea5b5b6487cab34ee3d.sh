function list_child_processes () {
    local ppid=$1;
    local current_children=$(pgrep -P $ppid);
    local local_child;
    if [ $? -eq 0 ];
    then
        for current_child in $current_children
        do
          local_child=$current_child;
          list_child_processes $local_child;
          echo $local_child;
        done;
    else
      return 0;
    fi;
}

ps 23053;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 23053 > /dev/null;
done;

for child in $(list_child_processes 23059);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/excellentmashengete/Downloads/Smart-Campus-Services-Portal/SmartCampusServicesPortal.Server/bin/Debug/net8.0/12e69ff422004ea5b5b6487cab34ee3d.sh;
