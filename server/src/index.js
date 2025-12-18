import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { ensureDefaultAdmin } from './services/adminService.js';

await connectDb();
await ensureDefaultAdmin();

  app.listen(env.port, () => {
    console.log(`🚀 Server ready on port ${env.port}`);
  });

export default app;

