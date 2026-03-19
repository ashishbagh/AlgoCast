import { useState } from "react";

export default function ImageCarousel({
  images,
}: Readonly<{
  images: ReadonlyArray<{ src: string; alt: string }>;
}>) {
  const prev = () => {
    const ind = index - 1;
    if (ind >= 0) setIndex(ind);
    else setIndex(images.length - 1);
  };
  const next = () => {
    const ind = index + 1;
    if (ind <= images.length - 1) setIndex(index + 1);
    else setIndex(0);
  };

  const pagination = (event) => {
    setIndex(event.target.id);
  };

  const [index, setIndex] = useState(0);

  const { src, alt } = images[index];

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        <button onClick={prev}>Prev</button>
        <span
          style={{
            maxWidth: "400px",
            maxHeight: "600px",
          }}
        >
          <img key={src} alt={alt} src={src} width="100%" />
        </span>
        <button onClick={next}>Next</button>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
      >
        {images.map((_, position) => (
          <span
            key={position}
            id={`${position}`}
            style={{
              margin: "4px",
              color: `${position === index ? "blue" : "black"}`,
            }}
            onClick={pagination}
          >
            {position + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
