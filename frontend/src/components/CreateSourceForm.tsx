import React, { useState } from "react";
import { createSource } from "../services/sourcesService";
import { Button } from "./Button";
import { SourceInput } from "../types/types";
import { z } from "zod";

export const CreateSourceForm = () => {
  const [dbhostname, setDBHostname] = useState<string>('');
  const [dbport, setDBPort] = useState<number>(0);
  const [dbname, setDBName] = useState<string>('');
  const [dbservername, setDBServerName] = useState<string>('');
  const [dbusername, setDBUsername] = useState<string>('');
  const [dbpassword, setDBPassword] = useState<string>('');
  const [connectorName, setConnectorName] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleNewSource = async (e: React.FormEvent) => {
    e.preventDefault();
    const sourceData: SourceInput = {
      name: connectorName,
      database_hostname: dbhostname,
      database_port: dbport,
      database_user: dbusername,
      database_password: dbpassword,
      database_dbname: dbname,
      database_server_name: dbservername,
    }
    try {
      const response = await createSource(sourceData);
      console.log(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.issues);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
        console.error(error);
      }
    }
  }

  return (
    <form id="sourceform">
      <div className="form-header">
        <h2>Create New Source</h2>
        <p>
          Please enter your database connection details below.
        </p>
      </div>
      <label htmlFor="dbhostname">Database Hostname</label>
      <input
        id="dbhostname"
        name="dbhostname"
        type="text"
        placeholder="Database Hostname"
        onChange={(e) => setDBHostname(e.target.value)}
      />
      <label htmlFor="dbport">Database Port</label>
      <input
        id="dbport"
        name="dbport"
        type="number"
        placeholder="Database Port"
        onChange={(e) => setDBPort(Number(e.target.value))}
      />
      <label htmlFor="dbhostname">Database Name</label>
      <input
        id="dbname"
        name="dbname"
        type="text"
        placeholder="Database Name"
        onChange={(e) => setDBName(e.target.value)}
      />
      <label htmlFor="dbport">Database Server Name</label>
      <input
        id="dbservername"
        name="dbservername"
        type="text"
        placeholder="Database Server Name"
        onChange={(e) => setDBServerName(e.target.value)}
      />
      <label htmlFor="dbhostname">Database Username</label>
      <input
        id="dbusername"
        name="dbusername"
        type="text"
        placeholder="Database Username"
        onChange={(e) => setDBUsername(e.target.value)}
      />
      <label htmlFor="dbport">Database Password</label>
      <input
        id="dbpassword"
        name="dbpassword"
        type="password"
        placeholder="Database Password"
        onChange={(e) => setDBPassword(e.target.value)}
      />
      <label htmlFor="connector-name">Connector Name</label>
      <input
        id="connector-name"
        name="connector-name"
        type="text"
        placeholder="Connector Name"
        onChange={(e) => setConnectorName(e.target.value)}
      />
      <button onSubmit={handleNewSource}>Submit</button>
      {/* <Button btnName="Submit" clickHandler={handleNewSource} /> */}
    </form>
  )
};