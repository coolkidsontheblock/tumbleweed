import { SourceData } from "../types/types"

interface SourceProps {
  sourceData: SourceData | null
}

export const Source = ( { sourceData }: SourceProps) => {
  if (sourceData) {
    return (
      <div>
        <ul>
          <li>Connector Name: {sourceData.name}</li>
          <li>Database Hostname: {sourceData.database_hostname}</li>
          <li>Database Port: {sourceData.database_port}</li>
          <li>Database Name: {sourceData.database_dbname}</li>
          <li>Database Server Name: {sourceData.database_server_name}</li>
          <li>Database Username: {sourceData.database_user}</li>
        </ul>
      </div>
    )
  }
}