import { useState } from "react";
import { createSource } from "../services/sourcesService";
import { Button } from "./Button";
import { z } from "zod";

export const CreateSourceForm = () => {
  const [dbhostname, setdbhostname] = useState<string>('');
  const [dbport, setdbport] = useState<number>(0);
  const [dbname, setdbname] = useState<string>('');
  const [dbservername, setdbservername] = useState<string>('');
  const [dbusername, setdbusername] = useState<string>('');
  const [dbpassword, setdbpassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleNewSource = async () => {
    const sourceData = {
      'database.hostname': dbhostname,
      'database.port': dbport,
      'database.dbname': dbname,
      'database.server.name': dbservername,
      'database.user': dbusername,
      'database.password': dbpassword
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
        onChange={(e) => setdbhostname(e.target.value)}
      />
      <label htmlFor="dbport">Database Port</label>
      <input
        id="dbport"
        name="dbport"
        type="number"
        placeholder="Database Port"
        onChange={(e) => setdbport(Number(e.target.value))}
      />
      <label htmlFor="dbhostname">Database Name</label>
      <input
        id="dbname"
        name="dbname"
        type="text"
        placeholder="Database Name"
        onChange={(e) => setdbname(e.target.value)}
      />
      <label htmlFor="dbport">Database Server Name</label>
      <input
        id="dbservername"
        name="dbservername"
        type="text"
        placeholder="Database Server Name"
        onChange={(e) => setdbservername(e.target.value)}
      />
      <label htmlFor="dbhostname">Database Username</label>
      <input
        id="dbusername"
        name="dbusername"
        type="text"
        placeholder="Database Username"
        onChange={(e) => setdbusername(e.target.value)}
      />
      <label htmlFor="dbport">Database Password</label>
      <input
        id="dbpassword"
        name="dbpassword"
        type="password"
        placeholder="Database Password"
        onChange={(e) => setdbpassword(e.target.value)}
      />
      <Button btnName="Submit" clickHandler={handleNewSource} />
    </form>
  )
};