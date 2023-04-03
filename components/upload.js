import { useState } from "react";
// import { useNavigate } from "react-router";

import { uploadImageAndWords } from "../../db/db";
import {
    CustomInput, ImageBackground, View, Text, Image, Pressable
  } from 'react-native';

function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function Upload() {
  const [translations, setTranslations] = useState([
    { id: generateUID(), to: "", from: "" },
  ]);
  const [imageFile, setImageFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  console.log(translations)
//   async function handleUpload(e) {
//     e.preventDefault();
//     setIsUploading(true);

//     await uploadImageAndWords(imageFile, translations);

//     // navigate("/myimages");
//   }

  function handleFileUpload(e) {
    setImageFile(e.target.files[0]);
  }

  function addNewTranslation() {
    setTranslations([...translations, { id: generateUID(), to: "", from: "" }]);
  }

  function setFrom(translation, newValue) {
    const updatedList = translations.map((t) =>
      t.id !== translation.id
        ? t
        : { id: translation.id, from: newValue, to: translation.to }
    );

    setTranslations(updatedList);
  }

  function setTo(translation, newValue) {
    const updatedList = translations.map((t) =>
      t.id !== translation.id
        ? t
        : { id: translation.id, from: translation.from, to: newValue }
    );
    setTranslations(updatedList);
  }

  function deleteTranslation(translation) {
    setTranslations(translations.filter((t) => t.id !== translation.id));
  }

  if (isUploading) {
    return "Uploading...";
  }

  return (
    <>
        {/* {translations.map((translation) => (
          <Translation
            key={translation.id}
            translation={translation}
            setFrom={setFrom}
            setTo={setTo}
            deleteTranslation={deleteTranslation}
          />
        ))} */}

        <Button onClick={addNewTranslation} variant="light">
          Add new translation
        </Button>

        <Button
          onClick={handleUpload}
          disabled={!imageFile}
          variant="primary"
          type="submit"
        >
          Upload
        </Button>
    </>
  );
}
