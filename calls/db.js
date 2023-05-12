import Parse, {User} from 'parse/react-native.js';
import * as FileSystem from 'expo-file-system';

async function getTranslations() {
  const Translation = Parse.Object.extend("Translation");
  const query = new Parse.Query(Translation);
  query.include("image");
  // query.notContainedIn("too_easy", [User.current()]);
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
  const totalNumberOfRows = await query.count();
  query.limit(100); // limit to 100 results
  query.skip(Math.floor(Math.random() * totalNumberOfRows)); // skip a random number of rows
  const results = await query.find();


  query.include("image");
  query.notContainedIn("too_easy", [User.current()]);

  return await query.find()
}

async function getOptionsAnswers(param) {
  const levenshtein = require('fast-levenshtein');
  const Translation = Parse.Object.extend("Translation");
  const query = new Parse.Query(Translation);
  const input = param.get("to")

  const results = await query.find();

  const sortedResults = results.sort((a, b) => {
    const distanceA = levenshtein.get(input, a.get("to"));
    const distanceB = levenshtein.get(input, b.get("to"));
    return distanceA - distanceB;
  });
  // take the top 3 most similar results, excluding the input string
  const mostSimilarResults = sortedResults.filter(result => result.get("to") !== input).slice(0, 3);

  return mostSimilarResults.map(result => result.get("to").toLowerCase());

  // const correctLength = param.get("to").length;
  // const regex = new RegExp(`^.{${correctLength}}$`);
  // query.matches("to", regex);

  // let results = await query.find();
  // const options = new Set();

  // while (options.size < 3 && results.length > 0) {
  //   const randomIndex = Math.floor(Math.random() * results.length);
  //   const option = results[randomIndex].get("to");

  //   if (option !== param && option.length === correctLength) {
  //     options.add(option.toLowerCase());
  //   }

  //   results.splice(randomIndex, 1);

  //   // If there are no more results, fetch another batch
  //   if (results.length === 0) {
  //     results = await query.find();
  //   }
  // }
  // console.log(options)
  // return Array.from(options);
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

async function addEvent(eventType, translationId){
  const newEvent = new Parse.Object('Event');
  newEvent.set('EventType', eventType);
  newEvent.set('userId', Parse.User.current().id);
  if(translationId){
    newEvent.set('translationId', translationId);
  }
  try {
    const result = await newEvent.save();
  } catch (error) {
    console.error('Error while creating event: ', error);
  }
}

async function saveExpoToken(token, userId){
  const User = new Parse.User();
  const query = new Parse.Query(User);
  console.log(userId)
  try {
    // Finds the user by its ID
    let user = await query.get(userId);
    // Updates the data we want
    user.set('expoPushToken', token);
    try {
      // Saves the user with the updated data
      let response = await user.save();
      console.log('Updated user', response);
    } catch (error) {
      console.error('Error while updating user', error);
    }
  } catch (error) {
    console.error('Error while retrieving user', error);
  }
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
  checkIfFavourite,
  addEvent,
  saveExpoToken,
  getOptionsAnswers
};
