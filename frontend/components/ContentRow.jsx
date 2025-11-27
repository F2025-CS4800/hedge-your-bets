"use client";

import { useState } from 'react';

// --- Image Modal Component ---
const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose} // Closes modal when clicking outside
        >
            <div 
                className="relative bg-gray-900 rounded-xl p-6 shadow-2xl max-w-4xl max-h-[90vh] w-11/12 md:w-3/4"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
            >
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Enlarged View</h3>
                
                {/* The main enlarged image */}
                <div className="w-full h-auto flex items-center justify-center">
                    <img 
                        src={imageUrl} 
                        alt="Enlarged Content Card" 
                        // object-contain ensures the full high-res image is visible within the modal
                        className="max-w-full max-h-[70vh] object-contain rounded-lg" 
                    />
                </div>
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white text-3xl font-light hover:text-red-500 transition-colors"
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};
// -------------------------------------------------------------


// --- ContentRow Component (Client-side) ---
export default function ContentRow({ title, cardDataArray }) {
    const [selectedImage, setSelectedImage] = useState(null);

    // Function now accepts the modalImagePath (the high-resolution path)
    const handleCardClick = (modalPath) => {
        setSelectedImage(modalPath);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            
            <div className="flex space-x-4 overflow-x-scroll pb-4 scrollbar-hide">
                
                {cardDataArray.map((card, index) => (
                    <div 
                        key={index}
                        className="flex-shrink-0 w-80 h-60 bg-gray-800 rounded-lg overflow-hidden 
                                   cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-xl"
                        // Passes the specific modal image path when clicked
                        onClick={() => handleCardClick(card.modalImagePath)} 
                    >
                        {/* --- IMAGE CONTAINER: Uses the thumbnailImagePath for the card background --- */}
                        <div 
                            // Uses the new thumbnailImagePath property
                            className="w-full h-full bg-cover bg-center bg-white bg-no-repeat" 
                            style={{ 
                                backgroundImage: `url(${card.thumbnailImagePath})`,
                            }}
                            role="img"
                            aria-label={`Showcase image ${index + 1}`}
                        >
                        </div>
                    </div>
                ))}
            </div>

            {/* Render the Modal */}
            <ImageModal 
                imageUrl={selectedImage} 
                onClose={handleCloseModal} 
            />
        </div>
    );
}