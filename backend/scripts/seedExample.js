import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../NoRelational/models/userModel.js";
import Register from "../NoRelational/models/registerModel.js";
import Sharing from "../NoRelational/models/sharingModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO_URI);

  const currentUser = await User.findOne().sort({ createdAt: 1 });

  if (!currentUser) {
    console.error("No users found. Run cli.js first to create the default user.");
    await mongoose.disconnect();
    process.exit(1);
  }

  const exampleUser = await User.create({
    name: "Exemplo",
    email: "exemplo@test.com",
  });

  const exampleRegister = await Register.create({
    title: "Exemplo de registro",
    description: "teste",
    status: "pendente",
    userId: exampleUser._id,
    creatorId: exampleUser._id,
  });

  const exampleSharing = await Sharing.create({
    userId: currentUser._id,
    registerId: exampleRegister._id,
    permission: "write",
  });

  console.log(JSON.stringify(
    [
      {
        _id: exampleSharing._id,
        userId: currentUser._id,
        registerId: exampleRegister._id,
        permission: exampleSharing.permission,
        sharedAt: exampleSharing.sharedAt,
      },
    ],
    null,
    2,
  ));

  await mongoose.disconnect();
}

main();
