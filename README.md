# Serviço de Tradução de Textos - Microserviços com Node.js

Este projeto implementa um sistema de tradução de textos utilizando arquitetura de microserviços. A aplicação é composta por dois serviços que se comunicam de forma assíncrona através de uma fila de mensagens (RabbitMQ).

## Estrutura do Projeto

```
servico-traducao/
├── docker-compose.yml       # Configuração dos serviços Docker
├── translation-api/         # Serviço da API REST
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── index.js
│   └── package.json
└── translation-worker/      # Serviço de processamento de traduções
    ├── models/
    ├── services/
    ├── Dockerfile
    ├── entrypoint.sh
    ├── index.js
    └── package.json
```

## Funcionalidades

### API REST (translation-api)

- Endpoint `POST /api/translations` para submeter textos para tradução
- Endpoint `GET /api/translations/:requestId` para verificar o status de uma tradução
- Endpoint `GET /api/translations` para listar todas as traduções

### Worker (translation-worker)

- Consome mensagens da fila
- Processa as traduções de forma assíncrona
- Atualiza o status no banco de dados

## Requisitos

- Docker e Docker Compose

## Executando a Aplicação com Docker

A maneira mais simples de executar o projeto é usando o Docker Compose, que iniciará todos os serviços necessários em contêineres isolados. Você não precisa instalar Node.js, MongoDB ou RabbitMQ localmente.

### Passo 1: Clonar o repositório

```bash
git clone <url-do-repositorio>
cd servico-traducao
```

### Passo 2: Construir e iniciar os contêineres

```bash
docker-compose up --build
```

Isso construirá as imagens Docker necessárias e iniciará todos os serviços:

- MongoDB (banco de dados)
- RabbitMQ (sistema de mensageria)
- translation-api (API REST)
- translation-worker (serviço de processamento)

Para executar em segundo plano:

```bash
docker-compose up -d
```

### Passo 3: Verificar se os serviços estão funcionando

```bash
docker ps
```

Você deverá ver quatro contêineres em execução:

- mongodb
- rabbitmq
- translation-api
- translation-worker

### Passo 4: Acessar a API

A API estará disponível em: `http://localhost:3000`

Para parar todos os serviços:

```bash
docker-compose down
```

Se você quiser remover todos os volumes (o que apagará os dados do MongoDB):

```bash
docker-compose down -v
```

## Testando a API

### Exemplos Funcionais de Teste

#### 1. Criar uma Nova Tradução

Você pode usar curl, Postman ou qualquer outra ferramenta de requisições HTTP.

**Usando Postman:**

- **Método**: POST
- **URL**: `http://localhost:3000/api/translations`
- **Headers**: Content-Type: application/json
- **Body** (JSON):

```json
{
  "sourceText": "hello",
  "sourceLanguage": "en",
  "targetLanguage": "pt"
}
```

**Exemplo de resposta**:

```json
{
  "message": "Tradução em processamento",
  "requestId": "60f1a5b3c8e9a2001234abcd"
}
```

> **Importante**: Anote o `requestId` retornado, pois ele será necessário para verificar o status da tradução.

#### 2. Verificar Status da Tradução

- **Método**: GET
- **URL**: `http://localhost:3000/api/translations/60f1a5b3c8e9a2001234abcd` (substituir pelo ID retornado no passo anterior)

**Exemplo de resposta**:

```json
{
  "requestId": "60f1a5b3c8e9a2001234abcd",
  "status": "completed",
  "sourceText": "hello",
  "sourceLanguage": "en",
  "targetLanguage": "pt",
  "translatedText": "olá",
  "createdAt": "2025-06-16T10:00:00.000Z",
  "updatedAt": "2025-06-16T10:00:10.000Z"
}
```

O status pode ser:

- `pending`: Tradução ainda não processada
- `processing`: Tradução em andamento
- `completed`: Tradução concluída
- `failed`: Erro ao processar a tradução

#### 3. Listar Todas as Traduções

- **Método**: GET
- **URL**: `http://localhost:3000/api/translations`

**Exemplo de resposta**:

```json
[
  {
    "requestId": "60f1a5b3c8e9a2001234abcd",
    "status": "completed",
    "sourceText": "hello",
    "sourceLanguage": "en",
    "targetLanguage": "pt",
    "translatedText": "olá",
    "createdAt": "2025-06-16T10:00:00.000Z",
    "updatedAt": "2025-06-16T10:00:10.000Z"
  },
  {
    "requestId": "60f1a5b3c8e9a2001234efgh",
    "status": "completed",
    "sourceText": "goodbye",
    "sourceLanguage": "en",
    "targetLanguage": "es",
    "translatedText": "adiós",
    "createdAt": "2025-06-16T11:00:00.000Z",
    "updatedAt": "2025-06-16T11:00:10.000Z"
  }
]
```

