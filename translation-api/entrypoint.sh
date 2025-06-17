#!/bin/bash

echo "Aguardando RabbitMQ..."
until nc -z -v -w30 rabbitmq 5672; do
  echo "RabbitMQ não está disponível ainda..."
  sleep 2
done
echo "RabbitMQ está pronto!"

echo "Aguardando MongoDB..."
until nc -z -v -w30 mongodb 27017; do
  echo "MongoDB não está disponível ainda..."
  sleep 2
done
echo "MongoDB está pronto!"

echo "Iniciando API..."
exec npm start
