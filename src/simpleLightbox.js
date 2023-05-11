import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

export const _gallery = new SimpleLightbox(".photo-card a", {
  captionPosition: "bottom",
  captionsData: "alt",
  captionDelay: 250,
});
