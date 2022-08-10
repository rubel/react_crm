import React from "react";
import { BiMoney, BiText, BiVideo } from "react-icons/bi";
import { CgWebsite } from "react-icons/cg";
import { FaAudioDescription, FaFacebook } from "react-icons/fa";
import { MdPictureInPicture } from "react-icons/md";
import { RiAdvertisementFill } from "react-icons/ri";
import CustomEditIcon from "./CustomEditIcon";

function ProductSheet({ details, deleteButtonPressed, editButtonPressed }) {
  const {
    id,
    name,
    website,
    description,
    facebook,
    voice_over_audio,
    voice_over_text,
    photo_and_video,
    price,
    compare_price,
    ad_copy,
    final_video_url,
    video_url,
  } = details;

  return (
    <div className="productSheetItem">
      <div style={{ minHeight: "25px" }}>
        <div style={{ float: "left", width: "90%" }}>
          <b>Name:</b> {name}
        </div>
        <div style={{ float: "right", width: "10%", textAlign: "right" }}>
          <CustomEditIcon id={id} deletePressedFunc={deleteButtonPressed} editPressedFunc={editButtonPressed} />
        </div>
      </div>
      <div style={{ minHeight: "25px" }}>
        <div style={{ width: "50%", float: "left" }}>
          <FaFacebook />
          <a href={facebook} className="linkAfterIcon">
            {facebook}
          </a>
        </div>
        <div style={{ width: "50%", float: "right" }}>
          <CgWebsite />{" "}
          <a href={website} className="linkAfterIcon">
            {website}
          </a>
        </div>
      </div>
      <div style={{ minHeight: "25px" }}>
        <div style={{ width: "50%", float: "left" }}>
          <FaAudioDescription />{" "}
          <a href={voice_over_audio} className="linkAfterIcon">
            {voice_over_audio}
          </a>
        </div>
        <div style={{ width: "50%", float: "right" }}>
          <BiVideo />{" "}
          <a href={video_url} className="linkAfterIcon">
            {video_url}
          </a>
        </div>
      </div>
      <div style={{ minHeight: "25px" }}>
        <div style={{ width: "50%", float: "left" }}>
          <BiVideo />{" "}
          <a href={final_video_url} className="linkAfterIcon">
            {final_video_url}
          </a>
        </div>
        <div style={{ width: "50%", float: "right" }}>
          <BiText style={{ marginRight: "10px" }} /> <>{voice_over_text}</>
        </div>
      </div>

      <div style={{ minHeight: "25px" }}>
        <div style={{ width: "50%", float: "left" }}>
          <RiAdvertisementFill /> <b>Ad Copy:</b>{" "}
          <a href={ad_copy} className="linkAfterIcon">
            {ad_copy}
          </a>
        </div>

        <div style={{ width: "50%", float: "right" }}>
          <MdPictureInPicture />{" "}
          <a href={photo_and_video} className="linkAfterIcon">
            {photo_and_video}
          </a>
        </div>
      </div>

      <div style={{ minHeight: "25px" }}>
        <div style={{ width: "50%", float: "left" }}>
          <BiMoney /> <b>Price:</b> {price}
        </div>
        <div style={{ width: "50%", float: "right" }}>
          <BiMoney /> <b>Compare Price:</b> {compare_price}
        </div>
      </div>

      <div>
        <div>
          <b>Description:</b>
        </div>{" "}
        <div>{description}</div>
      </div>
    </div>
  );
}

export default ProductSheet;
