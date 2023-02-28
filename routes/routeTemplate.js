const express = require("express");
const authController = require("./../controllers/authController");
const auctionController = require("./../controllers/auctionController");

const router = express.Router();

//Router

//Auction Summary List (Not Finished)
router.get("/auction-list", auctionController.getSummaryList);

// //Search (Picture not implement)
router.get("/search", auctionController.getSearch);

//Follow (Finished)
router
  .get(
    "/:auction_id/follow",
    authController.protect,
    auctionController.getFollow
  )
  .post(
    "/:auction_id/follow",
    authController.protect,
    auctionController.postFollow
  );

//Upload item (Picture not implement)
router.post("/upload", authController.protect, auctionController.postAuction); //Nearly Finish

//Get Auction Detail (Picture not implement)
router.get("/:auction_id", auctionController.getAuctionDetail);

//Bid Histroy
router.get("/:auction_id/bid-history", auctionController.getBidHistory);

//Refresh (Finished)
router.get("/:auction_id/refresh", auctionController.refresh); //Finished

// //Bid (Finished)
router.post(
  "/:auction_id/bid",
  authController.protect,
  auctionController.postBid
);

module.exports = router;
