// FacilityCard.jsx
import React from "react";

const FacilityCard = React.memo(({ facility, selectedId, onSelect }) => {
  return (
    <div style={{ padding: "0 10px" }}>
      <div
        onClick={() => onSelect(facility)}
        style={{
          border: facility.id === selectedId ? "3px solid #ff7b1d" : "1px solid #444",
          borderRadius: 10,
          cursor: "pointer",
          background: "#1e1e1e",
          color: "#fff",
          padding: 10,
          height: "100%",
          transition: "all 0.3s ease",
        }}
      >
        <img
          src={facility.images?.[0]?.imageUrl || "/default-image.jpg"}
          alt={facility.name}
          style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }}
        />
        <h4 style={{ marginTop: 10, color: "#ff7b1d" }}>{facility.name}</h4>
        <p style={{ fontSize: 14 }}>{facility.address}</p>
      </div>
    </div>
  );
});

export default FacilityCard;
