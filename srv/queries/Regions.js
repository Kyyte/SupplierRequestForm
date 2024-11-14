const getAllRegions = () => {
  return SELECT.from("com.kyyte.procurement.supplierrequestform.Regions");
};

module.exports = {
  getAllRegions,
};
