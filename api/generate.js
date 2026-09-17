import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || prompt.trim().length < 3) {
      return res.status(400).json({
        error: "Ajoute une description pour générer la vidéo.",
      });
    }

    const { request_id } = await fal.queue.submit(
      "fal-ai/kling-video/v3/standard/text-to-video",
      {
        input: {
          prompt: prompt.trim(),
          duration: "5",
          aspect_ratio: "9:16",
          generate_audio: false,
        },
      }
    );

    return res.status(202).json({
      requestId: request_id,
      status: "queued",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Impossible de lancer la génération vidéo.",
    });
  }
}