import React, { useEffect, useState } from "react";

function Home3() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/normal_users/home/home3/")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      {data ? <p>{data.content}</p> : <p>Loading...</p>}
    </div>
  );
}

export default Home3;
