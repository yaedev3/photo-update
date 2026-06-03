import { Request, API_URLS } from '../api'
import { PhotoStatus, Student } from '../interfaces'
import { Io } from '../utils'

export class PhotoService {
  private month: string = ''

  public async savePhotosByMonth(month: string) {
    this.month = month
    const file = this.getFileName()

    if (Io.checkIfOutputFileExists(file)) return

    const photos = await this.getPhotosFromAPI()
    this.storePhotos(photos)
  }

  public async getPhotosByMonth(month: string): Promise<Student[]> {
    this.month = month
    const file = this.getFileName()
    let photos: Student[] = []

    if (!Io.checkIfOutputFileExists(file)) {
      photos = await this.getPhotosFromAPI()
      this.storePhotos(photos)
    } else {
      photos = this.getPhotosFromFile()
    }

    return photos
  }

  private storePhotos(photos: Student[]): void {
    const hasPending = photos.some(
      (photo) => photo.status === PhotoStatus.Pending,
    )

    if (hasPending) return

    const file = this.getFileName()
    Io.writeOutputFile(file, photos)
  }

  private async getPhotosFromAPI(): Promise<Student[]> {
    console.log('Getting photos from API')
    const url: string = `${API_URLS.PhotoByMonth}/${this.month}`
    return await Request.get<Student[]>(url)
  }

  private getPhotosFromFile(): Student[] {
    console.log('Getting photos from file')
    const file = this.getFileName()
    return <Student[]>Io.readOutputFile(file)
  }

  private getFileName(): string {
    return `${new Date().getFullYear()}-${this.month}`
  }
}
