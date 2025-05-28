import 'server-only';
import { getDb, XP_THRESHOLDS_FOR_LEVEL } from './db'; 


interface UserProfileDB {
  id: number;
  username: string;
  profile_name: string | null;
  avatar_url: string | null;
  profile_completed_steps: number;
  profile_total_steps: number;
}

interface UserXpDB {
  current_xp: number;
  current_level_index: number; 
}

export interface UserProfilePageData {
  name: string;
  avatarUrl: string;
  progress: {
    completed: number;
    total: number; 
  };
}

export interface UserXpPageData {
  level: number;                      
  currentXP: number;                  
  xpForCurrentLevel: number;          
  xpForNextLevel: number | null;      
  progressToNextLevelPercent: number; 
  xpToLevelUp: number | null;         
  isMaxLevel: boolean;                
}

export async function getUserProfileDataForPage(userId: number): Promise<UserProfilePageData | null> {
  const db = await getDb();
  const user = await db.get<UserProfileDB>(
    'SELECT id, username, profile_name, avatar_url, profile_completed_steps, profile_total_steps FROM users WHERE id = ?',
    userId
  );

  if (!user) {
    return null;
  }

  return {
    name: user.profile_name || user.username || 'Пользователь',
    avatarUrl: user.avatar_url || '/default-avatar.png', 
    progress: {
      completed: user.profile_completed_steps ?? 0,
      total: user.profile_total_steps ?? 5, 
    },
  };
}

export async function getUserXpDataForPage(userId: number): Promise<UserXpPageData | null> {
  const db = await getDb();
  const userXp = await db.get<UserXpDB>(
    'SELECT current_xp, current_level_index FROM users WHERE id = ?',
    userId
  );

  if (!userXp) {
    return null;
  }

  const currentXP = userXp.current_xp ?? 0;

  let correctedLevelIndex = 0;
  for (let i = XP_THRESHOLDS_FOR_LEVEL.length - 1; i >= 0; i--) {
    if (currentXP >= XP_THRESHOLDS_FOR_LEVEL[i]) {
      correctedLevelIndex = i;
      break;
    }
  }

  const currentLevelIndex = correctedLevelIndex;

  const currentUserLevel = currentLevelIndex + 1;
  const xpForCurrentLevel = XP_THRESHOLDS_FOR_LEVEL[currentLevelIndex];

  const nextLevelIndex = currentLevelIndex + 1;
  const isMaxLevel = nextLevelIndex >= XP_THRESHOLDS_FOR_LEVEL.length;

  let xpForNextLevel: number | null = null;
  let progressToNextLevelPercent = 0;
  let xpToLevelUp: number | null = null;

  if (isMaxLevel) {
    progressToNextLevelPercent = 100;
    xpForNextLevel = null;
    xpToLevelUp = null;
  } else {
    xpForNextLevel = XP_THRESHOLDS_FOR_LEVEL[nextLevelIndex];
    const xpGainedOnCurrentLevel = currentXP - xpForCurrentLevel;
    const xpRangeForCurrentLevel = xpForNextLevel - xpForCurrentLevel;

    if (xpRangeForCurrentLevel > 0) {
      progressToNextLevelPercent = Math.min(100, Math.max(0, (xpGainedOnCurrentLevel / xpRangeForCurrentLevel) * 100));
    } else {
      progressToNextLevelPercent = xpGainedOnCurrentLevel >= 0 ? 100 : 0;
    }
    xpToLevelUp = Math.max(0, xpForNextLevel - currentXP);
  }

  return {
    level: currentUserLevel,
    currentXP: currentXP,
    xpForCurrentLevel: xpForCurrentLevel,
    xpForNextLevel: xpForNextLevel,
    progressToNextLevelPercent: parseFloat(progressToNextLevelPercent.toFixed(1)),
    xpToLevelUp: xpToLevelUp,
    isMaxLevel: isMaxLevel,
  };
}

export async function addUserXP(userId: number, xpAmountToAdd: number): Promise<{ success: boolean; message?: string; newXP?: number; newLevel?: number }> {
  if (xpAmountToAdd <= 0) {
    return { success: true, message: "Количество XP для добавления должно быть положительным." };
  }
  const db = await getDb();
  await db.run('BEGIN TRANSACTION');
  try {
    const user = await db.get<UserXpDB & { id: number }>(
      'SELECT id, current_xp, current_level_index FROM users WHERE id = ? FOR UPDATE',
      userId
    );
    if (!user) {
      await db.run('ROLLBACK');
      return { success: false, message: "Пользователь не найден." };
    }
    const currentXP = user.current_xp ?? 0;
    const currentLevelIndex = user.current_level_index ?? 0;
    const newTotalXP = currentXP + xpAmountToAdd;
    let newLevelIndex = currentLevelIndex;
    for (let i = XP_THRESHOLDS_FOR_LEVEL.length - 1; i >= 0; i--) {
      if (newTotalXP >= XP_THRESHOLDS_FOR_LEVEL[i]) {
        newLevelIndex = i;
        break;
      }
    }
    await db.run(
      'UPDATE users SET current_xp = ?, current_level_index = ? WHERE id = ?',
      newTotalXP,
      newLevelIndex,
      userId
    );
    await db.run('COMMIT');
    return { success: true, newXP: newTotalXP, newLevel: newLevelIndex + 1 };
  } catch (error) {
    await db.run('ROLLBACK');
    return { success: false, message: `Ошибка при обновлении XP: ${error instanceof Error ? error.message : String(error)}` };
  }
}