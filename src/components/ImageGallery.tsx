
import useFirestore from "../hooks/useFirestore";


const ImageGallery = () => {
  const { docs: images } = useFirestore("images");
 
  console.log(images);

  return (
    <div
      className={`grid duration-300 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-4 sm:gap-5 md:gap-7 lg:gap-10 mt-10 

      }`}
    >
      {images.map((image) => (
        <div
          key={image.imageUrl}
          className="card max-w-[20rem]  card-compact w-full bg-base-100 shadow-xl p-1"
        >
          <figure className="max-h-[10rem] ">
            <img src={image.imageUrl} alt="Shoes" />
          </figure>
          <div className="card-body">
            <p>Uploaded by: {image.userEmail}</p>
            <span>Created on: {image.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
