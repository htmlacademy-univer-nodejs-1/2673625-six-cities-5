import { User } from '../../types/User.js';
import { CityName, Location } from '../../types/City.enum.js';
import { Amenity, Offer, PropertyType } from '../../types/Offer.js';

const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 100;
const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 1024;

const IMAGES_COUNT = 6;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const MIN_COMMENTS_COUNT = 0;

const LATITUDE_MIN = -90;
const LATITUDE_MAX = 90;
const LONGITUDE_MIN = -180;
const LONGITUDE_MAX = 180;

type RawOffer = {
  title: string;
  description: string;
  publishDate: string;
  city: string;
  previewImage: string;
  images: string;
  isPremium: string;
  isFavorite: string;
  rating: string;
  type: string;
  rooms: string;
  guests: string;
  price: string;
  amenities: string;
  userEmail: string;
  commentsCount: string;
  location: string;
};

function reject(reason: string, value?: unknown): null {
  console.log(`❌ Reject offer: ${reason}`, value ?? '');
  return null;
}


export class OfferFactory {

  // 🔹 основной метод
  static create(rawData: RawOffer, users: User[]): Offer | null {
    try {
      const title = rawData.title;
      const description = rawData.description;

      if (
        title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH ||
        description.length < MIN_DESCRIPTION_LENGTH || description.length > MAX_DESCRIPTION_LENGTH
      ) {
        return reject('Invalid title or description length', { title, description });
      }

      const publishDate = new Date(rawData.publishDate);

      if (Number.isNaN(publishDate.getTime())) {
        return reject('Invalid publish date', rawData.publishDate);
      }


      if (!Object.values(CityName).includes(rawData.city as CityName)) {
        return reject('Invalid city', rawData.city);
      }
      const city = rawData.city as CityName;

      if (!rawData.previewImage) {
        return reject('Invalid preview image', rawData.previewImage);
      }

      const images = rawData.images.split(' ').filter(Boolean);
      if (images.length !== IMAGES_COUNT) {
        return reject('Invalid images count', images);
      }

      const isPremium = rawData.isPremium.toLowerCase() === 'true';
      const isFavorite = rawData.isFavorite.toLowerCase() === 'true';

      const rating = parseFloat(rawData.rating.replace(',', '.'));
      if (rating < MIN_RATING || rating > MAX_RATING) {
        return reject('Invalid rating', rating);
      }

      if (!Object.values(PropertyType).includes(rawData.type as PropertyType)) {
        return reject('Invalid property type', rawData.type)
      }
      const type = rawData.type as PropertyType;

      const rooms = Number(rawData.rooms);
      const guests = Number(rawData.guests);
      const price = Number(rawData.price);

      if (
        rooms < MIN_ROOMS || rooms > MAX_ROOMS ||
        guests < MIN_GUESTS || guests > MAX_GUESTS ||
        price < MIN_PRICE || price > MAX_PRICE
      ) {
        return null;
      }

      const amenities = rawData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter((a) => Object.values(Amenity).includes(a as Amenity)) as Amenity[];

      if (!amenities.length) {
        return reject('No valid amenities', rawData.amenities);
      }

      const user = users.find((u) => u.email === rawData.userEmail);
      if (!user) {
        return reject('User not found', rawData.userEmail);
      }

      const commentsCount = Number(rawData.commentsCount);
      if (commentsCount < MIN_COMMENTS_COUNT) {
        return null;
      }

      const [lat, lon] = rawData.location.split(' ');
      const latitude = Number(lat);
      const longitude = Number(lon);

      if (
        latitude < LATITUDE_MIN || latitude > LATITUDE_MAX ||
        longitude < LONGITUDE_MIN || longitude > LONGITUDE_MAX
      ) {
        return reject('Invalid location', rawData.location);
      }

      const location: Location = { latitude, longitude };

      return {
        title,
        description,
        publishDate,
        city,
        previewImage: rawData.previewImage,
        images: images as [string, string, string, string, string, string],
        isPremium,
        isFavorite,
        rating,
        type,
        rooms,
        guests,
        price,
        amenities,
        user,
        commentsCount,
        location
      };
    } catch {
      return null;
    }
  }

  // 🔹 адаптер TSV → RawOffer
  static createFromTSV(parts: string[], users: User[]): Offer | null {
    if (parts.length !== 17) {
      return null;
    }

    const [
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
      location
    ] = parts;

    return OfferFactory.create(
      {
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
        location
      },
      users
    );
  }
}
