import { Camera, HandIcon, ThumbsUp } from "lucide-react";
import { FaRegComment } from "react-icons/fa";
import {
  MdNetworkWifi3Bar,
  MdOutlineBattery6Bar,
  MdOutlineSignalCellular0Bar,
} from "react-icons/md";
import { TbShare3 } from "react-icons/tb";

const Advert = () => {
  return (
    <div>
      {" "}
      <div className="iphone">
        <div className="action-button"></div>
        <div className="volume-up"></div>
        <div className="volume-down"></div>
        <div className="power-button"></div>

        <div className="screen">
          <div className="status-bar">
            <span>9:41</span>

            <div className="status-icons">
              <span>
                <MdNetworkWifi3Bar />
              </span>

              <span>
                <MdOutlineSignalCellular0Bar />
              </span>
              <span className="flex items-center">
                <MdOutlineBattery6Bar />
                83%
              </span>
            </div>
          </div>

          <div className="reels-header">
            <span className="reels-title">Reels</span>

            <span className="camera-icon">
              <Camera />
            </span>
          </div>
          <video className="reel-video" muted loop autoPlay playsInline>
            <source src="/video/v2.mp4" type="video/mp4" className="h-full"/>
          </video>
          <div className="reel-actions">
            <div className="action">
              <div className="action-icon">
                <ThumbsUp />
              </div>

              <span className="action-count">12.4K</span>
            </div>

            <div className="action">
              <div className="action-icon">
                <FaRegComment />
              </div>

              <span className="action-count">326</span>
            </div>

            <div className="action">
              <div className="action-icon">
                <TbShare3 />
              </div>

              <span className="action-count">2.1K</span>
            </div>
          </div>

          <div className="reel-info">
            <div className="user">
              <div className="avatar"></div>

              <span className="username">Qur'an Media</span>

              <span className="follow-btn">Follow</span>
            </div>

            <p className="caption">
              Read,listen, and reflect the word of Allah.
            </p>

            <div className="music">
              <span>🎵</span>

              <span className="music-text">Original audio • Qur'an Media</span>
            </div>
          </div>

          <div className="progress">
            <div className="progress-fill"></div>
          </div>

          <div className="home-indicator"></div>
        </div>
      </div>
    </div>
  );
};

export default Advert;
