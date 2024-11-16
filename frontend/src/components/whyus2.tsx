"use client"
import { HoverEffect } from "@/components/ui/card-hover-effect";
 
export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
        <div className="text-4xl text-center"> Why AMBER?</div>
      <HoverEffect items={reasons} />
    </div>
  );
}
export const reasons = [
    {
      title: "Comprehensive Learning",
      description:
        "Our platform offers a wide range of courses covering various topics, ensuring that you have access to the best educational resources. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    link:"",
    },
    {
      title: "Interactive Experience",
      description:
        "We provide interactive lessons and engaging activities that make learning enjoyable. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.",
        link:"",
},
    {
      title: "Expert Instructors",
      description:
        "Our courses are designed and taught by industry experts who are passionate about sharing their knowledge. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        link:"",
},
    {
      title: "Flexible Learning",
      description:
        "Learn at your own pace with our flexible scheduling options that fit your lifestyle. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel urna eget mi placerat vestibulum.",
        link:"",
},
    {
      title: "Affordable Pricing",
      description:
        "We believe in making education accessible, which is why we offer competitive pricing for our courses. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        link:"",
},
    {
      title: "Community Support",
      description:
        "Join a thriving community of learners and educators who are here to support you on your journey. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        link:"",
},
  ];
  