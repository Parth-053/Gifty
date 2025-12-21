import Header from "../components/Header";
import LocationBar from "../components/LocationBar";
import SearchBar from "../components/SearchBar";
import Banner from "../components/Banner";
import CategoryRow from "../components/CategoryRow";
import ProductSection from "../components/ProductSection";
import Footer from "../components/Footer";
import BottomNavbar from "../components/BottomNavbar";

const Home = () => {
  return (
    <div className="pb-20 bg-[#FFF7ED] min-h-screen">
      <Header />
      <LocationBar />
      <SearchBar />
      <Banner />
      <CategoryRow />

      <ProductSection title="Best Sellers" />
      <ProductSection title="Suggested For You" />

      <Footer />
      <BottomNavbar />
    </div>
  );
};

export default Home;
