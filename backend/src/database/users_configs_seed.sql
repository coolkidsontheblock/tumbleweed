CREATE TABLE IF NOT EXISTS public.connectors
(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    plugin_name TEXT,
    database_hostname TEXT,
    database_port INT,
    database_user TEXT,
    database_password TEXT,
    database_dbname TEXT,
    database_server_name TEXT,
    connector_class TEXT,
    table_include_list TEXT,
    tombstone_on_delete TEXT,
    slot_name TEXT,
    transforms TEXT,
    transforms_outbox_type TEXT,
    transforms_outbox_table_fields_additional_placement TEXT,
    transforms_outbox_table_expand_json_payload TEXT,
    value_converter TEXT,
    topic_prefix TEXT,
    heartbeat_action_query TEXT,
    heartbeat_interval_ms INT,
    publication_name TEXT
);

TABLESPACE pg_default;
