import { put } from "@vercel/blob"
import fs from "fs"
import path from "path"

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN не найден в переменных окружения")
  process.exit(1)
}

async function uploadImagesToBlob() {
  const imagesDir = path.join(process.cwd(), "public", "images")

  try {
    const files = fs.readdirSync(imagesDir)
    const imageFiles = files.filter((file) => file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"))

    console.log(`Найдено ${imageFiles.length} изображений для загрузки`)

    const uploadedImages = {}

    for (const file of imageFiles) {
      const filePath = path.join(imagesDir, file)
      const fileBuffer = fs.readFileSync(filePath)

      console.log(`Загружаю ${file}...`)

      const blob = await put(file, fileBuffer, {
        access: "public",
        token: BLOB_READ_WRITE_TOKEN,
      })

      uploadedImages[file] = blob.url
      console.log(`✅ ${file} загружен: ${blob.url}`)
    }

    // Сохраняем URLs в JSON файл для обновления кода бота
    const outputPath = path.join(process.cwd(), "blob-urls.json")
    fs.writeFileSync(outputPath, JSON.stringify(uploadedImages, null, 2))

    console.log(`\n🎉 Все изображения загружены!`)
    console.log(`URLs сохранены в: ${outputPath}`)
  } catch (error) {
    console.error("Ошибка при загрузке изображений:", error)
  }
}

uploadImagesToBlob()
