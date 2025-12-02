import app from './src/app.js';
import { connectDb } from './src/config/db.js';
import { env } from './src/config/env.js';
import { ensureDefaultAdmin } from './src/services/adminService.js';

await connectDb();
await ensureDefaultAdmin();

app.listen(env.port, '0.0.0.0', () => {
  console.log(`🚀 Server ready on port ${env.port}`);
});

export default app;
