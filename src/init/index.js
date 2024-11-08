import { loadProtos } from './loadProto.js';

const initServer = async () => {
  try {
    await loadProtos();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default initServer;
