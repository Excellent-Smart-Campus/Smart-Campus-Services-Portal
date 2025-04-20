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

ps 79798;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 79798 > /dev/null;
done;

for child in $(list_child_processes 79802);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/excellentmashengete/Downloads/Project/Smart-Campus-Services-Portal/SmartCampusServicesPortal.Server/bin/Debug/net8.0/a693f56a55bd4372bf1b39feb42afa9c.sh;
