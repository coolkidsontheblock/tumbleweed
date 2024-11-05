CREATE TABLE IF NOT EXISTS public.connectors
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    plugin_name TEXT NOT NULL,
    database_hostname TEXT NOT NULL,
    database_port INT NOT NULL,
    database_user TEXT NOT NULL,
    database_password TEXT NOT NULL,
    database_dbname TEXT NOT NULL,
    database_server_name TEXT NOT NULL,
    connector_class TEXT NOT NULL,
    table_include_list TEXT NOT NULL,
    tombstone_on_delete TEXT NOT NULL,
    slot_name TEXT NOT NULL,
    transforms TEXT NOT NULL,
    transforms_outbox_type TEXT NOT NULL,
    transforms_outbox_table_fields_additional_placement TEXT NOT NULL,
    transforms_outbox_table_expand_json_payload TEXT NOT NULL,
    value_converter TEXT NOT NULL,
    topic_prefix TEXT NOT NULL,
    heartbeat_action_query TEXT NOT NULL,
    heartbeat_interval_ms INT NOT NULL,
    publication_name TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.consumers
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    endpoint_URL TEXT NOT NULL,
    kafka_client_id TEXT NOT NULL,
    kafka_broker_endpoints TEXT[] NOT NULL,
    kafka_group_id TEXT NOT NULL,
    subscribed_topics TEXT[] NOT NULL,
    received_message_count INT NOT NULL DEFAULT 0,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.topics
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    subscribed_consumers TEXT[],
    publishing_sources TEXT[],
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

TABLESPACE pg_default;
