import { useEffect } from "react";

interface HomeProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Home = ({ setLoading }: HomeProps) => {
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <img 
        src="Transparent Logo.svg"
        alt="logo with cactus and a desert scape in stained-glass style"
        style={{ width: '100%', height: 'auto', maxWidth: '800px' }}
      />
      <h1 id="homePageTitle">A change data capture pipeline for microservices</h1>
    </div>
  );
}