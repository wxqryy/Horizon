import { NextRequest, NextResponse } from 'next/server';
import { mkdir, stat, access } from 'fs/promises';
import { constants as fsConstants } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getCurrentUserId } from 'wxqryy/lib/auth-utils'; 
import { getDb } from 'wxqryy/lib/db';

const AVATARS_PUBLIC_SUBDIR = 'uploads/avatars';
const UPLOAD_DIR_FULL_PATH = path.join(process.cwd(), 'public', AVATARS_PUBLIC_SUBDIR);
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

async function ensureUploadDirExists(): Promise<boolean> {
  try {
    await access(UPLOAD_DIR_FULL_PATH, fsConstants.F_OK | fsConstants.W_OK);
    return true;
  } catch (error: unknown) { 

    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      try {
        await mkdir(UPLOAD_DIR_FULL_PATH, { recursive: true });

        await access(UPLOAD_DIR_FULL_PATH, fsConstants.W_OK);
        console.log(`Директория ${UPLOAD_DIR_FULL_PATH} успешно создана.`);
        return true;
      } catch (mkdirErr: unknown) { 
        console.error(`Не удалось создать директорию ${UPLOAD_DIR_FULL_PATH}:`, mkdirErr);
        return false;
      }
    } else {

      console.error(`Ошибка доступа к директории ${UPLOAD_DIR_FULL_PATH}:`, error);
      return false;
    }
  }
}

export async function POST(req: NextRequest) {
  const dirOk = await ensureUploadDirExists();
  if (!dirOk) {
    return NextResponse.json({ message: 'Ошибка конфигурации сервера: директория для загрузки аватаров недоступна.' }, { status: 500 });
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Неавторизованный доступ.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('avatar') as File | null; 

    if (!file) {
      return NextResponse.json({ message: 'Файл не предоставлен.' }, { status: 400 });
    }

    if (!(file instanceof File)) {
        return NextResponse.json({ message: 'Некорректные данные в поле avatar.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json({ message: `Недопустимый тип файла. Разрешены: JPG, PNG.` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ message: `Файл слишком большой (максимум ${MAX_FILE_SIZE_MB}MB).` }, { status: 413 });
    }

    const db = await getDb();
    const user = await db.get<{ username: string, avatar_url: string | null }>(
      'SELECT username, avatar_url FROM users WHERE id = ?',
      userId
    );

    if (!user || !user.username) {
      return NextResponse.json({ message: 'Пользователь не найден.' }, { status: 404 });
    }

    const safeUsername = user.username.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const newFilenameOnDisk = `${safeUsername}_${Date.now()}.png`; 
    const newFilePathOnDisk = path.join(UPLOAD_DIR_FULL_PATH, newFilenameOnDisk);

    const newAvatarUrlForClientAndDb = `/${AVATARS_PUBLIC_SUBDIR}/${newFilenameOnDisk}?v=${Date.now()}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    await sharp(buffer)
      .resize(200, 200) 
      .png({ quality: 80, compressionLevel: 7 }) 
      .toFile(newFilePathOnDisk);

    try {
      await stat(newFilePathOnDisk);
    } catch (statErr: unknown) { 
      console.error(`Файл аватара не был сохранен на диск или не доступен: ${newFilePathOnDisk}`, statErr);

      throw new Error(`Не удалось сохранить файл аватара на диск.`); 
    }

    await db.run('UPDATE users SET avatar_url = ? WHERE id = ?', newAvatarUrlForClientAndDb, userId);

    return NextResponse.json({
      success: true,
      avatarUrl: newAvatarUrlForClientAndDb,
      message: 'Аватар успешно обновлен!'
    }, { status: 200 });

  } catch (error: unknown) { 
    console.error("Ошибка при загрузке аватара:", error);
    let errorMessage = 'Внутренняя ошибка сервера при загрузке аватара.';
    if (error instanceof Error) {
      errorMessage = error.message; 
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}