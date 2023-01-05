import * as express from "express";
import * as uuid from "uuid";
import { upload } from "../middlewares/file_upload.js";
import {
  convertToAudio,
  mergeImageAndAudio,
  mergeVideoAndAudio,
  mergeAllVideos,
} from "../utilities/audio_utilities.js";

import fs from "fs";
import path from "path";

export const router = express.Router();

// use multer to handle file uploads
// const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
  // generate a new token and store it in a cookie
  const token = uuid.v4();
  res.cookie("storage_token", token, {
    expires: new Date(Date.now() + 900000),
  });
  res.json({ status: "ok", message: "Storage Created Successfully" });
});

// create new storage token
router.post("/create_new_storage", (req, res) => {
  // generate a new token and store it in a cookie
  const token = uuid.v4();
  res.cookie("storage_token", token, {
    expires: new Date(Date.now() + 900000),
  });
  res.json({ status: "ok", message: "Storage Created Successfully" });
});

// upload file
router.post("/upload_file", upload.single("my_file"), (req, res) => {
  // save the uploaded file to the database
  const file = req.file;
  // const storage_token = req.cookies.storage_token;
  // collection.insertOne({ file, storage_token }, (err, result) => {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .json({ status: "error", message: "Error uploading file" });
  //   }
  //   res.json({ status: "ok", file_path: file.path });
  // });
  // console.log(req);
  res.json({ status: "ok", file_path: file.path });
});

// create audio
router.post("/text_file_to_audio", async (req, res) => {
  // convert the text file to audio using a TTS service
  /** @type {string} */
  const file_path = req.body.file_path;
  const audio_file_path = await convertToAudio(file_path); // audio_utils.js
  res.json({
    status: "ok",
    message: "text to speech converted",
    audio_file_path,
  });
});

// merge image and audio to video
router.post("/merge_image_and_audio", async (req, res) => {
  // merge the image and audio using ffmpeg
  const image_path = req.body.image_file_path;
  const audio_path = req.body.audio_file_path;
  // console.log(req.body);
  const video_path = await mergeImageAndAudio(
    image_path,
    audio_path,
    req.storage_token
  ); // audio_utils.js
  res.json({
    status: "ok",
    message: "Video Created Successfully",
    video_path,
  });
});

// merge video and audio to video
router.post("/merge_video_and_audio", async (req, res) => {
  // merge the video and audio using ffmpeg
  const video_path = req.body.video_file_path;
  const audio_path = req.body.audio_file_path;

  const merged_video_path = await mergeVideoAndAudio(
    video_path,
    audio_path,
    req.storage_token
  ); // video_utils.js
  res.json({ status: "ok", merged_video_path });
});

router.post("/merge_all_video", async (req, res) => {
  // merge the list of videos using ffmpeg
  const video_paths = req.body.video_file_path_list;
  const merged_video_path = await mergeAllVideos(
    video_paths,
    req.storage_token
  ); // video_utils.js
  res.json({ status: "ok", merged_video_path });
});

router.get("/download_file", (req, res) => {
  // send the file as an attachment to the client's browser
  const file_path = req.query.file_path;
  res.download(file_path);
});

router.get("/my_upload_file", async (req, res) => {
  // retrieve the uploaded files from the database
  const storage_token = req.cookies.storage_token;
  fs.readdir(
    path.normalize(`${process.cwd()}/public/uploads/`),
    (err, files) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "error", message: "Error reading files" });
      }
      // filter the files based on the storage token
      const filteredFiles = files.filter((file) =>
        file.includes(storage_token)
      );
      res.json({
        status: "ok",
        data: filteredFiles.length
          ? filteredFiles
          : ["please upload some files"],
      });
    }
  );
  // collection.find({ storage_token }).toArray((err, files) => {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .json({ status: "error", message: "Error retrieving uploaded files" });
  //   }
  //   res.json({ status: "ok", files });
  // });
});
export default router;
