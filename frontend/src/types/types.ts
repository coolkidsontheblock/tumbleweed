import React from "react";

export interface SourceInput {
  name: string;
  database_hostname: string;
  database_port: number;
  database_user: string;
  database_password: string;
  database_dbname: string;
  database_server_name: string;
}

export interface ErrorBannerProps {
  message: string;
}