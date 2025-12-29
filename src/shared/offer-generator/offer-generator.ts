import { MockServerData } from '../types/Mock-server-data.js';
import { getRandomInt, getRandomItem, getRandomItems } from '../helpers/random.js';
import { CityName } from '../types/City.enum.js';
import { PropertyType, Amenity } from '../types/Offer.js';

export class OfferGenerator {
  constructor(private readonly data: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.data.titles);
    const description = getRandomItem(this.data.descriptions);
    const publishDate = new Date().toISOString();

    const city = getRandomItem(Object.values(CityName));
    const previewImage = getRandomItem(this.data.previewImages);
    const images = getRandomItems(this.data.previewImages, 6).join(' ');

    const isPremium = String(Math.random() > 0.5);
    const isFavorite = 'false';

    const rating = (Math.random() * 5).toFixed(1);
    const type = getRandomItem(Object.values(PropertyType));
    const rooms = getRandomInt(1, 8);
    const guests = getRandomInt(1, 10);
    const price = getRandomInt(100, 5000);

    const amenities = getRandomItems(
      Object.values(Amenity),
      getRandomInt(1, 3)
    ).join(',');

    const userEmail = getRandomItem(this.data.users);
    const commentsCount = '0';

    const latitude = (Math.random() * 180 - 90).toFixed(6);
    const longitude = (Math.random() * 360 - 180).toFixed(6);

    return [
      title,
      description,
      publishDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      amenities,
      userEmail,
      commentsCount,
      `${latitude} ${longitude}`
    ].join('\t');
  }
}
