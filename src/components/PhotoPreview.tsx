import React, { useState } from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CImage,
  CSpinner,
} from "@coreui/react";
import { Place } from "../types/place";

interface PhotoPreviewProps {
  place: Place;
  visible: boolean;
  onClose: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({ place, visible, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  const photos = place.photo_info?.thumbnails || [];
  const currentPhoto = photos[currentImageIndex];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
  };

  if (!photos.length) {
    return (
      <CModal visible={visible} onClose={onClose} size="lg">
        <CModalHeader>
          <CModalTitle>Photos - {place.name}</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center py-5">
          <p className="text-muted">No photos available for this place.</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    );
  }

  return (
    <CModal visible={visible} onClose={onClose} size="xl">
      <CModalHeader>
        <CModalTitle>
          Photos - {place.name} ({currentImageIndex + 1} of {photos.length})
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="text-center position-relative">
          {imageLoading && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <CSpinner color="primary" />
            </div>
          )}
          <CImage
            src={currentPhoto?.large_url || currentPhoto?.thumb_url}
            alt={`${place.name} photo ${currentImageIndex + 1}`}
            className="img-fluid"
            style={{ maxHeight: "70vh", objectFit: "contain" }}
            onLoad={handleImageLoad}
            onLoadStart={handleImageLoadStart}
          />
        </div>
        
        {photos.length > 1 && (
          <div className="d-flex justify-content-center mt-3 gap-2">
            <CButton color="primary" variant="outline" onClick={handlePrevious}>
              Previous
            </CButton>
            <CButton color="primary" variant="outline" onClick={handleNext}>
              Next
            </CButton>
          </div>
        )}

        <div className="mt-3">
          <div className="row">
            <div className="col-md-6">
              <small className="text-muted">
                <strong>Total Photos:</strong> {place.photo_info?.total_photos || 0}
              </small>
            </div>
            <div className="col-md-6">
              <small className="text-muted">
                <strong>Synced Photos:</strong> {place.photo_info?.synced_photos || 0}
              </small>
            </div>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default PhotoPreview;
