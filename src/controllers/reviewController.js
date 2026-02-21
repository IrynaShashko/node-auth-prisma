import prisma from "../lib/prisma.js";

const addReview = async (req, res) => {
  const { rating, comment, userId } = req.body;

  try {
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        user: {
          connect: { id: userId },
        },
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        review: {
          id: review.id,
          rating,
          comment,
          userId,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    res.json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { addReview, getAllReviews };
