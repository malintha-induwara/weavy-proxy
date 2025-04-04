import express from "express";
import { createUser,trashUser , getUser, updateUser, upsertUser, listUsers } from "../services/weavyService.js";

const router = express.Router();

const handleWeavyResponse = (req, res, weavyResult) => {
  res.status(weavyResult.status).json(weavyResult.data);
};

router.post("/", async (req, res) => {
  const result = await createUser(req.body);
  handleWeavyResponse(req, res, result);
});


router.get("/:user", async (req, res) => {
  const { user } = req.params;
  const { trashed } = req.query;
  const result = await getUser(user, trashed === "true");
  handleWeavyResponse(req, res, result);
});

router.patch("/:user", async (req, res) => {
  const { user } = req.params;
  const result = await updateUser(user, req.body);
  handleWeavyResponse(req, res, result);
});

router.put("/:uid", async (req, res) => {
  const { uid } = req.params;
  const result = await upsertUser(uid, req.body);
  handleWeavyResponse(req, res, result);
});


router.post('/:user/trash', async (req, res) => {
    const { user } = req.params;
    const result = await trashUser(user);
    handleWeavyResponse(req, res, result);
});
