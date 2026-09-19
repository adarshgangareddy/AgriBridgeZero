import { useState } from "react";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { marketplaceProducts, type MarketplaceProduct } from "../data/demo";

interface MarketplaceSectionProps {
  onOpenAuth: (actionDesc: string) => void;
  isLoggedIn: boolean;
  t: (key: string) => string;
}

export function MarketplaceSection({ onOpenAuth, isLoggedIn, t }: MarketplaceSectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);

  const previewProducts = marketplaceProducts.slice(0, 3);

  return (
    <div className="feature-column-card marketplace-feature-card" id="marketplace-section">
      <div className="card-head-row">
        <div>
          <h3 className="card-column-title">{t("marketplace")}</h3>
          <p className="card-column-subtitle">Certified inputs based on soil needs</p>
        </div>
        <button
          className="view-all-link"
          onClick={() => {
            if (!isLoggedIn) {
              onOpenAuth("Browse Full Marketplace");
            }
          }}
        >
          <span>{t("exploreMarketplace")}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 3 Compact Product Tiles */}
      <div className="marketplace-preview-list">
        {previewProducts.map((prod) => (
          <div
            key={prod.id}
            className="market-product-tile"
            onClick={() => setSelectedProduct(prod)}
            role="button"
            tabIndex={0}
          >
            <div className="market-img-wrap">
              <img src={prod.image} alt={prod.name} className="market-img" />
              <span className="market-category-tag">{prod.category}</span>
            </div>
            <div className="market-meta-wrap">
              <h4 className="market-prod-name">{prod.name}</h4>
              <p className="market-prod-match">{prod.targetRequirement}</p>
              <div className="market-rating-row">
                <Star size={11} className="star-icon" />
                <span>{prod.rating}</span>
                <span className="verified-supplier-tag">
                  <ShieldCheck size={11} /> {prod.supplier}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="market-bottom-notice">
        <p className="market-disclaimer">
          *Recommendations are generated strictly according to validated agronomic soil test thresholds.
        </p>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="product-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="prod-modal-head">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="prod-modal-img" />
              <div className="prod-modal-title-col">
                <span className="prod-cat-pill">{selectedProduct.category}</span>
                <h3 className="prod-name-head">{selectedProduct.name}</h3>
                <span className="prod-supplier">Verified Supplier: {selectedProduct.supplier}</span>
              </div>
            </div>

            <div className="prod-modal-body">
              <p className="prod-desc">{selectedProduct.description}</p>
              <div className="target-need-box">
                <strong>Why this is recommended:</strong>
                <p>{selectedProduct.targetRequirement}</p>
              </div>
            </div>

            <div className="prod-modal-actions">
              <button
                className="btn-accent-sm full-w"
                onClick={() => {
                  setSelectedProduct(null);
                  if (!isLoggedIn) {
                    onOpenAuth(`Contact Supplier for ${selectedProduct.name}`);
                  } else {
                    alert(`Inquiry sent to ${selectedProduct.supplier}! They will contact you shortly.`);
                  }
                }}
              >
                {isLoggedIn ? "Contact Verified Supplier" : "Sign In to Connect with Supplier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
