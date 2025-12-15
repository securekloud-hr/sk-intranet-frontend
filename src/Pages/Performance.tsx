import { useEffect, useState } from "react";
import API from "@/config";

const Performance = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/test`)
      .then((res) => res.json())
      .then((result) => {
        setData(result.data || []);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test Collection Data</h2>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Emp ID</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.empid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Performance;
