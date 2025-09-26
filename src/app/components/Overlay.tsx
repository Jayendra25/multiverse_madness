import React, { forwardRef } from "react";
import { Scroll } from "@react-three/drei";
import "./Overlay.css";

interface MeteorData {
  title: string;
  description: string;
  color: string;
}

interface SectionProps {
  meteor: MeteorData;
}

const Section = forwardRef<HTMLDivElement, SectionProps>(({ meteor }, ref) => {
  return (
    <section className="section">
      <div
        ref={ref}
        className="content"
        style={{ opacity: 0, transform: "scale(0.9)", pointerEvents: "none" }} // Initial styles
      >
        <h2 className="title" style={{ color: meteor.color }}>
          {meteor.title}
        </h2>
        <p className="description">{meteor.description}</p>
      </div>
    </section>
  );
});

interface OverlayProps {
  meteorData: MeteorData[];
  sectionRefs: React.RefObject<HTMLDivElement>[];
}

export const Overlay: React.FC<OverlayProps> = ({
  meteorData,
  sectionRefs,
}) => {
  return (
    <Scroll html>
      <div className="scroll-container">
        {meteorData.map((meteor, index) => (
          <Section key={index} meteor={meteor} ref={sectionRefs[index]} />
        ))}
      </div>
    </Scroll>
  );
};
