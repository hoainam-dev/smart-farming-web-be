const plantsModel = require("../model/plants");
const { admin } = require("../connectFirebase/connect");

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
    res.status(201).json({ message: "Cập nhật thành công!" });
  } catch (err) {
    console.log(err);
  }
};
exports.deletePlants = async (req, res) => {
  try {
    const id = req.params.id;
    await plantsModel.deletePlant(id);
    res.status(201).json({ message: "Xóa thành công" });
  } catch (err) {
    console.log(err);
  }
};
exports.getPlants = async (req, res) => {
  const querySnapshot = await admin.firestore().collection("plants").get();
  let plants = [];
  querySnapshot.forEach((doc) => {
    plants.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).json({
    plants,
  });
};
exports.getPlantDetails = async (req, res) => {
  const id = req.params.id;
  const docRef = admin.firestore().collection("plants").doc(id);
  const docSnapshot = await docRef.get();
  if (!docSnapshot.exists) {
    return res.status(404).send("plants not found");
  }
  const plant = docSnapshot.data();
  res.status(200).json({
    plant,
  });
};
exports.getPlantByCollection = async (req, res) => {
  try {
    const id = req.params.id;
    const collectionName = req.query.collectionName;
    const docRef = admin.firestore().collection("plants").doc(id);
    const collection = docRef.collection(collectionName);

    const querySnapshot = await collection.get();
    let checkIllness = [];
    querySnapshot.forEach((doc) => {
      checkIllness.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      checkIllness,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
};
exports.getAllCollectionbyIdPlant = async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = admin.firestore().collection("plants").doc(id);
    const collections = await docRef.listCollections();
    let allCollections = [];
    for (const collection of collections) {
      allCollections.push(collection.id);
    }
    res.status(200).json({
      collections: allCollections,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: err });
  }
}