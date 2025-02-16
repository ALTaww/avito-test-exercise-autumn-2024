import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const port = process.env.SERVER_PORT || 8001;

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// Тип для файла
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: MulterFile,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadDir = path.join(__dirname, "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (
    req: Request,
    file: MulterFile,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Маршрут для загрузки файлов
app.post("/upload", upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("Файл не был загружен.");
  }

  const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Отдача статических файлов из папки public
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
