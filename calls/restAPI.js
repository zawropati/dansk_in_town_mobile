async function getTranslations() {
    const rawResponse = await fetch(
      "https://parseapi.back4app.com/classes/Translation",
      {
        method: "GET",
        headers: {
          "X-Parse-Application-Id": "KLxcuhhjrb2JQwegqs5jto882HLxv7scW89HDACX",
          "X-Parse-REST-API-Key": "fUH4PcMVM4LXwMLIrQMQSIrEeHD9gRSQCzKVIq1G",
        },
      }
    );
    return await rawResponse.json();
  }

  async function getSpecificTranslations(constraintString) {
    // See: https://docs.parseplatform.org/rest/guide/#query-constraints

    let filterString =
      "?where=" + encodeURIComponent(JSON.stringify(constraintString));

    const rawResponse = await fetch(
      "https://parseapi.back4app.com/classes/Translation" + filterString,
      {
        method: "GET",
        headers: {
          "X-Parse-Application-Id": "KLxcuhhjrb2JQwegqs5jto882HLxv7scW89HDACX",
          "X-Parse-REST-API-Key": "fUH4PcMVM4LXwMLIrQMQSIrEeHD9gRSQCzKVIq1G",
        },
      }
    );
    return await rawResponse.json();
  }

  async function getTranslationsAfter1stOfDec() {
    let query = {
      createdAt: {
        $gte: {
          __type: "Date",
          iso: "2021-12-01T18:02:52.249Z",
        },
      },
    };

    return await getSpecificTranslations(query);
  }

  async function getTranslationOfWord(word) {
    let query = {
      from: {
        $in: [word],
      },
    };

    return await getSpecificTranslations(query);
  }

  async function getTranslationsOfUser(image_id) {
    // https://docs.parseplatform.org/rest/guide/#relational-queries
    let query = {
      user: {
        __type: "Pointer",
        className: "_User",
        objectId: image_id,
      },
    };
    return await getSpecificTranslations(query);
  }

  async function createNewUser() {
    const postData = {
      username: "mir3",
      password: "secret",
      email: "mir3@itu.dk",
    };

    try {
      const response = await fetch("https://parseapi.back4app.com/users/", {
        method: "POST",
        headers: {
          "X-Parse-Application-Id": "KLxcuhhjrb2JQwegqs5jto882HLxv7scW89HDACX",
          "X-Parse-REST-API-Key": "fUH4PcMVM4LXwMLIrQMQSIrEeHD9gRSQCzKVIq1G",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const message = "Error with Status Code: " + response.status;
        throw new Error(message);
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  export {
    getTranslations,
    createNewUser,
    getTranslationsAfter1stOfDec,
    getTranslationOfWord,
    getTranslationsOfUser,
  };
