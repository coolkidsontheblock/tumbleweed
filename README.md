![Tumbleweed](https://raw.githubusercontent.com/tumbleweed-cdc/.github/171c43760709c6998007793df34de60e8352c56e/profile/tumbleweed_logo_rectangle.svg)

## 🌵 What is Tumbleweed?

Tumbleweed is an open-source, user-friendly framework designed for fast and consistent data propagation between microservices using Change Data Capture (CDC) and the transactional outbox pattern.
It automatically deploys a self-hosted log-based CDC pipeline that abstracts away the complexities associated with setting up and using CDC tools. It is designed to monitor changes in one or more PostgreSQL databases and sync that data to consumer microservices in near real-time.

For more information check out our [case study](https://tumbleweed-cdc.github.io/docs/introduction/).

## 👷🏻‍♂️ Architecture and Technologies

Tumbleweed is powered by various open-source tools along with a custom TypeScript backend API and React-based frontend UI, ensuring efficient event-driven communication and seamless deployment.

* **Apache Kafka:** Log based message broker for high throughput, real-time data streaming. Decouples producer and consumer services through topic-based subscriptions.
* **Kafka Connect:** Facilitates data transmission between Kafka and external systems using source and sink connectors.
* **Debezium:** Enables real-time monitoring and streaming of database changes.
* **Apicurio Schema Registry:** Manages and stores schemas for Kafka messages, ensuring efficient data serialization and evolution.
* **Tumbleweed Backend API:** Tumbleweed leverages TypeScript and Express to provide a high-performance backend that is easy to extend and integrate with various services, ensuring smooth communication and efficient data synchronization among microservices.
* **Tumbleweed Frontend UI:** Built with React, the frontend offers a user-friendly and responsive interface, allowing users to effortlessly configure and manage their Tumbleweed pipelines.
* **Automated Cloud Deployment:** Custom CLI tool and Terraform for provisioning and deploying Tumbleweed pipelines on AWS ECS (Elastic Cloud Services) using Fargate.

## 💡 Key Features

* **Log-Based Change Data Capture (CDC):** Efficient data synchronization between microservices using log-based CDC.
* **Outbox Pattern Implementation:** Outbox pattern integration ensures reliable message delivery.
* **Abstraction of Complexities:** Simplifies the creation of outbox tables, message broker configuration, and setup of CDC tools.
* **Drop-In Solution:** Easily integrates into existing or newly created microservice architecture without extensive modifications.
* **Automated Deployment:** Provides simple CLI application for automatic deployment of self-hosted Tumbleweed pipelines on Amazon Web Services (AWS).
* **User-Friendly Interface:** Intuitive UI that simplifies setup and management of source and sink connectors.

## ➡️ Getting Started

### 📝 Configuring PostgreSQL

To enable Tumbleweed's Change Data Capture capabilities, your source PostgreSQL database must be version 10 or later and configured to use the **logical** replication mode by setting the Write-Ahead Log (WAL) level to `logical`.

Note: The location of the `postgresql.conf` and `pg_hba.conf` files may vary depending on how PostgreSQL is installed. Additionally, these files are typically not directly accessible on managed cloud services, in which case you need to use the provider's configuration tools to modify these settings. (e.g, Parameter Groups on AWS RDS).
1. Modify the PostgreSQL Configuration File:
    * Locate the `postgresql.conf` file and update the following settings:
    ```
    wal_level = logical
    max_replication_slots = 5
    max_wal_senders = 5
    ```
   
    * `wal_level` must be set to `logical` to enable logical replication.
    * `max_replication_slots` number of maximum allowed replication slots.
    * `max_wal_senders` number of concurrent connections allowed for sending WAL data.
2. Edit the pg_hba.conf file:
    ```
    host replication all 0.0.0.0/0 md5
    ```
    * Update this file  by replacing `0.0.0.0/0` with a specific IP address or range to allow trusted connections for replication.
3. Apply the changes by restarting the PostgreSQL server using the command 
  ```
  sudo systemctl restart postgresql
  ```
4. Confirm the PostgreSQL server is correctly set up for logical replication by running the SQL query `SHOW wal_level`. The output should be `logical`.

### 🔒 Database Permissions

Tumbleweed requires the ability to create an "outbox" table in your source database to propagate changes to consumers. Ensure the provided database user has the necessary privileges to connect to the database, create tables, and insert data into them.

### 🔄 Updating Queries

Tumblweed also requires you to modify your existing database queries that involve create and update operations.  This involves inserting a corresponding record into the "outbox" table and then deleting it within the same transaction. 

1. Identify all SQL queries in your application that insert or update data in your source database.

2. Modify the queries to use transactions. This will vary based on the language being used. The corresponding record should include the following:
      * aggregatetype (event descriptor/topic name)
      * aggregateid (payload id)
      * type (event category sub-type)
      * payload (event data as JSONB object)

Here's an example of adding a transaction to a JavaScript application query that inserts data into an orders table:
```js
try {
  // Transaction Begin
  await query('BEGIN');

  // Original query
  const newOrder = await query(`INSERT INTO orders (product_name, cost)
                                VALUES ($1, $2)
                                RETURNING *`, 
                                [product_name, cost]);

  // Add the event to the outbox
  await query(`INSERT INTO outbox (aggregatetype, aggregateid, type, payload)
        VALUES ($1, $2, $3, $4)`,
        ['order', newOrder.rows[0].id, 'order_created', JSON.stringify(newOrder.rows[0])]);
   
  // Clear the outbox table after the record has been successfully processed
  await query(`DELETE from outbox`);

  // Transaction End
  await query('COMMIT'); 
} catch (error) {
  // Reverts transaction changes in case of errors
  await query('ROLLBACK');
}
```
**Abstract API for Outbox Events**

To facilitate sending events to the outbox table, a more abstract approach may be beneficial, especially in larger applications. This provides more flexbility by allowing easier modification of the implementation details of the outbox, as well as promoting code reusability.

Here is an example of a JavaScript interface implementation using a class:
```js
class OutboxService {
    constructor(query) {
        this.query = query; // Database query function
    }

    async addEvent(aggregateType, aggregateId, eventType, payload) {
        await this.query(`INSERT INTO outbox (aggregatetype, aggregateid, type, payload)
                          VALUES ($1, $2, $3, $4)`,
                          [aggregateType, aggregateId, eventType, JSON.stringify(payload)]);
    }

    async clearOutbox() {
        await this.query(`DELETE FROM outbox`);
    }
}
```
And here is an example of how it could be applied to the same transaction demonstrated in the previous section:
```js
// Pass the query function to the service
const outboxService = new OutboxService(query);

try {
  // Transaction Begin
  await query('BEGIN'); 

  // Original query
  const newOrder = await query(`INSERT INTO orders (product_name, cost)
                                VALUES ($1, $2)
                                RETURNING *`, 
                                [product_name, cost]);

  // Add the event to the outbox
  await outboxService.addEvent('order', newOrder.rows[0].id, 'order_created', newOrder.rows[0]);

  // Clear the outbox table after the record has been successfully processed
  await outboxService.clearOutbox();

  // Transaction End
  await query('COMMIT');
} catch (error) {
  // Reverts transaction changes in case of errors
  await query('ROLLBACK');
}
```

## 🚀 Deployment

### ⚙️ Automated Deployment

A Command-Line Interface (CLI) tool is provided to automatically deploy self-hosted Tumbleweed pipelines to Amazon Web Services (AWS).

**Prerequisites:**

* An Amazon Web Services (AWS) account
* IP address(es) that will have access to the Tumbleweed UI
* Install [AWS CLI](https://aws.amazon.com/cli/)
* Install [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

You are now ready to deploy Tumbleweed!

Run the following command in your command line to get started:

```
npx tumbleweed_cdc roll
```

The pipeline can be destroyed with the following command:

```
npx tumbleweed_cdc burn
```
⚠️ Destroying the pipeline will permanently delete all associated resources and data.

### 🛠️ Manual Deployment

Manual deployment is also an option, whether locally or to an existing server of your choice using Docker.

**Prerequisites:**

* Install [Docker](https://docs.docker.com/engine/install/)

<br>

1. Clone the tumbleweed repository to your server by running the following command in your command line:

```
git clone https://github.com/tumbleweed-cdc/tumbleweed
```

2. Navigate to the `tumbleweed/docker` directory.

3. Run the following command to spin up the necessary docker containers and start the application:

```
sudo docker compose up -d --build
```

4. The Tumbleweed UI can now be accessed at `localhost:3001`.

Use the following command to stop the Tumbleweed application and all of its docker containers:
```
sudo docker compose down -v
```

## 📊 Consuming Data

Once a consumer is created in the Tumbleweed UI, it can be clicked on to view the consumer's details, including a provided Tumbleweed endpoint URL. This URL serves as a connection point for the consumer service to receive a stream of data from the topics they are subscribed to. The necessary code to establish a Server-Sent Events (SSE) connection must be implemented in each consumer service. The implementation details may vary depending on the programming language or technology used by the microservice.

Here is an example of the necessary code implemented in JavaScript:
```js
import EventSource from 'eventsource';

// Replace URL with provided Tumbleweed endpoint URL
const eventSource = new EventSource("http://127.0.0.1:4001/tumbleweed/consumer1");

// Do something when new message is received
eventSource.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received message:', message);
};

// Error handling
eventSource.onerror = (error) => {
  console.error('EventSource failed:', error);
};
```
---
🤝 Developed By: 
[Cruz Hernandez](https://github.com/archzedzenrun) | 
[Nick Perry](https://github.com/nickperry12) |
[Paco Michelson](https://github.com/jeffbbz) |
[Esther Kim](https://github.com/ekim1009)