### Usando PowerShell

#### Criar Tradução

```powershell
$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    sourceText = 'hello'
    sourceLanguage = 'en'
    targetLanguage = 'pt'
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/translations' -Method Post -Headers $headers -Body $body

$requestId = $response.requestId
Write-Host "ID da solicitação: $requestId"
$response | ConvertTo-Json
```

#### Verificar Status

```powershell
# Substitua pelo ID retornado na criação
$requestId = "60f1a5b3c8e9a2001234abcd"
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/translations/$requestId" -Method Get

$response | ConvertTo-Json
```

### Usando Curl (no PowerShell)

#### Criar Tradução

```powershell
curl -X POST http://localhost:3000/api/translations `
     -H "Content-Type: application/json" `
     -d "{\"sourceText\":\"hello\",\"sourceLanguage\":\"en\",\"targetLanguage\":\"pt\"}"
```

#### Verificar Status

```powershell
# Substitua pelo ID retornado na criação
curl -X GET http://localhost:3000/api/translations/60f1a5b3c8e9a2001234abcd
```

## Idiomas Suportados

Atualmente, o serviço de tradução suporta um conjunto limitado de palavras e frases pré-definidas entre os seguintes idiomas:

- Inglês (en)
- Português (pt)
- Espanhol (es)
- Francês (fr)

### Palavras e frases suportadas para tradução

O serviço atual utiliza um dicionário de traduções pré-definidas. Aqui estão algumas das palavras que podem ser traduzidas:

| Inglês (en) | Português (pt) | Espanhol (es) | Francês (fr)    |
| ----------- | -------------- | ------------- | --------------- |
| hello       | olá            | hola          | bonjour         |
| goodbye     | adeus          | adiós         | au revoir       |
| thank you   | obrigado       | gracias       | merci           |
| yes         | sim            | sí            | oui             |
| no          | não            | no            | non             |
| please      | por favor      | por favor     | s'il vous plaît |
| sorry       | desculpe       | lo siento     | désolé          |

> **Nota**: Para adicionar suporte a mais palavras ou integrar com serviços de tradução externos como Google Translate ou Microsoft Translator, será necessário modificar a implementação no `translation-worker/services/translationService.js`.

## Monitoramento e Administração

### Interface do RabbitMQ

Você pode acessar a interface de administração do RabbitMQ para monitorar filas e mensagens:

- **URL**: http://localhost:15672
- **Usuário**: guest
- **Senha**: guest

Na interface do RabbitMQ, você pode:

- Verificar o status da fila "translations"
- Monitorar o envio e consumo de mensagens
- Verificar se há mensagens presas na fila

### MongoDB

Se você precisar acessar diretamente o MongoDB, pode usar qualquer cliente MongoDB (como MongoDB Compass) com a seguinte conexão:

- **URL de Conexão**: mongodb://localhost:27017/translation-service

## Arquitetura do Sistema

O sistema utiliza uma arquitetura de microserviços com comunicação assíncrona:

1. **API (translation-api)**:

   - Recebe solicitações HTTP dos clientes
   - Valida as entradas
   - Envia mensagens para a fila RabbitMQ
   - Fornece endpoints para consultar o status das traduções

2. **Worker (translation-worker)**:

   - Consome mensagens da fila RabbitMQ
   - Processa as traduções
   - Atualiza o status no banco de dados MongoDB

3. **RabbitMQ**:

   - Gerencia a fila de mensagens
   - Garante que as mensagens não sejam perdidas
   - Permite escalabilidade horizontal dos workers

4. **MongoDB**:
   - Armazena os detalhes e status das traduções
   - Compartilhado entre a API e o Worker

Esta arquitetura permite alta escalabilidade e resiliência:

- Os serviços podem ser escalados independentemente
- Falhas em um serviço não afetam diretamente os outros
- O sistema pode lidar com picos de demanda através da fila

## Solução de Problemas

### API não está acessível

1. Verifique se todos os contêineres estão em execução:

   ```bash
   docker ps
   ```

2. Verifique os logs da API:
   ```bash
   docker logs translation-api
   ```

### Traduções não estão sendo processadas

1. Verifique os logs do Worker:

   ```bash
   docker logs translation-worker
   ```

2. Verifique se o RabbitMQ está funcionando corretamente através da interface de administração (http://localhost:15672)

3. Reinicie os serviços:
   ```bash
   docker-compose restart
   ```

## Licença

Este projeto está licenciado sob a licença MIT.
