const plantsModel = require("../model/plants");

exports.create = async (req, res) => {
  try {
    await plantsModel.createPlant(req.body);
    res.status(201).json({ message: "tạo thành công!" });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
exports.createCollectionByIdPlant = async (req, res) => {
  try {
    const id = req.params.id;
    const { collectionName, proposal, dateChek, Diagnostic } = req.body;
    await plantsModel.createCollection(
      id,
      collectionName,
      proposal,
      dateChek,
      Diagnostic
    );
    res.status(201).json({ message: "tạo thành công!" });
  } catch (error) {
    res.status(500).json({ err: err });
  }
};
exports.updatePlants = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await plantsModel.updatePlants(id, data);
    req.status(201).json({ message: "Cập nhật thành công!" });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};
