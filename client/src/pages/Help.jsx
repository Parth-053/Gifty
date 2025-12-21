import HelpHeader from "../components/HelpHeader";
import HelpQuickActions from "../components/HelpQuickActions";
import FAQSection from "../components/FAQSection";
import ContactSupport from "../components/ContactSupport";

const Help = () => {
  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <HelpHeader />

      <div className="px-4 mt-4 space-y-6 pb-10">
        <HelpQuickActions />
        <FAQSection />
        <ContactSupport />
      </div>
    </div>
  );
};

export default Help;
