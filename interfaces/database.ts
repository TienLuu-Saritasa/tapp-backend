import mongoose from 'mongoose';

export interface Database {
  connect: () => void;
}

export class MongoDatabase implements Database {
  async connect() {
    try {
      if (process.env.MONGO_URL == null) return;
      await mongoose.connect(process.env.MONGO_URL);
      console.log({
        type: 'Success',
        message: 'MongoDB connected',
      });
    } catch (err) {
      console.log({
        type: 'Error',
        message: `Fail to connect to mongo ${err}`,
      });
      process.exit();
    }
  }
}
