import db from '@/db.server';


export const prismaLogStream = {
  write: async (logLine: string) => {
    try {
      const log = JSON.parse(logLine);
      await db.log.create({
        data: {
          level: mapLevel(log.level),
          message: log.msg,
          meta: log, // whole log as JSON (optional)
        }
      });
    } catch (err) {
      console.error('Failed to log with Prisma:', err);
    }
  }
};

function mapLevel(levelNumber: number): string {
  switch (levelNumber) {
    case 10: return 'trace';
    case 20: return 'debug';
    case 30: return 'info';
    case 40: return 'warn';
    case 50: return 'error';
    case 60: return 'fatal';
    default: return 'info';
  }
}
