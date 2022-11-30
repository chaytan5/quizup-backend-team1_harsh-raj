const express = require("express");
const router = express.Router();
const Mock = require("../models/MockModel");
const MockQuestion = require("../models/MockQuestion.model");

// @desc    Get mock
// @route   GET /mock
router.get("/", async (req, res) => {
  try {
    const mocks = await Mock.find().populate("questions");

    res.send(mocks);
  } catch (err) {
    console.log(err);
    res.end("error");
  }
});

// @desc    Create a mock
// @route   POST /mock
router.post("/", async (req, res) => {
  try {
    await Mock.create(req.body);
    res.send("new mock created");
  } catch (err) {
    console.log(err);
    res.end("error");
  }
});

// @desc    Add question to mock
// @route   POST /mock/question
router.post("/question", async (req, res) => {
  try {
    const mock = await Mock.findById(req.body.id).lean();
    if (!mock) throw new Error("Mock not found");

    const newQuestion = await MockQuestion.create({
      question: "new question?",
      options: ["option 1", "option 2", "option 3", "option 4"],
      answer: "option 3",
    });
    await Mock.updateOne(
      { _id: req.body.id },
      { $push: { questions: newQuestion._id } }
    );
    res.status(200).json({ message: "Adding questions" });
  } catch (err) {
    console.log(err);
    res.end("error");
  }
});

module.exports = router;
