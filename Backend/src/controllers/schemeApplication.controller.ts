const SchemeApplication = require("../models/SchemeApplication.model");

const toBoolean = (value: any) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.toLowerCase().trim();
    if (v === "true" || v === "yes") return true;
    if (v === "false" || v === "no") return false;
  }
  return null;
};

const saveApplicationStatus = async (req: any, res: any) => {
  try {
    const authUserId = req.user?.userId?.toString();
    const { userId, schemeId, applied } = req.body;

    if (!authUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!schemeId || typeof schemeId !== "string") {
      return res.status(400).json({ message: "schemeId is required" });
    }

    const appliedBool = toBoolean(applied);
    if (appliedBool === null) {
      return res.status(400).json({ message: "applied must be boolean" });
    }

    // If client sends userId, ensure it matches auth token user.
    if (userId && userId.toString() !== authUserId) {
      return res.status(403).json({ message: "Cannot update another user data" });
    }

    const now = new Date();
    const status = appliedBool ? "applied" : "not_applied";

    const application = await SchemeApplication.findOneAndUpdate(
      { userId: authUserId, schemeId: schemeId.trim() },
      {
        $set: {
          applied: appliedBool,
          status,
          appliedAt: appliedBool ? now : null,
        },
        $setOnInsert: {
          userId: authUserId,
          schemeId: schemeId.trim(),
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Application status saved",
      data: {
        id: application._id,
        userId: application.userId,
        schemeId: application.schemeId,
        applied: application.applied,
        status: application.status,
        applied_at: application.appliedAt,
        updated_at: application.updatedAt,
      },
    });
  } catch (err) {
    console.error("saveApplicationStatus error:", err);
    return res.status(500).json({ message: "Failed to save application status" });
  }
};

const getUserApplications = async (req: any, res: any) => {
  try {
    const authUserId = req.user?.userId?.toString();
    const { userId } = req.params;

    if (!authUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // For now, user can only read own application records.
    if (userId.toString() !== authUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const records = await SchemeApplication.find({ userId }).sort({ updatedAt: -1 });
    const response = records.map((record: any) => ({
      schemeId: record.schemeId,
      applied: record.applied,
      status: record.status,
      applied_at: record.appliedAt,
      updated_at: record.updatedAt,
    }));

    return res.status(200).json(response);
  } catch (err) {
    console.error("getUserApplications error:", err);
    return res.status(500).json({ message: "Failed to fetch applications" });
  }
};

const getMyApplications = async (req: any, res: any) => {
  try {
    const authUserId = req.user?.userId?.toString();
    const schemeId = (req.query?.schemeId || "").toString().trim();

    if (!authUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const filter: any = { userId: authUserId };
    if (schemeId) filter.schemeId = schemeId;

    const records = await SchemeApplication.find(filter).sort({ updatedAt: -1 });
    const response = records.map((record: any) => ({
      schemeId: record.schemeId,
      applied: record.applied,
      status: record.status,
      applied_at: record.appliedAt,
      updated_at: record.updatedAt,
    }));

    return res.status(200).json(response);
  } catch (err) {
    console.error("getMyApplications error:", err);
    return res.status(500).json({ message: "Failed to fetch my applications" });
  }
};

const updateApplicationStatus = async (req: any, res: any) => {
  try {
    const authUserId = req.user?.userId?.toString();
    const { schemeId } = req.params;
    const appliedBool = toBoolean(req.body?.applied);

    if (!authUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!schemeId) {
      return res.status(400).json({ message: "schemeId is required" });
    }

    if (appliedBool === null) {
      return res.status(400).json({ message: "applied must be boolean" });
    }

    const now = new Date();
    const status = appliedBool ? "applied" : "not_applied";

    const updated = await SchemeApplication.findOneAndUpdate(
      { userId: authUserId, schemeId },
      {
        $set: {
          applied: appliedBool,
          status,
          appliedAt: appliedBool ? now : null,
        },
        $setOnInsert: {
          userId: authUserId,
          schemeId,
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Application status updated",
      data: {
        schemeId: updated.schemeId,
        applied: updated.applied,
        status: updated.status,
        applied_at: updated.appliedAt,
        updated_at: updated.updatedAt,
      },
    });
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    return res.status(500).json({ message: "Failed to update application status" });
  }
};

const getApplicationSummary = async (_req: any, res: any) => {
  try {
    const [counts, schemeWise, userWise] = await Promise.all([
      SchemeApplication.aggregate([
        {
          $group: {
            _id: null,
            totalApplications: { $sum: 1 },
            appliedCount: {
              $sum: { $cond: [{ $eq: ["$status", "applied"] }, 1, 0] },
            },
            notAppliedCount: {
              $sum: { $cond: [{ $eq: ["$status", "not_applied"] }, 1, 0] },
            },
            pendingCount: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
          },
        },
      ]),
      SchemeApplication.aggregate([
        {
          $group: {
            _id: "$schemeId",
            total: { $sum: 1 },
            applied: {
              $sum: { $cond: [{ $eq: ["$status", "applied"] }, 1, 0] },
            },
            notApplied: {
              $sum: { $cond: [{ $eq: ["$status", "not_applied"] }, 1, 0] },
            },
          },
        },
        { $sort: { total: -1 } },
      ]),
      SchemeApplication.aggregate([
        {
          $group: {
            _id: "$userId",
            total: { $sum: 1 },
            applied: {
              $sum: { $cond: [{ $eq: ["$status", "applied"] }, 1, 0] },
            },
            notApplied: {
              $sum: { $cond: [{ $eq: ["$status", "not_applied"] }, 1, 0] },
            },
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    return res.status(200).json({
      totals: counts[0] || {
        totalApplications: 0,
        appliedCount: 0,
        notAppliedCount: 0,
        pendingCount: 0,
      },
      schemeWise,
      userWise,
    });
  } catch (err) {
    console.error("getApplicationSummary error:", err);
    return res.status(500).json({ message: "Failed to fetch application summary" });
  }
};

const getAllApplications = async (_req: any, res: any) => {
  try {
    const records = await SchemeApplication.find({})
      .sort({ updatedAt: -1 })
      .select("userId schemeId applied status appliedAt createdAt updatedAt");

    return res.status(200).json(records);
  } catch (err) {
    console.error("getAllApplications error:", err);
    return res.status(500).json({ message: "Failed to fetch all applications" });
  }
};

module.exports = {
  saveApplicationStatus,
  getUserApplications,
  getMyApplications,
  updateApplicationStatus,
  getApplicationSummary,
  getAllApplications,
};
