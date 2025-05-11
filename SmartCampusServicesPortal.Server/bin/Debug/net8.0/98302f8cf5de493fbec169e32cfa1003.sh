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

ps 21721;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 21721 > /dev/null;
done;

for child in $(list_child_processes 21730);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/excellentmashengete/Downloads/Smart-Campus-Services-Portal/SmartCampusServicesPortal.Server/bin/Debug/net8.0/98302f8cf5de493fbec169e32cfa1003.sh;
