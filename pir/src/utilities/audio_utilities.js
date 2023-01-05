import gTTS from "gtts";
import * as uuid from "uuid";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";

const currentDir = path.normalize(process.cwd() + "/");

function getFfmpeg() {
  const command = ffmpeg();
  command.setFfmpegPath(ffmpegPath);
  command.setFfprobePath(ffprobePath.path);
  return command;
}

/**
 * @param {string} file_path
 * @returns {Promise<string>} audio_file_path
 */
export function convertToAudio(file_path) {
  return new Promise((resolve, reject) => {
    fs.readFile(file_path, "utf8", (err, data) => {
      if (err) reject(err);

      const gtts = new gTTS(data, "en");
      const newFileName = `${uuid.v1()}.mp3`;
      const audio_file_path = path.normalize(`public/uploads/${newFileName}`);
      const save_file_path = path.normalize(
        `${process.cwd()}/${audio_file_path}}`
      );
      gtts.save(save_file_path, (err) => {
        if (err) {
          reject(err);
        }
        resolve(audio_file_path);
      });
    });
  });
}
/**
 * @param {string} image_path
 * @param {string} audio_path
 * @param {string} uid
 * @returns {Promise<string>} merged_video_path
 */
export function mergeImageAndAudio(image_path, audio_path, uid) {
  return new Promise((resolve, reject) => {
    const newFileName = `${uuid.v1()}${uid}_voice`;
    const outputPath = path.normalize(`public/uploads/${newFileName}.mp4`);

    const command = getFfmpeg();
    command
      .input(path.normalize(currentDir + image_path))
      .input(path.normalize(currentDir + audio_path))
      .outputOptions(["-acodec copy", "-vcodec copy"])
      .on("progress", (progress) => {
        console.log(progress.percent);
      })
      .on("start", (commandLine) => {
        console.log(commandLine);
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        resolve(outputPath);
      })
      .save(`${currentDir}${outputPath}`);
  });
}

/**
 * @param {string} video_path
 * @param {string} audio_path
 * @param {string} uid
 * @returns {Promise<string>} merged_video_path
 */
export function mergeVideoAndAudio(video_path, audio_path, uid) {
  return new Promise((resolve, reject) => {
    const newFileName = `${uuid.v1()}${uid}`;
    const outputPath = path.normalize(`public/uploads/${newFileName}.mp4`);
    const command = getFfmpeg();
    command
      .input(path.normalize(currentDir + video_path))
      .input(path.normalize(currentDir + audio_path))
      .outputOptions(["-c:v copy", "-map 0:v:0", "-map 1:a:0"])
      .on("progress", (progress) => {
        console.log(progress.percent);
      })
      .on("start", (commandLine) => {
        console.log(commandLine);
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        resolve(outputPath);
      })
      .save(`${currentDir}${outputPath}`);
  });
}

/**
 * @param {string[]} video_paths
 * @param {string} uid
 * @returns {Promise<string>} merged_video_path
 */
export function mergeAllVideos(video_paths, uid) {
  return new Promise((resolve, reject) => {
    const newFileName = `${uuid.v1()}${uid}`;
    const outputPath = path.normalize(`public/uploads/${newFileName}.mp4`);

    const command = getFfmpeg();

    video_paths.forEach((video_path) => {
      command.input(path.normalize(currentDir + video_path));
    });

    command
      .on("progress", (progress) => {
        console.log(progress.percent);
      })
      .on("start", (commandLine) => {
        console.log(commandLine);
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        resolve(outputPath);
      })
      .mergeToFile(`${currentDir}${outputPath}`, currentDir);
  });
}
