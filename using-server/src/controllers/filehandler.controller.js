module.exports.renameFile = async (req, res, next) => {
  try {
    const result = await require("./renameFile")(
      req.body.originRef,
      req.body.destinationRef
    );
    return res.status(200).json({
      status: "OK",
      message: "success",
      data: result,
    });
  } catch (error) {
    return res.status(200).json({
      status: "ERROR",
      message: error.message,
    });
  }
};
