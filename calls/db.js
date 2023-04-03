import Parse, {User} from 'parse/react-native.js';
import * as FileSystem from 'expo-file-system';

async function getTranslations() {
  const Translation = Parse.Object.extend("Translation");
  const query = new Parse.Query(Translation);
  query.include("image");
  query.notContainedIn("too_easy", [User.current()]);
  query.equalTo("user", Parse.User.current());

  return await query.find();
}

async function getTranslation(id) {
  const Translation = Parse.Object.extend("Translation");
  const query = new Parse.Query(Translation);
  query.include("image");
  return await query.get(id);
}

async function getRandomTranslationBut(id) {
  const Translation = Parse.Object.extend("Translation");
  const query = new Parse.Query(Translation);
  query.include("image");

  let translations = await query.find();

  let randomTranslation =
    translations[Math.floor(Math.random() * translations.length)];
  while (randomTranslation.id === id) {
    randomTranslation =
      translations[Math.floor(Math.random() * translations.length)];
  }

  return randomTranslation;
}

async function getTranslationsForExercises() {
  const Translation = Parse.Object.extend("Translation");
  const query = new Parse.Query(Translation);
  query.include("image");

  query.notContainedIn("too_easy", [User.current()]);

  return await query.find();
}

async function tooEasy(translation) {
  const current_too_easy = translation.get("too_easy") || [];
  current_too_easy.push(User.current());
  translation.set("too_easy", current_too_easy);
  translation.save();
}

async function uploadImageAndWords(photoFileInfo, photoBase64, translations) {
  const photoFile = new Parse.File(photoFileInfo.uri.split('/').pop(), { base64: photoBase64 });
  await photoFile.save().then(async (result) => {
    const Image = Parse.Object.extend("Image");
    const newImage = new Image();
    newImage.set("file", photoFile)
    return await Promise.all(
      translations.map((translation) => {
        const Translation = Parse.Object.extend("Translation");
        const newTranslation = new Translation();
        newTranslation.set("from", translation.from);
        newTranslation.set("to", translation.to);
        newTranslation.set("user", Parse.User.current());
        newTranslation.set("image", newImage);
        try {
          return newTranslation.save();
        } catch (error) {
          alert(error);
          return Promise.reject("something went wrong");
        }
      })
    )
  }).catch((error) => {
    console.log(error)
  })
}

async function addToFavourites(imageId, userId) {
  const myNewObject = new Parse.Object('Favourites');
  myNewObject.set('userId', userId);
  myNewObject.set('imageId',imageId);
  try {
    const result = await myNewObject.save();
    // Access the Parse Object attributes using the .GET method
    console.log('Favourites created', result);
  } catch (error) {
    console.error('Error while creating Favourites: ', error);
  }
}

async function getFavouritesByUser(userId) {
  const Favourites = Parse.Object.extend("Favourites");
  const query = new Parse.Query(Favourites);

  const object = await query.get('xKue915KBG');
  object.set('userId', userId);

  query.include("image");
  return await query.get(id);
  const myNewObject = new Parse.Object('Favourites');
  myNewObject.set('userId', userId);
  myNewObject.set('imageId',imageId);
  try {
    const result = await myNewObject.save();
    // Access the Parse Object attributes using the .GET method
    console.log('Favourites created', result);
  } catch (error) {
    console.error('Error while creating Favourites: ', error);
  }
}

async function getLastWeekTranslations(){
  const today = new Date();
  const lastWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
  const Translation = Parse.Object.extend("Translation");
  const query = new Parse.Query(Translation);
  query.equalTo("user", Parse.User.current());
  query.greaterThan('createdAt', lastWeek);

  return await query.count();

}
async function getAllTranslations(){
  const Translation = Parse.Object.extend("Translation");
  const query = new Parse.Query(Translation);
  query.equalTo("user", Parse.User.current());

  return await query.count();

}

async function checkIfFavourite(imageId, userId){
  const Translation = Parse.Object.extend("Favourites");
  const query = new Parse.Query(Translation);
  query.equalTo("userId", userId);
  query.equalTo("imageId", imageId);

  return await query.exists();

}

export {
  getTranslations,
  uploadImageAndWords,
  tooEasy,
  getTranslationsForExercises,
  getTranslation,
  getRandomTranslationBut,
  addToFavourites,
  getLastWeekTranslations,
  getAllTranslations,
  checkIfFavourite
};
