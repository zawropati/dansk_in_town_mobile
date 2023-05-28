import requests
import json
import os
import datetime

# set up your Parse API credentials and headers
url = 'https://parseapi.back4app.com/classes/UserToken'
headers = {
    'X-Parse-Application-Id': 'KLxcuhhjrb2JQwegqs5jto882HLxv7scW89HDACX',
    'X-Parse-REST-API-Key': 'fUH4PcMVM4LXwMLIrQMQSIrEeHD9gRSQCzKVIq1G'
}

# make the GET request and parse the response
response = requests.get(url, headers=headers)
if response.status_code == 200:
    data = json.loads(response.content)
    tokens = []
    for user in data['results']:
        tokens.append(user['expoPushToken'])

    print(tokens)

else:
    print('Error:', response)


url2 = 'https://parseapi.back4app.com/classes/Translation'

# Calculate the date one week ago
one_week_ago = datetime.datetime.now() - datetime.timedelta(days=2)

# Construct the query to count images added in the last week
query = {
    "createdAt": {
        "$gte": {
            "__type": "Date",
            "iso": one_week_ago.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        }
    }
}
params = {
    "where": json.dumps(query),
    "count": 1
}
response = requests.get(url2, headers=headers, params=params)

if response.status_code == 200:
    data = json.loads(response.content)
    print(data)
    count = len(data['results'])
    print("Number of images added in the last week:", count)
else:
    print("Error:", response)

if count > 0:
    if count == 1:
        body = f"{count} new picture was added since yesterday! Check it out in practice 🌟"
    else:
        body= f"{count} new pictures were added since yesterday! Check it out in practice 🌟"
    print(tokens)
    push_data = {
        "to": ['ExponentPushToken[gqHdSfFcnT5O17p4QsLErB]', 'ExponentPushToken[7xf-EBOnVxcZqwmROSWQX9]', 'ExponentPushToken[lYmeTQEfXECTNHYwqE9I4p]', 'ExponentPushToken[Zz7xRVF9I0abemZUW_uQkT]', 'ExponentPushToken[_2rPmaGdNUIdgiWzT-2aW8]', 'ExponentPushToken[_AZAMzJ6z0fnjooU6kfeaU]', 'ExponentPushToken[wlFRyfJWAPR2RR9vOshp_a]'],
        "title": "Hi, Dansk In Town here!",
        "body": body
    }

    curl_data = {
        "url": "https://exp.host/--/api/v2/push/send",
        "header": "Content-Type: application/json",
        "data": json.dumps(push_data)
    }

    curl_command = 'curl -H "{header}" -X POST "{url}" -d \'{data}\''.format(**curl_data)

    response = os.system(curl_command)
