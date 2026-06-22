import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#e8eff7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#002147",
          fontSize: 24,
          lineHeight: 1,
        }}
      >
        ♥
      </div>
    ),
    size
  );
}
