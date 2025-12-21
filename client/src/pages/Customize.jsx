import CustomizeHeader from "../components/CustomizeHeader";
import GiftPreview from "../components/GiftPreview";
import CustomizeTabs from "../components/CustomizeTabs";
import CustomizeFooter from "../components/CustomizeFooter";
import BottomNavbar from "../components/BottomNavbar";

const Customize = () => {
  return (
    <div className="min-h-screen bg-[#FFF7ED] pb-32">
      <CustomizeHeader />

      {/* Preview */}
      <GiftPreview />

      {/* Controls */}
      <CustomizeTabs />

      <CustomizeFooter />

      <BottomNavbar />
    </div>
  );
};

export default Customize;
