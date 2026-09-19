import { useState } from "react";
import { Play, X } from "lucide-react";

interface FarmerBannerProps {
  t: (key: string) => string;
}

export function FarmerBanner({ t }: FarmerBannerProps) {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="farmer-banner-section">
      <div className="section-container">
        <div className="farmer-banner-card">
          <img
            src="/farmer-story.jpg"
            alt="Indian Farmer in field at sunset"
            className="farmer-banner-bg-img"
          />
          <div className="farmer-banner-overlay" />

          <div className="farmer-banner-content">
            <h3 className="banner-quote">
              "{t("storyBannerText")}"
            </h3>
            <button
              className="watch-story-btn"
              onClick={() => setVideoModalOpen(true)}
            >
              <div className="play-icon-circle">
                <Play size={15} fill="currentColor" />
              </div>
              <span>{t("watchOurStory")}</span>
            </button>
          </div>
        </div>
      </div>

      {videoModalOpen && (
        <div className="video-modal-backdrop" onClick={() => setVideoModalOpen(false)}>
          <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-head">
              <h4 className="video-modal-title">AgriBridgeZero: Rooting Prosperity</h4>
              <button className="video-modal-close" onClick={() => setVideoModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="video-player-mock">
              <img src="/farmer-story.jpg" alt="Story preview" className="video-mock-poster" />
              <div className="video-play-center" onClick={() => alert("Playing AgriBridgeZero documentary feature...")}>
                <Play size={32} fill="white" />
              </div>
              <div className="video-caption-bar">
                <span>Field Study: 400+ Farmers across Karnataka & Telangana achieving 28% fertilizer optimization with AgriBridgeZero ABZ-001.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
