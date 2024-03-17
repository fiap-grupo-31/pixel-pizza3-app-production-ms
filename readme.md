![Static Badge](https://img.shields.io/badge/v11-version?logo=typescript&color=%234169E1&labelColor=white&label=Typescript)
![Static Badge](https://img.shields.io/badge/v18-version?logo=node.js&color=%234169E1&labelColor=white&label=Nojes)
[![MySQL Version](https://img.shields.io/badge/MySQL-v8-blue?logo=mysql&labelColor=white)](https://www.mysql.com/)
![Static Badge](https://img.shields.io/badge/v11-version?logo=ubuntu&color=%234169E1&labelColor=white&label=Ubuntu) ![Static Badge](https://img.shields.io/badge/v20-version?logo=docker&color=%234169E1&labelColor=white&label=Docker) ![Static Badge](https://img.shields.io/badge/v1.29.2-version?logo=dockercompose&color=%234169E1&labelColor=white&label=DockerCompose) ![Static Badge](https://img.shields.io/badge/vOAS3-version?logo=swagger&color=%234169E1&labelColor=white&label=Swagger)
[![RabbitMQ Version](https://img.shields.io/badge/RabbitMQ-v1.29.2-blue?logo=rabbitmq)](https://www.rabbitmq.com/)


# Tech Challenge - Fase 05 (GRUPO 31) - Sistema de gestão de pedidos - Microserviço de Produção

Consiste no microserviço de um sistema de gestão de pedidos para produção incluindo as seguintes caracteristicas:

## Caracteristicas

- Endpoint de buscar todos os pedidos em produção
- Endpoint para criar um novo pedido para produção
- Endpoint de buscar um pedido em produção por id
- Endpoint de buscar todos os pedidos em produção por status
- Endpoint para atualizar um status de um pedido emprodução
- Pipeline GitActions Workflow para execução de testes e build da imagem em ECR AWS

## Padrão Saga
O padrão de saga coreografado foi selecionado como a abordagem ideal para a comunicação entre os microsserviços envolvidos no processamento de pedidos por diversas razões fundamentais que se alinham com os requisitos e princípios da arquitetura de microsserviços criada em nosso projeto:

- Autonomia e Desacoplamento:
No padrão de saga coreografado, cada microsserviço é autônomo em sua execução e responsabilidade. Isso significa que cada serviço é capaz de tomar decisões e agir de forma independente em resposta aos eventos que ocorrem dentro do sistema. Essa autonomia promove um alto nível de desacoplamento entre os serviços, permitindo que eles evoluam de forma independente e sejam mais facilmente escaláveis.

- Flexibilidade e Resiliência:
O padrão de saga coreografado oferece uma flexibilidade excepcional para lidar com cenários complexos e imprevisíveis. Cada microsserviço é capaz de adaptar seu comportamento em tempo real com base nos eventos que ocorrem no sistema. Isso permite que o sistema se recupere de falhas e exceções de forma mais eficaz, garantindo uma maior resiliência e robustez.

- Escalabilidade Horizontal:
A abordagem coreografada permite uma escalabilidade horizontal eficiente, pois cada microsserviço pode ser escalado independentemente com base em suas próprias demandas de carga de trabalho. Isso possibilita a distribuição do processamento e a utilização eficiente dos recursos disponíveis, garantindo um desempenho otimizado em todo o sistema.

- Dinâmica de Comunicação:
No padrão de saga coreografado, a comunicação entre os microsserviços é baseada em eventos assíncronos e troca de mensagens. Isso permite uma dinâmica de comunicação fluida e adaptável, onde os serviços podem colaborar e coordenar suas atividades de forma eficiente, mesmo em um ambiente distribuído e altamente escalável.

- Baixa Complexidade de Orquestração:
Ao contrário do padrão de saga orquestrado, onde existe um componente centralizado responsável por coordenar e controlar o fluxo de execução, o padrão de saga coreografado possui uma complexidade de orquestração significativamente menor. Cada microsserviço é responsável por coordenar suas próprias atividades em resposta aos eventos que ocorrem no sistema, reduzindo assim a sobrecarga e o ponto único de falha.

#### Baseado nessas considerações, o padrão de saga coreografado foi escolhido como a abordagem mais adequada para a comunicação entre os microsserviços envolvidos no processamento de pedidos. Sua flexibilidade, autonomia e capacidade de lidar com cenários complexos garantem um sistema altamente resiliente, escalável e adaptável às demandas em constante evolução do negócio, bem como a não necessidade de criar um novo microserviço desacoplado com banco de dados isolado para orquestrar todo o processo.


### Criação de Pedido e Pedido de pagamento Modelo coreografado, saga executado com sucesso
```mermaid
sequenceDiagram
loop Criação de pedido
    Cliente->>MICROSERVICE_ORDERS: Pedido realizado via API para Microserviço Orders
    MICROSERVICE_ORDERS->>MongoDb: Persiste em database
    MICROSERVICE_ORDERS->>RabbitMq: Queue Pedido de Pagamento
	RabbitMq->>MICROSERVICE_PAYMENT: Efetua pedido de pagamento
    MICROSERVICE_PAYMENT->>Mysql: Persiste em database
    MICROSERVICE_PAYMENT->>RabbitMq: Envia SUCCESS Sucesso no pedido pagamento
    RabbitMq->>MICROSERVICE_ORDERS: Microserviço e Orders processa retorno
    MICROSERVICE_ORDERS->>MongoDb: Persiste em database
    MICROSERVICE_ORDERS-->>Whatsapp: Notifica Cliente
    MICROSERVICE_ORDERS->>RabbitMq: Queue Produção de pedido (Cozinha)
    RabbitMq->>MICROSERVICE_PRODUCTION: Cria pedido na cozinha para produção
    MICROSERVICE_PRODUCTION->>Mysql: Persiste em database
    MICROSERVICE_PRODUCTION->>RabbitMq: Envia SUCCESS Sucesso para pedidos atualizar andamento
    RabbitMq->>MICROSERVICE_ORDERS: Microserviço e Orders processa retorno
    MICROSERVICE_ORDERS->>MongoDb: Persiste em database
    MICROSERVICE_ORDERS-->>Whatsapp: Notifica Cliente do andamento
end

```

### Criação de Pedido e Pedido de pagamento Modelo coreografado, saga entrando em ação compensatória por falha no pedido de pagamento
```mermaid
sequenceDiagram
loop Criação de pedido
    Cliente->>MICROSERVICE_ORDERS: Pedido realizado via API para Microserviço Orders
    MICROSERVICE_ORDERS->>MongoDb: Persiste em database
    MICROSERVICE_ORDERS->>RabbitMq: Queue Pedido de Pagamento
	RabbitMq->>MICROSERVICE_PAYMENT: Efetua pedido de pagamento
    MICROSERVICE_PAYMENT->>Mysql: Persiste em database
    MICROSERVICE_PAYMENT->>RabbitMq: Envia ERROR Falha no pedido pagamento
    RabbitMq->>MICROSERVICE_ORDERS: Microserviço e Orders processa retorno compensatório
    MICROSERVICE_ORDERS->>MongoDb: Persiste em database
    MICROSERVICE_ORDERS-->>Whatsapp: Notifica Cliente
end

```

### Criação de Pedido e Pedido de pagamento Modelo coreografado, saga entrando em ação compensatória por falha na criação da do pedido na cozinha
```mermaid
sequenceDiagram
loop Criação de pedido
    Cliente->>MICROSERVICE_ORDERS: Pedido realizado via API para Microserviço Orders
    MICROSERVICE_ORDERS->>MongoDb: Persiste em database
    MICROSERVICE_ORDERS->>RabbitMq: Queue Pedido de Pagamento
	RabbitMq->>MICROSERVICE_PAYMENT: Efetua pedido de pagamento
    MICROSERVICE_PAYMENT->>Mysql: Persiste em database
    MICROSERVICE_PAYMENT->>RabbitMq: Envia SUCCESS Sucesso no pedido pagamento
    RabbitMq->>MICROSERVICE_ORDERS: Microserviço e Orders processa retorno
    MICROSERVICE_ORDERS->>MongoDb: Persiste em database
    MICROSERVICE_ORDERS-->>Whatsapp: Notifica Cliente
    MICROSERVICE_ORDERS->>RabbitMq: Queue Produção de pedido (Cozinha)
    RabbitMq->>MICROSERVICE_PRODUCTION: Cria pedido na cozinha para produção
    MICROSERVICE_PRODUCTION->>Mysql: Persiste em database
    MICROSERVICE_PRODUCTION->>RabbitMq: Envia ERROR Falha para cozinha receber
    RabbitMq->>MICROSERVICE_ORDERS: Microserviço e Orders processa retorno compensatório
    MICROSERVICE_ORDERS->>MongoDb: Persiste em database
    MICROSERVICE_ORDERS-->>Whatsapp: Notifica Cliente do andamento
    MICROSERVICE_ORDERS->>RabbitMq: Queue Pedido de cancelamento de Pagamento compensatório
	RabbitMq->>MICROSERVICE_PAYMENT: Efetua pedido de cancelamento pagamento
    MICROSERVICE_PAYMENT->>Mysql: Persiste em database
    MICROSERVICE_PAYMENT->>RabbitMq: Envia SUCCESS Sucesso no pedido pagamento
    RabbitMq->>MICROSERVICE_ORDERS: Microserviço e Orders processa retorno
    MICROSERVICE_ORDERS->>MongoDb: Persiste em database
    MICROSERVICE_ORDERS-->>Whatsapp: Notifica Cliente
end

```

## Requisitos para execução direta

- Debian: 11 ou superior | Ubuntu: 20
- Node: 18 ou superior
- Banco de dados Mysql

## Requisitos para execução via docker

- Docker: 20 ou superior
- Docker-compose: 1.29.2 ou superior

## Execução dos testes unitários

- npm run test

![Alt text](test.png)

Coverage

![Alt text](coverage.png)

## Gerar a versão de distribuição /dist ( se necessário )

Executar o comando abaixo para gerar automaticamente o dist
- npm run build

## Execução via docker
A execução da aplicação via docker-compose permite a execução do microserviço com escalabilidade horizontal (via replicas do container).

Para executar o modelo padrão da atividade executando 2 instâncias (1 para aplicação e 1 para o banco de dados), acesse o diretorio onde está o código e digite o comando a seguir:

    docker-compose up

Ele irá provisionar uam instância de banco de dados (mysql) e aplicar um build no Dockerfile para provisionar a instância de aplicação. Em tela irá apresentar o log continuo da execução dos serviços.

Para executar o pacote sem visualizar os log's, execute o comando abaixo:

    docker-compose up -d

Para encerrar o serviço digite o comando a seguir: 

    docker-compose down

## Documentação das API's

A documentação pode ser acessada via browser digitando o endereço abaixo quando a aplicação estiver em execução:

    http://localhost:8082/api-docs/

Para acessar diretamente [clique aqui](http://localhost:8082/api-docs/)

O swagger é um framework composto por diversas ferramentas que, independente da linguagem, auxilia a descrição, consumo e visualização de serviços de uma API REST e foi selecionado para documentação dos endpoints do backend da aplicação.

- PRODUÇÃO (payments)
    - Permite listar todos os pedidos em produção
    - Efetua pedido para produção
    - Permite listar 1 pedido em produção por id
    - Permite listar todos os pedidos em produção por status
    - Permite atualizar o status de um pedido em produção

## Requisitos para jornada de teste

## Jornada de teste

Permite listar todos os pedidos em produção
```
curl --location 'http://localhost:8082/production'
```

Permite listar 1 pedido em produção por id
```
curl --location 'http://localhost:8082/production/{id}'
```

Permite listar todos os pedidos em produção por status
```
curl --location 'http://localhost:8082/production/status/{status}'
```

Efetua pedido para produção
```
curl --location 'http://localhost:8082/production' \
--header 'Content-Type: application/json' \
--data '{
  "orderId": "123456789",
  "protocol": "1",
  "orderDescription": ""
}'

```

Permite atualizar o status de um pedido em produção
```
curl --location 'http://localhost:8082/production/id' \
--header 'Content-Type: application/json' \
--data '{
  "status": "DONE"
}'

```


## Requisitos para teste unitário automatizado via GitActions e BuildImage para registro no ECR AWS

* [Terraform](https://www.terraform.io/) - Terraform is an open-source infrastructure as code software tool that provides a consistent CLI workflow to manage hundreds of cloud services. Terraform codifies cloud APIs into declarative configuration files.
* [Amazon AWS Account](https://aws.amazon.com/it/console/) - Amazon AWS account with billing enabled
* [aws cli](https://aws.amazon.com/cli/) optional

## Antes de começar

Esta execução esta fora do nível gratuito da AWS, importante avaliar antes de executar

## AWS configuração

Com os requisitos já identificados, configure abaixo no secrets do github.

```
AWS_ACCESS_KEY = "xxxxxxxxxxxxxxxxx"
AWS_SECRET_KEY = "xxxxxxxxxxxxxxxxx"
SONAR_HOST_URL = "xxxxxxxxxxxxxxxxx"
SONAR_TOKEN    = "xxxxxxxxxxxxxxxxx"
```

## Uso

Com os requisitos já identificados, as variáveis configuradas no secrets do github.

Efetue o Pull Request com a branch master para executar o processo de

- Teste
- Sonarqube
- Deploy

### Execução do projeto

Ao efetuar um push no repositório develop com sucesso, é necessário efetuar um pull request na branch master para que a execução do pipeline do workflow seja executado

