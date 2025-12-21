import AboutHeader from "../components/AboutHeader";
import AboutHero from "../components/AboutHero";
import AboutWhyGifty from "../components/AboutWhyGifty";
import AboutStats from "../components/AboutStats";
import AboutFooterNote from "../components/AboutFooterNote";

const About = () => {
  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-10">
      <AboutHeader />

      <div className="px-4 mt-4 space-y-8">
        <AboutHero />
        <AboutWhyGifty />
        <AboutStats />
        <AboutFooterNote />
      </div>
    </div>
  );
};

export default About;
