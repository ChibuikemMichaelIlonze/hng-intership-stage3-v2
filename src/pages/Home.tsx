import Navbar from "../components/Navbar";
import UploadForm from "../components/UploadForm";
import ImageGallery from "../components/ImageGallery";

const Home = () => {
  return (
    <div className="py-5 px-3 sm:px-7 md:px-10 lg:px-15 pb-24 min-h-screen">
      <Navbar />
      <UploadForm />
      <ImageGallery />
    </div>
  );
};

export default Home;
