import app from './src/app.js';
import { connectDb } from './src/config/db.js';
import { env } from './src/config/env.js';
import { ensureDefaultAdmin } from './src/services/adminService.js';

await connectDb();
await ensureDefaultAdmin();

if (env.nodeEnv !== 'production') {
  app.listen(env.port, () => {
    console.log(`🚀 Server ready on port ${env.port}`);
  });
}

export default app;
