import React from "react";

const SimpleTable = ({
  title,
  data,
}: {
  title: string;
  data: string[];
}): JSX.Element => {
  return (
    <table>
      <thead>
        <tr>
          <td>{title}</td>
        </tr>
      </thead>
      <tbody>
        {data.map((elem: string) => (
          <tr key={elem}>
            <td>{elem}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SimpleTable;
