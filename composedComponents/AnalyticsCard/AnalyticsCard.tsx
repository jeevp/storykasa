import "./style.scss";

interface AnalyticsCardProps {
  value: number;
  name: string;
}

export default function AnalyticsCard({ value, name }: AnalyticsCardProps) {
  return (
    <div className="card" style={{ backgroundColor: "#fff" }}>
      <div
        style={{
          textAlign: "center",
          height: "40px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <label>{name}</label>
        </div>
        <h3>{value}</h3>
      </div>
    </div>
  );
}
