import React from "react";

type Row = {
  cliente: string;
  valor: string;
  hora: string;
};

const rows: Row[] = [
  { cliente: "Juan Perez", valor: "$ 1.200,00", hora: "08:15" },
  { cliente: "Maria Gomez", valor: "$ 980,00", hora: "09:40" },
  { cliente: "Carlos Ruiz", valor: "$ 2.450,00", hora: "11:05" },
];

export default function ClientsTable() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border">
      <table className="w-full border-collapse">
        <thead>
          <tr
            style={{
              backgroundColor: "var(--primary-100)",
              color: "var(--primary-800)",
            }}
          >
            <th style={{ ...thStyle, width: "70px", textAlign: "center" }}>#</th>
            <th style={thStyle}>CLIENTE</th>
            <th style={thStyle}>
              <span className="inline-flex items-center gap-2">
                <span>VALOR</span>
                <span
                  className="inline-flex flex-col leading-none"
                  style={{ color: "var(--primary-700)" }}
                >
                  <span style={{ fontSize: "9px", marginBottom: "-1px" }}>▲</span>
                  <span style={{ fontSize: "9px" }}>▼</span>
                </span>
              </span>
            </th>
            <th style={thStyle}>HORA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.cliente + idx}>
              <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600 }}>
                {idx + 1}
              </td>
              <td style={tdStyle}>{r.cliente}</td>
              <td style={tdStyle}>{r.valor}</td>
              <td style={tdStyle}>{r.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const borderColor = "var(--primary-200)";

const thStyle: React.CSSProperties = {
  borderBottom: `1px solid ${borderColor}`,
  borderRight: `1px solid ${borderColor}`,
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: 700,
};

const tdStyle: React.CSSProperties = {
  borderRight: `1px solid ${borderColor}`,
  borderBottom: `1px solid ${borderColor}`,
  padding: "14px 16px",
  fontSize: "14px",
};

