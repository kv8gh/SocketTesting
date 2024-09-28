import mongoose from 'mongoose';
//! This is meant for use with round-1 page-4, with socket.io for real time updates in the grid

const bondBiddingSchema = mongoose.Schema(
  {
    highestBids: [
      {
        type: Number //? Array of current highest bids, where (index+1) is the property number
      }
    ]
  },
  { collection: 'BondBidding' }
);

export const BondBidding =
  mongoose.models.BondBidding || mongoose.model('BondBidding', bondBiddingSchema);
