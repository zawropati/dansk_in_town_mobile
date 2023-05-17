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
  query.descending('createdAt');
  query.limit(100);

  // const totalNumberOfRows = await query.count();
  // query.limit(100); // limit to 100 results
  // query.skip(Math.floor(Math.random() * totalNumberOfRows)); // skip a random number of rows
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
    const UserToken = new Parse.Object('UserToken');
    const query = new Parse.Query(UserToken);
    query.equalTo('userId', userId);

    try {
      const existingRow = await query.first();

      if (existingRow) {
        // Row exists, update it
        existingRow.set('expoPushToken', token);
        await existingRow.save();
        console.log('Row updated successfully');
      } else {
        // Row doesn't exist, add new row
        const newRow = new UserToken();
        newRow.set('userId', userId);
        newRow.set('expoPushToken', token);
        await newRow.save();
        console.log('New row added successfully');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }



  // const UserToken = new Parse.Object('UserToken');
  // UserToken.set('userId', userId)
  // UserToken.set('expoPushToken', token);
  // try {
  //   let response = await UserToken.save();
  // } catch (error) {
  //   console.error('Error while creating user token', error);
  // }

async function getStrike(){
  const DailyStrike = Parse.Object.extend("DailyStrike");
  const query = new Parse.Query(DailyStrike);
  query.equalTo("userId", Parse.User.current().id);
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  query.greaterThanOrEqualTo('updatedAt', startOfDay);
  query.lessThan('updatedAt', endOfDay);
  const strike = await query.first();
  if (strike) {
    console.log('Strike found for today');
    return {
      "correctAnswersCount": strike.get("correctAnswersCount"),
      "strikeDays": strike.get("strikeDays")
    };
  } else {
    console.log('Strike not found for today, checking yesterday');
    const yesterday = new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000);
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const endOfYesterday = new Date(startOfDay.getTime() - 1);
    query.greaterThanOrEqualTo('updatedAt', startOfYesterday);
    query.lessThan('updatedAt', endOfYesterday);
    const strikeYesterday = await query.first();
    if (strikeYesterday){
      if(strikeYesterday.get('correctAnswersCount') >= 10){
        return {
          "correctAnswersCount": 0,
          "strikeDays": strikeYesterday.get("strikeDays")
        };
      }
    }
    return 0
  }
}

async function handleStrike(dailyStrike){
  const DailyStrike = Parse.Object.extend("DailyStrike");
  const query = new Parse.Query(DailyStrike);
  query.equalTo("userId", Parse.User.current().id);
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  query.greaterThanOrEqualTo('updatedAt', startOfDay);
  query.lessThan('updatedAt', endOfDay);
  const strike = await query.first();
  if(strike){
    strike.increment('correctAnswersCount', 1);
    if(strike.get('correctAnswersCount') == 10){
      strike.increment('strikeDays', 1);
    }
    await strike.save()
    return strike
  }else{
    const DailyStrikeNew = new Parse.Object("DailyStrike");
    DailyStrikeNew.set('userId', Parse.User.current().id)
    DailyStrikeNew.set('correctAnswersCount', 1);
    DailyStrikeNew.set('strikeDays', dailyStrike);
    try {
     await DailyStrikeNew.save();
     return DailyStrikeNew
    } catch (error) {
      console.error('Error while creating daily strike', error);
    }
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
  getOptionsAnswers,
  getStrike,
  handleStrike
};
