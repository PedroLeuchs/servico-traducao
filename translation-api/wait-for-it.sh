#!/bin/sh
# wait-for-it.sh script adaptado para esperar serviços externos
# antes de iniciar a aplicação

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z -v -w30 "$host" "$port"; do
  echo "Esperando por $host:$port..."
  sleep 1
done

echo "$host:$port está disponível, executando comando"
exec $cmd
