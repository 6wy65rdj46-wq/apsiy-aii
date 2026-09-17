import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY,
});

export default async function handler(req, res) {
  const requestId = req.query.requestId;

  if (!requestId) {
    return res.status(400).json({ error: "requestId manquant" });
  }

  try {
    const status = await fal.queue.status(
      "fal-ai/kling-video/v3/standard/text-to-video",
      {
        requestId,
        logs: true,
      }
    );

    if (status.status !== "COMPLETED") {
      return res.status(200).json({
        status: status.status,
      });
    }

    const result = await fal.queue.result(
      "fal-ai/kling-video/v3/standard/text-to-video",
      {
        requestId,
      }
    );

    return res.status(200).json({
      status: "COMPLETED",
      video: result.data?.video?.url || null,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Impossible de vérifier la génération.",
    });
  }
}