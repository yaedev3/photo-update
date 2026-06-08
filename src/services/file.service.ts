import { Jimp } from 'jimp'
import fs from 'fs-extra'

import {
  getStudentPhotoFromAspirantes,
  getStudentPhotoFromDB,
} from '../database/db.service'
enum Servers {
  Escolares = 'es',
  Aspirantes = 'as',
}

export class FileService {
  private month: string = ''

  public setMonth(month: string): void {
    this.month = month
  }

  public async storePhotos(list: string[]): Promise<void> {
    const requests = list.map((element) => this.getPhoto(element))
    await Promise.all(requests)
  }

  private async getPhoto(id: string): Promise<void> {
    await this.savePhoto(id, Servers.Aspirantes)
    // await this.savePhoto(id, Servers.Escolares)
  }

  private async savePhoto(id: string, server: Servers): Promise<void> {
    try {
      const fileName: string = this.getFileName(id, server)
      const photo: Buffer = await this.getServerSource(server)(id)
      const image = await Jimp.read(photo)
      const output = await image.getBuffer('image/jpeg')
      fs.writeFileSync(fileName, output)
    } catch (error) {
      console.log(error)
      console.log(`No se pudo crear la foto para ${id}`)
    }
  }

  private getServerSource(server: Servers) {
    if (Servers.Aspirantes === server) return getStudentPhotoFromAspirantes
    return getStudentPhotoFromDB
  }

  private getFileName(id: string, server: Servers): string {
    return this.getFolderPath(`${id}-${this.month}-${server}.jpg`)
  }

  private getFolderPath(fileName: string): string {
    return `images/${fileName}`
  }
}
