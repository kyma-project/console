import React from "react";
interface Props {
  title: string;
  data: string[];
}

const SimpleTable: React.FunctionComponent<Props> = ({ title, data }) => (
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

export default SimpleTable;
