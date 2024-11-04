import { Link, useNavigate } from "react-router-dom"

interface SourceProps {
  source: string
  setSelectedSource: (source: string) => void
}

export const Source = ( { source, setSelectedSource }: SourceProps) => {
  // const navigate = useNavigate();
  
  return (
    <li onClick={() => setSelectedSource(source)}>
      <Link to={`/sources/${source}`}>
        {source}
      </Link>
    </li>
    // <>
    // </>
  )
}