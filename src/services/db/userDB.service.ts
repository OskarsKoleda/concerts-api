import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UserModel } from "../../models/user/user.model";
import {
  UserDocument,
  UserModelFields,
  UserStats,
} from "../../models/user/user.types";
import { VisitsModel } from "../../models/visits/visits.model";
import { AppError } from "../../utils/AppError";
import { SALT_ROUNDS } from "./constants";

export const ensureUniqueEmail = async (email: string): Promise<void> => {
  const user: UserDocument | null = await UserModel.findOne({ email }).exec();

  if (user) {
    throw new AppError("User with this email already exists", 409);
  }
};

export const createUserInDb = async (
  userData: UserModelFields
): Promise<UserDocument> => {
  const user = new UserModel(userData);

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  return user;
};

export const getUserFromDb = async (userId: string): Promise<UserDocument> => {
  const user = await UserModel.findById(userId)
    .select("-password -__v")
    .lean()
    .exec();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user as UserDocument;
};

export const getUserStatsFromDb = async (
  userId: string
): Promise<UserStats> => {
  const agg = VisitsModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
  ]);

  agg.lookup({
    from: "events",
    localField: "eventId",
    foreignField: "_id",
    as: "event",
  });

  agg.unwind("event");

  agg.group({
    _id: null,
    totalVisits: { $sum: 1 },
    totalSpent: { $sum: "$event.ticketPrice" },
    avgSpent: { $avg: "$event.ticketPrice" },
    maxSpent: { $max: "$event.ticketPrice" },
    minSpent: { $min: "$event.ticketPrice" },
    allBandsSeen: { $push: "$event.bands" }, // returns [["A", "B"], ["A", "C"]]
    allCategories: { $push: "$event.category" },
    allCities: { $push: "$event.city" },
    allVenues: { $push: "$event.venue" },
    allYears: { $push: { $year: "$event.date" } },
  });

  agg.addFields({
    bandsSeenFlat: {
      $reduce: {
        input: "$allBandsSeen",
        initialValue: [],
        in: {
          $concatArrays: ["$$value", "$$this"],
        },
      },
    },
  });

  agg.addFields({
    uniqueBandsSeen: {
      $setUnion: "$bandsSeenFlat",
    },
  });

  agg.addFields({
    uniqueCitiesSeen: {
      $setUnion: "$allCities",
    },
  });

  agg.addFields({
    uniqueVenuesSeen: {
      $setUnion: "$allVenues",
    },
  });

  agg.addFields({
    uniqueYearsSeen: {
      $setUnion: "$allYears",
    },
  });

  agg.project({
    _id: 0,
    totalVisits: 1,
    totalSpent: 1,
    avgSpent: { $round: ["$avgSpent", 0] },
    maxSpent: 1,
    minSpent: 1,
    uniqueBandsSeenCount: { $size: "$uniqueBandsSeen" },
    uniqueCitiesSeenCount: { $size: "$uniqueCitiesSeen" },
    uniqueVenuesSeenCount: { $size: "$uniqueVenuesSeen" },
    bandCounts: {
      $arrayToObject: {
        $map: {
          input: "$uniqueBandsSeen",
          as: "band",
          in: {
            k: "$$band",
            v: {
              $size: {
                $filter: {
                  input: "$bandsSeenFlat",
                  as: "b",
                  cond: { $eq: ["$$b", "$$band"] },
                },
              },
            },
          },
        },
      },
    },
    categoryCounts: {
      $arrayToObject: {
        $map: {
          input: { $setUnion: "$allCategories" },
          as: "category",
          in: {
            k: "$$category",
            v: {
              $size: {
                $filter: {
                  input: "$allCategories",
                  as: "c",
                  cond: { $eq: ["$$c", "$$category"] },
                },
              },
            },
          },
        },
      },
    },
    cityCounts: {
      $arrayToObject: {
        $map: {
          input: "$uniqueCitiesSeen",
          as: "city",
          in: {
            k: "$$city",
            v: {
              $size: {
                $filter: {
                  input: "$allCities",
                  as: "c",
                  cond: { $eq: ["$$c", "$$city"] },
                },
              },
            },
          },
        },
      },
    },
    venueCounts: {
      $arrayToObject: {
        $map: {
          input: { $setUnion: "$allVenues" },
          as: "venue",
          in: {
            k: "$$venue",
            v: {
              $size: {
                $filter: {
                  input: "$allVenues",
                  as: "v",
                  cond: { $eq: ["$$v", "$$venue"] },
                },
              },
            },
          },
        },
      },
    },
    yearCounts: {
      $arrayToObject: {
        $map: {
          input: "$uniqueYearsSeen",
          as: "year",
          in: {
            k: { $toString: "$$year" },
            v: {
              $size: {
                $filter: {
                  input: "$allYears",
                  as: "y",
                  cond: { $eq: ["$$y", "$$year"] },
                },
              },
            },
          },
        },
      },
    },
  });

  const results = await agg;

  if (!results || results.length === 0) {
    return {
      totalVisits: 0,
      totalSpent: 0,
      avgSpent: 0,
      maxSpent: 0,
      minSpent: 0,
      uniqueBandsSeenCount: 0,
      uniqueCitiesSeenCount: 0,
      uniqueVenuesSeenCount: 0,
      categoryCounts: {},
      bandCounts: {},
      cityCounts: {},
      venueCounts: {},
      yearCounts: {},
    };
  }

  return results[0] as UserStats;
};
