import { WordRotate } from "@/components/WordRotate";

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Oswald', sans-serif" }} className="flex absolute top-[20vh] flex-col">
<WordRotate words={["INTERACTIVE", "PERSONALIZED", "EDUTAINMENT"]} duration={2000} />
<WordRotate words={["COGNIZANT", "EMPOWERMENT", "USER-FRIENDLY"]} duration={2175} />
<WordRotate words={["SYNERGISTIC", "ACCESSIBLE", "OMNISCIENT"]} duration={2350} />

    </div>
  );
}
